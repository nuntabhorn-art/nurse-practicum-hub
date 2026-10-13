// ตัวช่วยกลางสำหรับทุกหน้า: session จาก OTP + เรียก API พร้อม token
const API_URL = "https://script.google.com/macros/s/AKfycbxV-LwNHAA5FQSgGTghWyWppGdYo3bEiUoD6RdSYYMXOj24ZK2MO56_GXeO_zz_yd8/exec";
const SESSION_KEY = "nursenote_user_session";

function getSession() {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (s && s.token && s.email && s.email.toLowerCase().endsWith("@bcnchainat.ac.th")) return s;
  } catch (e) {}
  return null;
}

function goLogin() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "index.html?login=1";
}

// เรียกต้นหน้า: ถ้ายังไม่ล็อกอินให้เด้งไปหน้าแรกเพื่อยืนยัน OTP
function requireLogin() {
  const s = getSession();
  if (!s) { goLogin(); return null; }
  return s;
}

function handleAuthExpired(d) {
  if (d && d.authRequired) {
    localStorage.removeItem(SESSION_KEY);
    Swal.fire({ icon: 'warning', title: 'เซสชันหมดอายุ', text: 'กรุณาเข้าสู่ระบบด้วย OTP อีกครั้ง', allowOutsideClick: false })
      .then(() => goLogin());
    return true;
  }
  return false;
}

async function apiPost(action, data) {
  const s = getSession();
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ action: action, data: data || {}, token: s ? s.token : "" })
  });
  const d = await res.json();
  handleAuthExpired(d);
  return d;
}

async function apiGet(params) {
  const s = getSession();
  const q = new URLSearchParams(Object.assign({}, params, { token: s ? s.token : "" }));
  const res = await fetch(API_URL + "?" + q.toString());
  const d = await res.json();
  handleAuthExpired(d);
  return d;
}
