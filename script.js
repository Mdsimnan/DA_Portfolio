// ===== Sidebar Toggle =====
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuIcon = document.getElementById('menuIcon');
const closeIcon = document.getElementById('closeIcon');

function toggleMenu() {
  const isOpen = sidebar.classList.toggle('open');
  overlay.classList.toggle('active', isOpen);
  menuIcon.classList.toggle('hidden', isOpen);
  closeIcon.classList.toggle('hidden', !isOpen);
}
menuToggle.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

// ===== Theme Toggle =====
const themeToggle = document.getElementById('themeToggle');
const moonIcon = document.getElementById('moonIcon');
const sunIcon = document.getElementById('sunIcon');
let isDark = true;

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.classList.toggle('light', !isDark);
  moonIcon.classList.toggle('hidden', !isDark);
  sunIcon.classList.toggle('hidden', isDark);
});

// ===== Smooth Scroll & Active Nav =====
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const id = item.getAttribute('data-section');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    if (sidebar.classList.contains('open')) toggleMenu();
  });
});

// Active section highlighting
const sections = document.querySelectorAll('section[id]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(n => n.classList.remove('active'));
      const active = document.querySelector(`.nav-item[data-section="${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.3 });
sections.forEach(s => observer.observe(s));

// ===== Particle Background =====
(function() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  const CONNECTION_DISTANCE = 150;
  const PARTICLE_COUNT = 80;
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 1.5 + 0.5,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isLight = document.documentElement.classList.contains('light');
    const dotColor = isLight ? 'rgba(0,150,130,0.5)' : 'rgba(55,226,255,0.5)';
    const lineColor = isLight ? 'rgba(0,150,130,0.15)' : 'rgba(55,226,255,0.15)';

    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.fillStyle = dotColor;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DISTANCE) {
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  resize(); createParticles(); draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
})();

// ===== Custom Cursor Trail =====
(function() {
  if ('ontouchstart' in window) return;
  const canvas = document.getElementById('cursorCanvas');
  const ctx = canvas.getContext('2d');
  const mouse = { x: -100, y: -100 };
  const current = { x: -100, y: -100 };
  const trail = [];

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }

  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    current.x += (mouse.x - current.x) * 0.15;
    current.y += (mouse.y - current.y) * 0.15;
    trail.push({ x: current.x, y: current.y, size: 2 });
    if (trail.length > 25) trail.shift();

    for (let i = 0; i < trail.length; i++) {
      const p = trail[i];
      ctx.fillStyle = '#37e2ff';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
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

  resize(); animate();
  window.addEventListener('resize', resize);
})();
