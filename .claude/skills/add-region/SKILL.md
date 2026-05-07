---
name: add-region
description: >
  Adds a new Bulgarian city + oblast to the interactive real estate map.
  Triggers when user provides a pixel-coordinate GeoJSON file (neighborhoods),
  a reference oblast image, and says they want to add a new region/city.
  Handles calibration, file generation, Overpass fetches, and all code updates.
---

# Add Region to Map

Full workflow for adding city neighborhoods + oblast municipalities to `InnerGoogleMapPicker`.

Already done: София, Перник, Пловдив, Бургас, Варна, Велико Търново.

---

## What User Provides

| Input | Description |
|-------|-------------|
| `{city}.json` | GeoJSON with neighborhood polygons in **pixel coordinates** `[x, y]` |
| Oblast image | Reference map showing municipality names and boundaries |
| (optional) Neighborhood names | Usually extracted from the JSON `name` property |

The JSON looks like:
```json
{
  "type": "FeatureCollection",
  "features": [
    { "type": "Feature", "properties": { "name": "Квартал" }, "geometry": { "type": "Polygon", "coordinates": [[[x, y], ...]] } }
  ]
}
```

---

## Naming Convention

| Thing | Pattern | Example |
|-------|---------|---------|
| NUTS3 oblast code | 3-letter caps | `GAB` |
| NUTS3 city code | `{CODE}_GRAD` | `GAB_GRAD` |
| oblastFiles key | `"{City}-Областта"` | `"Габрово-Областта"` |
| neighborhoodFiles key | `"{City}"` + `"{City}-град"` | `"Габрово"`, `"Габрово-град"` |
| CITY_VIEW_ZOOM key | same as oblastFiles/neighborhoodFiles keys | |
| nuts3ToLabel display | `"{City}-Област"` (no та) | `"Габрово-Област"` |
| nuts3ToFilterValue | `"{City}-Областта"` (internal) | `"Габрово-Областта"` |
| Asset files | `{city}-neighborhoods.json`, `{city}-city.json`, `{region}-oblast.json` | `gabrovo-neighborhoods.json` |

---

## Step 1 — Calibration (pixel → geo)

Read the JSON. Find 3-4 neighborhoods with recognizable names. Look up their approximate center coordinates on Google Maps / OSM.

Compute scale + offset via least-squares (or manual from 2 points):
```
lon = LON_SCALE * px + LON_OFF
lat = LAT_SCALE * py + LAT_OFF   ← LAT_SCALE is negative (y flipped)
```

Node.js script to solve from control points:
```js
// controlPoints = [ { px, py, lon, lat }, ... ]
// Simple 2-point solve:
const LON_SCALE = (p2.lon - p1.lon) / (p2.px - p1.px);
const LON_OFF   = p1.lon - LON_SCALE * p1.px;
const LAT_SCALE = (p2.lat - p1.lat) / (p2.py - p1.py);
const LAT_OFF   = p1.lat - LAT_SCALE * p1.py;
```

Verify: spot-check 2 more neighborhoods. Error < 500m = acceptable.

---

## Step 2 — Create `{city}-neighborhoods.json`

```js
const fs = require('fs');
const src = JSON.parse(fs.readFileSync('{city}.json', 'utf8'));

const LON_SCALE = /* computed */;
const LON_OFF   = /* computed */;
const LAT_SCALE = /* computed */;
const LAT_OFF   = /* computed */;

function px2geo([px, py]) {
  return [LON_SCALE * px + LON_OFF, LAT_SCALE * py + LAT_OFF];
}

const out = {
  type: 'FeatureCollection',
  features: src.features.map(f => ({
    ...f,
    properties: { ...f.properties, nuts3: '{CODE}_GRAD' },
    geometry: {
      ...f.geometry,
      coordinates: f.geometry.coordinates.map(ring => ring.map(px2geo))
    }
  }))
};

fs.writeFileSync('src/assets/{city}-neighborhoods.json', JSON.stringify(out, null, 2));
```

Save to: `src/assets/{city}-neighborhoods.json`

---

## Step 3 — Create `{city}-city.json` (city overlay)

Convex hull of ALL neighborhood vertices, scaled 2.5× from centroid for clickability.

