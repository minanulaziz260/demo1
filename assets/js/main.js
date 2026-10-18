/**
 * Serenity Blossom - Full Interactive Script
 * Reverse engineered from Vitopia.co SectionRenderV1 & website runtime
 */

document.addEventListener('DOMContentLoaded', () => {
  initGSAPAnimations();
  initMusicController();
  initSlideshows();
  initCountdown();
  initNavigationMenu();
  initRsvpForm();
  initCommentForm();
  initResponsiveLayout();
});

// ==================== 1. GSAP ANIMATIONS ====================
function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof TextPlugin !== 'undefined') gsap.registerPlugin(TextPlugin);

  // Directional Fade Animations
  const fadeConfigs = [
    { type: 'fadeIn', axis: 'yPercent', value: 0, start: 'top 110%', end: 'bottom 20%' },
    { type: 'fadeInUp', axis: 'yPercent', value: 80, start: 'top 110%', end: 'bottom 20%' },
    { type: 'fadeInDown', axis: 'yPercent', value: -80, start: 'top 60%', end: 'bottom 20%' },
    { type: 'fadeInLeft', axis: 'xPercent', value: -80, start: 'top 95%', end: 'bottom 20%' },
    { type: 'fadeInRight', axis: 'xPercent', value: 80, start: 'top 95%', end: 'bottom 20%' }
  ];

  fadeConfigs.forEach(({ type, axis, value, start, end }) => {
    document.querySelectorAll(`[data-animation="${type}"]`).forEach(el => {
      const duration = parseFloat(el.getAttribute('data-animation-duration') || '1.4');
      const delay = parseFloat(el.getAttribute('data-animation-delay') || '0') / 1000;
      const aStart = el.getAttribute('data-animation-start') || start;
      const aEnd = el.getAttribute('data-animation-end') || end;

      gsap.fromTo(
        el,
        { opacity: 0, [axis]: value },
        {
          opacity: 1,
          [axis]: 0,
          duration: duration,
          delay: delay,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: aStart,
            end: aEnd,
            toggleActions: 'play none none none'
          }
        }
      );
    });
  });

  // Typing animation
  document.querySelectorAll("[data-animation='typing']").forEach(el => {
    const text = el.getAttribute('data-text') || el.textContent.trim();
    el.textContent = '';
    gsap.to(el, {
      opacity: 1,
      text: text,
      duration: parseFloat(el.getAttribute('data-animation-duration') || '4'),
      ease: 'power1.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        end: 'bottom 20%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Zoom In animation
  document.querySelectorAll("[data-animation='zoomIn']").forEach(el => {
    gsap.fromTo(
      el,
      { opacity: 0, scale: 0.6 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 95%',
          end: 'bottom 20%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Hide on scroll (Cover element)
  document.querySelectorAll("[data-animation='hideOnScroll']").forEach(el => {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const innerH = window.innerHeight;
      if (window.innerWidth < 1024) {
        if (scrollY > innerH * 0.35) {
          gsap.to(el, { opacity: 0, duration: 0.4, ease: 'power2.out' });
        } else {
          gsap.to(el, { opacity: 1, duration: 0.4, ease: 'power2.out' });
        }
      } else {
        gsap.to(el, { opacity: 1, duration: 0.2, ease: 'power2.out' });
      }
    });
  });
}

// ==================== 2. MUSIC CONTROLLER ====================
let isAudioPlaying = false;
let userHasInteracted = false;

function initMusicController() {
  const audio = document.getElementById('bgMusic');
  const btnMusic = document.getElementById('btnMusic');
  if (!audio || !btnMusic) return;

  function playAudio() {
    audio.play().then(() => {
      isAudioPlaying = true;
      btnMusic.classList.add('playing');
      btnMusic.classList.remove('paused');
    }).catch(err => {
      console.log('Autoplay deferred until user interaction:', err);
      isAudioPlaying = false;
      btnMusic.classList.add('paused');
      btnMusic.classList.remove('playing');
    });
  }

  function pauseAudio() {
    audio.pause();
    isAudioPlaying = false;
    btnMusic.classList.add('paused');
    btnMusic.classList.remove('playing');
  }

  function toggleAudio(e) {
    if (e) e.preventDefault();
    userHasInteracted = true;
    if (isAudioPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  btnMusic.addEventListener('click', toggleAudio);

  // Trigger on "Open Invitation" buttons
  document.querySelectorAll('.play-music, #uid-c114409c').forEach(btn => {
    btn.addEventListener('click', () => {
      userHasInteracted = true;
      playAudio();
    });
  });

  // Global one-time interaction fallback to unlock audio
  const unlockEvents = ['click', 'touchstart'];
  const unlockAudio = () => {
    if (!userHasInteracted) {
      userHasInteracted = true;
      playAudio();
    }
    unlockEvents.forEach(evt => document.removeEventListener(evt, unlockAudio));
  };
  unlockEvents.forEach(evt => document.addEventListener(evt, unlockAudio, { once: true }));

  // Translate music button away while scrolling, restore on idle
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    btnMusic.style.transform = 'translateX(-120%)';
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      btnMusic.style.transform = 'translateX(0)';
    }, 250);
  });
}

// ==================== 3. SLIDESHOWS ====================
function initSlideshows() {
  document.querySelectorAll('.slideshow').forEach(slideshow => {
    const timer = Number(slideshow.getAttribute('data-timer')) || 3000;
    const images = slideshow.querySelectorAll('img');
    if (images.length === 0) return;

    let currentIndex = 0;
    images[0].classList.add('active');

    setInterval(() => {
      const current = images[currentIndex];
      const nextIndex = (currentIndex + 1) % images.length;
      const next = images[nextIndex];

      images.forEach(img => img.classList.remove('previous'));
      current.classList.remove('active');
      current.classList.add('previous');
      next.classList.add('active');

      currentIndex = nextIndex;

      setTimeout(() => {
        current.classList.remove('previous');
      }, 800);
    }, timer);
  });
}

// ==================== 4. COUNTDOWN TIMER ====================
function initCountdown() {
  document.querySelectorAll('[data-component="countdown"]').forEach(el => {
    const targetStr = el.getAttribute('data-datetime') || '2026-04-21T10:00';
    const targetDate = new Date(targetStr);
    if (isNaN(targetDate.getTime())) return;

    const daysEl = el.querySelector('.days');
    const hoursEl = el.querySelector('.hours');
    const minutesEl = el.querySelector('.minutes');
    const secondsEl = el.querySelector('.seconds');

    function update() {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;

      if (diff <= 0) {
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minutesEl) minutesEl.textContent = '00';
        if (secondsEl) secondsEl.textContent = '00';
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = String(d).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(m).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(s).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  });
}

// ==================== 5. NAVIGATION MENU ====================
function initNavigationMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const dropdown = document.getElementById('menu-dropdown');
  if (!menuBtn || !dropdown) return;

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && !menuBtn.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });

  document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', (e) => {
      dropdown.classList.add('hidden');
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

// ==================== 6. RSVP FORM ====================
function initRsvpForm() {
  const container = document.getElementById('rsvp-form');
  if (!container) return;

  const savedRsvp = localStorage.getItem('serenity_blossom_rsvp');
  if (savedRsvp) {
    try {
      const data = JSON.parse(savedRsvp);
      renderRsvpConfirmation(container, data);
      return;
    } catch (e) {}
  }

  container.innerHTML = `
    <form id="rsvp-inner-form" class="space-y-4 text-left">
      <div>
        <label class="block text-sm font-semibold text-neutral-800 mb-1">Nama Lengkap</label>
        <input type="text" id="rsvp-name" required placeholder="Masukkan Nama Anda" 
          class="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[var(--button-bg)] text-sm bg-white/90 text-neutral-900" />
      </div>

      <div>
        <label class="block text-sm font-semibold text-neutral-800 mb-1">Konfirmasi Kehadiran</label>
        <div class="grid grid-cols-2 gap-2">
          <label class="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-300 bg-white/90 cursor-pointer hover:border-[var(--button-bg)] transition">
            <input type="radio" name="rsvp-status" value="Hadir" checked class="text-[var(--button-bg)] focus:ring-[var(--button-bg)]" />
            <span class="text-sm font-medium text-neutral-800">Hadir</span>
          </label>
          <label class="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-300 bg-white/90 cursor-pointer hover:border-[var(--button-bg)] transition">
            <input type="radio" name="rsvp-status" value="Tidak Hadir" class="text-[var(--button-bg)] focus:ring-[var(--button-bg)]" />
            <span class="text-sm font-medium text-neutral-800">Tidak Hadir</span>
          </label>
        </div>
      </div>

      <div>
        <label class="block text-sm font-semibold text-neutral-800 mb-1">Jumlah Tamu</label>
        <select id="rsvp-guests" class="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[var(--button-bg)] text-sm bg-white/90 text-neutral-900">
          <option value="1 Orang">1 Orang</option>
          <option value="2 Orang">2 Orang</option>
          <option value="3 Orang">3 Orang</option>
          <option value="4 Orang">4 Orang</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-semibold text-neutral-800 mb-1">Pesan / Doa (Opsional)</label>
        <textarea id="rsvp-notes" rows="2" placeholder="Tuliskan ucapan atau catatan..." 
          class="w-full px-4 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[var(--button-bg)] text-sm bg-white/90 text-neutral-900"></textarea>
      </div>

      <button type="submit" 
        class="w-full py-3 px-6 rounded-full font-semibold text-sm text-[var(--button-color)] bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] shadow-md transition-all duration-200">
        Kirim Konfirmasi Kehadiran
      </button>
    </form>
  `;

  const form = document.getElementById('rsvp-inner-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('rsvp-name').value.trim();
    const status = form.querySelector('input[name="rsvp-status"]:checked').value;
    const guests = document.getElementById('rsvp-guests').value;
    const notes = document.getElementById('rsvp-notes').value.trim();

    const data = { name, status, guests, notes, date: new Date().toLocaleDateString('id-ID') };
    localStorage.setItem('serenity_blossom_rsvp', JSON.stringify(data));
    showToast('Konfirmasi RSVP berhasil terkirim!');
    renderRsvpConfirmation(container, data);
  });
}

function renderRsvpConfirmation(container, data) {
  const isAttending = data.status === 'Hadir';
  container.innerHTML = `
    <div class="text-center py-4 space-y-4">
      <div class="w-14 h-14 mx-auto rounded-full ${isAttending ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'} flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <div>
        <h4 class="font-bold text-lg text-neutral-900">${data.name}</h4>
        <span class="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${isAttending ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-700'}">
          ${data.status} • ${data.guests}
        </span>
      </div>
      <p class="text-sm text-neutral-600">Terima kasih atas konfirmasi Anda. Kehadiran dan doa restu Anda merupakan kehormatan bagi kami.</p>
      
      <button id="rsvp-reset-btn" class="text-xs text-[var(--button-bg)] hover:underline font-semibold pt-2">
        Ubah Konfirmasi Kehadiran
      </button>
    </div>
  `;

  document.getElementById('rsvp-reset-btn').addEventListener('click', () => {
    localStorage.removeItem('serenity_blossom_rsvp');
    initRsvpForm();
  });
}

// ==================== 7. COMMENT / WISHES FORM ====================
const defaultComments = [
  {
    id: "1",
    name: "Andini",
    email: "andini@example.com",
    content: "Selamat atas pernikahannya! Semoga selalu diberi kebahagiaan dan cinta yang tak berkesudahan.",
    is_owner: false,
    time: "2 menit yang lalu"
  },
  {
    id: "2",
    name: "Budi",
    email: "budi@example.com",
    content: "Barakallah! Semoga menjadi keluarga sakinah, mawaddah, warahmah.",
    is_owner: false,
    time: "10 minutes ago"
  },
  {
    id: "3",
    name: "Lina",
    email: "lina@example.com",
    content: "Ikut bahagia melihat kalian bersatu. Semoga langgeng sampai akhir hayat!",
    is_owner: false,
    time: "30 minutes ago"
  },
  {
    id: "4",
    name: "Admin Website",
    email: "admin@vitopia.com",
    content: "Terima kasih atas doa dan ucapannya! ❤️",
    is_owner: true,
    time: "1 minutes ago"
  }
];

function initCommentForm() {
  const container = document.getElementById('comment-form');
  if (!container) return;

  const stored = localStorage.getItem('serenity_blossom_comments');
  let comments = defaultComments;
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        comments = parsed;
      }
    } catch (e) {}
  }

  container.innerHTML = `
    <div class="space-y-6 text-left">
      <form id="comment-inner-form" class="space-y-3">
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">Nama</label>
          <input type="text" id="comment-name" required placeholder="Nama Anda" 
            class="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-bg)] bg-white/90 text-neutral-900" />
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">E-Mail (Opsional)</label>
          <input type="email" id="comment-email" placeholder="email@domain.com" 
            class="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-bg)] bg-white/90 text-neutral-900" />
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">Ucapan & Doa</label>
          <textarea id="comment-content" required rows="3" maxlength="500" placeholder="Tuliskan ucapan atau doa restu Anda..." 
            class="w-full px-4 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-bg)] bg-white/90 text-neutral-900"></textarea>
          <div class="text-right text-xs text-neutral-500" id="char-counter">Sisa karakter: 500</div>
        </div>

        <button type="submit" 
          class="w-full py-2.5 px-6 rounded-full font-semibold text-sm text-[var(--button-color)] bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] shadow-md transition">
          Kirim Ucapan
        </button>
      </form>

      <hr class="border-neutral-300" />

      <div class="space-y-3 max-h-96 overflow-y-auto pr-1" id="comments-list">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;

  const textarea = document.getElementById('comment-content');
  const counter = document.getElementById('char-counter');
  textarea.addEventListener('input', () => {
    counter.textContent = `Sisa karakter: ${500 - textarea.value.length}`;
  });

  const listContainer = document.getElementById('comments-list');
  function renderList() {
    listContainer.innerHTML = comments.map(c => `
      <div class="p-3.5 rounded-xl bg-white/80 border border-neutral-200/80 shadow-sm space-y-1">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-[var(--button-bg)] text-[var(--button-color)] flex items-center justify-center font-bold text-xs">
            ${c.name.charAt(0).toUpperCase()}
          </div>
          <span class="font-bold text-sm text-neutral-900">${c.name}</span>
          ${c.is_owner ? `
            <svg class="w-4 h-4 text-blue-500 inline" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          ` : ''}
          <span class="text-[11px] text-neutral-400 ml-auto">${c.time}</span>
        </div>
        <p class="text-sm text-neutral-700 pl-9 leading-relaxed">${c.content}</p>
      </div>
    `).join('');
  }

  renderList();

  const form = document.getElementById('comment-inner-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('comment-name').value.trim();
    const email = document.getElementById('comment-email').value.trim();
    const content = textarea.value.trim();

    if (!name || !content) return;

    const newComment = {
      id: Date.now().toString(),
      name,
      email,
      content,
      is_owner: false,
      time: "Baru saja"
    };

    comments.unshift(newComment);
    localStorage.setItem('serenity_blossom_comments', JSON.stringify(comments));
    renderList();
    form.reset();
    counter.textContent = 'Sisa karakter: 500';
    showToast('Ucapan Anda berhasil dikirim!');
  });
}

// ==================== 8. CLIPBOARD HELPER ====================
window.copyToClipboard = function(text, btnElement) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Nomor rekening ${text} berhasil disalin!`);
      if (btnElement) {
        const origText = btnElement.innerHTML;
        btnElement.innerHTML = `✓ Tersalin`;
        setTimeout(() => { btnElement.innerHTML = origText; }, 2000);
      }
    });
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(`Nomor rekening ${text} berhasil disalin!`);
    if (btnElement) {
      const origText = btnElement.innerHTML;
      btnElement.innerHTML = `✓ Tersalin`;
      setTimeout(() => { btnElement.innerHTML = origText; }, 2000);
    }
  }
};

// ==================== 9. TOAST NOTIFICATION ====================
function showToast(message) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/90 text-white px-5 py-2.5 rounded-full text-xs font-medium shadow-2xl backdrop-blur-md transition-all duration-300 opacity-0 pointer-events-none transform translate-y-3';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.remove('opacity-0', 'translate-y-3');
  toast.classList.add('opacity-100', 'translate-y-0');

  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-3');
  }, 3000);
}

// ==================== 10. RESPONSIVE LAYOUT ====================
function initResponsiveLayout() {
  const gi = 375;
  const updateLayout = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const zoomRatio = w < gi ? w / gi : 1;
    document.body.style.zoom = `${zoomRatio}`;

    const sectionRender = document.getElementById('section-render');
    if (sectionRender) {
      if (w < 1024) {
        sectionRender.style.marginTop = `${h / zoomRatio}px`;
      } else {
        sectionRender.style.marginTop = '0px';
      }
    }
  };

  window.addEventListener('resize', updateLayout);
  updateLayout();
}
