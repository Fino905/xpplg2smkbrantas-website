/**
 * XI RPL 2 — Official Class Website
 * script.js — Main JavaScript (REVISI)
 * Tambahan:
 *  - Group export PNG & PDF (html2canvas + jsPDF)
 *  - Mode per-anggota (berdasarkan jumlah anggota/kelompok)
 *  - Max 18 kelompok
 *  - Mobile responsive improvements
 *  - Loading screen
 * ============================================================
 */

/* ============================================================
   LOADING SCREEN MODULE
   ============================================================ */
const LoadingScreen = (() => {
  const STEPS = [
    { pct: 15, msg: "Memuat aset halaman..." },
    { pct: 35, msg: "Menyiapkan data siswa..." },
    { pct: 55, msg: "Membangun galeri..." },
    { pct: 72, msg: "Menginisialisasi komponen..." },
    { pct: 88, msg: "Hampir selesai..." },
    { pct: 100, msg: "Selamat datang di XI RPL 2! 🎉" },
  ];

  let stepIndex = 0;
  let stepTimer = null;

  function setProgress(pct, msg) {
    const bar = document.getElementById('lsBar');
    const status = document.getElementById('lsStatus');
    if (bar) bar.style.width = pct + '%';
    if (status) { status.style.opacity = '0'; setTimeout(() => { status.textContent = msg; status.style.opacity = '1'; }, 120); }
  }

  function runParticles() {
    const canvas = document.getElementById('loadingParticles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let raf;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function spawn() {
      particles = [];
      const n = Math.floor(canvas.width / 22);
      for (let i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.4 + 0.4,
          speed: Math.random() * 0.35 + 0.08,
          opacity: Math.random() * 0.45 + 0.05,
          drift: (Math.random() - 0.5) * 0.25,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(86,180,255,${p.opacity})`;
        ctx.fill();
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
        if (p.x < -4) p.x = canvas.width + 4;
        if (p.x > canvas.width + 4) p.x = -4;
      });
      raf = requestAnimationFrame(draw);
    }

    resize();
    spawn();
    draw();
    window.addEventListener('resize', () => { cancelAnimationFrame(raf); resize(); spawn(); draw(); });
  }

  function advanceStep() {
    if (stepIndex >= STEPS.length) return;
    const s = STEPS[stepIndex++];
    setProgress(s.pct, s.msg);
  }

  function hide() {
    const el = document.getElementById('loadingScreen');
    if (!el) return;
    setProgress(100, STEPS[STEPS.length - 1].msg);
    setTimeout(() => {
      el.classList.add('hide');
      setTimeout(() => el.remove(), 650);
    }, 500);
  }

  function init() {
    runParticles();
    advanceStep();

    /* Simulate incremental loading ticks */
    const intervals = [300, 280, 320, 260, 350];
    let i = 0;
    function tick() {
      if (i < intervals.length) {
        stepTimer = setTimeout(() => { advanceStep(); i++; tick(); }, intervals[i]);
      }
    }
    tick();

    /* Hide after page fully loaded (fonts, images, scripts) */
    const dismiss = () => {
      if (stepTimer) clearTimeout(stepTimer);
      /* Jump to 100% then fade */
      stepIndex = STEPS.length - 1;
      hide();
    };

    if (document.readyState === 'complete') {
      setTimeout(dismiss, 800);
    } else {
      window.addEventListener('load', () => setTimeout(dismiss, 600), { once: true });
      /* Safety fallback — never freeze longer than 4s */
      setTimeout(dismiss, 4000);
    }
  }

  return { init };
})();

/* Start loading screen immediately — before DOM ready */
LoadingScreen.init();

/* ============================================================
   DATA
   ============================================================ */

const HOMEROOM_DATA = {
  name: "Lolita Bestari Dyahayu Oktaviana, S.Kom",
  title: "Wali Kelas XI RPL 2",
  subject: " - ",
  desc: "Sosok pembimbing yang penuh dedikasi dan semangat dalam mengarahkan generasi penerus teknologi. Selalu mendukung kreativitas dan inovasi setiap siswa di kelas XI RPL 2.",
  img: "image/Walikelas11.jpg",
  initials: "WK",
  stats: [
    { val: "36", lbl: "Siswa" },
    { val: "2025", lbl: "Angkatan" },
    { val: "RPL", lbl: "Jurusan" },
  ]
};

const GALLERY_DATA = [
  { id: 1, title: "Cewe Kelas XI RPL 2", category: "foto", img: "image/Gallery/cewe.jpg", tags: ["Angkatan 2025"] },
  { id: 5, title: "Foto Kelas", category: "foto", img: "image/Gallery/formal.jpg", tags: ["Angkatan 2025"] },
  { id: 2, title: "Cowo Kelas XI RPL 2", category: "foto", img: "image/Gallery/cowo1.jpg", tags: ["Angkatan 2025"] },
  { id: 4, title: "Miniatur Pengolahan Bahan Bersama Bu Vinda", category: "kegiatan", img: "image/Gallery/minimap.jpg", tags: ["Sumatif 3"] },
  { id: 6, title: "Hari Pahlawan", category: "event", img: "image/Gallery/IMG-20251028-WA0069.jpg", tags: ["Lapangan"] },
  { id: 8, title: "Ngerujak", category: "kegiatan", img: "image/Gallery/IMG-20251025-WA0063.jpg", tags: ["Rutin"] },
  { id: 12, title: "Peringatan Hari Guru", category: "event", img: "image/Gallery/motion_photo_6586712432520767369.jpg", tags: ["Hari Spesial"] },
  { id: 13, title: "Mukbang MBG By Huda Gizi Nasional", category: "kegiatan", img: "image/Gallery/Mukbang.jpg", tags: ["UKK"] },
  { id: 14, title: "Pondok Ramadhan", category: "event", img: "image/bg.jpg", tags: ["Hari Spesial"] },
  { id: 16, title: "Game Jam Internal", category: "kegiatan", img: "image/Gallery/IMG-20251218-WA0010.jpg", tags: ["PPLG"] },
];

const STUDENTS_DATA = [
  { no: 1, name: "Afa El Yuma Pratama", role: "Siswa", initials: "AE", img: "image/Siswa/1. AFA EL YUMA PRATAMA_.jpg" },
  { no: 2, name: "Ahmad Subhan Zaki", role: "Siswa", initials: "AS", img: "image/Siswa/2. AHMAD SUBHAN ZAKI.jpg" },
  { no: 3, name: "Alina Danastri Anindya", role: "Siswa", initials: "AD", img: "image/Siswa/3. ALINA DANASTRI ANINDYA.jpg" },
  { no: 4, name: "Amelia Putri Roshida", role: "Siswa", initials: "AP", img: "image/Siswa/4. AMELIA PUTRI ROSHIDA.jpg" },
  { no: 5, name: "Anandita Galuh Sekar Kinanti", role: "Siswa", initials: "AG", img: "image/Siswa/5. ANANDITA GALUH SEKAR KINANTI.jpg" },
  { no: 6, name: "Ardhelia Zheva Tentieagusty", role: "Siswa", initials: "AZ", img: "image/Siswa/6. ARDHELIA ZHEVA TENIEAGUSTY.jpg" },
  { no: 7, name: "Arkana Esa Dewa", role: "Siswa", initials: "AE", img: "image/Siswa/7. ARKANA ESA DEWA.jpg" },
  { no: 8, name: "Arlan Girindrawardana Putra", role: "Siswa", initials: "AG", img: "image/Siswa/8. ARLAN GIRINDRAWARDANA PUTRA.jpg" },
  { no: 9, name: "Aura Bunga Savania", role: "Siswa", initials: "AB", img: "image/Siswa/9. AURA BUNGA SAVANIA.jpg" },
  { no: 10, name: "Azizatul Kunainah Nurfiani", role: "Siswa", initials: "AK", img: "image/Siswa/10. AZIZATUL KUNAINAH NURFIANI.jpg" },
  { no: 11, name: "Choerul Nuril Huda", role: "Siswa", initials: "CN", img: "image/Siswa/11. CHOERUL NURIL HUDA.jpg" },
  { no: 12, name: "Desi Eka Wati", role: "Siswa", initials: "DE", img: "image/Siswa/12. DESI EKA WATI.jpg" },
  { no: 13, name: "Fadhil Akbar Hermansyah", role: "Siswa", initials: "FA", img: "image/Siswa/14. FADHIL AKBAR HERMANSYAH.jpg" },
  { no: 14, name: "Febian Nikko Ferdi Ansyah", role: "Siswa", initials: "FN", img: "image/Siswa/15. FEBIAN NIKKO FERDI ANSYAH.jpg" },
  { no: 15, name: "Fhirly Adysta Putri", role: "Siswa", initials: "FA", img: "image/Siswa/16. FHIRLY ADYSTA PUTRI.jpg" },
  { no: 16, name: "Grendy Arvel Putra Agusti", role: "Siswa", initials: "GA", img: "image/Siswa/17. GRENDY ARVEL PUTRA AGUSTI.jpg" },
  { no: 17, name: "Habib Alfino Febrianto", role: "Siswa", initials: "HA", img: "image/Siswa/18. HABIB ALFINO FEBRIANTO.jpg" },
  { no: 18, name: "Hanna Belinda", role: "Siswa", initials: "HB", img: "image/Siswa/19. HANNA BELINDA.jpg" },
  { no: 19, name: "Indi Agri Faresa", role: "Siswa", initials: "IA", img: "image/Siswa/20. INDI AGRI FARESA.jpg" },
  { no: 20, name: "Jenny Beby Cantika", role: "Siswa", initials: "JB", img: "image/Siswa/21. JENNY BEBY CANTIKA.jpg" },
  { no: 21, name: "Kanzha Ariesna Rahmadhany", role: "Siswa", initials: "KA", img: "image/Siswa/22. KANZHA ARIESNA RAHMADHANY.jpg" },
  { no: 22, name: "Kesya Dwi Oktaviola", role: "Siswa", initials: "KD", img: "image/Siswa/23. KESYA DWI OKTAVIOLA.jpg" },
  { no: 23, name: "Lukluul Diniyah Fitra", role: "Siswa", initials: "LD", img: "image/Siswa/24. LUKLUUL DINIYAH FITRA.jpg" },
  { no: 24, name: "Maura Natania", role: "Siswa", initials: "MN", img: "image/Siswa/25. MAURA NATANIA.jpg" },
  { no: 25, name: "Melda Okta Maulana", role: "Siswa", initials: "MO", img: "image/Siswa/26. MELDA OKTA MAULANA.jpg" },
  { no: 26, name: "Muhammad Mubarok", role: "Siswa", initials: "MM", img: "image/Siswa/27. MUHAMMAD MUBAROK.jpg" },
  { no: 27, name: "Nazna Deandra Alifiah Putri", role: "Siswa", initials: "ND", img: "image/Siswa/28. NAZNA DEANDRA ALIFIAH PUTRI.jpg" },
  { no: 28, name: "Nindi Faulina Defita Rani", role: "Siswa", initials: "NF", img: "image/Siswa/29. NINDI FAULINA DEFITA RANI.jpg" },
  { no: 29, name: "Nur Widhia Sallamah", role: "Siswa", initials: "NW", img: "image/Siswa/30. NUR WIDHIA SALLAMAH.jpg" },
  { no: 30, name: "Olivia Eka Pratiwi", role: "Siswa", initials: "OE", img: "image/Siswa/31. OLIVIA EKA PRATIWI.jpg" },
  { no: 31, name: "Raihaan Adian Tamaamil", role: "Siswa", initials: "RA", img: "image/Siswa/32. RAIHAN ADIAN TAMAAMIL.jpg" },
  { no: 32, name: "Rika Aulia Sari", role: "Siswa", initials: "RS", img: "image/Siswa/33. RIKA AULIA SARI.jpg" },
  { no: 33, name: "Shindy Aura Cantika", role: "Siswa", initials: "SA", img: "image/Siswa/34. SHINDY AURA CANTIKA.jpg" },
  { no: 34, name: "Talitha Zaki Al Alub", role: "Siswa", initials: "TZ", img: "image/Siswa/35. TALITHA ZAKI AL ALUB.jpg" },
  { no: 35, name: "Wibian Junanta", role: "Siswa", initials: "WJ", img: "image/Siswa/36. WIBIAN JUNANTA.jpg" },
  { no: 36, name: "Yunita Salsabila", role: "Siswa", initials: "YS", img: "image/Siswa/37. YUNITA SALSABILA.jpg" },
];

/* Color palette for groups — 18 warna */
const GROUP_COLORS = [
  { bg: "#1a6fff", text: "#fff", glow: "rgba(26,111,255,0.25)" },
  { bg: "#ff6ab0", text: "#fff", glow: "rgba(255,106,176,0.25)" },
  { bg: "#22e87a", text: "#0a0a0f", glow: "rgba(34,232,122,0.25)" },
  { bg: "#ffd06a", text: "#0a0a0f", glow: "rgba(255,208,106,0.25)" },
  { bg: "#ff8c6a", text: "#fff", glow: "rgba(255,140,106,0.25)" },
  { bg: "#6aaeff", text: "#0a0a0f", glow: "rgba(106,174,255,0.25)" },
  { bg: "#d06aff", text: "#fff", glow: "rgba(208,106,255,0.25)" },
  { bg: "#6aff8c", text: "#0a0a0f", glow: "rgba(106,255,140,0.25)" },
  { bg: "#ff4d4d", text: "#fff", glow: "rgba(255,77,77,0.25)" },
  { bg: "#4dffee", text: "#0a0a0f", glow: "rgba(77,255,238,0.25)" },
  { bg: "#c8ff4d", text: "#0a0a0f", glow: "rgba(200,255,77,0.25)" },
  { bg: "#ff4da6", text: "#fff", glow: "rgba(255,77,166,0.25)" },
  { bg: "#4d8aff", text: "#fff", glow: "rgba(77,138,255,0.25)" },
  { bg: "#ff9f4d", text: "#0a0a0f", glow: "rgba(255,159,77,0.25)" },
  { bg: "#4dffb8", text: "#0a0a0f", glow: "rgba(77,255,184,0.25)" },
  { bg: "#9b4dff", text: "#fff", glow: "rgba(155,77,255,0.25)" },
  { bg: "#ff4d6a", text: "#fff", glow: "rgba(255,77,106,0.25)" },
  { bg: "#4dd9ff", text: "#0a0a0f", glow: "rgba(77,217,255,0.25)" },
];

/* ============================================================
   UTILITY
   ============================================================ */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generatePlaceholderSrc(id, title) {
  const hue = (id * 47 + 180) % 360;
  const hue2 = (hue + 60) % 360;
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   style="stop-color:hsl(${hue},60%,20%)"/>
          <stop offset="100%" style="stop-color:hsl(${hue2},60%,12%)"/>
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#g)"/>
      <text x="50%" y="46%" text-anchor="middle" fill="rgba(255,255,255,0.15)"
            font-family="sans-serif" font-size="64" font-weight="900">X2</text>
      <text x="50%" y="65%" text-anchor="middle" fill="rgba(255,255,255,0.5)"
            font-family="sans-serif" font-size="14">${title}</text>
    </svg>
  `.trim();
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
}

function showToast(msg, icon = 'fa-check-circle') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> ${msg}`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 2400);
  });
}

/* ============================================================
   EXPORT LOADING OVERLAY
   ============================================================ */
function createExportLoadingEl() {
  let el = document.getElementById('exportLoadingOverlay');
  if (el) return el;
  el = document.createElement('div');
  el.id = 'exportLoadingOverlay';
  el.className = 'export-loading';
  el.innerHTML = `
    <div class="export-loading-spinner"></div>
    <p id="exportLoadingMsg">Menyiapkan ekspor...</p>
  `;
  document.body.appendChild(el);
  return el;
}

function showExportLoading(msg = 'Menyiapkan ekspor...') {
  const el = createExportLoadingEl();
  document.getElementById('exportLoadingMsg').textContent = msg;
  el.classList.add('show');
}

function hideExportLoading() {
  const el = document.getElementById('exportLoadingOverlay');
  if (el) el.classList.remove('show');
}

/* ============================================================
   THEME MODULE
   ============================================================ */
const Theme = (() => {
  const STORAGE_KEY = 'xpplg2-theme';

  function getPreferred() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    apply(current === 'dark' ? 'light' : 'dark');
  }

  function init() {
    apply(getPreferred());
    const btn = document.getElementById('themeToggle');
    if (btn) btn.addEventListener('click', toggle);
  }

  return { init };
})();

/* ============================================================
   PARALLAX MODULE
   ============================================================ */
const Parallax = (() => {
  let ticking = false;

  function createParticles() {
    const container = document.getElementById('parallaxParticles');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resize() {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    }

    function spawnParticles() {
      particles = [];
      const count = Math.floor(canvas.width / 18);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.4,
          speed: Math.random() * 0.4 + 0.1,
          opacity: Math.random() * 0.5 + 0.1,
          drift: (Math.random() - 0.5) * 0.3,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,106,255,${p.opacity})`;
        ctx.fill();
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
        if (p.x < -5) p.x = canvas.width + 5;
        if (p.x > canvas.width + 5) p.x = -5;
      });
      animFrame = requestAnimationFrame(draw);
    }

    resize();
    spawnParticles();
    draw();

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animFrame);
      resize();
      spawnParticles();
      draw();
    });
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      document.querySelectorAll('.parallax-layer[data-speed]').forEach(layer => {
        const speed = parseFloat(layer.dataset.speed) || 0;
        layer.style.transform = `translateY(${scrollY * speed}px)`;
      });
      ticking = false;
    });
  }

  function init() {
    createParticles();
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  return { init };
})();