```js
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/assets/{city}-neighborhoods.json', 'utf8'));

// Collect all points
const all = [];
data.features.forEach(f =>
  f.geometry.coordinates[0].forEach(pt => all.push(pt))
);

// Centroid
const cx = all.reduce((s, p) => s + p[0], 0) / all.length;
const cy = all.reduce((s, p) => s + p[1], 0) / all.length;

// Convex hull (gift wrapping)
function cross(O, A, B) {
  return (A[0]-O[0])*(B[1]-O[1]) - (A[1]-O[1])*(B[0]-O[0]);
}
function convexHull(pts) {
  const sorted = [...pts].sort((a,b) => a[0]-b[0] || a[1]-b[1]);
  const lower = [], upper = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length-2], lower[lower.length-1], p) <= 0) lower.pop();
    lower.push(p);
  }
  for (const p of [...sorted].reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length-2], upper[upper.length-1], p) <= 0) upper.pop();
    upper.push(p);
  }
  upper.pop(); lower.pop();
  return [...lower, ...upper];
}

const hull = convexHull(all);

// Scale 2.5× from centroid
const scaled = hull.map(([lon, lat]) => [
  cx + 2.5 * (lon - cx),
  cy + 2.5 * (lat - cy)
]);
scaled.push(scaled[0]); // close ring

const out = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    properties: { nuts3: '{CODE}_GRAD', name: '{CityName}' },
    geometry: { type: 'Polygon', coordinates: [scaled] }
  }]
};

fs.writeFileSync('src/assets/{city}-city.json', JSON.stringify(out, null, 2));
console.log('Hull points:', scaled.length, 'BBox lon:', Math.min(...hull.map(p=>p[0])).toFixed(4), '–', Math.max(...hull.map(p=>p[0])).toFixed(4));
```

Save to: `src/assets/{city}-city.json`

---

## Step 4 — Create `{region}-oblast.json` (municipality polygons)

### OSM admin levels in Bulgaria (CRITICAL)

| Level | Meaning |
|-------|---------|
| `admin_level=4` | Oblast (28 regions) |
| `admin_level=5` | **Obshtina / Municipality** ← USE THIS |
| `admin_level=8` | Settlement / town boundary (too small — wrong level) |

**Do NOT use admin_level=8.** It gives town boundaries, not full municipality territory.  
**Do NOT prefix names with "Община"** — OSM Bulgaria names them directly (e.g. "Свищов", not "Община Свищов").

### 4a. Fetch all municipalities in the oblast bbox

Use a single wide bbox query at `admin_level=5`, then filter by known municipality names:

```js
// scripts/fetch-{region}-oblast.mjs  (ESM — project uses "type": "module")
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Wide bbox covering entire oblast — verify at overpass-turbo.eu first
const QUERY = `[out:json][timeout:90];
(relation["boundary"="administrative"]["admin_level"="5"]({south},{west},{north},{east}););
out geom;`;

// Municipality names as they appear in OSM — NO "Община" prefix
// EXCLUDE the city municipality (it's shown via city overlay)
const MUNICIPALITIES = new Set([
  "Община1", "Община2", ...  // all except the main city
]);

function postOverpass(hostname, query) {
  return new Promise((resolve, reject) => {
    const body = 'data=' + encodeURIComponent(query);
    const req = https.request({
      hostname, path: '/api/interpreter', method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
        'User-Agent': 'NodeJS-RealEstate/1.0',
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('JSON parse fail: ' + data.slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.setTimeout(95000, () => { req.destroy(); reject(new Error('timeout')); });
    req.write(body);
    req.end();
  });
}

function assembleRing(outerWays) {
  if (!outerWays.length) return null;
  const segments = outerWays.map(m => m.geometry.map(p => [p.lon, p.lat]));
  if (segments.length === 1) {
    const r = segments[0];
    if (r[0][0] !== r.at(-1)[0]) r.push(r[0]);
    return r;
  }
  const ring = [...segments[0]];
  const remaining = segments.slice(1);
  while (remaining.length) {
    const tail = ring.at(-1);
    let best = -1, bestD = Infinity, flip = false;
    for (let i = 0; i < remaining.length; i++) {
      const s = remaining[i];
      const d1 = Math.hypot(tail[0] - s[0][0], tail[1] - s[0][1]);
      const d2 = Math.hypot(tail[0] - s.at(-1)[0], tail[1] - s.at(-1)[1]);
      if (d1 < bestD) { bestD = d1; best = i; flip = false; }
      if (d2 < bestD) { bestD = d2; best = i; flip = true; }
    }
    const seg = remaining.splice(best, 1)[0];
    ring.push(...(flip ? [...seg].reverse() : seg).slice(1));
  }
  if (ring[0][0] !== ring.at(-1)[0]) ring.push(ring[0]);
  return ring.map(([lon, lat]) => [Math.round(lon * 1e6) / 1e6, Math.round(lat * 1e6) / 1e6]);
}

const ENDPOINTS = ['overpass.kumi.systems', 'overpass-api.de'];

async function fetchWithFallback() {
  for (const host of ENDPOINTS) {
    console.log('Trying', host, '...');
    try { return await postOverpass(host, QUERY); }
    catch (e) { console.warn('  Failed:', e.message); }
  }
  throw new Error('All endpoints failed');
}

const data = await fetchWithFallback();
const all = data.elements.filter(e => e.type === 'relation');
console.log('Relations found:', all.length);
all.forEach(r => console.log(' raw:', r.tags?.name));

const features = all
  .filter(rel => MUNICIPALITIES.has(rel.tags?.name))
  .map(rel => {
    const outers = rel.members.filter(m => m.type === 'way' && m.role === 'outer');
    const coords = assembleRing(outers);
    if (!coords || coords.length < 4) return null;
    return {
      type: 'Feature',
      properties: { name: rel.tags.name, nuts3: '{CODE}' },
      geometry: { type: 'Polygon', coordinates: [coords] },
    };
  })
  .filter(Boolean);

console.log('\nMatched:', features.length);
features.forEach(f => console.log(' ✓', f.properties.name));

const missing = [...MUNICIPALITIES].filter(n => !features.find(f => f.properties.name === n));
if (missing.length) console.warn('MISSING:', missing);

fs.writeFileSync(
  path.join(__dirname, '../src/assets/{region}-oblast.json'),
  JSON.stringify({ type: 'FeatureCollection', features }, null, 2)
);
```

