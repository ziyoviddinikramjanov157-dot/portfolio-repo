# Bosmenti — erkaklar kiyim do‘koni (React)

Bosmenti do‘konining mobil ilova va veb-sayti (demo). React + TypeScript + Vite asosida qurilgan.

- Birinchi ochilganda 3D landing chiqadi, ro‘yxatdan o‘tish so‘ralmaydi.
- Kiyimlar 11 ta bo‘limga ajratilgan. Har bir mahsulot sahifasida o‘lcham, rang, ma’lumot va narx bor.
- Savatda to‘lov usuli tanlanadi: naqd yoki karta.
- Kirish telefon raqam orqali (SMS kod). Faqat buyurtma berishda so‘raladi.
- Sayt telefon va kompyuter ekraniga moslashadi.

## Ishga tushirish

Kerak: [Node.js](https://nodejs.org) 18 yoki undan yangi.

```bash
cd bosmenti-app
npm install      # bir marta
npm run dev      # http://localhost:5173 da ochiladi
```

Tayyor (production) versiyani yig‘ish:

```bash
npm run build    # natija: dist/ papkasi
npm run preview  # dist/ ni http://localhost:4173 da ko‘rsatadi
```

`dist/` papkasini istalgan statik hostingga (Netlify, Vercel, GitHub Pages) yuklash mumkin.

## Tuzilishi

```
src/
  main.tsx            ilovani ishga tushiradi
  App.tsx             ekranlarni almashtiradi
  store.tsx           holat: navigatsiya, savat, sevimlilar, foydalanuvchi, buyurtmalar
  styles.css          barcha uslublar (telefon + kompyuter)
  data/catalog.ts     bo‘limlar, mahsulotlar, o‘lchamlar, o‘lcham jadvallari (demo)
  lib/                yordamchi funksiyalar va fotosiz mahsulotlar uchun chizmalar
  components/         umumiy qismlar: kartalar, menyu, bildirishnoma, kirish oynasi, 3D hero
  screens/            Landing, Bosh sahifa, Katalog, Mahsulot, Savat, Profil
public/img/           fotolar (manbalari: public/img/CREDITS.md)
```

## Keyingi qadamlar

- **Haqiqiy ma’lumotlar.** `src/data/catalog.ts` dagi demo mahsulotlar o‘rniga backend API ulanadi. Fotolar do‘konning haqiqiy fotolari bilan almashtiriladi.
- **SMS.** `src/components/LoginSheet.tsx` dagi `verify` funksiyasi hozir istalgan kodni qabul qiladi. Uni SMS xizmatiga (masalan, Eskiz yoki Play Mobile) ulash kerak.
- **Karta orqali to‘lov.** Payme yoki Click to‘lov sahifasiga yo‘naltirish qo‘shiladi.
- **Play Market va App Store.** [Capacitor](https://capacitorjs.com) yordamida ilovaga aylantiriladi:
  ```bash
  npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
  npx cap init Bosmenti uz.bosmenti.app --web-dir dist
  npm run build && npx cap add android && npx cap open android
  ```
  `vite.config.ts` dagi `base: './'` sozlamasi WebView ichida ishlashi uchun allaqachon qo‘yilgan.

Savat, sevimlilar va buyurtmalar hozircha faqat brauzerning `localStorage` xotirasida saqlanadi.