/* ============================================================
   GALLERY MODULE
   ============================================================ */
const Gallery = (() => {
  const ITEMS_PER_PAGE = 8;
  let currentPage = 1;
  let currentFilter = 'all';
  let lightboxIndex = 0;
  let filteredItems = [];

  const getGrid = () => document.getElementById('galleryGrid');
  const getPagination = () => document.getElementById('galleryPagination');
  const getLightbox = () => document.getElementById('lightbox');
  const getLbImg = () => document.getElementById('lightboxImg');
  const getLbCaption = () => document.getElementById('lightboxCaption');

  function getFilteredItems() {
    return currentFilter === 'all'
      ? GALLERY_DATA
      : GALLERY_DATA.filter(item => item.category === currentFilter);
  }

  function renderGallery() {
    const grid = getGrid();
    filteredItems = getFilteredItems();
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const slice = filteredItems.slice(start, start + ITEMS_PER_PAGE);

    if (slice.length === 0) {
      grid.innerHTML = `<div class="empty-state"><i class="fa-solid fa-images"></i>Tidak ada foto di kategori ini.</div>`;
      getPagination().innerHTML = '';
      return;
    }

    grid.innerHTML = slice.map((item, idx) => {
      const src = item.img || generatePlaceholderSrc(item.id, item.title);
      const globalIndex = GALLERY_DATA.indexOf(item);
      return `
        <div class="gallery-item"
             style="animation-delay:${idx * 0.06}s"
             data-index="${globalIndex}"
             role="button"
             tabindex="0"
             aria-label="Lihat foto: ${item.title}">
          <img src="${src}" alt="${item.title}" loading="lazy" />
          <div class="gallery-overlay">
            <span class="gallery-overlay-tag">${item.category}</span>
            <span class="gallery-overlay-title">${item.title}</span>
          </div>
          <div class="gallery-zoom-icon"><i class="fa-solid fa-magnifying-glass-plus"></i></div>
        </div>`;
    }).join('');

    renderPagination();

    grid.querySelectorAll('.gallery-item').forEach(el => {
      el.addEventListener('click', () => openLightbox(+el.dataset.index));
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') openLightbox(+el.dataset.index);
      });
    });
  }

  function renderPagination() {
    const pg = getPagination();
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    if (totalPages <= 1) { pg.innerHTML = ''; return; }
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="page-btn${i === currentPage ? ' active' : ''}" data-page="${i}">${i}</button>`;
    }
    pg.innerHTML = html;
    pg.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentPage = +btn.dataset.page;
        renderGallery();
        document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function openLightbox(index) {
    lightboxIndex = index;
    updateLightboxContent();
    getLightbox().classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    getLightbox().classList.remove('open');
    document.body.style.overflow = '';
  }
  function updateLightboxContent() {
    const item = GALLERY_DATA[lightboxIndex];
    if (!item) return;
    getLbImg().src = item.img || generatePlaceholderSrc(item.id, item.title);
    getLbImg().alt = item.title;
    getLbCaption().textContent = `${item.title} — ${item.category}`;
  }
  function prevLightbox() {
    lightboxIndex = (lightboxIndex - 1 + GALLERY_DATA.length) % GALLERY_DATA.length;
    updateLightboxContent();
  }
  function nextLightbox() {
    lightboxIndex = (lightboxIndex + 1) % GALLERY_DATA.length;
    updateLightboxContent();
  }

  function init() {
    renderGallery();
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        currentPage = 1;
        renderGallery();
      });
    });
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxPrev').addEventListener('click', prevLightbox);
    document.getElementById('lightboxNext').addEventListener('click', nextLightbox);
    getLightbox().addEventListener('click', e => { if (e.target === getLightbox()) closeLightbox(); });
    document.addEventListener('keydown', e => {
      if (!getLightbox().classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
    });
  }

  return { init };
})();

/* ============================================================
   HOMEROOM TEACHER MODULE
   ============================================================ */
const HomeroomTeacher = (() => {
  function init() {
    const card = document.getElementById('homeroomCard');
    if (!card) return;
    const d = HOMEROOM_DATA;
    const photoHTML = d.img
      ? `<img src="${d.img}" alt="Foto ${d.name}" loading="lazy"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
         <div class="homeroom-photo-placeholder" style="display:none">${d.initials}</div>`
      : `<div class="homeroom-photo-placeholder">${d.initials}</div>`;
    const statsHTML = d.stats.map(s => `
      <div class="homeroom-stat">
        <span class="homeroom-stat-val">${s.val}</span>
        <span class="homeroom-stat-lbl">${s.lbl}</span>
      </div>
    `).join('');
    card.innerHTML = `
      <div class="homeroom-photo-col">${photoHTML}</div>
      <div class="homeroom-body">
        <div class="homeroom-badge">
          <i class="fa-solid fa-chalkboard-teacher"></i> Wali Kelas
        </div>
        <h3 class="homeroom-name">${d.name}</h3>
        <p class="homeroom-title">${d.title} · ${d.subject}</p>
        <div class="homeroom-divider"></div>
        <p class="homeroom-desc">${d.desc}</p>
        <div class="homeroom-stats">${statsHTML}</div>
      </div>
    `;
  }
  return { init };
})();

/* ============================================================
   STUDENTS MODULE
   ============================================================ */
const Students = (() => {
  const PER_PAGE = 12;
  let currentPage = 1;
  let searchQuery = '';

  const getGrid = () => document.getElementById('studentsGrid');
  const getPagination = () => document.getElementById('studentsPagination');

  function getFiltered() {
    if (!searchQuery) return STUDENTS_DATA;
    const q = searchQuery.toLowerCase();
    return STUDENTS_DATA.filter(s => s.name.toLowerCase().includes(q));
  }

  function renderStudents() {
    const grid = getGrid();
    const filtered = getFiltered();
    const start = (currentPage - 1) * PER_PAGE;
    const slice = filtered.slice(start, start + PER_PAGE);

    if (slice.length === 0) {
      grid.innerHTML = `<div class="empty-state"><i class="fa-solid fa-user-slash"></i>Siswa tidak ditemukan.</div>`;
      getPagination().innerHTML = '';
      return;
    }

    grid.innerHTML = slice.map((s, idx) => `
      <article class="student-card reveal"
               style="animation-delay:${idx * 0.04}s"
               data-student-no="${s.no}"
               tabindex="0"
               role="button"
               aria-label="Lihat foto ${s.name}">
        <div class="student-photo">
          ${s.img
        ? `<img src="${s.img}" alt="Foto ${s.name}" loading="lazy"
                   onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
               <div class="student-photo-placeholder" style="display:none">${s.initials}</div>`
        : `<div class="student-photo-placeholder">${s.initials}</div>`
      }
        </div>
        <span class="student-number">#${String(s.no).padStart(2, '0')}</span>
        <h3 class="student-name">${s.name}</h3>
        <span class="student-role">${s.role}</span>
        <span class="click-hint"><i class="fa-solid fa-eye"></i></span>
      </article>
    `).join('');

    renderPagination(filtered.length);

    grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    grid.querySelectorAll('.student-card').forEach(card => {
      card.addEventListener('click', () => window.openPortfolioModal(+card.dataset.studentNo));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') window.openPortfolioModal(+card.dataset.studentNo);
      });
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%';
        const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%';
        card.style.setProperty('--card-glow-x', x);
        card.style.setProperty('--card-glow-y', y);
      });
    });
  }

  function renderPagination(total) {
    const pg = getPagination();
    const totalPages = Math.ceil(total / PER_PAGE);
    if (totalPages <= 1) { pg.innerHTML = ''; return; }
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="page-btn${i === currentPage ? ' active' : ''}" data-page="${i}">${i}</button>`;
    }
    pg.innerHTML = html;
    pg.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentPage = +btn.dataset.page;
        renderStudents();
        document.getElementById('students').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function init() {
    renderStudents();
    const input = document.getElementById('studentSearch');
    let debounceTimer;
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchQuery = input.value.trim();
        currentPage = 1;
        renderStudents();
      }, 280);
    });
  }

  return { init };
})();

