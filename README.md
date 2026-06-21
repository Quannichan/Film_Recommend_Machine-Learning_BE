# Film commendation using Machine Learning Algorithm (TF-IDF) (Film_Recommend_Machine-Learning_BE)

> Film recommend using TF-IDF machine learning algorithm and ExpressJs Back-end.

---

## 🔗 Table of content
- [Description](#_description)
- [Timeline](#_timeline)
- [Technique](#_Technique_30)
- [Structure Tree](#_Structure_Tree_57)
- [Table Structure](#_Table_Structure_150)
- [Set-up & run](##️-how-to-set-up--run)
- [Author](#Author)

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
  * natural (machine learning library for NLP)
  * bcrypt (for encrypt/decrypt data)
  * cors (for cross-origin resources sharing)
  * dotenv (read .env variables)
  * nodemon (for node process hot reload)
  * parcel (for build src)
  * express (backend framework)
  * multer (for write/read/edit file)
  * prisma (database ORM framework)

---

## 🌲 Structure Tree

```bash
film_recomendation_AI_BE
├── README.md
├── data
│   ├── api_country.json
│   ├── api_genre.json
│   ├── crawl
│   │   ├── crawlFailedImg.py
│   │   ├── crawlFilmWCountry.py
│   │   ├── crawlImg.py
│   │   └── crawler.py
│   ├── films_news_2.json
│   └── log.log
├── generated
│   └── prisma
│       └── schema.prisma
├── package-lock.json
├── package.json
├── prisma
│   └── schema.prisma
├── prisma.config.js
├── src
│   ├── DTO
│   │   ├── auth
│   │   │   ├── LoginDTO.js
│   │   │   └── RegisterDTO.js
│   │   ├── country
│   │   │   ├── CountryModDTO.js
│   │   │   ├── CountryNewDTO.js
│   │   │   └── CountryPageDTO.js
│   │   ├── genre
│   │   │   ├── GenreModDTO.js
│   │   │   ├── GenreNewDTO.js
│   │   │   └── GenrePageDTO.js
│   │   ├── post_sample
│   │   │   ├── PostSampleNewDTO.js
│   │   │   ├── PostSamplePageDTO.js
│   │   │   └── PostSampleUpdateDTO.js
│   │   └── user
│   │       ├── GetLstPageDTO.js
│   │       ├── ModAvaDTO.js
│   │       ├── ModDTO.js
│   │       └── ModPassDTO.js
│   ├── config
│   │   └── connectSql.js
│   ├── controller
│   │   ├── countryController.js
│   │   ├── genreController.js
│   │   ├── infoController.js
│   │   ├── loginController.js
│   │   ├── postSampleController.js
│   │   └── registerController.js
│   ├── dev.js
│   ├── index.js
│   ├── middleware
│   │   └── middelware.js
│   ├── models
│   │   ├── countryModel.js
│   │   ├── genreModel.js
│   │   ├── infoModel.js
│   │   ├── loginModel.js
│   │   ├── postSampleModel.js
│   │   ├── registerModel.js
│   │   └── tokenModel.js
│   ├── router
│   │   ├── route.js
│   │   └── routes
│   │       ├── admin.js
│   │       ├── auth.js
│   │       ├── image.js
│   │       ├── info.js
│   │       ├── postSample.js
│   │       └── public.js
│   ├── security
│   │   └── HashTool.js
│   ├── seed
│   │   ├── seedCountry.js
│   │   ├── seedGenre.js
│   │   └── seedSample.js
│   ├── tools
│   │   ├── VectorFilms.js
│   │   ├── commonTools.js
│   │   ├── mail.js
│   │   ├── mapping.js
│   │   └── randomTool.js
│   └── utils
│       └── verifyEmailTemplate.js
└── tsup.config.js

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