**Verify output:** each municipality should have thousands of coordinate points. If you see < 100 points, you got the wrong admin_level.

### 4b. EXCLUDE city municipality

The city municipality (e.g., Велико Търново, Перник, Варна) is already represented by the city overlay. **Do NOT include it in the MUNICIPALITIES set.**

Save to: `src/assets/{region}-oblast.json`

---

## Step 5 — Update `src/const/neighborhoods.ts`

Add two entries:

```typescript
"{CityName}-Областта": [
  // DO NOT include the city name itself — it's excluded from the oblast GeoJSON
  "Община1", "Община2", ...  // all other municipalities
],
"{CityName}": [
  // all neighborhood names from the JSON, alphabetically sorted
  "Квартал 1", "Квартал 2", ...
],
```

Add alias if city name ≠ neighborhoods key:
```typescript
const CITY_ALIAS: Record<string, string> = {
  // existing...
  "{CityName}": "{CityName}",  // only if needed
};
```

---

## Step 6 — Update `InnerGoogleMapPicker.tsx`

### 6a. nuts3ToLabel (display label — no "та")
```typescript
{CODE}: "{CityName}-Област", {CODE}_GRAD: "{CityName}-град",
```

### 6b. nuts3ToFilterValue (internal routing key — with "та")
```typescript
{CODE}: "{CityName}-Областта", {CODE}_GRAD: "{CityName}",
```

### 6c. Oblast data record (municipality → settlements)
```typescript
const {CITY}_OBLAST_DATA: Record<string, string[]> = {
  "Община1": ["гр. Град1", "с. Село1", "с. Село2"],
  "Община2": ["гр. Град2", "с. Село3"],
  // ...
};
```

### 6d. CITY_VIEW_ZOOM
```typescript
"{CityName}":          { center: [lat, lon], zoom: 13 },
"{CityName}-град":     { center: [lat, lon], zoom: 13 },
"{CityName}-Областта": { center: [lat, lon], zoom: 9  },
```
Find center lat/lon from Google Maps. City zoom=**13**, Oblast zoom=9-10.

### 6e. mapAssets type
```typescript
{city}CityGeoJSON: FeatureCollection;
```

### 6f. Promise.all imports (order matters — match destructure)
```typescript
import("../../assets/{city}-city.json"),
import("../../assets/{region}-oblast.json"),
import("../../assets/{city}-neighborhoods.json"),
```

### 6g. Destructure + setMapAssets
```typescript
// Add to destructure: ..., {city}City, {region}Obl, {city}Nh
{city}CityGeoJSON: {city}City.default as FeatureCollection,
oblastFiles: {
  // existing...
  "{CityName}-Областта": {region}Obl.default as FeatureCollection,
},
neighborhoodFiles: {
  // existing...
  "{CityName}":      {city}Nh.default as FeatureCollection,
  "{CityName}-град": {city}Nh.default as FeatureCollection,
},
```

### 6h. isOblastView check
```typescript
const isOblastView = ... || nuts3 === "{CODE}";
```

### 6i. mapKey chain
```typescript
: nuts3 === "{CODE}"      ? "{CityName}-Областта"
: nuts3 === "{CODE}_GRAD" ? "{CityName}-град"
```

### 6j. setViewMode oblast array
```typescript
setViewMode([
  "София-Областта","Пловдив-Областта","Варна-Областта",
  "Бургас-Областта","Перник-Областта",
  "{CityName}-Областта"  // ← add here
].includes(city) ? "oblast" : "city");
```

