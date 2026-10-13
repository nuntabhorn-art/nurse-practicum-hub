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

async function syncSupabaseSession() {
  if (!window.NurseSupabase || !NurseSupabase.enabled) return getSession();
  try {
    const client = await NurseSupabase.init();
    if (!client) return getSession();
    const result = await client.auth.getSession();
    const session = result && result.data && result.data.session;
    if (!session || !session.user || !session.user.email) return getSession();

    const profileResult = await client
      .from('profiles')
      .select('full_name, role')
      .eq('id', session.user.id)
      .maybeSingle();
    const profile = profileResult && profileResult.data;
    const userData = {
      email: session.user.email.toLowerCase(),
      name: profile && profile.full_name ? profile.full_name : session.user.email.split('@')[0],
      isAdmin: Boolean(profile && (profile.role === 'admin' || profile.role === 'teacher')),
      role: profile && profile.role ? profile.role : 'student',
      userId: session.user.id,
      token: session.access_token,
      provider: 'supabase'
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    return userData;
  } catch (e) {
    return getSession();
  }
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
  // หาก API ส่ง authRequired กลับมา ให้ตรวจสอบว่ามี session อยู่หรือไม่
  // ไม่ลบ session ทันทีถ้าเป็นเพียงข้อผิดพลาดเครือข่ายหรือ token ชั่วคราว
  if (d && d.authRequired) {
    const s = getSession();
    // ถ้าผู้ใช้เคยล็อกอินยืนยันตัวตนแล้ว ไม่เตะออกทันที ให้ทำงานต่อในโหมดออฟไลน์/แคช
    if (s && s.email) {
      console.warn('API reported auth issue, continuing in cached session mode:', s.email);
      return false;
    }
    localStorage.removeItem(SESSION_KEY);
    Swal.fire({ icon: 'warning', title: 'เซสชันหมดอายุ', text: 'กรุณาเข้าสู่ระบบด้วย OTP อีกครั้ง', allowOutsideClick: false })
      .then(() => goLogin());
    return true;
  }
  return false;
}

async function fetchJson(url, options) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, Object.assign({}, options || {}, { signal: controller.signal }));
    const text = await res.text();
    let data;
    try { data = text ? JSON.parse(text) : {}; }
    catch (e) { throw new Error('เซิร์ฟเวอร์ตอบกลับข้อมูลไม่ถูกต้อง'); }
    if (!res.ok) throw new Error(data.message || `การเชื่อมต่อล้มเหลว (${res.status})`);
    return data;
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('การเชื่อมต่อใช้เวลานานเกินไป กรุณาลองใหม่');
    throw e;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function apiPost(action, data) {
  const s = getSession();
  const d = await fetchJson(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action: action, data: data || {}, token: s ? s.token : "" })
  });
  handleAuthExpired(d);
  return d;
}

async function signOutCurrentUser() {
  const current = getSession();
  try {
    if (current && current.provider === 'supabase' && window.NurseSupabase && NurseSupabase.enabled) {
      const client = await NurseSupabase.init();
      if (client) await client.auth.signOut();
    } else if (current) {
      await apiPost('logout', {});
    }
  } finally {
    localStorage.removeItem(SESSION_KEY);
  }
}

