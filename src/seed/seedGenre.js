const { prisma } = require("../config/connectSql");

async function main(){
    console.log("=== REMOVE ALL GENRE DATA ===");
    await prisma.genre.deleteMany();

    const Seeddata = [
        { "id": 1, "slug": "bi-an", "name": "Bí ẩn" },
        { "id": 2, "slug": "chieu-rap", "name": "Chiếu rạp" },
        { "id": 3, "slug": "hanh-dong", "name": "Hành động" },
        { "id": 4, "slug": "khoa-hoc", "name": "Khoa học" },
        { "id": 5, "slug": "tinh-cam", "name": "Tình cảm" },
        { "id": 6, "slug": "lang-man", "name": "Lãng mạn" },
        { "id": 7, "slug": "hoc-duong", "name": "Học đường" },
        { "id": 8, "slug": "sieu-anh-hung", "name": "Siêu anh hùng" },
        { "id": 9, "slug": "kinh-di", "name": "Kinh dị" },
        { "id": 10, "slug": "vo-thuat", "name": "Võ thuật" },
        { "id": 11, "slug": "hoat-hinh", "name": "Hoạt hình" },
        { "id": 12, "slug": "tai-lieu", "name": "Tài liệu" },
        { "id": 13, "slug": "hai", "name": "Hài" },
        { "id": 14, "slug": "tam-ly", "name": "Tâm lý" },
        { "id": 15, "slug": "gia-dinh", "name": "Gia đình" },
        { "id": 16, "slug": "vien-tuong", "name": "Viễn tưởng" },
        { "id": 17, "slug": "than-thoai", "name": "Thần thoại" },
        { "id": 18, "slug": "co-trang", "name": "Cổ trang" },
        { "id": 19, "slug": "gia-tuong", "name": "Giả tưởng" },
        { "id": 20, "slug": "hinh-su", "name": "Hình sự" }
    ]


    console.log("=== START SEED GENRE DATA ===");
    await prisma.genre.createMany({
        data: Seeddata
    });
    console.log("=== DONE ===");
    prisma.$disconnect();
}

main();
