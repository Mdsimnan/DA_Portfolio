// ========== Sidebar Toggle ==========
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuIcon = document.getElementById('menuIcon');
const closeIcon = document.getElementById('closeIcon');

function toggleMenu() {
  const isOpen = sidebar.classList.toggle('open');
  overlay.classList.toggle('active', isOpen);
  menuIcon.style.display = isOpen ? 'none' : 'block';
  closeIcon.style.display = isOpen ? 'block' : 'none';
}

menuToggle.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

// ========== Theme Toggle ==========
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');

themeToggle.addEventListener('click', () => {
  const html = document.documentElement;
  const isDark = html.classList.contains('dark');
  html.classList.toggle('dark', !isDark);
  html.classList.toggle('light', isDark);
  sunIcon.style.display = isDark ? 'none' : 'block';
  moonIcon.style.display = isDark ? 'block' : 'none';
});

// ========== Navigation ==========
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const section = item.dataset.section;
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    if (sidebar.classList.contains('open')) toggleMenu();
  });
});

// Active section on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    const top = s.offsetTop - 200;
    if (window.scrollY >= top) current = s.id;
  });
  navItems.forEach(n => {
    n.classList.toggle('active', n.dataset.section === current);
  });
});

// ========== Particle Background ==========
(function() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const COUNT = 80;
  const DIST = 150;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createParticles();
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isLight = document.documentElement.classList.contains('light');
    const dotColor = isLight ? 'hsla(170,80%,35%,0.5)' : 'hsla(170,100%,50%,0.6)';
    const lineBase = isLight ? '170,80%,35%' : '170,100%,50%';

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x, dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < DIST) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `hsla(${lineBase},${(isLight ? 0.1 : 0.15) * (1 - dist / DIST)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
})();

// ========== Custom Cursor Trail ==========
(function() {
  if ('ontouchstart' in window) return;

  const canvas = document.getElementById('cursorCanvas');
  const ctx = canvas.getContext('2d');
  const mouse = { x: -100, y: -100 };
  const current = { x: -100, y: -100 };
  const trail = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    current.x += (mouse.x - current.x) * 0.15;
    current.y += (mouse.y - current.y) * 0.15;

    trail.push({ x: current.x, y: current.y, size: 2 });
    if (trail.length > 25) trail.shift();

    for (let i = 0; i < trail.length; i++) {
      const p = trail[i];
      ctx.fillStyle = '#37e2ff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      if (i > 0) {
        ctx.strokeStyle = 'rgba(55,226,255,0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    }
    requestAnimationFrame(animate);
  }

  resize();
  animate();
  window.addEventListener('resize', resize);
})();
