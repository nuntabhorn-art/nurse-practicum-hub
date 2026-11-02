"use strict";
const cases = [
  {
    id:"sepsis", title:"กรณี 1 · สงสัย Sepsis", tag:"การประเมินและสื่อสารความเสี่ยง",
    scenario:"ผู้ป่วยจำลองอายุ 67 ปี รับไว้ใน ICU ด้วยการติดเชื้อทางเดินปัสสาวะ มีไข้ 39°C ชีพจร 124 ครั้ง/นาที ความดัน 86/50 mmHg หายใจ 28 ครั้ง/นาที ปัสสาวะลดลง และเริ่มสับสน ข้อมูลและอาการเปลี่ยนแปลงเกิดขึ้นในช่วง 2 ชั่วโมงล่าสุด",
    task:"ระบุข้อมูลที่ต้องประเมินทันที จัดลำดับปัญหา และเขียนข้อความสื่อสารแก่ทีมรักษาตาม SBAR โดยอ้างอิงข้อมูลในกรณีจำลอง",
    pre:[
      {q:"ข้อมูลใดบ่งชี้ว่าผู้ป่วยรายนี้ต้องได้รับการประเมินซ้ำอย่างเร่งด่วน?",a:["ไข้เพียงอย่างเดียว","ความดันต่ำร่วมกับสับสนและปัสสาวะลดลง","อายุ 67 ปีเพียงอย่างเดียว"],key:1},
      {q:"การสื่อสารแบบ SBAR ควรระบุอะไรในส่วน Assessment?",a:["เพียงชื่อหอผู้ป่วย","ข้อประเมินสภาพและความเสี่ยงปัจจุบันจากข้อมูลที่มี","คำสั่งรักษาที่ไม่เคยได้รับ"],key:1}
    ],
    post:[
      {q:"เมื่อความดันต่ำและระดับความรู้สึกตัวเปลี่ยนพร้อมกัน ควรจัดการเรียนรู้ให้ผู้เรียนทำสิ่งใดก่อน?",a:["รอรอบบันทึกถัดไป","ประเมินซ้ำและแจ้งทีมตามระบบของหน่วยงาน","สรุปผลหลังจำหน่าย"],key:1},
      {q:"ข้อใดเป็นหลักฐานที่มีประโยชน์ที่สุดใน SBAR สำหรับกรณีนี้?",a:["แนวโน้ม vital signs ระดับรู้สึกตัว และปริมาณปัสสาวะ","ความเห็นที่ไม่มีข้อมูลสนับสนุน","เฉพาะอายุผู้ป่วย"],key:0}
    ],
    feedback:"ประเด็นหลักคือเห็นสัญญาณการไหลเวียนเลือดและอวัยวะเปลี่ยนแปลง ประเมินซ้ำอย่างเป็นระบบ และสื่อสารข้อมูลที่ตรวจพบอย่างทันเวลา ตามแนวทางและขอบเขตบทบาทของหน่วยงาน"
  },
  {
    id:"respiratory",title:"กรณี 2 · หายใจล้มเหลว",tag:"ABCDE และการเฝ้าระวัง",
    scenario:"ผู้ป่วยจำลองอายุ 54 ปี ใช้เครื่องช่วยหายใจใน ICU ค่า SpO₂ ลดจาก 96% เป็น 88% มีเสียงสัญญาณเตือนจากเครื่อง หายใจสัมพันธ์กับเครื่องลดลง และมีเสมหะมากขึ้น ข้อมูลที่เหลือยังไม่ครบ",
    task:"เรียงลำดับสิ่งที่ต้องตรวจประเมินด้าน airway/breathing ระบุข้อมูลที่ยังขาด และสื่อสารสิ่งที่พบกับพยาบาลพี่เลี้ยงหรือทีมตามขั้นตอนของหน่วยงาน",
    pre:[
      {q:"ข้อมูลใดควรถูกประเมินก่อนเมื่อ SpO₂ ลดและเครื่องส่งสัญญาณเตือน?",a:["ความครบถ้วนของ airway/breathing และสภาพผู้ป่วย","ประวัติการนอนย้อนหลังหนึ่งเดือน","คะแนนความพึงพอใจ"],key:0},
      {q:"เมื่อข้อมูลไม่ครบ ควรบันทึกอย่างไร?",a:["เติมค่าที่คาดเดา","แยกสิ่งที่สังเกตจริงจากสิ่งที่ยังต้องตรวจ","คัดลอกบันทึกเดิม"],key:1}
    ],
    post:[
      {q:"สัญญาณเตือนพร้อม SpO₂ ลดควรนำไปสู่การเรียนรู้ข้อใด?",a:["ดูเฉพาะตัวเลขบนจอ","ประเมินผู้ป่วยและระบบที่เกี่ยวข้องทันที พร้อมขอความช่วยเหลือตามความเหมาะสม","ปิดสัญญาณเตือนโดยไม่ตรวจ"],key:1},
      {q:"ข้อมูลบันทึกใดช่วยติดตามการเปลี่ยนแปลงได้ดีที่สุด?",a:["เวลาที่เกิดเหตุ ค่า SpO₂ สภาพผู้ป่วย สิ่งที่ตรวจพบ และการสื่อสารทีม","ความรู้สึกโดยไม่มีข้อเท็จจริง","คำวินิจฉัยที่คาดเดา"],key:0}
    ],
    feedback:"ประเด็นหลักคือประเมินตัวผู้ป่วยก่อนเชื่อจอแสดงผล ตรวจ airway และ breathing เป็นลำดับ บันทึกข้อมูลที่เห็นจริง และขอความช่วยเหลือตามขอบเขตบทบาท"
  },
  {
    id:"hemodynamic",title:"กรณี 3 · Hemodynamic instability",tag:"แนวโน้มข้อมูลและการจัดลำดับ",
    scenario:"ผู้ป่วยจำลองอายุ 72 ปี หลังผ่าตัดใน ICU ความดันลดจาก 118/72 เป็น 90/56 mmHg ชีพจรเพิ่มจาก 88 เป็น 116 ครั้ง/นาที ผิวหนังเย็น ปัสสาวะในชั่วโมงล่าสุดลดลง ข้อมูลการสูญเสียสารน้ำและผลตรวจล่าสุดยังไม่ครบ",
    task:"สรุปแนวโน้มข้อมูล ระบุข้อมูลสำคัญที่ต้องตรวจเพิ่ม และนำเสนอเหตุผลในการจัดลำดับการประเมินและการสื่อสารทีม",
    pre:[
      {q:"ข้อใดช่วยให้เห็นความเปลี่ยนแปลงของผู้ป่วยมากที่สุด?",a:["ค่าเดี่ยวที่ไม่มีเวลา","แนวโน้มความดัน ชีพจร อาการ และปัสสาวะ","ประวัติที่ไม่เกี่ยวข้อง"],key:1},
      {q:"หากข้อมูลการสูญเสียสารน้ำยังไม่ครบ ควรทำอย่างไร?",a:["ระบุว่าไม่ทราบและตรวจสอบเพิ่ม","ประมาณค่าแล้วบันทึกเป็นจริง","ละเลยข้อมูลทั้งหมด"],key:0}
    ],
    post:[
      {q:"ข้อใดบ่งชี้ว่าควรประเมินและสื่อสารความเสี่ยงอย่างรวดเร็ว?",a:["ความดันลด ชีพจรเพิ่ม ผิวหนังเย็น และปัสสาวะลด","อายุเพียงอย่างเดียว","เวลาเข้าเวร"],key:0},
      {q:"การรายงานข้อมูลที่มีคุณภาพควรมีอะไร?",a:["ค่าปัจจุบันเท่านั้น","ค่าก่อนหน้าและปัจจุบันพร้อมเวลา อาการร่วม และข้อมูลที่ยังขาด","ข้อสรุปที่ไม่ได้ตรวจสอบ"],key:1}
    ],
    feedback:"ประเด็นหลักคืออ่านแนวโน้มหลายตัวแปรร่วมกัน แยกข้อมูลจริงจากข้อมูลที่ยังขาด และสื่อสารการเปลี่ยนแปลงอย่างมีเหตุผล"
  }
];
const rubric = ["ประเมินและรวบรวมข้อมูล", "คิดวิเคราะห์และจัดลำดับปัญหา", "ความปลอดภัยและขอบเขตบทบาท", "การสื่อสารกับทีม", "การบันทึกและสะท้อนคิด"];
const session = requireLogin();
const storageKey = `nursenote-icu-v1:${session?.email || "guest"}`;
const assessKey = `nursenote-icu-assess-v1:${session?.email || "guest"}`;
const readList = key => {try { const value=JSON.parse(localStorage.getItem(key)||"[]"); return Array.isArray(value)?value:[] } catch {return []}};
const readRecords=()=>readList(storageKey);
const saveRecords=records=>localStorage.setItem(storageKey,JSON.stringify(records));
const readAssessRecords=()=>readList(assessKey);
const saveAssessRecords=records=>localStorage.setItem(assessKey,JSON.stringify(records));
const app=document.getElementById("app");
let view="home", selected=null, phase="pre", answers={}, draft=null;
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[c]);
const randomCode=()=>"ICU-"+Array.from(crypto.getRandomValues(new Uint8Array(5)),x=>x.toString(16).padStart(2,"0")).join("").toUpperCase();
function setView(next){if(!session?.isAdmin && next==="assess")return;view=next;["homeTab","assessTab","exportTab"].forEach((id,i)=>document.getElementById(id).classList.toggle("active",["home","assess","export"][i]===next));render()}
if (!session?.isAdmin) document.getElementById("assessTab").hidden=true;
document.getElementById("homeTab").onclick=()=>setView("home");
document.getElementById("assessTab").onclick=()=>setView("assess");
document.getElementById("exportTab").onclick=()=>setView("export");
function questionForm(items,label){return `<form id="quiz"><span class="step">${label}</span>${items.map((item,i)=>`<fieldset><legend>${i+1}. ${esc(item.q)}</legend>${item.a.map((choice,j)=>`<label><input required type="radio" name="q${i}" value="${j}">${esc(choice)}</label>`).join("")}</fieldset>`).join("")}<button class="primary" type="submit">บันทึกคำตอบ</button></form>`}
function renderHome(){
 if(!selected){app.innerHTML=`<div class="card"><h2>ICU Cases</h2><p>เลือกกรณีจำลอง ทำแบบทดสอบก่อนเรียน วิเคราะห์สถานการณ์ ทำแบบทดสอบหลังเรียน แล้วสะท้อนคิด</p><p class="muted small">แบบทดสอบนี้เป็นต้นแบบสำหรับตรวจความรู้พื้นฐาน ยังต้องตรวจความตรงของเนื้อหาก่อนใช้วิจัย</p></div>${cases.map(c=>`<div class="card"><span class="badge">${esc(c.tag)}</span><h2>${esc(c.title)}</h2><button data-case="${c.id}" class="primary">เริ่มกรณี</button></div>`).join("")}`;app.querySelectorAll("[data-case]").forEach(b=>b.onclick=()=>{selected=cases.find(c=>c.id===b.dataset.case);phase="pre";answers={};draft={code:randomCode(),caseId:selected.id};render()});return}
 const c=selected;let inner=`<button id="back">← ICU Cases</button><div class="card"><span class="badge">${esc(c.tag)}</span><h2>${esc(c.title)}</h2>`;
 if(phase==="pre")inner+=questionForm(c.pre,"1 / 4 · Pre-test");
 if(phase==="case")inner+=`<span class="step">2 / 4 · วิเคราะห์กรณี</span><p>${esc(c.scenario)}</p><h3>งานของผู้เรียน</h3><p>${esc(c.task)}</p><label for="analysis">บันทึกการคิดวิเคราะห์ (ไม่ใส่ชื่อหรือข้อมูลผู้ป่วยจริง)</label><textarea id="analysis" required placeholder="ข้อมูลสำคัญ → ปัญหา/ความเสี่ยง → สิ่งที่จะประเมิน/สื่อสาร"></textarea><div class="actions"><button id="toPost" class="primary">บันทึกและทำ Post-test</button></div>`;
 if(phase==="post")inner+=questionForm(c.post,"3 / 4 · Post-test");
 if(phase==="reflection")inner+=`<span class="step">4 / 4 · Reflection</span><div class="feedback">${esc(c.feedback)}</div><p>Pre-test: ${draft.preScore}/2 · Post-test: ${draft.postScore}/2</p><label for="reflection">สิ่งที่ฉันสังเกตเห็น เหตุผลที่เลือกปฏิบัติ และสิ่งที่จะปรับครั้งหน้า</label><textarea id="reflection" required placeholder="ฉันเรียนรู้อะไร และจะปรับการตัดสินใจอย่างไร"></textarea><div class="actions"><button id="finish" class="primary">จบกรณีและบันทึกผล</button></div>`;
 if(phase==="done")inner+=`<span class="step">เสร็จสิ้น</span><p>รหัสผู้เรียน: <strong>${esc(draft.code)}</strong></p><p>Pre-test ${draft.preScore}/2 → Post-test ${draft.postScore}/2</p><p class="muted">แจ้งรหัสนี้แก่อาจารย์เพื่อประเมิน rubric หากต้องการเชื่อมข้อมูลผลการเรียนในเครื่องนี้</p>`;
 app.innerHTML=inner+`</div>`;document.getElementById("back").onclick=()=>{selected=null;render()};
 if(phase==="pre"||phase==="post")document.getElementById("quiz").onsubmit=e=>{e.preventDefault();const form=new FormData(e.target),items=phase==="pre"?c.pre:c.post;const score=items.reduce((sum,q,i)=>sum+(Number(form.get("q"+i))===q.key?1:0),0);if(phase==="pre"){draft.preScore=score;phase="case"}else{draft.postScore=score;phase="reflection"}render()};
 if(phase==="case")document.getElementById("toPost").onclick=()=>{const value=document.getElementById("analysis").value.trim();if(!value){alert("กรุณาบันทึกการคิดวิเคราะห์ก่อน");return}draft.analysis=value;phase="post";render()};
 if(phase==="reflection")document.getElementById("finish").onclick=()=>{const value=document.getElementById("reflection").value.trim();if(!value){alert("กรุณาเขียน reflection ก่อน");return}draft.reflection=value;saveRecords([...readRecords(),draft]);phase="done";render()};
}
function renderAssess(){
 const records=readAssessRecords();
 app.innerHTML=`<div class="card"><h2>Rubric สำหรับอาจารย์</h2><p>นำเข้าไฟล์ผลการเรียนที่นักศึกษาส่งมา แล้วให้คะแนน 1–4 ในแต่ละด้าน</p><label>นำเข้าไฟล์ JSON ของนักศึกษา<input id="importFile" type="file" accept=".json,application/json"></label>${records.length?`<label for="record">เลือกผลการเรียน</label><select id="record"><option value="">— เลือก —</option>${records.map((r,i)=>`<option value="${i}">${esc(r.code)} · ${esc(cases.find(c=>c.id===r.caseId)?.title||r.caseId)}</option>`).join("")}</select><div id="rubricForm"></div>`:`<p class="muted">ยังไม่มีผลการเรียนที่นำเข้า</p>`}</div>`;
 document.getElementById("importFile").onchange=async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>1000000)throw Error("ไฟล์ใหญ่เกิน 1 MB");const data=JSON.parse(await file.text());if(!Array.isArray(data)||data.length>100||!data.every(r=>typeof r.code==="string"&&/^ICU-[A-F0-9]{10}$/.test(r.code)&&cases.some(c=>c.id===r.caseId)&&Number.isInteger(r.preScore)&&r.preScore>=0&&r.preScore<=2&&Number.isInteger(r.postScore)&&r.postScore>=0&&r.postScore<=2&&typeof r.analysis==="string"&&r.analysis.length<=5000&&typeof r.reflection==="string"&&r.reflection.length<=5000))throw Error("รูปแบบไฟล์ไม่ถูกต้อง");const byCode=new Map(readAssessRecords().map(r=>[r.code+":"+r.caseId,r]));data.forEach(r=>{const key=r.code+":"+r.caseId,prior=byCode.get(key);byCode.set(key,{code:r.code,caseId:r.caseId,preScore:r.preScore,postScore:r.postScore,analysis:r.analysis,reflection:r.reflection,rubric:prior?.rubric,feedback:prior?.feedback})});saveAssessRecords([...byCode.values()]);renderAssess()}catch(err){alert("นำเข้าไม่สำเร็จ: "+err.message)}};
 if(records.length)document.getElementById("record").onchange=e=>{const index=Number(e.target.value),box=document.getElementById("rubricForm");if(e.target.value===""){box.innerHTML="";return}const r=records[index];box.innerHTML=`<p><strong>การคิดวิเคราะห์</strong><br>${esc(r.analysis)}</p><p><strong>Reflection</strong><br>${esc(r.reflection)}</p><form id="grade"><p class="muted small">1 = ต้องพัฒนา · 2 = เริ่มทำได้ · 3 = ทำได้ตามเกณฑ์ · 4 = ทำได้ดีพร้อมให้เหตุผล</p>${rubric.map((name,i)=>`<label>${esc(name)}<select required name="r${i}"><option value="">— เลือกคะแนน —</option>${[1,2,3,4].map(n=>`<option value="${n}" ${r.rubric?.[i]===n?"selected":""}>${n}</option>`).join("")}</select></label>`).join("")}<label>Feedback<textarea name="feedback" placeholder="จุดแข็งและสิ่งที่ควรปรับ">${esc(r.feedback||"")}</textarea></label><button class="primary" type="submit">บันทึก rubric</button></form>`;document.getElementById("grade").onsubmit=event=>{event.preventDefault();const f=new FormData(event.target);records[index]={...r,rubric:rubric.map((_,i)=>Number(f.get("r"+i))),feedback:String(f.get("feedback")||"").trim()};saveAssessRecords(records);alert("บันทึก rubric แล้ว")}};
}
function csvCell(value){const s=String(value??"");return `"${s.replaceAll('"','""')}"`}
function downloadFile(content,mime,name){const url=URL.createObjectURL(new Blob([content],{type:mime}));const link=document.createElement("a");link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function exportCsv(records,name){const rows=[["code","case_id","pre_score_2","post_score_2",...rubric.map((_,i)=>`rubric_${i+1}_4`)],...records.map(r=>[r.code,r.caseId,r.preScore,r.postScore,...(r.rubric||Array(5).fill(""))])];downloadFile("\ufeff"+rows.map(row=>row.map(csvCell).join(",")).join("\r\n"),"text/csv;charset=utf-8",name)}
function renderExport(){
 const own=readRecords(), imported=session?.isAdmin?readAssessRecords():[];
 const counts=session?.isAdmin?`<p>ผลที่อาจารย์ทดลองเอง: <strong>${own.length}</strong> รายการ<br>ผลนักศึกษาที่นำเข้า: <strong>${imported.length}</strong> รายการ</p>`:`<p>ผลของฉันในเบราว์เซอร์นี้: <strong>${own.length}</strong> รายการ</p>`;
 app.innerHTML=`<div class="card"><h2>Export ข้อมูลไม่ระบุชื่อ</h2><p>ไฟล์ CSV มีเฉพาะรหัสสุ่ม กรณี คะแนน pre/post และ rubric รายด้าน ไม่มีชื่อหรือข้อความอิสระ</p>${counts}<div class="actions">${session?.isAdmin?`<button id="downloadStudents" class="primary" ${imported.length?"":"disabled"}>ดาวน์โหลด CSV ผลนักศึกษา</button><button id="downloadOwn" ${own.length?"":"disabled"}>ดาวน์โหลด CSV ผลทดลองของฉัน</button>`:`<button id="downloadOwn" class="primary" ${own.length?"":"disabled"}>ดาวน์โหลด CSV</button><button id="submission" ${own.length?"":"disabled"}>ดาวน์โหลดผลการเรียน JSON ส่งอาจารย์</button>`}</div><p class="muted small">ผลเก็บเฉพาะในเบราว์เซอร์นี้ นักศึกษาต้องส่งไฟล์ JSON ให้อาจารย์เพื่อนำเข้าและประเมิน rubric รหัสสุ่มอาจเชื่อมกลับไปยังผู้เรียนได้หากมีบัญชีจับคู่แยกต่างหาก</p></div>`;
 const studentsButton=document.getElementById("downloadStudents");if(studentsButton)studentsButton.onclick=()=>exportCsv(imported,"nursenote-icu-students.csv");
 document.getElementById("downloadOwn").onclick=()=>exportCsv(own,session?.isAdmin?"nursenote-icu-teacher-trial.csv":"nursenote-icu-results.csv");
 const submission=document.getElementById("submission");if(submission)submission.onclick=()=>downloadFile(JSON.stringify(own),"application/json","nursenote-icu-submission.json");
}
function render(){if(view==="home")renderHome();else if(view==="assess")renderAssess();else renderExport()}
if(session) render();
