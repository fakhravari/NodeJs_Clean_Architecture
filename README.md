# NodeJs_Clean_Architecture

این مخزن یک پیاده‌سازی نمونه از یک API لایه‌ای (Clean/Layered Architecture) با استفاده از Node.js، Express و SQL Server است. هدف پروژه ارائه یک ساختار واضح برای مدیریت کنترلرها، سرویس‌ها، مدل‌ها، میان‌افزارها و تنظیمات دیتابیس و مستندسازی API با Swagger است.

این README به زبان فارسی نوشته شده تا راحت‌تر برای توسعه‌دهندگان فارسی‌زبان توضیح داده شود.

---

## فهرست مطالب
- توضیح کلی
- معماری و پوشه‌بندی
- قابلیت‌ها (Features)
- پیش‌نیازها
- نصب و اجرا
- متغیرهای محیطی (`.env`)
- مستندات API (Swagger)
- مسیرها / Endpoints مهم
- خطایابی و لاگینگ
- اعتبارسنجی و مدیریت خطا
- آپلود فایل و FTP
- تراکنش‌ها و Stored Procedures / Views
- تست‌ها و توسعه
- مشارکت (Contributing)
- مجوز (License)

---

## توضیح کلی
این پروژه یک API نمونه مبتنی بر مفاهیم Clean Architecture است که جداسازی مسئولیت‌ها را بین لایه‌ها (controllers → services → models) رعایت می‌کند. هدف این مخزن ارائهٔ یک الگوی عملی برای ساخت APIهای مقیاس‌پذیر و قابل تست است.

## معماری و پوشه‌بندی
ساختار شاخص پوشه‌ها:

- `src/app.js` — نقطه ورود برنامه و پیکربندی میدل‌ورها.
- `src/config/` — تنظیمات برنامه و دیتابیس (`configUtil.js`, `db.js`).
- `src/controllers/` — کنترلرهای Express (ورودی HTTP → سرویس‌ها).
- `src/services/` — منطق کسب‌وکار و تعامل با دیتابیس (استفاده از `mssql`).
- `src/models/` — نام جدول‌ها یا مدل‌های ساده که نام جدول را نگه می‌دارند.
- `src/middleware/` — میان‌افزارهای Express (auth, validate, error handler).
- `src/utils/` — ابزارهای کمکی مانند `AppError`, `asyncHandler`, `viewHelpers`.
- `src/routes/` — مسیربندی مسیرهای API و اعتبارسنجی با `express-validator`.
- `docs/` — پیکربندی Swagger/OpenAPI.

## قابلیت‌ها (Features)

- ساختار لایه‌ای (Controller → Service → Model)
- اتصال به SQL Server با `mssql`
- پشتیبانی از Stored Procedures و Views
- مستندسازی خودکار با Swagger (`/api-docs`)
- مدیریت خطاها با `AppError` و middleware مرکزی
- اعتبارسنجی ورودی‌ها با `express-validator` و middleware `validate`
- آپلود فایل با `multer` و ارسال فایل به FTP با `basic-ftp`
- نمونه‌ای از متدهای سرویس: CRUD، خلاصه سفارشات، گزارش‌ها و متدهای ویو/StoredProc

## پیش‌نیازها

- Node.js (نسخه 16+ یا مشابه نصب شده در سیستم شما)
- یک SQL Server قابل دسترسی (یا Docker container)
- npm یا yarn

## نصب و اجرا (محلی)

1. مخزن را کلون کنید:

```powershell
git clone <repo-url>
cd NodeJs_Clean_Architecture
```

2. وابستگی‌ها را نصب کنید:

```powershell
npm install
```

3. یک فایل `.env` در ریشه پروژه ایجاد کنید (نمونه در ادامه).

4. سرور توسعه را اجرا کنید:

```powershell
npm run dev
```

سرور به‌صورت پیش‌فرض روی پورتی که در `.env` مشخص شده یا 3000 اجرا می‌شود.

## متغیرهای محیطی (`.env`) — نمونه

```text
# Server
PORT=3000

# JWT
JWT_SECRET=yourSuperSecretKey12345
JWT_EXPIRES_IN=60

# Database SQL Server
DB_USER=sa
DB_PASS=YourStrong!Passw0rd
DB_SERVER=localhost
DB_NAME=MyDatabase
DB_ENCRYPT=false
DB_TRUST_CERT=true
DB_POOL_MAX=10

# FTP (در صورت نیاز)
FTP_HOST=ftp.example.com
FTP_USER=ftpuser
FTP_PASS=ftppass
FTP_SECURE=false
```

