require("dotenv/config");
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const { PrismaClient } = require('../../generated/prisma/client');

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  password: process.env.DATABASE_PASSWORD,
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME
})

const prisma = new PrismaClient({ adapter });
prisma.$connect()
  .then(() => console.log("Prisma connected"))
  .catch(err => console.error("Prisma error:", err));
module.exports =  { prisma }