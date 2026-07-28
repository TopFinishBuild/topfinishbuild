import MongoDB from './db.js';

/**
 * Next `order` value for an ordered collection — one past the current highest,
 * or 0 when the collection is empty or nothing carries an order yet.
 */
export async function nextOrder(collection: string): Promise<number> {
    const last = await MongoDB.collection<{ order?: number }>(collection)
        .find({})
        .sort({ order: -1 })
        .limit(1)
        .toArray();

    return last.length > 0 && last[0].order != null ? last[0].order + 1 : 0;
}
