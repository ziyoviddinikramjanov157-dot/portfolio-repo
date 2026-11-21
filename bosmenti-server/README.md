# Bosmenti — server (backend)

Node.js + TypeScript + Express + PostgreSQL. Do‘kon sayti va admin panelga ma’lumot beradi, buyurtmalarni saqlaydi va yangi buyurtma haqida Telegramga xabar yuboradi. Sayt (`../bosmenti-app`) shu server orqali ochiladi.

- `https://DOMEN/` — do‘kon sayti
- `https://DOMEN/admin` — boshqaruv paneli: buyurtmalar, mahsulotlar va rasmlar, do‘kon sozlamalari

## Internetga chiqarish (VPS + Docker)

Kerak bo‘ladi:

1. **Server (VPS):** Ubuntu 22.04 yoki 24.04, kamida 1 GB operativ xotira.
2. **Domen:** DNS sozlamalarida A yozuvini serverning IP manziliga qarating.
3. **Docker:** serverda bir marta o‘rnatiladi:

```bash
curl -fsSL https://get.docker.com | sh
```

Keyin serverda:

```bash
git clone https://github.com/ziyoviddinikramjanov157-dot/portfolio-repo.git
cd portfolio-repo/bosmenti-server
cp .env.example .env
nano .env
```

`.env` faylida `DOMAIN`, `DB_PASSWORD` va `ADMIN_PASSWORD`ni to‘ldiring, so‘ng ishga tushiring:

```bash
docker compose up -d --build
```

Bir necha daqiqadan keyin sayt `https://DOMEN` manzilida ochiladi. HTTPS sertifikatini Caddy o‘zi oladi va yangilab turadi.

Kundalik ishlar:

| Nima | Buyruq |
| --- | --- |
| Yangi versiyani o‘rnatish | `git pull && docker compose up -d --build` |
| Loglarni ko‘rish | `docker compose logs -f app` |
| Bazaning zaxira nusxasi | `docker compose exec db pg_dump -U bosmenti bosmenti > zaxira.sql` |
| Rasmlarning zaxira nusxasi | `docker compose cp app:/app/uploads ./uploads-zaxira` |
| Admin parolini almashtirish | `.env`da `ADMIN_PASSWORD`ni o‘zgartirib, `docker compose up -d` |

Zaxira nusxani muntazam (masalan, har kuni) olib, serverdan tashqarida saqlang.

## Telegram xabarlari

1. Telegramda [@BotFather](https://t.me/BotFather) ga `/newbot` yozing va bot tokenini oling.
2. Botni do‘kon xodimlari guruhiga qo‘shing va guruhga biror xabar yozing.
3. Brauzerda `https://api.telegram.org/bot<TOKEN>/getUpdates` ni oching va `"chat":{"id": ...}` raqamini oling (guruh uchun u minus bilan boshlanadi).
4. `.env`ga `TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHAT_ID`ni yozing va `docker compose up -d` ni bajaring.

Telegram sozlanmagan bo‘lsa ham buyurtmalar admin panelda ko‘rinadi.

## O‘z kompyuteringizda ishlatish

Kerak: Node.js 22 va PostgreSQL 16.

```bash
createdb bosmenti
cp .env.example .env
```

`.env`da `DATABASE_URL`, `NODE_ENV=development`, `ADMIN_LOGIN` va `ADMIN_PASSWORD` qatorlarini to‘ldiring. Keyin ikkita terminalda:

```bash
npm install && npm run dev
```

```bash
cd ../bosmenti-app && npm install && npm run dev
```

Sayt `http://localhost:5173` da, admin panel `http://localhost:5173/admin.html` da ochiladi. API `http://localhost:3000` da ishlaydi.

Testlar uchun alohida baza kerak (`bosmenti_test`, yoki `TEST_DATABASE_URL` bilan boshqasini ko‘rsating):

```bash
createdb bosmenti_test && npm test
```

## Xavfsizlik

- Narxlar va yetkazib berish narxi faqat serverda, bazadagi ma’lumot bo‘yicha hisoblanadi.
- Admin sessiyasi `httpOnly` cookie'da, 30 kun amal qiladi. 15 daqiqada 10 ta noto‘g‘ri paroldan keyin kirish vaqtincha yopiladi.
- Bitta IP manzildan 15 daqiqada 10 tagacha buyurtma qabul qilinadi.
- Faqat JPG, PNG va WEBP rasmlar (5 MB gacha) yuklanadi; fayl turi nomidan emas, ichidagi baytlardan tekshiriladi.
- Mijoz faqat o‘z brauzeridagi maxfiy kod orqali o‘z buyurtmalarini ko‘radi; boshqalarning buyurtmasi ko‘rinmaydi.

## Tuzilishi

```
migrations/          baza tuzilishi (har biri bir marta, tartib bilan bajariladi)
src/
  index.ts           ishga tushirish: migratsiya, boshlang‘ich ma’lumotlar, server
  app.ts             Express: xavfsizlik sarlavhalari, API, rasmlar, sayt fayllari
  config.ts          .env sozlamalarini tekshirish
  routes/public.ts   /api/catalog, /api/orders, /api/orders/lookup
  routes/admin.ts    /api/admin/... (kirish, buyurtmalar, mahsulotlar, rasm yuklash, sozlamalar)
  services/          buyurtmalar, mahsulotlar, sozlamalar, Telegram
  seed-data.ts       boshlang‘ich bo‘limlar va 28 ta namunaviy mahsulot
test/                API testlari (haqiqiy PostgreSQL bazada)
Dockerfile, docker-compose.yml, Caddyfile   serverga chiqarish
```
