import dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const envPaths = [resolve(process.cwd(), '..', '.env'), resolve(process.cwd(), '.env')];
const envPath = envPaths.find(p => existsSync(p));
if (envPath) dotenv.config({ path: envPath });

const MONGODB_URI = process.env.MONGODB_URI ?? '';
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

const TESTIMONIALS = [
    {
        text: 'Страхотна работа от начало до край. Шпакловката е идеално изравнена, боята легна перфектно. Препоръчвам ги на всеки, който търси качество.',
        name: 'Мария Иванова',
        subtitle: 'Апартамент, кв. Младост',
        initials: 'МИ',
        stars: 5,
    },
    {
        text: 'Наехме TopFinish Build за нашия офис. Работиха извън работно време, за да не пречат на служителите ни. Резултатът — невероятен модерен интериор.',
        name: 'Петър Димитров',
        subtitle: 'Управител, IT компания',
        initials: 'ПД',
        stars: 5,
    },
    {
        text: 'Банята ни беше напълно трансформирана. Плочките са наредени с милиметрова точност, силиконите — идеални. За нас TopFinish е синоним на перфекционизъм.',
        name: 'Светла Колева',
        subtitle: 'Жилищен имот, кв. Витоша',
        initials: 'СК',
        stars: 5,
    },
    {
        text: 'Монтираха гипсокартон в цялата ни нова къща. Точни, спретнати, с нула отпадъци и мръсотия след приключване. Ще се обърнем към тях и за следващия ни проект.',
        name: 'Георги Николов',
        subtitle: 'Еднофамилна къща, Бояна',
        initials: 'ГН',
        stars: 5,
    },
    {
        text: 'Изключително прецизна шпакловка и боядисване в пет цвята — всяка повърхност като огледало. Завършиха ново строителство навреме и без нито едно оплакване от наша страна.',
        name: 'Даниела Петрова',
        subtitle: 'Ново строителство, кв. Бъкстон',
        initials: 'ДП',
        stars: 5,
    },
    {
        text: 'Свалиха стара мазилка, направиха цялостна шпакловка и боядисване на целия апартамент. Работиха бързо, чисто, без излишни обещания. Точно такива изпълнители търсехме.',
        name: 'Николай Стоянов',
        subtitle: 'Апартамент, кв. Лозенец',
        initials: 'НС',
        stars: 5,
    },
];

const client = new MongoClient(MONGODB_URI);

try {
    await client.connect();
    const col = client.db('topfinish').collection('testimonials');

    const existing = await col.countDocuments();
    if (existing > 0) {
        console.log(`Collection already has ${existing} testimonials — skipping seed.`);
        console.log('To force re-seed, drop the collection first.');
    } else {
        const docs = TESTIMONIALS.map((t, i) => ({
            _id: uuidv4(),
            ...t,
            order: i,
            createdAt: new Date(),
        }));
        await col.insertMany(docs as never[]);
        console.log(`\n✓ Inserted ${docs.length} testimonials:\n`);
        docs.forEach(d => console.log(`  [${d.order}] ${d.name} — ${'★'.repeat(d.stars)}`));
    }
} finally {
    await client.close();
}
