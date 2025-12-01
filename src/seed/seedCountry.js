const { prisma } = require("../config/connectSql");

async function main(){

    console.log("=== REMOVE ALL COUNTRY DATA ===");
    await prisma.country.deleteMany();

    const Seeddata = [
        { "id": 1,  "slug": "anh",       "name": "Anh",        "code": "GB"},
        { "id": 2,  "slug": "canada",    "name": "Canada",     "code": "CA"},
        { "id": 3,  "slug": "han-quoc",  "name": "Hàn Quốc",   "code": "KR"},
        { "id": 4,  "slug": "hong-kong","name": "Hồng Kông",   "code": "HK"},
        { "id": 5,  "slug": "my",        "name": "Mỹ",         "code": "US"},
        { "id": 6,  "slug": "nhat-ban",  "name": "Nhật Bản",   "code": "JP"},
        { "id": 7,  "slug": "phap",      "name": "Pháp",       "code": "FR"},
        { "id": 8,  "slug": "thai-lan",  "name": "Thái Lan",   "code": "TH"},
        { "id": 9,  "slug": "trung-quoc","name": "Trung Quốc", "code": "CN"},
        { "id": 10, "slug": "uc",        "name": "Úc",         "code": "AU"},
        { "id": 11, "slug": "dai-loan",  "name": "Đài Loan",   "code": "TW"},
        { "id": 12, "slug": "duc",       "name": "Đức",        "code": "DE"}
    ]

    console.log("=== START SEED COUNTRY DATA ===");
    await prisma.country.createMany({
        data: Seeddata
    });
    console.log("=== DONE ===");
    prisma.$disconnect();
}


main();
