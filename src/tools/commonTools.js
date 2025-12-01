const fs = require("fs") 
const path = require("path");

    function writeFile(name_file,imageData, savePath = "images"){
        return new Promise((resolve, reject)=>{
            const imageDir = path.join(__dirname, "..", "..", savePath);
            console.log(imageDir);
            if (!fs.existsSync(imageDir)) {
                fs.mkdirSync(imageDir, { recursive: true });
            }
            const imagePath = path.join(imageDir, name_file);
            fs.writeFile(imagePath, imageData, "base64" , async (err)=>{
                if(err){
                    console.log("SAVEIMGERR");
                    console.log(err)
                    reject(false)
                }else{
                    console.log("SAVEIMGSUCC");
                    resolve(true)
                }
            })
        })
    }

    function formatDateToSQL(date) {
        const pad = (n) => n < 10 ? '0' + n : n;
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    module.exports = {writeFile, formatDateToSQL}