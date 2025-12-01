/* Main JS for portfolio enhancements */

/* ---------- Utilities ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ---------- Theme toggle (Step 6) ---------- */
(function themeInit() {
    const btn = document.getElementById('theme-toggle');
    const userPref = localStorage.getItem('theme');
    if (userPref === 'dark') document.body.classList.add('dark-mode');
    updateThemeButton();
    btn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeButton();
    });
    function updateThemeButton() {
        const isDark = document.body.classList.contains('dark-mode');
        btn.textContent = isDark ? '☀️' : '🌙';
    }
})();

/* ---------- Skill bars animation (Step 1) ---------- */
(function skillBars() {
    const bars = $$('.skill-bar');
    if (!('IntersectionObserver' in window)) {
        // fallback: animate immediately
        bars.forEach(animateBar);
        return;
    }
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateBar(entry.target);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    bars.forEach(b => io.observe(b));

    function animateBar(bar) {
        const fill = bar.querySelector('.skill-fill');
        const level = parseInt(bar.getAttribute('data-level') || 0, 10);
        fill.style.width = level + '%';
        bar.setAttribute('aria-valuenow', level);
    }
})();

/* ---------- Make project cards clickable (Step 2) ---------- */   
(function projectsClickable() {
    const cards = $$('.project-card');
    cards.forEach(card => {
        const url = card.dataset.url;
        if (!url) return;
        card.addEventListener('click', () => window.location.href = url);
        // allow keyboard activation
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.location.href = url;
            }
        });
    });
})();

(function contactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const feedback = document.getElementById('form-feedback');

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        feedback.classList.remove('error');
        feedback.textContent = '';

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const message = form.message.value.trim();

        if (!name || !email || !message) {
            feedback.classList.add('error');
            feedback.textContent = 'Please fill in all fields.';
            return;
        }
        if (!isValidEmail(email)) {
            feedback.classList.add('error');
            feedback.textContent = 'Please enter a valid email address.';
            return;
        }

        const data = { name, email, message, submittedAt: new Date().toISOString() };
        localStorage.setItem('contactForm', JSON.stringify(data));

        // success message then redirect to details page
        feedback.classList.remove('error');
        feedback.textContent = 'Message saved. Redirecting to details page...';
        // redirect immediately as per instructions
        window.location.href = 'form-details.html';
    });
})();

/* ---------- Canvas drawing (Step 4) ---------- */
(function canvasDraw() {
    const canvas = document.getElementById('my-canvas');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    // simple decorative drawing
    ctx.fillStyle = '#ffd369';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#222';
    ctx.font = '20px Arial';
    ctx.fillText('Hello 👋', 12, 30);
    ctx.beginPath();
    ctx.arc(260, 120, 36, 0, Math.PI * 2);
    ctx.fillStyle = '#ff9f43';
    ctx.fill();
})();

/* ---------- Slider (Step 5) ---------- */
(function slider() {
    const track = document.querySelector('.slides-track');
    const prev = document.querySelector('.slider-btn.prev');
    const next = document.querySelector('.slider-btn.next');
    if (!track || !prev || !next) return;
    const slides = Array.from(track.children);
    let idx = 0;

    function update() {
        const width = track.clientWidth / slides.length * slides.length; // full width
        track.style.transform = `translateX(-${idx * 100}%)`;
    }
    prev.addEventListener('click', () => { idx = (idx - 1 + slides.length) % slides.length; update(); });
    next.addEventListener('click', () => { idx = (idx + 1) % slides.length; update(); });

    // make responsive: recompute on resize
    window.addEventListener('resize', update);
    // auto-play (optional, gentle)
    let autoplay = setInterval(() => { idx = (idx + 1) % slides.length; update(); }, 5000);
    // pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoplay));
    track.addEventListener('mouseleave', () => {
        autoplay = setInterval(() => { idx = (idx + 1) % slides.length; update(); }, 5000);
    });
    // initialize
    update();
})();

/* ---------- Back-to-top button (Step 7) ---------- */
(function backToTop() {
    const btn = document.getElementById('back-to-top');
    const showAfter = 300;
    window.addEventListener('scroll', () => {
        if (window.scrollY > showAfter) btn.style.display = 'block';
        else btn.style.display = 'none';
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ---------- Accessibility: enable smooth scrolling for anchor links ---------- */
(function smoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
})();

/* End of script.js */
