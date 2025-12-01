# CV Buider (CV_Buider_ExpressJs)

> Build CV using AI LLM model and ExpressJs Back-end.

---

## 🔗 Table of content
- [Description](#_Description_15)
- [Timeline](#_Timeline_24)
- [Technique](#_Technique_30)
- [Structure Tree](#_Structure_Tree_57)
- [Table Structure](#_Table_Structure_150)
- [Set-up & run](#_How_to_setup__run_170)
- [Author](#Author_199)

## 📝 Description

- Project CV Builder BE is the Back-End of Project CV Builder using ExpressJs.
- Using Prisma for Connect and Mapping DBMS.
- OpenAI for Hint, Generation CV content.
- VNPAY for account upgrade payment.

---

## 📆 Timeline

- 2 Months, From 09/2025 - 10/2025

---

## 🔧 Technique

> Language:
  * Javascript
  * JSON (Javascript Object Notation)

> DBMS:
  * MySQL

> Framework:
  * NodeJs, Exxpressjs

> Library/Tool:
  * OpenAI
  * axios
  * bcrypt
  * cors
  * dotenv
  * nodemon
  * parcel
  * express
  * multer
  * prisma
  * vnpay

---

## 🌲 Structure Tree

```bash
CVAI_BE_Expressjs
├── README.md
├── images
│   ├── blue_cv.png
│   ├── business_cv.png
│   ├── classic_cv.png
│   ├── dark_cv.png
│   ├── defaultimg.jpg
│   ├── light_cv.png
│   ├── medic_cv.png
│   ├── polite_cv.png
│   └── simple_cv.png
├── package-lock.json
├── package.json
├── prisma
│   └── schema.prisma
└── src
    ├── DTO
    │   ├── auth
    │   │   ├── LoginDTO.js
    │   │   └── RegisterDTO.js
    │   ├── post
    │   │   ├── PostDelDTO.js
    │   │   ├── PostGetDTO.js
    │   │   ├── PostModDTO.js
    │   │   ├── PostNewDTO.js
    │   │   └── PostPageDTO.js
    │   ├── post_sample
    │   │   ├── PostSampleNewDTO.js
    │   │   ├── PostSamplePageDTO.js
    │   │   └── PostSampleUpdateDTO.js
    │   └── user
    │       ├── GetLstPageDTO.js
    │       ├── ModAvaDTO.js
    │       ├── ModDTO.js
    │       ├── ModPassDTO.js
    │       ├── UploadCertiDTO.js
    │       ├── UploadFaceDTO.js
    │       └── UploadIdentifyDTO.js
    ├── config
    │   └── connectSql.js
    ├── controller
    │   ├── infoController.js
    │   ├── loginController.js
    │   ├── openAIController.js
    │   ├── otpController.js
    │   ├── postController.js
    │   ├── postSampleController.js
    │   ├── registerController.js
    │   └── vnpayController.js
    ├── dev.js
    ├── index.js
    ├── middleware
    │   └── middelware.js
    ├── models
    │   ├── infoModel.js
    │   ├── locationModel.js
    │   ├── loginModel.js
    │   ├── openAIModel.js
    │   ├── otpModel.js
    │   ├── postModel.js
    │   ├── postSampleModel.js
    │   ├── registerModel.js
    │   ├── tokenModel.js
    │   └── vnpayModel.js
    ├── openAI
    │   └── openAI.js
    ├── router
    │   ├── route.js
    │   └── routes
    │       ├── AI.js
    │       ├── admin.js
    │       ├── auth.js
    │       ├── image.js
    │       ├── info.js
    │       ├── post.js
    │       ├── public.js
    │       └── vnpay.js
    ├── security
    │   └── HashTool.js
    ├── seed
    │   └── seedSample.js
    └── tools
        ├── commonTools.js
        ├── mapping.js
        └── randomTool.js
```

---

## 📁 Table Structure

| 📁 Folder / 📄 File | 🔍 Feature                                                                         |
| -------------------- | ----------------------------------------------------------------------------------- |
| `prisma/`            | Write Object and Generate SQL                                                       |
| `config/`            | Config connect database                                                             |
| `controller/`        | Controll request and response to model                                              |
| `model/`             | Logic for object mapping in SQL                                                     |
| `DTO/`               | Data transfer object for receive what data for service                              |
| `openAI/`            | Tool for call OpenAI                                                                |
| `router/`            | Manage all routing endpoint                                                         |
| `security/`          | Manage all function use for encrypt and decrypt data                                |
| `seed/`              | For seed data into database                                                         |
| `tools/`             | Manage all re-used tools                                                            |
| `dev.js`             | Main function for running server (Development)                                      |
| `index.js`           | Main function for running server (Production)                                       |
| `images/`            | Store images sent to server                                                         |

---

## ⚙️ How to set-up & run

- Install nodejs from <https://nodejs.org/en/download>
- Initialize .env
- Go to cmd

```bash
# clone to local
git clone https://github.com/Quannichan/CV_Builder_Expressjs.git

# install node package
npm install

# run for de
npm run dev 

# run for test
npm run test

# build to production
npm run build

# run production
npm run product
```

- .env variables

```bash
KEY=KEY_FOR_HASING
DATABASE_URL=MYSQL_URL_CONNECTION
PORT=SERVER_PORT
TMN_CODE=TMN_CODE_OFVNPAY
HASH_SECRET=HASH_SECRET_FOR_TOKEN_MAKER
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
IPN_URL=https://sandbox.vnpayment.vn/vnpaygw-sit-testing/user/login
RETURN_URL=http://localhost:3001/api/be/vnpay/ipn_return
TZ=Asia/Ho_Chi_Minh
FRONTEND_URL=FRONT_END_REDIRECT_URL
OPENAI_KEY=OPENAI_KEY_GEN_FROM_GITHUB
SMTP_PASS=APP_PASSWORD_OF_GOOGLE_ACCOUNT
MAIL_FROM=YOUR_PERSONAL_EMAIL
MAIL_VERIFY_URL=http://localhost:3001/api/be/verify/account
```

---

## Author

- Quannichan
- 13/08/2004
- <tranminhquan130804@gmail.com>
- (+84)886523224 (vn)
"# Film_Recommend_Machine-Learning_BE" 
