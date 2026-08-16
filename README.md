# تنظيم مالي (Tanzim Mali)

منصة ويب لإدارة الميزانية الشخصية — نسخة MVP. مبنية بـ Next.js + Prisma + MySQL.

## المتطلبات

- Node.js 20+
- قاعدة بيانات MySQL (محلياً أو على Hostinger)

## الإعداد المحلي

1. ثبّت الحزم:

   ```bash
   npm install
   ```

2. انسخ ملف البيئة وعدّل القيم:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL`: رابط الاتصال بقاعدة بيانات MySQL، مثل:
     `mysql://user:password@localhost:3306/tanzim_mali`
   - `JWT_SECRET`: نص عشوائي طويل لتوقيع جلسات الدخول (يمكن توليده بـ
     `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`)

3. طبّق مخطط قاعدة البيانات:

   ```bash
   npx prisma migrate deploy
   ```

   (أثناء التطوير استخدم `npx prisma migrate dev` بدلاً منها لإنشاء migrations جديدة)

4. شغّل خادم التطوير:

   ```bash
   npm run dev
   ```

   ثم افتح [http://localhost:3000](http://localhost:3000)

## البنية

- `src/app` — صفحات Next.js (App Router)، بما فيها `/login`، `/signup`، `/dashboard`، `/transactions`، `/settings`
- `src/actions` — Server Actions للمصادقة والمعاملات والإعدادات
- `src/lib` — Prisma client، الجلسات (JWT)، التحقق من صحة المدخلات (Zod)، الثوابت
- `prisma/schema.prisma` — مخطط قاعدة البيانات

## النشر على Hostinger

راجع مواصفات المشروع للحصول على خطوات النشر الكاملة. باختصار:

1. أنشئ تطبيق Node.js وقاعدة بيانات MySQL من hPanel
2. اربط المستودع أو ارفع المشروع
3. أضف متغيرات البيئة (`DATABASE_URL`, `JWT_SECRET`) من إعدادات التطبيق
4. شغّل `npx prisma migrate deploy` على الخادم
5. فعّل SSL المجاني — الجلسات تُخزَّن في كوكي آمن (`secure`) يتطلب HTTPS في بيئة الإنتاج