توجه: مقادیر بالا نمونه هستند؛ برای اتصال واقعی به دیتابیس از مقادیر مناسب محیط‌تان استفاده کنید.

## مستندات API (Swagger)

پس از راه‌اندازی سرور، مستندات Swagger در:

http://localhost:3000/api-docs

این مجموعه شامل مسیرهای CRUD برای مشتریان، محصولات، سفارشات، جزئیات سفارش، و احراز هویت است.

## مسیرها / Endpoints مهم

چند endpoint برجسته (خلاصه):

- Customers
   - `GET /customers` — لیست مشتریان
   - `GET /customers/:id` — یک مشتری
   - `POST /customers` — ایجاد مشتری
   - `PUT /customers/:id` — بروزرسانی
   - `DELETE /customers/:id` — حذف
   - `GET /customers/proc?Id=...` — فراخوانی Stored Procedure `dbo.GetAllCustomers(@Id INT=0)` (متد مستقل)

- Orders
   - `GET /orders` — لیست سفارش‌ها
   - `GET /orders/:id` — جزئیات سفارش
   - `POST /orders` — ایجاد سفارش
   - `GET /orders/summary` — خلاصه سفارش‌ها (تعداد اقلام و مبلغ)
   - `GET /orders/view` — خواندن از View/TVF `[dbo].[GetAllOrders]` (فیلدها: OrderID, CustomerID, OrderDate, TotalAmount, JsonDetails)
   - `GET /orders/view/formatted` — خروجی به فرمت ویو-مدل (رشته‌های SQL-tuple برای راحتی وارد کردن به اسکریپت)

- Auth (نمونه)
   - `POST /auth/login`

- FTP
   - مسیرهای مرتبط با آپلود و انتقال فایل به FTP

برای لیست کامل به Swagger مراجعه کنید.

## Stored Procedures و Views

- این پروژه نمونه‌هایی برای:
   - فراخوانی Stored Procedure مستقل: `dbo.GetAllCustomers(@Id INT=0)` — تابع سرویس `getAllFromProc` و route `/customers/proc`.
   - خواندن از View/TVF: `[dbo].[GetAllOrders]` — route `/orders/view` و `/orders/view/formatted` برای خروجی به شکل tuples.

توجه: اجرای واقعی این مسیرها مستلزم وجود این اشیاء در دیتابیس شماست.

## مدیریت خطا و اعتبارسنجی

- AppError: کلاسی برای خطاهای عملیاتی که شامل `statusCode`, `code`, `message`, و `details` است.
- asyncHandler: برای wrap کردن کنترلرهای async و ارسال خطاها به middleware مرکزی.
- validate middleware: از `express-validator` استفاده می‌کند و خطاها را به شکل دیکشنری فیلدها برمی‌گرداند.

در صورت خطاهای داخلی، سرور یک `errorId` تولید می‌کند تا بتوانید آن را با لاگ‌ها مطابقت دهید.

## آپلود فایل و FTP

- فایل‌ها با `multer` آپلود می‌شوند و در `uploads/` ذخیره می‌شوند.
- سرویس FTP با `basic-ftp` تنظیم شده تا فایل‌ها را به یک سرور FTP منتقل کند (پیکربندی در `.env`).

## لاگینگ

- فعلاً لاگ‌ها با `console.*` نوشته می‌شوند. پیشنهاد می‌شود برای محیط تولید از `winston` یا `pino` استفاده شود.

## آزمون‌ها و توسعه

- فعلاً تست‌های اتوماتیک در مخزن وجود ندارند. پیشنهاد برای اضافه کردن:
   - Jest + Supertest برای endpoint tests
   - یک set از تستهای واحد (services) و یکپارچه (controllers)

نمونه دستور برای اجرای سرور توسعه:

```powershell
npm run dev
```

و برای تست (پس از اضافه شدن):

```powershell
npm test
```

## مهاجرت دیتابیس / داده‌های نمونه

- این مخزن شامل اسکریپت‌های مهاجرت نیست؛ اگر بخواهید می‌توانم پیشنهاداتی برای استفاده از `mssql` migrations یا `knex`/`umzug` اضافه کنم و نمونه اسکریپت‌های ایجاد جداول، stored procedures و viewها تولید کنم.

## نکات امنیتی

- از قرار دادن اطلاعات حساس در مخزن خودداری کنید. از `.env` محلی برای ذخیره رمزها و connection string استفاده کنید.
- JWT secret را قوی قرار دهید و در محیط تولید از مدیریت محرمانگی مناسب استفاده کنید.

## مشارکت (Contributing)

