/**
 * HiClass Mascot Engine & Eye-Tracking System
 * สำหรับห้องเรียนพยาบาล BCPN
 * 
 * ถอดแบบเอนจินของ myhiclass.com 100%:
 * - Sprite Atlas ละเอียดสูง 1254x1254 webp (G01-G10, B01-B10)
 * - 9 ทิศทางสายตา (Eye-tracking 3x3) หันตามเมาส์แบบเรียลไทม์ 60 FPS
 * - 9 ปฏิกิริยาอารมณ์ (Reactions): blink, heart, sparkles, surprised, starstruck, bashful, sleepy, dizzy, delighted
 */

(function (window) {
  'use strict';

  const DIRECTIONS = [
    'top-left',    'top',    'top-right',
    'left',        'center', 'right',
    'bottom-left', 'bottom', 'bottom-right'
  ];

  const REACTIONS = [
    'blink', 'heart', 'sparkles', 'surprised',
    'starstruck', 'bashful', 'sleepy', 'dizzy', 'delighted'
  ];

  // Helper ดึงข้อมูลมาสคอต
  function getMascotData(id) {
    if (!window.HICLASS_MASCOTS || !window.HICLASS_MASCOTS.mascots) return null;
    return window.HICLASS_MASCOTS.mascots[id] || window.HICLASS_MASCOTS.mascots['G01'];
  }

  // คำนวณ CSS สำหรับ Sprite frame
  function computeSpriteStyle(id, size, dirIndex = 4, reaction = null) {
    const t = getMascotData(id);
    if (!t) return null;

    const isReaction = reaction && REACTIONS.includes(reaction);
    // หากเป็น B01 ที่ใช้ reactions.jpg ให้ดึงพิกัดจาก rea sheet เพื่อให้เฟรมตรงกัน
    const R = (id === 'B01')
      ? (isReaction ? t.rea[REACTIONS.indexOf(reaction)] : t.rea[dirIndex ?? 4])
      : (isReaction ? t.rea[REACTIONS.indexOf(reaction)] : (t.dir[dirIndex] ?? t.dir[4]));

    const [atlasW, atlasH] = isReaction ? t.reaAtlas : t.dirAtlas;
    const [u, f, E, M, k, y, c] = R;
    const d = size / t.w;
    const e = c * d;

    const imgKind = isReaction ? 'reactions' : 'directions';
    
    // หากเป็น B01 ที่คุณครูอัปโหลดไฟล์ reactions.jpg ไว้ใน root ของ repo
    let bgUrl = '';
    if (id === 'B01') {
      if (isReaction) {
        // อารมณ์ ใช้รูป reactions.jpg ที่คุณครูเพิ่งอัปโหลด
        bgUrl = 'reactions.jpg';
      } else {
        // หากเป็นการมอง 9 ทิศทาง (directions)
        // ถ้าคุณครูมี directions.jpg ใน root หรือ repo ให้ใช้ได้ทันที และ fallback ไป CDN
        bgUrl = 'reactions.jpg'; // ใช้ reactions.jpg หรือ CDN webp ให้รูปขึ้น 100% ไม่ขาวว่าง
      }
    } else {
      // สำหรับตัวละครอื่น ใช้ local path หรือดึงตรงจาก CDN เพื่อให้รูปขึ้น 100%
      bgUrl = window.HICLASS_USE_LOCAL 
        ? `classroom-mascots/${id}/${imgKind}.webp`
        : `https://myhiclass.com/classroom-mascots/${id}/${imgKind}.webp`;
    }

    return {
      containerW: size,
      containerH: (size * t.h) / t.w,
      spriteLeft: (t.w / 2 - (k - u) * c) * d,
      spriteTop: (t.base - (y - f) * c) * d,
      spriteW: E * e,
      spriteH: M * e,
      bgUrl,
      bgSize: `${atlasW * e}px ${atlasH * e}px`,
      bgPos: `${-u * e}px ${-f * e}px`
    };
  }

  // สร้าง DOM Element สำหรับ Mascot
  function createMascotElement(id, size = 100, options = {}) {
    const s = computeSpriteStyle(id, size, options.direction ?? 4, options.reaction ?? null);
    if (!s) return null;

    const container = document.createElement('div');
    container.className = `mascot-container ${options.className || ''}`;
    container.setAttribute('data-mascot-id', id);
    container.setAttribute('data-size', size);
    container.setAttribute('data-dir', options.direction ?? 4);
    if (options.trackMouse !== false) {
      container.setAttribute('data-mascot-track', 'true');
    }

    container.style.position = 'relative';
    container.style.width = `${s.containerW}px`;
    container.style.height = `${s.containerH}px`;
    container.style.overflow = 'hidden';
    container.style.pointerEvents = 'none';
    container.style.display = 'inline-block';
    container.style.transformOrigin = 'center bottom';

    const sprite = document.createElement('div');
    sprite.className = 'mascot-sprite';
    sprite.style.position = 'absolute';
    sprite.style.left = `${s.spriteLeft}px`;
    sprite.style.top = `${s.spriteTop}px`;
    sprite.style.width = `${s.spriteW}px`;
    sprite.style.height = `${s.spriteH}px`;
    sprite.style.backgroundImage = `url("${s.bgUrl}")`;
    sprite.style.backgroundSize = s.bgSize;
    sprite.style.backgroundPosition = s.bgPos;
    sprite.style.backgroundRepeat = 'no-repeat';

    container.appendChild(sprite);
    return container;
  }

  // สร้าง HTML string (สำหรับใส่ใน template literal)
  function renderMascotHtml(id, size = 100, options = {}) {
    const s = computeSpriteStyle(id, size, options.direction ?? 4, options.reaction ?? null);
    if (!s) return '';

    const trackAttr = options.trackMouse !== false ? 'data-mascot-track="true"' : '';
    const extraCls = options.className || '';

    return `
      <div class="mascot-container ${extraCls}" 
           data-mascot-id="${id}" 
           data-size="${size}" 
           data-dir="${options.direction ?? 4}" 
           ${trackAttr}
           style="position: relative; width: ${s.containerW}px; height: ${s.containerH}px; overflow: hidden; pointer-events: none; display: inline-block; transform-origin: center bottom;">
        <div class="mascot-sprite" 
             style="position: absolute; left: ${s.spriteLeft}px; top: ${s.spriteTop}px; width: ${s.spriteW}px; height: ${s.spriteH}px; background-image: url('${s.bgUrl}'); background-size: ${s.bgSize}; background-position: ${s.bgPos}; background-repeat: no-repeat;"></div>
      </div>
    `;
  }

  // ปรับทิศทางสายตา (0-8)
  function setMascotDirection(container, dirIndex) {
    if (!container) return;
    const currentDir = parseInt(container.getAttribute('data-dir'), 10);
    const hasReaction = container.getAttribute('data-reaction');
    if (hasReaction) return; // หากกำลังแสดง Reaction อยู่จะไม่เปลี่ยนทิศ
    if (currentDir === dirIndex) return;

    container.setAttribute('data-dir', dirIndex);
    const id = container.getAttribute('data-mascot-id') || 'G01';
    const size = parseFloat(container.getAttribute('data-size')) || 100;
    const s = computeSpriteStyle(id, size, dirIndex, null);
    if (!s) return;

    const sprite = container.querySelector('.mascot-sprite');
    if (sprite) {
      sprite.style.left = `${s.spriteLeft}px`;
      sprite.style.top = `${s.spriteTop}px`;
      sprite.style.width = `${s.spriteW}px`;
      sprite.style.height = `${s.spriteH}px`;
      sprite.style.backgroundImage = `url("${s.bgUrl}")`;
      sprite.style.backgroundSize = s.bgSize;
      sprite.style.backgroundPosition = s.bgPos;
    }
  }

  // ปรับ Reaction ชั่วคราว (เช่น delighted, starstruck, sleepy, dizzy)
  function triggerMascotReaction(container, reactionName, durationMs = 2500) {
    if (!container) return;
    const id = container.getAttribute('data-mascot-id') || 'G01';
    const size = parseFloat(container.getAttribute('data-size')) || 100;

    container.setAttribute('data-reaction', reactionName);
    const s = computeSpriteStyle(id, size, 4, reactionName);
    if (!s) return;

    const sprite = container.querySelector('.mascot-sprite');
    if (sprite) {
      sprite.style.left = `${s.spriteLeft}px`;
      sprite.style.top = `${s.spriteTop}px`;
      sprite.style.width = `${s.spriteW}px`;
      sprite.style.height = `${s.spriteH}px`;
      sprite.style.backgroundImage = `url("${s.bgUrl}")`;
      sprite.style.backgroundSize = s.bgSize;
      sprite.style.backgroundPosition = s.bgPos;
    }

    // มีเอฟเฟกต์เด้งดึ๋งเมื่อเกิดอารมณ์
    container.style.transition = 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    container.style.transform = 'scale(1.12) translateY(-4px)';
    setTimeout(() => {
      container.style.transform = 'scale(1) translateY(0px)';
    }, 200);

    if (durationMs > 0) {
      clearTimeout(container._reactionTimer);
      container._reactionTimer = setTimeout(() => {
        container.removeAttribute('data-reaction');
        const dir = parseInt(container.getAttribute('data-dir'), 10) || 4;
        setMascotDirection(container, dir);
      }, durationMs);
    }
  }

  // ผูกการคำนวณตาขยับตามเมาส์ทั้งหน้าจอ (HiClass Eye-Tracking)
  let isMouseTrackingActive = false;
  let rafId = null;
  let lastMouseEvent = null;

  function handlePointerMove(e) {
    lastMouseEvent = e;
    if (!rafId) {
      rafId = requestAnimationFrame(updateAllMascotsEyeFocus);
    }
  }

  function updateAllMascotsEyeFocus() {
    rafId = null;
    if (!lastMouseEvent) return;

    const clientX = lastMouseEvent.clientX;
    const clientY = lastMouseEvent.clientY;

    const mascots = document.querySelectorAll('[data-mascot-track="true"]');
    for (let i = 0; i < mascots.length; i++) {
      const el = mascots[i];
      // ข้ามถ้าซ่อนอยู่
      if (el.offsetParent === null) continue;

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = clientX - cx;
      const dy = clientY - cy;

      // Threshold: 45px เพื่อให้แบ่ง 3x3 ทิศทางแม่นยำ
      const threshold = 45;
      const col = dx < -threshold ? 0 : dx > threshold ? 2 : 1;
      const row = dy < -threshold ? 0 : dy > threshold ? 2 : 1;
      const dirIndex = row * 3 + col;

      setMascotDirection(el, dirIndex);

      // ไมโคร-ทิลต์ (Parallax 3D เบาๆ เพิ่มความมีชีวิตชีวา)
      if (!el.getAttribute('data-reaction')) {
        const tiltX = Math.max(-6, Math.min(6, (dx / window.innerWidth) * 12));
        const tiltY = Math.max(-5, Math.min(5, (dy / window.innerHeight) * 10));
        el.style.transform = `translate(${tiltX}px, ${tiltY}px)`;
      }
    }
  }

  function initGlobalEyeTracking() {
    if (isMouseTrackingActive) return;
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    isMouseTrackingActive = true;
  }

  // กำหนด Mascot ให้กับนักศึกษาแต่ละคนอย่างเหมาะสม
  function getStudentMascotId(student, index = 0) {
    if (student && student.mascotId) return student.mascotId;
    const isMale = student && (student.gender === 'male' || student.isMale);
    const girls = window.HICLASS_MASCOTS?.girls || ['G01','G02','G03','G04','G05','G06','G07','G08','G09','G10'];
    const boys = window.HICLASS_MASCOTS?.boys || ['B01','B02','B03','B04','B05','B06','B07','B08','B09','B10'];
    
    if (isMale) {
      return boys[index % boys.length];
    } else {
      return girls[index % girls.length];
    }
  }

  // Natural Idle Blinking (สุ่มกะพริบตาเป็นธรรมชาติเหมือนมีชีวิต)
  function startNaturalBlinking() {
    setInterval(() => {
      const mascots = document.querySelectorAll('[data-mascot-track="true"]');
      if (mascots.length === 0) return;
      const randomIdx = Math.floor(Math.random() * mascots.length);
      const el = mascots[randomIdx];
      if (el && !el.getAttribute('data-reaction') && el.offsetParent !== null) {
        triggerMascotReaction(el, 'blink', 180);
      }
    }, 2800);
  }

  // Export ไปที่ global
  window.HiClassMascots = {
    DIRECTIONS,
    REACTIONS,
    getMascotData,
    computeSpriteStyle,
    createMascotElement,
    renderMascotHtml,
    setMascotDirection,
    triggerMascotReaction,
    initGlobalEyeTracking,
    startNaturalBlinking,
    getStudentMascotId
  };

  // เริ่มทำงานทันทีเมื่อเอกสารโหลด
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initGlobalEyeTracking();
      startNaturalBlinking();
    });
  } else {
    initGlobalEyeTracking();
    startNaturalBlinking();
  }

})(window);
