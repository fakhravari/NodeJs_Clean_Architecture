# 🧱 Kiandent Node.js API — Layered Architecture

پروژهٔ نمونهٔ **Node.js + Express + SQL Server** با معماری لایه‌ای (config/models/services/controllers/routes) و **Swagger UI** برای مستندسازی و تست CRUD مربوط به موجودیت‌های زیر:

- 👤 Customers (مشتریان)
- 📦 Products (محصولات)
- 🧾 Orders (سفارش‌ها)
- 📋 OrderDetails (جزئیات سفارش‌ها)

> این README برای ریپوی «kiandent-node-api-arch» نوشته شده و تمام مراحل اجرا، تست و توسعه را پوشش می‌دهد.

---

## فهرست مطالب
- [ویژگی‌ها](#ویژگیها)
- [ساختار پوشه‌ها](#ساختار-پوشهها)
- [پیش‌نیازها](#پیشنیازها)
- [نصب و اجرا](#نصب-و-اجرا)
- [پیکربندی اتصال به دیتابیس](#پیکربندی-اتصال-به-دیتابیس)
- [اسکریپت‌ها](#اسکریپتها)
- [مستندات Swagger UI](#مستندات-swagger-ui)
- [Endpointها (CRUD)](#endpointها-crud)
- [نمونه درخواست‌ها (curl)](#نمونه-درخواستها-curl)
- [نکات امنیتی](#نکات-امنیتی)
- [عیب‌یابی](#عیبیابی)
- [مجوز](#مجوز)
- [نویسنده](#نویسنده)

---

## ویژگی‌ها
- معماری لایه‌ای تمیز و توسعه‌پذیر
- اتصال مستقیم به **SQL Server** با پکیج `mssql`
- عملیات کامل CRUD برای ۴ موجودیت اصلی
- مستندسازی خودکار با **Swagger UI**
- سازگار با Postman / curl / مرورگر

---

## ساختار پوشه‌ها

```
kiandent-node-api-arch/
│
├─ src/
│  ├─ config/
│  │  └─ db.js                # اتصال به SQL Server (mssql)
│  │
│  ├─ models/                 # مشخصات/تعاریف جداول
│  │  ├─ customerModel.js
│  │  ├─ productModel.js
│  │  ├─ orderModel.js
│  │  └─ orderDetailModel.js
│  │
│  ├─ services/               # منطق تجاری و تعامل با DB
│  │  ├─ customerService.js
│  │  ├─ productService.js
│  │  ├─ orderService.js
│  │  └─ orderDetailService.js
│  │
│  ├─ controllers/            # کنترلرها (ارتباط Route ↔ Service)
│  │  ├─ customerController.js
│  │  ├─ productController.js
│  │  ├─ orderController.js
│  │  └─ orderDetailController.js
│  │
│  ├─ routes/                 # مسیرهای REST و Swagger annotations
│  │  ├─ customerRoutes.js
│  │  ├─ productRoutes.js
│  │  ├─ orderRoutes.js
│  │  └─ orderDetailRoutes.js
│  │
│  ├─ docs/
│  │  └─ swagger.js           # پیکربندی swagger-jsdoc
│  │
│  └─ app.js                  # نقطهٔ ورود اپلیکیشن
│
├─ package.json
├─ .gitignore
└─ README.md
```

---

## پیش‌نیازها
- **Node.js** v18+  
- **npm** (همراه Node نصب است)  
- دسترسی به یک **SQL Server** (محلی یا ریموت)

---

## نصب و اجرا

```bash
# نصب وابستگی‌ها
npm install

# اجرای توسعه (با nodemon)
npm run dev

# یا اجرای معمولی
npm start
```

پس از اجرا، Swagger UI در آدرس زیر در دسترس است:

```
http://localhost:3000/api-docs
```

---

## پیکربندی اتصال به دیتابیس

اطلاعات اتصال در `src/config/db.js` قرار دارد. به‌صورت پیش‌فرض نمونه‌ای مانند زیر تنظیم شده است (برای محیط شما قابل تغییر است):

```js
const dbConfig = {
  user: 'kiandent_NodeJs',
  password: 'q8E0*0es7',
  server: '62.204.61.143\sqlserver2022',
  database: 'kiandent_NodeJs',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 }
};
```

> **نکته:** اگر اتصال ناموفق بود، می‌توانید به‌صورت جایگزین از قالب `IP,PORT` استفاده کنید، مثل:
> ```js
> server: '62.204.61.143,1433'
> ```
> و اطمینان حاصل کنید **TCP/IP** در SQL Server فعال و فایروال پورت را باز کرده باشد.

> **پیشنهاد امنیتی:** می‌توانید این مقادیر را به متغیرهای محیطی منتقل کنید (فایل `.env` + پکیج `dotenv`) تا اطلاعات حساس داخل کد نباشد.

---

## اسکریپت‌ها
در `package.json` موارد زیر تعریف شده است:

```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
  }
}
```

- `npm start` → اجرای معمولی
- `npm run dev` → اجرای زنده با **nodemon**

---

## مستندات Swagger UI

- مسیر: **`/api-docs`**
- ابزارها: `swagger-ui-express` + `swagger-jsdoc`
- سورس Annotationها: فایل‌های داخل `src/routes/*.js`

در صفحهٔ Swagger UI می‌توانید دکمهٔ **Try it out** را بزنید و تمام endpointها را بدون نیاز به Postman تست کنید.

---

## Endpointها (CRUD)

### Customers
- `GET /customers` — لیست مشتری‌ها
- `GET /customers/{id}` — دریافت یک مشتری
- `POST /customers` — افزودن مشتری
- `PUT /customers/{id}` — بروزرسانی مشتری
- `DELETE /customers/{id}` — حذف مشتری

### Products
- `GET /products` — لیست محصولات
- `GET /products/{id}` — دریافت یک محصول
- `POST /products` — افزودن محصول
- `PUT /products/{id}` — بروزرسانی محصول
- `DELETE /products/{id}` — حذف محصول

### Orders
- `GET /orders` — لیست سفارش‌ها
- `GET /orders/{id}` — دریافت یک سفارش
- `POST /orders` — ثبت سفارش
- `PUT /orders/{id}` — بروزرسانی سفارش
- `DELETE /orders/{id}` — حذف سفارش

### OrderDetails
- `GET /orderdetails` — لیست جزئیات سفارش‌ها
- `GET /orderdetails/{id}` — دریافت یک جزئیات سفارش
- `POST /orderdetails` — افزودن جزئیات
- `PUT /orderdetails/{id}` — بروزرسانی جزئیات
- `DELETE /orderdetails/{id}` — حذف جزئیات

---

## نمونه درخواست‌ها (curl)

> قبل از تست، مطمئن شوید سرور در حال اجرا است: `http://localhost:3000`

### Customers
```bash
# لیست
curl http://localhost:3000/customers

# افزودن
curl -X POST http://localhost:3000/customers   -H "Content-Type: application/json"   -d '{"FullName":"علی رضایی","Phone":"09120000000","Email":"ali@example.com","City":"تهران"}'

# بروزرسانی (ID=1)
curl -X PUT http://localhost:3000/customers/1   -H "Content-Type: application/json"   -d '{"FullName":"علی راد","Phone":"09123333333","Email":"ali.r@example.com","City":"کرج"}'

# حذف (ID=1)
curl -X DELETE http://localhost:3000/customers/1
```

### Products
```bash
curl http://localhost:3000/products

curl -X POST http://localhost:3000/products   -H "Content-Type: application/json"   -d '{"ProductName":"مسواک برقی","Price":750000,"Stock":20}'

curl -X PUT http://localhost:3000/products/1   -H "Content-Type: application/json"   -d '{"ProductName":"مسواک برقی پرو","Price":850000,"Stock":18}'

curl -X DELETE http://localhost:3000/products/1
```

### Orders
```bash
curl http://localhost:3000/orders

curl -X POST http://localhost:3000/orders   -H "Content-Type: application/json"   -d '{"CustomerID":1,"TotalAmount":0}'

curl -X PUT http://localhost:3000/orders/1   -H "Content-Type: application/json"   -d '{"TotalAmount":1200000}'

curl -X DELETE http://localhost:3000/orders/1
```

### OrderDetails
```bash
curl http://localhost:3000/orderdetails

curl -X POST http://localhost:3000/orderdetails   -H "Content-Type: application/json"   -d '{"OrderID":1,"ProductID":1,"Quantity":2,"UnitPrice":750000}'

curl -X PUT http://localhost:3000/orderdetails/1   -H "Content-Type: application/json"   -d '{"Quantity":3,"UnitPrice":740000}'

curl -X DELETE http://localhost:3000/orderdetails/1
```

---

## نکات امنیتی
- فایل‌های حساس مثل رمزهای اتصال را **در ریپو قرار ندهید**. از `.gitignore` استفاده کنید.
- پیشنهاد می‌شود از **متغیرهای محیطی** و فایل `.env` + پکیج `dotenv` استفاده کنید.
- روی سرور، پورت‌ها و فایروال را با دقت تنظیم کنید.

---

## عیب‌یابی
- **ETIMEOUT / ECONNREFUSED**: دسترسی شبکه‌ای به SQL Server یا پورت 1433 بررسی شود.  
- **Cannot connect**: تنظیمات TCP/IP در SQL Server فعال باشد. اگر instance name دارید، DNS/NBNS درست resolve شود یا از قالب `IP,PORT` استفاده کنید.  
- **خطای اسکیما/ستون**: نام جداول و ستون‌ها با دیتابیس هم‌خوان باشد.  
- **Swagger خالی**: اطمینان از اسکن مسیر `apis: ['./src/routes/*.js']` و وجود Annotationهای `@swagger` در فایل‌های route.

---

## مجوز
این پروژه تحت مجوز **MIT** منتشر می‌شود.

---

## نویسنده
**Mohammad Hussein Fakhravari**  
📧 fakhravary@hotmail.com  
GitHub: [@fakhravary](https://github.com/fakhravary)

> اگر مفید بود، یک ⭐ در GitHub بدهید 🙌