- اگر می‌خواهید فیچر یا اصلاحی اضافه کنید:
   1. یک issue باز کنید یا feature request ثبت کنید.
   2. یک branch جدید بسازید (`feature/NAME`)، تغییرات را اعمال و pull request ارسال کنید.
   3. برای PR توضیح واضح بنویسید و اگر تست اضافه شده، آن‌ها را هم اجرا کنید.

## مجوز

این پروژه تحت مجوز MIT قرار می‌گیرد (در صورت نیاز فایل `LICENSE` اضافه شود).

---

اگر بخش خاصی را می‌خواهید گسترش دهم (مثلاً نمونه `.sql` برای View/StoredProc، اسکریپت‌های migration، یا تست‌های Jest با مثال)، بگویید تا آماده‌اش کنم.
# Node.js Clean Architecture — مستند فنی و آکادمیک

نویسنده: Mohammad Hussein Fakhravari

تاریخ: 2025-11-11

خلاصه (Abstract)
------------------
این مدارک شرحِ یک پیاده‌سازی نمونه از یک API لایه‌ای (Clean/Layered) مبتنی بر Node.js و Express را ارائه می‌دهد. هدف از این پروژه فراهم آوردن چارچوبی عملی برای توسعهٔ سرویس‌های RESTful قابل آزمون، قابل نگهداری و قابل استقرار است؛ و نشان دادن ترکیب الگوهایی مانند مدیریت پیکربندی متمرکز، اعتبارسنجی ورودی، مدیریت خطا، مستندسازی OpenAPI و تعامل با پایگاه‌دادهٔ رابطه‌ای (SQL Server).

کلیدواژه‌ها: Node.js, Express, Clean Architecture, SQL Server, JWT, OpenAPI, validation, error handling

مقدمه (Introduction)
-----------------------
پیاده‌سازی‌های سادهٔ API در عمل اغلب به سرعت به مجموعه‌ای از وابستگی‌های نامنظم و منطق توزیع‌شده تبدیل می‌شوند که تست‌پذیری و نگهداری را دشوار می‌سازد. این پروژه نمونه‌ای آموزشی و عملی است که نشان می‌دهد چگونه با جداسازی نگرانی‌ها (Separation of Concerns) و تعریف قراردادهای مشخص بین لایه‌ها می‌توان کیفیت و انسجام کد را بهبود بخشید.

مسئلهٔ تحقیق (Problem Statement)
---------------------------------
چگونگی سازمان‌دهی یک پروژهٔ میان‌ردهٔ Node.js طوری که:
- منطقی قابل تست و قابل تعویض باشد
- خطاها و پیام‌ها به شکل ساختاریافته و قابل ماشینی تولید شوند
- مستندسازی API به صورت خودکار تولید و قابل استفاده برای تست‌ها و مصرف‌کنندگان باشد

اهداف (Objectives)
------------------
1. ارائهٔ یک ساختار لایه‌ای (Controllers → Services → Models)
2. معرفی الگوی مدیریت خطا (AppError + central middleware) و قراردادی برای پاسخ‌های خطا
3. نشان دادن چگونگی اعتبارسنجی و بازگرداندن خطاهای ولیدیشن به صورت ماشین‌پسند
4. تولید مستندات OpenAPI/Swagger برای مصرف‌کنندگان و تست‌های خودکار

معماری پیشنهادی (System Architecture)
-------------------------------------
این پیاده‌سازی از الگوی لایه‌ای ساده استفاده می‌کند. دیاگرام متنی (ASCII) زیر نمای کلی را نشان می‌دهد:

```
Client (HTTP)
   |
   v
Routes (Express) --- Swagger docs (/api-docs)
   |
   v
Controllers ----> Middleware (auth, validate, error)
   |
   v
Services (business logic)
   |
   v
Data Access (mssql)
   |
   v
SQL Server
```

توضیح لایه‌ها
- Routes: تعریف endpointها و مستندات OpenAPI (annotations)
- Controllers: تبدیل درخواست HTTP به پارامترهای سرویس و بازگرداندن پاسخ یکپارچه
- Services: منطق تجاری و فراخوانی‌های DB با پارامترایزیشن
- Middleware: احراز هویت JWT، اعتبارسنجی (express-validator)، مدیریت خطا

دلایل طراحی (Design Rationale)
-------------------------------
- جداسازی کنترلرها و سرویس‌ها برای تسهیل تست واحد و جایگزینی رفتارها (mocking)
- استفاده از پارامترایزیشن در کوئری‌ها برای جلوگیری از SQL Injection
- نمایشی یکنواخت از پاسخ‌ها (success flag, error object) برای ساده‌سازی مصرف در کلاینت و تست
- تولید `errorId` برای لاگ‌گذاری و ردیابی خطاهای غیرمنتظره در محیط تولید

