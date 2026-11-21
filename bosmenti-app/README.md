# Bosmenti — erkaklar kiyim do‘koni (sayt va admin panel)

Do‘konning sayti va boshqaruv paneli. React + TypeScript + Vite. Ma’lumotlarni serverdan (`../bosmenti-server`) oladi.

- Birinchi ochilganda do‘kon haqidagi landing sahifasi chiqadi, ro‘yxatdan o‘tish so‘ralmaydi.
- Bo‘limlar, mahsulotlar, narxlar va do‘kon ma’lumotlari admin panelda tahrirlanadi.
- Buyurtma berishda mijoz ismi va telefon raqamini qoldiradi; to‘lov kiyimni qabul qilganda naqd yoki karta bilan.
- Mijoz buyurtmasi holatini “Profil” bo‘limida ko‘radi.
- Sayt telefon va kompyuter ekraniga moslashadi.

Serverga chiqarish va ishga tushirish: [`../bosmenti-server/README.md`](../bosmenti-server/README.md).

## Tuzilishi

```
index.html, admin.html  ikki sahifa: do‘kon va admin panel
src/
  main.tsx              katalogni serverdan yuklab, do‘konni ochadi
  App.tsx               ekranlarni almashtiradi
  store.tsx             holat: navigatsiya, savat, sevimlilar, buyurtma berish
  data/catalog.ts       serverdan kelgan katalog (bo‘limlar, mahsulotlar, o‘lchamlar, do‘kon ma’lumotlari)
  lib/api.ts            server bilan aloqa
  components/, screens/ do‘kon ekranlari
  admin/                boshqaruv paneli: buyurtmalar, mahsulotlar, sozlamalar
public/img/             do‘konning boshlang‘ich fotolari (manbalari: public/img/CREDITS.md)
```

## Mobil ilova (Play Market, App Store)

[Capacitor](https://capacitorjs.com) yordamida ilovaga aylantiriladi. Ilova ichida sayt boshqa manzildan ochilgani uchun server manzilini ko‘rsatib yig‘ing:

```bash
VITE_API_URL=https://bosmenti.uz npm run build
```

Bunda serverda shu ilova manzilidan so‘rovlarga ruxsat (CORS) qo‘shish kerak bo‘ladi.
