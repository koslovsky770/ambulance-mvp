# מערכת ניהול הזמנת אמבולנסים – MVP

דמו מודרני של מערכת ניהול לחברת אמבולנסים. RTL, mobile-first לנהג.

## טכנולוגיה
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase (Postgres + Auth + RLS)

## הפעלה מקומית
```bash
npm install
cp .env.local.example .env.local   # מלאו את מפתחות Supabase
npm run dev
```
פתחו http://localhost:3000

## חשבונות דמו (בסביבת הפיתוח)
| תפקיד | אימייל | סיסמה |
|---|---|---|
| מנהל | admin@demo.local | demo1234 |
| נהג | driver@demo.local | demo1234 |

## תפקידים
- **מנהל** – ניהול מלא של קריאות, מטופלים, נהגים, רכבים, מוסדות, סוגי תלונות, דוחות + ייצוא CSV.
- **נהג** – רואה רק את הקריאות ששויכו אליו, מעדכן סטטוסים (התקבלה → בדרך → הגיע → סיום).

## מבנה
```
app/
  (auth)/login/          מסך התחברות
  (admin)/               דשבורד, קריאות, ישויות, דוחות
  driver/                ממשק נהג מובייל
lib/                     status, calls, entities, auth, supabase clients
components/              call-list, call-form, shared UI
```

## מה לא נכנס לגרסה הזו
Multi-tenant, סליקה, WhatsApp, GPS, אפליקציית native, ניהול משמרות/ביטוח, אוטומציות.