مدل داده‌ای خلاصه (Data Model)
-------------------------------
جداول اصلی (خلاصه):
- Users (FullName, Email, Password, Jwt, JwtIssuedAt, JwtExpiresAt)
- Customers (CustomerID, FullName, Phone, Email, City)
- Products (ProductID, ProductName, Price, Stock)
- Orders (OrderID, CustomerID, TotalAmount, CreatedAt)
- OrderDetails (OrderDetailID, OrderID, ProductID, Quantity, UnitPrice)

برای اسکریپت‌های ایجاد جداول، به فایل `db.sql` در ریشه مراجعه کنید.

قرارداد API و مدل خطاها (API Contract)
------------------------------------
موارد مهم:
- پاسخ موفق:

```json
{ "success": true, "data": ..., "message": "..." }
```

- پاسخ خطا:

```json
{
  "success": false,
  "error": {
    "statusCode": <HTTP>,
    "code": "<ERROR_CODE>",
    "message": "Human-friendly message",
    "details": { "field": ["msg", ...] } // optional
  }
}
```

این قرارداد به مصرف‌کننده اجازه می‌دهد خطاها را برنامه‌محور (programmatically) هندل کند و پیام‌های انسانی را برای نمایش در UI به کار گیرد.

اعتبارسنجی و مدیریت خطا (Validation & Error Handling)
-----------------------------------------------------
- از `express-validator` برای تعریف قواعد ولیدیشن در سطح روتر استفاده شده است.
- middleware `validate` نتایج ولیدیشن را به یک دیکشنری `details` تبدیل می‌کند (کلیدها نام فیلدها و مقادیر آرایهٔ پیام‌ها).
- خطاهای عملیاتی با `AppError` پرتاب می‌شوند و middleware مرکزی آن‌ها را با کد HTTP مناسب بازمی‌گرداند.

نمونهٔ ولیدیشن (مثال پژوهشی)
--------------------------------
درخواست ناقص برای ثبت‌نام (`POST /auth/register`) ممکن است پاسخ زیر را تولید کند:

```json
{
  "success": false,
  "error": {
    "statusCode": 400,
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": { "email": ["Valid Email is required"], "password": ["Password must be at least 6 characters"] }
  }
}
```

محیط آزمایشی و اجرای بازتولیدپذیر (Reproducible Experiment Setup)
------------------------------------------------------------------
برای آزمایش پژوهشی:
1. یک ماشین مجازی یا کانتینر دیتابیس با نسخهٔ مشخص SQL Server راه‌اندازی کنید.
2. اسکریپت `db.sql` را اجرا و داده‌های نمونه را بارگذاری کنید.
3. متغیر محیطی `NODE_ENV=test` را تنظیم کنید و با داده‌های fixture تست‌ها را اجرا نمایید.

روندهای ارزیابی (Evaluation)
-----------------------------
ارزیابی این پروژه معمولاً شامل موارد زیر است:
- تحلیل پوشش واحدهای تست (unit test coverage)
- تست‌های کارایی پایه برای کوئری‌های بحرانی
- بررسی مقاومت در برابر خطا (fault injection) در سطوح سرویس و DB

محدودیت‌ها و کارهای آینده (Limitations & Future Work)
----------------------------------------------------
- پیاده‌سازی فعلی از اعتبارسنجی و لاگ پایه استفاده می‌کند؛ پیشنهاد می‌شود لاگر ساختاریافته (pino/winston) افزوده و لاگ‌ها به سرویس متمرکزی ارسال شوند.
- سیاست کامل مدیریت توکن (refresh/revoke) پیاده‌سازی نشده است.
- تست‌های خودکار فعلی کم هستند؛ افزودن suite تست و CI پیشنهاد می‌شود.

چگونه مشارکت کنید (Contribution)
--------------------------------
1. یک issue باز کنید و تغییر پیشنهادی را توصیف نمایید.
2. یک شاخهٔ جدید بسازید و تغییرات را اعمال کنید.
3. Pull request را باز کنید و توضیحات لازم را بنویسید.

مشاهدهٔ مستندات (Online)
-------------------------
مستندات OpenAPI/Swagger این پروژه در آدرس زیر قابل مشاهده و بررسی است:

https://nodejs-clean-architecture.onrender.com/api-docs

مجوز (License)
----------------
MIT © Mohammad Hussein Fakhravari