/* ============================================================
   STUDENT PHOTO MODAL MODULE
   ============================================================ */
(function wireStudentModal() {
  function open(no) {
    const modal = document.getElementById('studentModal');
    const img = document.getElementById('studentModalImg');
    const ph = document.getElementById('studentModalPlaceholder');
    const numEl = document.getElementById('studentModalNumber');
    const nameEl = document.getElementById('studentModalName');
    const roleEl = document.getElementById('studentModalRole');

    const student = STUDENTS_DATA.find(s => s.no === no);
    if (!student) return;

    if (student.img) {
      img.src = student.img;
      img.alt = `Foto ${student.name}`;
      img.style.display = 'block';
      ph.style.display = 'none';
      img.onerror = () => {
        img.style.display = 'none';
        ph.textContent = student.initials;
        ph.style.display = 'flex';
      };
    } else {
      img.style.display = 'none';
      ph.textContent = student.initials;
      ph.style.display = 'flex';
    }

    numEl.textContent = `#${String(student.no).padStart(2, '0')}`;
    nameEl.textContent = student.name;
    roleEl.textContent = student.role;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    document.getElementById('studentModal').classList.remove('open');
    document.body.style.overflow = '';
  }

  window.openStudentModal = open;

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('studentModalClose').addEventListener('click', close);
    document.getElementById('studentModalBackdrop').addEventListener('click', close);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && document.getElementById('studentModal').classList.contains('open')) close();
    });
  });
})();

