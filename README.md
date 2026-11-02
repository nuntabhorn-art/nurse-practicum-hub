# bcn-chainat-practicum

## ICU Cases (ADDIE prototype)

Open `practicum.html` and choose **ICU Cases**, or open `icu-cases.html` after signing in with the existing college OTP flow. The three simulated cases are sepsis, respiratory failure, and hemodynamic instability. Each has a pre-test, clinical analysis prompt, post-test, and reflection. The teacher can import learner submissions and assess five rubric dimensions on a 1–4 scale.

For the current static deployment, ICU results are stored in the browser under the signed-in account. A learner downloads **JSON** from the Export tab and sends it to the teacher through the college-approved channel. The teacher imports that JSON in the Rubric tab and downloads a combined **CSV** for analysis. The CSV excludes names, email addresses, analysis, reflection, and feedback; its random learner code can still be linked to a person if a separate code list is kept. Browser data is not synchronized between devices, so export before clearing browser storage.

The cases, questions, and rubric are draft teaching materials. Have ICU educators review their clinical accuracy and content validity before using them for formal assessment or research. The client-side quiz and storage do not provide exam security or server-side verification.

### วิธีใช้ฉบับเร็ว

1. นักศึกษาเข้าระบบเดิม เปิด **วอร์ดฝึก → ICU Cases** แล้วทำกรณีจนจบ
2. นักศึกษาเปิด **Export ข้อมูล → ดาวน์โหลดผลการเรียน JSON ส่งอาจารย์** และส่งผ่านช่องทางที่วิทยาลัยกำหนด
3. อาจารย์เปิด **ICU Cases → Rubric อาจารย์** นำเข้าไฟล์ JSON ของนักศึกษาแต่ละคนและให้คะแนน
4. อาจารย์เปิด **Export ข้อมูล → ดาวน์โหลด CSV** เพื่อวิเคราะห์คะแนนแบบไม่แสดงชื่อ

การเปลี่ยนเครื่องหรือการล้างข้อมูลเบราว์เซอร์ทำให้ข้อมูลที่ยังไม่ส่งออกหายได้ ระบบนี้ยังไม่ได้เชื่อม backend สำหรับผล ICU โดยเฉพาะ

### แก้โจทย์และเฉลย ICU

กรณีและข้อสอบ ICU อยู่ต้นไฟล์ `icu-cases.js` ในตัวแปร `cases` แต่ละกรณีมี `scenario` (สถานการณ์), `task` (งานวิเคราะห์), `pre` และ `post` (ข้อสอบก่อน/หลัง), และ `feedback` (ประเด็นเฉลยหลังทำ post-test) คำถามหนึ่งข้อเขียนเป็น `{q:"โจทย์", a:["ตัวเลือกแรก","ตัวเลือกที่สอง","ตัวเลือกที่สาม"], key:1}` โดย `key` นับจากศูนย์: 0=ตัวเลือกแรก, 1=ตัวเลือกที่สอง, 2=ตัวเลือกที่สาม หลังแก้ไฟล์ ให้ commit และ push ไป `main` เพื่อให้ Vercel สร้าง deployment ใหม่ ขณะนี้ยังไม่มีหน้าจอเพิ่ม/แก้ข้อสอบ ICU ในเว็บ และ `feedback` เป็นคำอธิบายรวมของกรณี ไม่ใช่เฉลยรายข้อ

หน้า `exam.html` เป็น **คลังข้อสอบ 8 วิชาแยกจาก ICU Cases** บัญชีอาจารย์มีปุ่ม “เพิ่มข้อสอบ” ให้กรอกโจทย์ ตัวเลือก A–D เฉลย เหตุผล และอ้างอิง แต่ข้อที่เพิ่มผ่านหน้านี้เก็บในเบราว์เซอร์เครื่องนั้น (`localStorage`) จึงไม่กระจายไปยังนักศึกษาหรืออุปกรณ์อื่นโดยอัตโนมัติ ข้อสอบเริ่มต้นที่ทุกคนเห็นอยู่ใน `exam_questions_data.js`
