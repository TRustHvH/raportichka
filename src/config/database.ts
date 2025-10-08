import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'raportichka',
    password: 'collranbich1',
    port: 5432,
});

export default pool; 