/* ============================================================
   STUDENT PORTFOLIO MODAL MODULE
   ============================================================ */

/* Extended portfolio data — bisa dilengkapi sesuai data asli */
const PORTFOLIO_DATA = {
  /* Default template; di-override per-siswa jika ada data khusus */
  default: {
    hobbies: "—",
    favoriteSubject: "—",
    aspiration: "—",
    about: "Siswa aktif kelas XI RPL 2, SMK Brantas Karangkates.",
    skills: ["HTML/CSS", "JavaScript", "Problem Solving", "Teamwork"],
    achievements: []
  },
  /* Contoh data khusus — silakan lengkapi sesuai data siswa */
  1: { hobbies: "Gaming, Coding", favoriteSubject: "Pemrograman", aspiration: "Software Engineer", about: "Semangat belajar teknologi dan senang berkolaborasi dalam tim.", skills: ["HTML/CSS", "JavaScript", "Python"], achievements: [] },
  2: { hobbies: "Membaca, Olahraga", favoriteSubject: "Matematika", aspiration: "Data Scientist", about: "Tertarik dengan data dan algoritma.", skills: ["Python", "Logika", "Matematika"], achievements: [] },
  3: { hobbies: "Desain, Menggambar", favoriteSubject: "Seni & Desain", aspiration: "UI/UX Designer", about: "Kreatif dan suka membuat desain yang estetik.", skills: ["Figma", "Adobe XD", "Illustrator"], achievements: [] },
  4: { hobbies: "Memasak, Musik", favoriteSubject: "Bahasa Indonesia", aspiration: "Web Developer", about: "Aktif dan suka bereksperimen dengan hal-hal baru.", skills: ["HTML/CSS", "Canva", "Teamwork"], achievements: [] },
};