async function supabaseGetDashboard(studentCode, viewMode) {
  if (!window.NurseSupabase || !NurseSupabase.enabled) return null;
  const current = getSession();
  if (!current || current.provider !== 'supabase') return null;

  try {
    const client = await NurseSupabase.init();
    const profileQuery = await client
      .from('profiles')
      .select('id, email, full_name, role, student_code, cohort')
      .eq('id', current.userId)
      .maybeSingle();
    if (profileQuery.error || !profileQuery.data) return null;

    const profile = profileQuery.data;
    const isStaff = profile.role === 'teacher' || profile.role === 'admin';
    const all = viewMode === 'all' && isStaff;
    const studentFilter = all ? null : profile.id;
    const workQuery = client.from('daily_works')
      .select('id, student_id, title, description, file_url, status, submitted_at, profiles:student_id(full_name,student_code)')
      .order('submitted_at', { ascending: false }).limit(100);
    const attendanceQuery = client.from('attendance')
      .select('id, student_id, status, checkin_at, profiles:student_id(full_name,student_code)')
      .order('checkin_at', { ascending: false }).limit(100);
    const evaluationQuery = client.from('skill_evaluations')
      .select('id, student_id, result, experience_note, evaluated_at, skills:skill_id(name)')
      .order('evaluated_at', { ascending: false }).limit(100);
    if (studentFilter) {
      workQuery.eq('student_id', studentFilter);
      attendanceQuery.eq('student_id', studentFilter);
      evaluationQuery.eq('student_id', studentFilter);
    }

    const [worksResult, attendanceResult, evaluationResult, petResult] = await Promise.all([
      workQuery,
      attendanceQuery,
      evaluationQuery,
      client.from('pet_progress').select('exp, coins, level').eq('student_id', profile.id).maybeSingle()
    ]);
    if (worksResult.error || attendanceResult.error || evaluationResult.error) return null;

    const studentId = profile.student_code || studentCode || profile.id;
    const pet = petResult.data || {};
    const name = profile.full_name || profile.email.split('@')[0];
    const mapProfile = row => row.profiles || {};
    const workStatus = { submitted: 'รอตรวจ', reviewing: 'กำลังตรวจ', passed: 'ผ่าน', needs_revision: 'ต้องแก้ไข' };
    const attendanceStatus = { on_time: 'ตรงเวลา', late: 'สาย', late_submission: 'ส่งงานช้า', sick: 'ป่วย', personal_leave: 'ลา', absent: 'ขาด' };
    const works = (worksResult.data || []).map(w => ({
      workId: w.id,
      studentId: mapProfile(w).student_code || w.student_id,
      studentName: mapProfile(w).full_name || name,
      submitDate: w.submitted_at,
      subject: w.title,
      content: w.description || '',
      fileUrl: w.file_url || '',
      status: workStatus[w.status] || w.status,
      score: '',
      feedback: ''
    }));
    const attendances = (attendanceResult.data || []).map(a => ({
      logId: a.id,
      date: String(a.checkin_at || '').slice(0, 10),
      time: String(a.checkin_at || '').slice(11, 16),
      studentId: mapProfile(a).student_code || a.student_id,
      studentName: mapProfile(a).full_name || name,
      status: attendanceStatus[a.status] || a.status,
      deduct: 0,
      bonus: 0,
      note: ''
    }));
    const compList = (evaluationResult.data || []).map(e => ({
      date: String(e.evaluated_at || '').slice(0, 10),
      studentId: mapProfile(e).student_code || e.student_id,
      skillName: e.skills && e.skills.name ? e.skills.name : '-',
      result: e.result,
      exp: 0
    }));
    const hasSupabaseData = works.length || attendances.length || compList.length;
    if (!hasSupabaseData) return null;

    return {
      studentInfo: { studentId, name, group: profile.cohort || '-', ward: '-', coins: pet.coins || 0, exp: pet.exp || 0, level: pet.level || 1, heroScore: 0, punctualityScore: 100 },
      students: [{ studentId, name, group: profile.cohort || '-', ward: '-', level: pet.level || 1, exp: pet.exp || 0, coins: pet.coins || 0, heroScore: 0 }],
      attendances,
      compList,
      works,
      allWorks: all ? works : [],
      teams: []
    };
  } catch (e) {
    return null;
  }
}

async function apiGet(params) {
  const s = getSession();
  const q = new URLSearchParams(Object.assign({}, params, { token: s ? s.token : "" }));
  const d = await fetchJson(API_URL + "?" + q.toString());
  handleAuthExpired(d);
  return d;
}

// Helper: ตรวจงาน Care Plan
async function apiGradeWork(workId, studentId, status, score, feedback) {
  return await apiPost('gradeWork', { workId, studentId, status, score, feedback });
}

// Helper: ประเมินหัตถการ
async function apiEvaluateSkill(studentId, skillName, result, exp) {
  return await apiPost('evaluateSkill', { studentId, skillName, result, exp });
}

// Helper: ให้คะแนนความดีคนไข้ Hero Score
async function apiAwardHeroScore(studentId, points) {
  return await apiPost('awardHeroScore', { studentId, points });
}

// Helper: บันทึกข้อมูลการจัดกลุ่ม
async function apiSaveTeamGrouping(groupName, teams) {
  return await apiPost('saveTeamGrouping', { groupName, teams });
}

// Helper: สแกนใบหน้าเข้าเวรพร้อมส่งภาพ Base64
async function apiRecordFaceAttendance(imageBase64, coords, name) {
  return await apiPost('recordFaceAttendance', { imageBase64, coords, name });
}
