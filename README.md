# Invoys generator — Invoice & Packing List

Invoice-95 formatidagi invoysni (EN/RU) Excel faylida yaratadigan sayt.

## Fayllar

| Fayl | Vazifasi |
|---|---|
| `index.html` | Saytning o'zi (bitta fayl, server kerak emas) |
| `api/orginfo.js` | INN bo'yicha orginfo.uz'dan korxona nomi va manzilini oluvchi Vercel funksiyasi |

## Vercel'ga joylash (mxik-uz bilan bir xil yo'l)

1. GitHub'da yangi repo oching, masalan `invoys-generator`.
2. Shu papkadagi fayllarni tuzilishi bilan yuklang:
   ```
   index.html
   api/orginfo.js
   README.md
   ```
3. vercel.com → **Add New → Project** → shu repo'ni tanlang → **Deploy**. Hech qanday sozlama kerak emas.
4. Tayyor: `https://<loyiha-nomi>.vercel.app`

Shundan keyin "orginfo.uz'dan topish" tugmasi xaridor nomi va manzilini avtomatik to'ldiradi.
Funksiya natijani 1 kun keshlaydi.

## Imkoniyatlar

- Qo'lda kiritish: faktura raqami/sanasi, shartnoma (ixtiyoriy), sotuvchi, xaridor (INN, nom, manzil, telefon), tovarlar jadvali.
- Excel'dan yuklash: ustunlar avtomatik aniqlanadi (o'zbek, rus, ingliz, xitoy sarlavhalari), kerak bo'lsa qo'lda to'g'rilanadi.
  - **Bitta invoys** — hamma tovar bitta faylga.
  - **Alohida invoyslar** — "Jami/Итого/合计" qatorlari, Invoice № ustuni, konteyner raqami yoki har bir qator bo'yicha ajratish.
  - Bir xil nom + HS + narxdagi qatorlarni jamlash (modellar o'lcham bo'yicha).
- Excel'dan nusxalangan blokni jadvalga to'g'ridan-to'g'ri joylash (Ctrl+V).
- Yuklab olish: joriy invoys (.xlsx), hammasi alohida fayllarda (ZIP) yoki bitta Excel'da (har biri alohida varaq).
- Sotuvchi va xaridorlarni saqlab qo'yish; kiritilgan ma'lumotlar brauzerda saqlanib turadi.

## Eslatma

- orginfo.uz sahifa tuzilishini o'zgartirsa, `api/orginfo.js` dagi `parse()` funksiyasini yangilash kerak bo'ladi.
  Avtomatik qidiruv ishlamasa, sayt orginfo.uz havolasini ko'rsatadi — nom va manzilni qo'lda qo'yish mumkin.
- Kutubxonalar cdnjs.cloudflare.com'dan yuklanadi (ExcelJS, SheetJS, JSZip) — internet kerak.