function getPortfolioData(no) {
  return { ...PORTFOLIO_DATA.default, ...(PORTFOLIO_DATA[no] || {}) };
}

/* Gradient palette for hero banner based on student number */
const HERO_GRADIENTS = [
  "135deg, #1a6fff 0%, #56b4ff 100%",
  "135deg, #ff6ab0 0%, #ffd06a 100%",
  "135deg, #22e87a 0%, #4dd9ff 100%",
  "135deg, #d06aff 0%, #ff6ab0 100%",
  "135deg, #ff8c6a 0%, #ffd06a 100%",
  "135deg, #4dffee 0%, #4d8aff 100%",
];

(function wirePortfolioModal() {
  function open(no) {
    const modal = document.getElementById('portfolioModal');
    const student = STUDENTS_DATA.find(s => s.no === no);
    if (!student) return;

    const pdata = getPortfolioData(no);

    /* Avatar */
    const img = document.getElementById('portfolioAvatarImg');
    const ph = document.getElementById('portfolioAvatarPh');
    if (student.img) {
      img.src = student.img;
      img.alt = `Foto ${student.name}`;
      img.style.display = 'block';
      ph.style.display = 'none';
      img.onerror = () => { img.style.display = 'none'; ph.textContent = student.initials; ph.style.display = 'flex'; };
    } else {
      img.style.display = 'none';
      ph.textContent = student.initials;
      ph.style.display = 'flex';
    }

    /* Hero gradient */
    const heroEl = document.getElementById('portfolioHero');
    heroEl.style.background = `linear-gradient(${HERO_GRADIENTS[no % HERO_GRADIENTS.length]})`;
    document.getElementById('portfolioHeroDeco').textContent = student.initials;

    /* Info */
    document.getElementById('portfolioNumber').textContent = `#${String(student.no).padStart(2, '0')}`;
    document.getElementById('portfolioName').textContent = student.name;
    document.getElementById('portfolioRole').textContent = student.role + ' · XI RPL 2';

    /* Bio tab */
    const bioGrid = document.getElementById('portfolioBioGrid');
    bioGrid.innerHTML = `
      <div class="portfolio-bio-item">
        <div class="portfolio-bio-label"><i class="fa-solid fa-hashtag"></i> Nomor Absen</div>
        <div class="portfolio-bio-value">${String(student.no).padStart(2, '0')}</div>
      </div>
      <div class="portfolio-bio-item">
        <div class="portfolio-bio-label"><i class="fa-solid fa-school"></i> Kelas</div>
        <div class="portfolio-bio-value">XI RPL 2</div>
      </div>
      <div class="portfolio-bio-item">
        <div class="portfolio-bio-label"><i class="fa-solid fa-heart"></i> Hobi</div>
        <div class="portfolio-bio-value">${pdata.hobbies}</div>
      </div>
      <div class="portfolio-bio-item">
        <div class="portfolio-bio-label"><i class="fa-solid fa-book-open"></i> Mata Pelajaran Favorit</div>
        <div class="portfolio-bio-value">${pdata.favoriteSubject}</div>
      </div>
      <div class="portfolio-bio-item portfolio-bio-full">
        <div class="portfolio-bio-label"><i class="fa-solid fa-star"></i> Cita-cita</div>
        <div class="portfolio-bio-value">${pdata.aspiration}</div>
      </div>
      <div class="portfolio-bio-about portfolio-bio-full">
        <div class="portfolio-bio-about-label"><i class="fa-solid fa-quote-left"></i> Tentang Saya</div>
        ${pdata.about}
      </div>
    `;

    /* Skills tab */
    const skillsEl = document.getElementById('portfolioSkillsContent');
    if (pdata.skills && pdata.skills.length > 0) {
      const skillIcons = { 'HTML/CSS': 'fa-code', 'JavaScript': 'fa-js', 'Python': 'fa-python', 'Figma': 'fa-figma', default: 'fa-star' };
      skillsEl.innerHTML = `
        <div class="portfolio-skills-list">
          ${pdata.skills.map(sk => {
        const icon = skillIcons[sk] || skillIcons.default;
        return `<span class="portfolio-skill-tag"><i class="fa-brands ${icon}" onerror="this.className='fa-solid fa-code'"></i> ${sk}</span>`;
      }).join('')}
        </div>`;
    } else {
      skillsEl.innerHTML = `<div class="portfolio-empty"><i class="fa-solid fa-code"></i>Belum ada data keahlian.</div>`;
    }

    /* Achievements tab */
    const achEl = document.getElementById('portfolioAchievementsContent');
    if (pdata.achievements && pdata.achievements.length > 0) {
      achEl.innerHTML = `<div class="portfolio-achievement-list">${pdata.achievements.map(a => `
          <div class="portfolio-achievement-item">
            <div class="portfolio-achievement-icon"><i class="fa-solid fa-trophy"></i></div>
            <div>
              <div class="portfolio-achievement-title">${a.title}</div>
              <div class="portfolio-achievement-desc">${a.desc}</div>
            </div>
          </div>`).join('')
        }</div>`;
    } else {
      achEl.innerHTML = `<div class="portfolio-empty"><i class="fa-solid fa-trophy"></i>Belum ada prestasi tercatat.</div>`;
    }

    /* Reset tab ke Bio */
    document.querySelectorAll('.portfolio-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.portfolio-tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector('.portfolio-tab-btn[data-tab="bio"]').classList.add('active');
    document.querySelector('[data-tab-content="bio"]').classList.add('active');

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    document.getElementById('portfolioModal').classList.remove('open');
    document.body.style.overflow = '';
  }

  window.openPortfolioModal = open;

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('portfolioModalClose').addEventListener('click', close);
    document.getElementById('portfolioModalBackdrop').addEventListener('click', close);

    /* Tab switching */
    document.querySelectorAll('.portfolio-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll('.portfolio-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.portfolio-tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.querySelector(`[data-tab-content="${tab}"]`).classList.add('active');
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && document.getElementById('portfolioModal').classList.contains('open')) close();
    });
  });
})();

