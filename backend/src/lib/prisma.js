const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const shouldUseSsl = (process.env.DATABASE_URL || '').includes('sslmode=require');

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: shouldUseSsl
		? { rejectUnauthorized: false }
		: undefined
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

module.exports = prisma;
