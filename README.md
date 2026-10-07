# Business Card Management API

![NodeJS](https://img.shields.io/badge/Node.js-v18+-green?style=flat&logo=nodedotjs)
![Express](https://img.shields.io/badge/Express.js-4.x-blue?style=flat&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Local-green?style=flat&logo=mongodb)
![JWT](https://img.shields.io/badge/Authentication-JWT-orange?style=flat&logo=jsonwebtokens)

## 📌 תיאור הפרויקט

מערכת REST API מלאה לניהול משתמשים וכרטיסי ביקור עסקיים, שפותחה כפרויקט גמר בסביבת Node.js.

**יכולות ליבה של המערכת:**

- הרשמת משתמשים, התחברות וניהול הרשאות (משתמש רגיל, עסקי ומנהל).
- התחברות מהירה באמצעות Google OAuth.
- ניהול מלא (CRUD) של כרטיסי ביקור עסקיים ומערכת לייקים.
- אימות משתמשים באמצעות JWT והצפנת סיסמאות ב-bcryptjs.
- ולידציית נתונים קפדנית באמצעות Joi.
- תמיכה בעבודה מול MongoDB מקומי ומסד הנתונים בענן MongoDB Atlas.
- מנגנון נעילת חשבון (Lockout) לאחר 3 ניסיונות התחברות כושלים רצופים.
- File Logger לרישום שגיאות HTTP לקבצי לוג יומיים.

---

## 🛠️ טכנולוגיות וספריות

- **Core:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Security & Auth:** bcryptjs, jsonwebtoken, google-auth-library
- **Validation:** Joi
- **Logging & Utils:** Morgan, Chalk, dotenv, config, CORS, moment

---

## 🚀 הפעלה מהירה

### 1. התקנת תלויות

npm install

### 2. הגדרת משתני סביבה (.env)

יש ליצור קובץ .env בשורש הפרויקט ולהגדיר את הפרמטרים הבאים:
PORT=3000
JWT_SECRET=your_jwt_secret_key
MONGO_URI_ATLAS=your_mongodb_atlas_connection_string
GOOGLE_CLIENT_ID=your_google_client_id

### 3. הרצת הפרויקט

לפיתוח מקומי (Local MongoDB):

- הרצה רגילה: node app.js
- הרצה במצב פיתוח: nodemon app.js

לחיבור ל-MongoDB Atlas:

- Linux / macOS: NODE_ENV=atlas nodemon app.js
- Windows (Cmd): set NODE_ENV=atlas && nodemon app.js

> השרת יעלה כברירת מחדל בכתובת: http://localhost:3000

---

## 🏗️ מבנה הפרויקט והארכיטקטורה

הפרויקט בנוי בארכיטקטורת שכבות (Layered Architecture) להפרדת אחריות מלאה:

Routes ➔ Controllers ➔ Services ➔ Repositories ➔ Models ➔ MongoDB

backend-project---service-to-business-card/
│
├── app.js
├── package.json
├── README.md
│
├── config/
│ ├── default.json
│ ├── development.json
│ └── atlas.json
│
├── public/
│ └── index.html
│
└── src/
├── config/ # התחברות ל-DB (connectDB) ונתוני אתחול (initialData)
├── controllers/ # טיפול בבקשות ותגובות HTTP
├── middleware/ # Auth, Admin, Business, Validation, Error Handling
├── models/ # סכמות Mongoose (User, Card)
├── repositories/ # גישה ושילוב שאילתות מול מסד הנתונים
├── routes/ # הגדרת נתיבי ה-API
├── services/ # לוגיקה עסקית
├── utils/ # File Logger, הדפסות צבעוניות לקונסול (printMessage)
└── validations/ # סכמות ולידציה של Joi (User, Card, BizNumber)

---

## 📡 תיעוד Endpoints (API Summary)

### 👤 משתמשים (Users)

| Method     | Endpoint        | הרשאה         | תיאור                           |
| :--------- | :-------------- | :------------ | :------------------------------ |
| **POST**   | `/users`        | Public        | הרשמת משתמש חדש                 |
| **POST**   | `/users/login`  | Public        | התחברות וקבלת JWT Token         |
| **POST**   | `/users/google` | Public        | התחברות / הרשמה באמצעות Google  |
| **GET**    | `/users`        | Admin         | שליפת כל המשתמשים               |
| **GET**    | `/users/:id`    | User / Admin  | שליפת משתמש לפי ID              |
| **PUT**    | `/users/:id`    | Owner         | עדכון פרטי משתמש                |
| **PATCH**  | `/users/:id`    | Owner         | שינוי סטטוס עסקי (`isBusiness`) |
| **DELETE** | `/users/:id`    | Owner / Admin | מחיקת משתמש                     |

### 🃏 כרטיסי ביקור (Cards)

| Method     | Endpoint               | הרשאה              | תיאור                               |
| :--------- | :--------------------- | :----------------- | :---------------------------------- |
| **GET**    | `/cards`               | Public             | שליפת כל כרטיסי הביקור              |
| **GET**    | `/cards/my-cards`      | Logged-in User     | שליפת הכרטיסים של המשתמש המחובר     |
| **GET**    | `/cards/:id`           | Public             | שליפת כרטיס לפי ID                  |
| **POST**   | `/cards`               | Business User      | יצירת כרטיס ביקור חדש               |
| **PUT**    | `/cards/:id`           | Card Owner         | עדכון כרטיס ביקור                   |
| **PATCH**  | `/cards/:id`           | Logged-in User     | ביצוע Like / Unlike לכרטיס          |
| **DELETE** | `/cards/:id`           | Card Owner / Admin | מחיקת כרטיס ביקור                   |
| **PATCH**  | `/cards/:id/bizNumber` | Admin              | **[Bonus]** עדכון מספר עסק ע"י מנהל |

---

## ⭐ תכונות מתקדמות ובונוסים

1. **Google Authentication (`POST /users/google`):**
   מאפשרת התחברות מהירה בעזרת Google ID Token המאומת מול `google-auth-library`. המערכת מזהה משתמשים קיימים או יוצרת משתמש חדש עם סיסמה מוצפנת אקראית ומנפיקה JWT Token.

2. **מנגנון נעילת חשבון (Login Lockout):**
   הגנה מפני ניסיונות התחברות כושלים חוזרים. לאחר **3 ניסיונות כושלים רצופים**, החשבון נחסם למשך **24 שעות** (`blockedUntil`). ניסיון מוצלח מאפס את המונה.

3. **File Logger לשגיאות (`src/utils/fileLogger.js`):**
   מנגנון המתעד כל תגובת שגיאת HTTP בסטטוס **400 ומעלה** בתוך קובצי לוג יומיים השמורים בתיקיית `/logs`.

4. **עדכון bizNumber ע"י Admin (`PATCH /cards/:id/bizNumber`):**
   מאפשר למנהל מערכת לשנות את מספר העסק הייחודי של כרטיס קיים, תוך אימות ולידציה שהמספר החדש אינו תפוס.

---

## 🛡️ אבטחה וטיפול בשגיאות

- **Password Hashing:** הצפנת סיסמאות בעזרת `bcryptjs` לפני שמירתן ב-DB.
- **JWT Authorization:** אבטחת הנתיבים בעזרת הדר `Authorization: Bearer <token>`. בדיקת הבעלות מתבצעת ישירות מול המידע המפוענח ב-`req.user` בשרת ולא מסתמכת על נתונים מהלקוח.
- **CORS Protection:** הגבלת origins מורשים דרך קובצי הקונפיגורציה.
- **Centralized Error Handling:** טיפול מרכזי בשגיאות בעזרת `AppError` ו-`errorMiddleware`, המבטיח החזרת תשובות HTTP במבנה אחיד וטיפול מבוקר בשגיאות Mongoose.

---

## ✅ Checklist לפני הגשה

- [x] התיקייה `node_modules` אינה כלולה ב-Git.
- [x] מפתחות רגישים ו-Connection Strings מוגדרים דרך משתני סביבה.
- [x] נבדקה תאימות ב-MongoDB מקומי וב-MongoDB Atlas.
- [x] קיימים נתוני אתחול ראשוניים (`initialData.js`).
- [x] כל ה-Endpoints והבונוסים נבדקו ונמצאו תקינים.