/* ============================================================
   RANDOM STUDENT PICKER MODULE
   ============================================================ */
const RandomPicker = (() => {
  const diceIcons = [
    'fa-dice-one', 'fa-dice-two', 'fa-dice-three',
    'fa-dice-four', 'fa-dice-five', 'fa-dice-six'
  ];
  let rollInterval = null;

  const getModal = () => document.getElementById('randomModal');
  const getDice = () => document.getElementById('randomDiceIcon');
  const getImg = () => document.getElementById('randomModalImg');
  const getPh = () => document.getElementById('randomModalPlaceholder');
  const getNum = () => document.getElementById('randomModalNumber');
  const getName = () => document.getElementById('randomModalName');

  function pickRandom() {
    return STUDENTS_DATA[Math.floor(Math.random() * STUDENTS_DATA.length)];
  }

  function openWithAnimation() {
    getModal().classList.add('open');
    document.body.style.overflow = 'hidden';

    getImg().style.display = 'none';
    getPh().style.display = 'none';
    getNum().textContent = '...';
    getName().textContent = '';
    getName().className = 'random-modal-name name-cycling';

    const diceEl = getDice();
    let diceIdx = 0;
    diceEl.className = 'fa-solid fa-dice-six rolling';
    diceEl.parentElement.classList.add('rolling');

    let cycleCount = 0;
    const totalCycles = 28;
    rollInterval = setInterval(() => {
      const s = pickRandom();
      getName().textContent = s.name;
      diceEl.className = `fa-solid ${diceIcons[diceIdx % diceIcons.length]} rolling`;
      diceIdx++;
      cycleCount++;
      if (cycleCount >= totalCycles) {
        clearInterval(rollInterval);
        rollInterval = null;
        revealWinner();
      }
    }, 80);
  }

  function revealWinner() {
    const winner = pickRandom();
    const diceEl = getDice();
    diceEl.parentElement.classList.remove('rolling');
    diceEl.className = 'fa-solid fa-dice-six';
    getName().classList.remove('name-cycling');

    getNum().textContent = `#${String(winner.no).padStart(2, '0')}`;
    getName().textContent = winner.name;

    const img = getImg();
    const ph = getPh();
    if (winner.img) {
      img.src = winner.img;
      img.alt = `Foto ${winner.name}`;
      img.style.display = 'block';
      ph.style.display = 'none';
      img.onerror = () => {
        img.style.display = 'none';
        ph.textContent = winner.initials;
        ph.style.display = 'flex';
      };
    } else {
      img.style.display = 'none';
      ph.textContent = winner.initials;
      ph.style.display = 'flex';
    }
  }

  function close() {
    if (rollInterval) { clearInterval(rollInterval); rollInterval = null; }
    getModal().classList.remove('open');
    document.body.style.overflow = '';
  }

  function init() {
    document.getElementById('btnRandomPicker').addEventListener('click', openWithAnimation);
    document.getElementById('randomModalClose').addEventListener('click', close);
    document.getElementById('randomModalBackdrop').addEventListener('click', close);
    document.getElementById('randomAgainBtn').addEventListener('click', openWithAnimation);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && getModal().classList.contains('open')) close();
    });
  }

  return { init };
})();

/* ============================================================
   GROUP PICKER MODULE (REVISI)
   - Mode: by-groups (max 18) | by-members (otomatis hitung kelompok)
   - Export PNG & PDF via html2canvas + jsPDF
   - Responsive mobile
   ============================================================ */