### 6k. handleNeighborhoodClick
```typescript
const is{City}Oblast = cityView === "{CityName}-Областта";
const oblastData = isPlovdivOblast ? PLOVDIV_OBLAST_DATA
                 : isVarnaOblast   ? VARNA_OBLAST_DATA
                 : isBurgasOblast  ? BURGAS_OBLAST_DATA
                 : isPernikOblast  ? PERNIK_OBLAST_DATA
                 : is{City}Oblast  ? {CITY}_OBLAST_DATA  // ← add
                 : SOFIA_OBLAST_DATA;
```

### 6l. JSX city overlay
```tsx
{/* {CityName}-grad overlay */}
{!cityView && (
  <GeoJSON
    key="{city}-city"
    data={mapAssets.{city}CityGeoJSON}
    style={(f) => getOblastStyle((f?.properties as any)?.nuts3 ?? "")}
    onEachFeature={onEachOblast}
    pane="cityOverlayPane"
  />
)}
```

---

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| Nothing shows on oblast click | `setViewMode` array has old `-Област` keys | Use `-Областта` everywhere in that array |
| Oblast GeoJSON not loading | `oblastFiles` key mismatch with `mapKey` | Keys must match exactly, including "та" |
| City overlay covers whole oblast | `isOblastView` missing the CODE | Add `\|\| nuts3 === "{CODE}"` |
| Municipality polygons too small | Used `admin_level=8` (town boundary) instead of `admin_level=5` (obshtina) | Use `admin_level=5`. Verify by checking polygon point count — correct ones have thousands of points |
| Overpass returns 0 results at admin_level=5 | Wrong bbox or wrong endpoint | Try both `overpass.kumi.systems` and `overpass-api.de`; widen bbox |
| Overpass returns 0 results at admin_level=6 | In Bulgaria, admin_level=6 = oblast, not municipality | Use `admin_level=5` |
| "Община X" names not found | OSM Bulgaria names municipalities without "Община" prefix | Filter by plain name: "Свищов" not "Община Свищов" |
| Script errors: `require is not defined` | Project has `"type": "module"` — CommonJS not allowed | Use `.mjs` extension with `import` syntax |
| Overpass 429 rate limit | Too many requests | Add `User-Agent` header, wait 1.5s between requests |
| Overpass timeout on large relation | Geometry too complex | Fetch individually per relation, not batch |
| Ring not closed / jagged | Way order wrong | Use greedy nearest-endpoint assembly |
| Tooltip shows wrong name | `nuts3ToLabel` has wrong value | Label = display only, separate from filterValue |
| Click routes to wrong view | `nuts3ToFilterValue` mismatch | `nuts3ToFilterValue[CODE]` must match `oblastFiles` key |
| City included in oblast view | City municipality added to MUNICIPALITIES set | Exclude the city by name — it has its own overlay |

---

## Checklist

- [ ] `{city}-neighborhoods.json` — all neighborhoods, `nuts3: '{CODE}_GRAD'`, geo coords
- [ ] `{city}-city.json` — convex hull 2.5×, `nuts3: '{CODE}_GRAD'`
- [ ] `{region}-oblast.json` — municipalities only (NO city municipality), `nuts3: '{CODE}'`, fetched at `admin_level=5`, thousands of points each
- [ ] `neighborhoods.ts` — oblast list (no city name) + neighborhood list added
- [ ] `nuts3ToLabel` — display name `{City}-Област` (no та)
- [ ] `nuts3ToFilterValue` — internal `{City}-Областта` (with та)
- [ ] `{CITY}_OBLAST_DATA` — municipality → settlements (no city entry)
- [ ] `CITY_VIEW_ZOOM` — 3 entries: city zoom=**13**, city-grad zoom=**13**, oblast zoom=9
- [ ] `mapAssets` type — added `{city}CityGeoJSON`
- [ ] `Promise.all` + destructure — 3 new imports in correct position
- [ ] `oblastFiles` key — `"{CityName}-Областта"`
- [ ] `neighborhoodFiles` keys — `"{CityName}"` + `"{CityName}-град"`
- [ ] `isOblastView` — includes `nuts3 === "{CODE}"`
- [ ] `mapKey` chain — `{CODE}` → `"{CityName}-Областта"`, `{CODE}_GRAD` → `"{CityName}-град"`
- [ ] `setViewMode` array — includes `"{CityName}-Областта"`
- [ ] `handleNeighborhoodClick` — new oblast case added
- [ ] JSX city overlay — new `<GeoJSON>` block
- [ ] `sf-map-region-label` div — shows `cityView` above map when region selected (CSS in `searchForm.css`)
