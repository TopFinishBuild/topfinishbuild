import { MongoClient, ServerApiVersion, type Db } from 'mongodb';

// dotenv loaded in app.ts entry point

let database: Db | null = null;
let client: MongoClient | null = null;

const getDatabase = (): Db => {
    if (!database) {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: false,
                deprecationErrors: true,
            },
        });
        database = client.db('topfinish');
    }
    return database;
};

const MongoDB = new Proxy({} as Db, {
    get(_target, prop: string | symbol) {
        const db = getDatabase();
        const value = (db as any)[prop];
        return typeof value === 'function' ? value.bind(db) : value;
    },
});

export default MongoDB;
