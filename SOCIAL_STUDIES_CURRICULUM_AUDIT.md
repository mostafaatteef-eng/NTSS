# Social Studies — textbook indexing audit (2026-11-16)

The EBDA NTSS platform now shows **Social Studies** only to Grades 2 and 3. Source mapping is based on the two PDFs uploaded by the user.

## Grade 2 — 2026–2027, FIRST TERM
**PDF:** `دراسات اجتماعية - الصف الثاني - تيرم اول (1).pdf` (63 pages)
**Book title:** الدراسات الاجتماعية — مصر الأرض والحضارة.

1. **الوحدة الأولى: الملامح الطبيعية لمصر** (كتاب ص 2–33)
   - الدرس الأول: موقع مصر وأهميته — ص 5
   - الدرس الثاني: سطح مصر — ص 12
   - الدرس الثالث: مناخ مصر والأقاليم المناخية — ص 24
2. **الوحدة الثانية: نشأة الدولة المصرية وتطورها** (كتاب ص 34–61)
   - الدرس الأول: نشأة الحضارة المصرية القديمة — ص 36
   - الدرس الثاني: عصور ما قبل التاريخ في مصر — ص 45
   - الدرس الثالث: العصور التاريخية في مصر — ص 53

**Out of scope:** Grade 2 Term 2 was not uploaded and is NOT represented as available.

## Grade 3 — older student guide; not verified as 2026–2027 edition
**PDF:** `دليل الطالب الدراسات الاجتماعية للصف الثالث الثانوي الفني.pdf` (93 PDF pages). Original guide cover visibly shows 2022–2023. Term placement is not specified.

1. **الوحدة الخامسة: الثروات المعدنية والنقل والطاقة** — ten lessons:
   - التوزيع الجغرافي للمعادن في مصر
   - الحديد الخام في مصر
   - الفوسفات والمنجنيز
   - الجبس وملح الطعام
   - مصادر الطاقة المتعددة في مصر
   - البترول وتكريره في مصر
   - الغاز الطبيعي في مصر
   - الفحم وتوليد الكهرباء في مصر
   - النقل البري والمائي في مصر
   - النقل الجوي في مصر
2. **الوحدة السادسة: التطور البشري ومشكلات المجتمع** — ten lessons:
   - التنمية البشرية والأمن الغذائي
   - العطاء العلمي لمصر قديمًا وحديثًا
   - المجتمعات العمرانية الجديدة
   - الميزان التجاري لمصر
   - قناة السويس وأهميتها التجارية
   - القناطر والسدود المصرية
   - المشكلات البيئية للمجتمع المصري
   - مصادر التلوث وأنواعه
   - الانفجار السكاني
   - البطالة

Original unit numbering (5 and 6) is preserved; the platform must not rename these to 1 and 2. Their relationship to other historical units or the current year cannot be inferred from the attached PDF.

## Question and game specification
- All 26 source-indexed lessons have 50 *practice interactions*, **1,300 interactions total**.
- Styles rotate: identify concept, typed keyword completion, identify definition, correct/incorrect, independent recall.
- Five anchor concept/definition pairs currently drive each lesson's practice set. The content is **supplementary and paraphrased**, not a direct transcription of the supplied books, and many interactions revisit the same information.
- Student typing is checked by normalization of Arabic characters; close synonyms are **not** automatically accepted.
- No formal teaching or assessment approval has occurred; specific lesson content and answer keys require an academic review.
- No uploaded textbook PDFs were copied into the public repository.

## Integration validation
- Grade 2: 2 units, 6 lessons, 300 generated practice interactions.
- Grade 3: 2 units, 20 lessons, 1,000 generated practice interactions.
- Every lesson's 50 questions generated without runtime errors; answer index checks passed; all practice views rendered in a JavaScript test.
- Browser/device end-to-end testing and GitHub Pages deployment propagation were not confirmed.
