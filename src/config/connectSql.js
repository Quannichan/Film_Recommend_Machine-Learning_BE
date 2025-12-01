const { PrismaClient } = require("../../generated/prisma");

    const prisma = new PrismaClient();
    prisma.$connect();

    // async function testConnection() {
    //     try {
    //         await prisma.$connect(); // thử kết nối
    //         console.log("✅ Prisma đã kết nối thành công!");
    //     } catch (err) {
    //         console.error("❌ Lỗi kết nối Prisma:", err);
    //     } finally {
    //         await prisma.$disconnect();
    //     }
    // }

module.exports = {
    // testConnection, 
    prisma}