const GroupPicker = (() => {
  let groupCount = 4;
  let memberCount = 5;
  let shuffleMode = 'random';
  let splitMode = 'by-groups'; // 'by-groups' | 'by-members'
  const MAX_GROUPS = 18;
  const MIN_GROUPS = 2;
  const MAX_MEMBERS = Math.floor(STUDENTS_DATA.length / 2);
  const MIN_MEMBERS = 2;

  /* State for current generated groups */
  let currentGroups = [];

  /* DOM helpers */
  const getModal = () => document.getElementById('groupModal');
  const getConfig = () => document.getElementById('groupConfig');
  const getResults = () => document.getElementById('groupResults');
  const getContainer = () => document.getElementById('groupsContainer');
  const getCountVal = () => document.getElementById('groupCountVal');
  const getMemberVal = () => document.getElementById('memberCountVal');
  const getPreview = () => document.getElementById('groupMembersPreview');
  const getCountPreview = () => document.getElementById('groupCountPreview');
  const getResultLabel = () => document.getElementById('groupResultsLabel');

  /* ── helpers ── */

  function calcByGroups() {
    const total = STUDENTS_DATA.length;
    const base = Math.floor(total / groupCount);
    const extra = total % groupCount;
    return extra > 0 ? `${base}–${base + 1} siswa` : `${base} siswa`;
  }

  function calcByMembers() {
    const total = STUDENTS_DATA.length;
    const est = Math.ceil(total / memberCount);
    return `~${est} kelompok`;
  }

  function updatePreview() {
    if (splitMode === 'by-groups') {
      getPreview().textContent = `~${calcByGroups()}`;
    } else {
      getCountPreview().textContent = calcByMembers();
    }
  }

  function buildGroups() {
    const students = shuffle(STUDENTS_DATA);
    let count = groupCount;

    if (splitMode === 'by-members') {
      count = Math.ceil(students.length / memberCount);
    }

    const groups = Array.from({ length: count }, () => []);

    if (shuffleMode === 'balanced') {
      students.forEach((s, i) => groups[i % count].push(s));
    } else {
      const base = Math.floor(students.length / count);
      const extra = students.length % count;
      let idx = 0;
      for (let g = 0; g < count; g++) {
        const size = base + (g < extra ? 1 : 0);
        groups[g] = students.slice(idx, idx + size);
        idx += size;
      }
    }
    return groups;
  }

  function renderGroups(groups) {
    currentGroups = groups;
    const container = getContainer();
    container.innerHTML = groups.map((members, gi) => {
      const color = GROUP_COLORS[gi % GROUP_COLORS.length];
      const membersHTML = members.map(s => `
        <div class="group-member-row">
          <span class="group-member-num">#${String(s.no).padStart(2, '0')}</span>
          <span>${s.name}</span>
        </div>
      `).join('');

      return `
        <div class="group-card" style="animation-delay:${gi * 0.07}s; box-shadow: 0 4px 20px ${color.glow}; border-color: ${color.bg}33;">
          <div class="group-card-header" style="background:${color.bg};">
            <div class="group-card-dot" style="background:#fff; opacity:0.7;"></div>
            <span class="group-card-title">Kelompok ${gi + 1}</span>
            <span class="group-card-count">${members.length} siswa</span>
          </div>
          <div class="group-card-members">${membersHTML}</div>
        </div>`;
    }).join('');
  }

  function generate() {
    const groups = buildGroups();
    renderGroups(groups);

    const modeLabel = shuffleMode === 'balanced' ? 'Seimbang' : 'Acak';
    const splitLabel = splitMode === 'by-members'
      ? `per ${memberCount} siswa`
      : `${groups.length} Kelompok`;

    getResultLabel().textContent =
      `${groups.length} Kelompok · ${STUDENTS_DATA.length} Siswa · ${splitLabel} · Mode: ${modeLabel}`;

    getConfig().style.display = 'none';
    getResults().style.display = 'block';
  }

  function showConfig() {
    getResults().style.display = 'none';
    getConfig().style.display = 'flex';
  }

  function open() {
    showConfig();
    updatePreview();
    getModal().classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    getModal().classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── COPY ── */
  function copyResults() {
    let text = `=== Pembagian Kelompok XI RPL 2 ===\n\n`;
    currentGroups.forEach((members, gi) => {
      text += `Kelompok ${gi + 1}:\n`;
      members.forEach(s => {
        text += `  #${String(s.no).padStart(2, '0')} ${s.name}\n`;
      });
      text += '\n';
    });
    navigator.clipboard.writeText(text)
      .then(() => showToast('Hasil kelompok berhasil disalin!', 'fa-copy'))
      .catch(() => showToast('Gagal menyalin. Coba lagi.', 'fa-times-circle'));
  }

  /* ── BUILD SNAPSHOT ELEMENT ── */
  function buildSnapshotElement() {
    let snap = document.getElementById('groupExportSnapshot');
    if (snap) snap.remove();

    snap = document.createElement('div');
    snap.id = 'groupExportSnapshot';

    const now = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const groupCount_ = currentGroups.length;

    const cardsHTML = currentGroups.map((members, gi) => {
      const color = GROUP_COLORS[gi % GROUP_COLORS.length];
      const membersHTML = members.map(s =>
        `<div class="snap-member">
          <span class="snap-member-num">#${String(s.no).padStart(2, '0')}</span>
          <span>${s.name}</span>
        </div>`
      ).join('');
      return `
        <div class="snap-card" style="border-color:${color.bg}33;">
          <div class="snap-card-header" style="background:${color.bg};">
            <span class="snap-card-title">Kelompok ${gi + 1}</span>
            <span class="snap-card-count">${members.length} siswa</span>
          </div>
          <div class="snap-members">${membersHTML}</div>
        </div>`;
    }).join('');

    snap.innerHTML = `
      <div class="snap-header">
        <div class="snap-title">Pembagian Kelompok XI RPL 2</div>
        <div class="snap-subtitle">${groupCount_} Kelompok · ${STUDENTS_DATA.length} Siswa · ${now}</div>
      </div>
      <div class="snap-grid">${cardsHTML}</div>
      <div class="snap-footer">XI RPL 2 · SMK Brantas Karangkates · ${now}</div>
    `;

    document.body.appendChild(snap);
    return snap;
  }

  /* ── EXPORT PNG ── */
  async function exportPNG() {
    if (!window.html2canvas) {
      showToast('html2canvas belum dimuat. Coba lagi.', 'fa-times-circle');
      return;
    }
    showExportLoading('Membuat gambar PNG...');
    try {
      const snap = buildSnapshotElement();
      // Wait a tick for fonts/images
      await new Promise(r => setTimeout(r, 300));

      const canvas = await window.html2canvas(snap, {
        backgroundColor: '#0a0a0f',
        scale: 2,
        useCORS: true,
        logging: false,
        width: snap.offsetWidth,
        height: snap.offsetHeight,
      });

      snap.remove();
      hideExportLoading();

      const link = document.createElement('a');
      link.download = `kelompok-xpplg2-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      showToast('PNG berhasil diunduh!', 'fa-image');
    } catch (err) {
      snap?.remove();
      hideExportLoading();
      console.error('Export PNG error:', err);
      showToast('Gagal ekspor PNG. Coba lagi.', 'fa-times-circle');
    }
  }

  /* ── EXPORT PDF ── */
  async function exportPDF() {
    if (!window.html2canvas) {
      showToast('html2canvas belum dimuat. Coba lagi.', 'fa-times-circle');
      return;
    }
    if (!window.jspdf && !window.jsPDF) {
      showToast('jsPDF belum dimuat. Coba lagi.', 'fa-times-circle');
      return;
    }
    showExportLoading('Membuat file PDF...');
    try {
      const snap = buildSnapshotElement();
      await new Promise(r => setTimeout(r, 300));

      const canvas = await window.html2canvas(snap, {
        backgroundColor: '#0a0a0f',
        scale: 2,
        useCORS: true,
        logging: false,
        width: snap.offsetWidth,
        height: snap.offsetHeight,
      });

      snap.remove();

      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf || window;
      const orientation = canvas.width > canvas.height ? 'landscape' : 'portrait';
      const pdf = new jsPDF({
        orientation,
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`kelompok-xpplg2-${Date.now()}.pdf`);

      hideExportLoading();
      showToast('PDF berhasil diunduh!', 'fa-file-pdf');
    } catch (err) {
      snap?.remove();
      hideExportLoading();
      console.error('Export PDF error:', err);
      showToast('Gagal ekspor PDF. Coba lagi.', 'fa-times-circle');
    }
  }

  /* ── INIT ── */
  function init() {
    document.getElementById('btnGroupPicker').addEventListener('click', open);
    document.getElementById('groupModalClose').addEventListener('click', close);
    document.getElementById('groupModalBackdrop').addEventListener('click', close);

    /* Split mode toggle */
    document.querySelectorAll('.split-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.split-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        splitMode = btn.dataset.split;

        if (splitMode === 'by-groups') {
          document.getElementById('panelByGroups').style.display = 'flex';
          document.getElementById('panelByMembers').style.display = 'none';
        } else {
          document.getElementById('panelByGroups').style.display = 'none';
          document.getElementById('panelByMembers').style.display = 'flex';
        }
        updatePreview();
      });
    });

    /* Stepper: group count */
    document.getElementById('groupCountMinus').addEventListener('click', () => {
      if (groupCount > MIN_GROUPS) {
        groupCount--;
        getCountVal().textContent = groupCount;
        updatePreview();
      }
    });
    document.getElementById('groupCountPlus').addEventListener('click', () => {
      if (groupCount < MAX_GROUPS) {
        groupCount++;
        getCountVal().textContent = groupCount;
        updatePreview();
      }
    });

    /* Stepper: member count */
    document.getElementById('memberCountMinus').addEventListener('click', () => {
      if (memberCount > MIN_MEMBERS) {
        memberCount--;
        getMemberVal().textContent = memberCount;
        updatePreview();
      }
    });
    document.getElementById('memberCountPlus').addEventListener('click', () => {
      if (memberCount < MAX_MEMBERS) {
        memberCount++;
        getMemberVal().textContent = memberCount;
        updatePreview();
      }
    });

    /* Mode buttons */
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        shuffleMode = btn.dataset.mode;
      });
    });

    /* Generate */
    document.getElementById('groupGenerateBtn').addEventListener('click', generate);

    /* Shuffle again */
    document.getElementById('groupShuffleAgain').addEventListener('click', generate);

    /* Back to config */
    document.getElementById('groupBackBtn').addEventListener('click', showConfig);

    /* Copy */
    document.getElementById('groupCopyBtn').addEventListener('click', copyResults);

    /* Export PNG */
    document.getElementById('groupExportPng').addEventListener('click', exportPNG);

    /* Export PDF */
    document.getElementById('groupExportPdf').addEventListener('click', exportPDF);

    /* Escape close */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && getModal().classList.contains('open')) close();
    });

    /* Init preview */
    updatePreview();
  }

  return { init };
})();

/* ============================================================
   NAVBAR MODULE
   ============================================================ */
const Navbar = (() => {
  function init() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const links = navLinks.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
      updateActiveLink();
    }, { passive: true });

    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('open');
      navLinks.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  function updateActiveLink() {
    const sections = ['home', 'gallery', 'homeroom', 'students', 'structure'];
    const scrollY = window.scrollY + 100;
    let activeId = sections[0];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) activeId = id;
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.section === activeId);
    });
  }

  return { init };
})();

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

function initReveal() {
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function animateCounters() {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      const step = target / (1800 / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      }, 16);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(c => counterObserver.observe(c));
}

/* ============================================================
   BACK TO TOP
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ============================================================
   KODE TAMBAHAN (PENGAYAAN FITUR & AKSESIBILITAS)
   ============================================================ */

/* ── 1. Fungsionalitas Keyboard Accessibility Untuk Modal & Galeri ── */
document.addEventListener('keydown', (e) => {
  const activeModal = document.querySelector('.modal.open, .lightbox.open, #groupModal.open, #randomModal.open, #portfolioModal.open');
  if (!activeModal) return;

  // Shortcut tombol 'Esc' untuk menutup semua modal yang sedang terbuka secara aman
  if (e.key === 'Escape') {
    const closeButtons = activeModal.querySelectorAll('[id*="Close"], [id*="Btn"], .close-btn');
    if (closeButtons.length > 0) {
      closeButtons[0].click();
    } else {
      // Fallback jika tombol close spesifik tidak terpicu
      activeModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
});

/* ── 2. Optimasi Event Resize Menggunakan Debounce ── */
// Mencegah penurunan performa (lagging) saat orientasi layar HP berubah atau jendela di-resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Memastikan modul partikel loading screen mendeteksi ukuran layar baru jika masih aktif
    const loadingCanvas = document.getElementById('loadingParticles');
    if (loadingCanvas && typeof loadingCanvas.getContext === 'function') {
      const ctx = loadingCanvas.getContext('2d');
      loadingCanvas.width = window.innerWidth;
      loadingCanvas.height = window.innerHeight;
    }
  }, 250);
});

/* ── 3. Sinkronisasi Fokus Input Pencarian Siswa ── */
// Efek interaktif visual tambahan saat pengguna mengetik di kolom pencarian siswa
const searchInput = document.getElementById('studentSearch');
if (searchInput) {
  searchInput.addEventListener('focus', () => {
    searchInput.parentElement.classList.add('search-focused');
  });
  searchInput.addEventListener('blur', () => {
    searchInput.parentElement.classList.remove('search-focused');
  });
}

/* ── 4. Fitur Validasi Ekspor Kelompok Semesta ── */
// Logika pencegahan error jika pengguna menekan tombol ekspor PNG/PDF sebelum kelompok di-generate
const pngBtn = document.getElementById('groupExportPng');
const pdfBtn = document.getElementById('groupExportPdf');

function checkGroupGenerated(e) {
  const container = document.getElementById('groupsContainer');
  if (!container || container.children.length === 0) {
    e.stopImmediatePropagation(); // Menghentikan proses ekspor bawaan
    showToast('Silakan generate kelompok terlebih dahulu!', 'fa-excounter-circle');
  }
}

if (pngBtn) pngBtn.addEventListener('click', checkGroupGenerated, { capture: true });
if (pdfBtn) pdfBtn.addEventListener('click', checkGroupGenerated, { capture: true });

/* ============================================================
   INIT — DOMContentLoaded
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  Navbar.init();
  Parallax.init();
  Gallery.init();
  HomeroomTeacher.init();
  Students.init();
  RandomPicker.init();
  GroupPicker.init();

  initReveal();
  animateCounters();
  initBackToTop();
  initSmoothScroll();
});
