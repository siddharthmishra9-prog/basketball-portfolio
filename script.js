/* ============================================
   BASKETBALL CYBERPUNK — SCRIPT.JS
   ============================================ */

/* ============ CUSTOM CURSOR ============ */
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

// Cursor scale on interactive elements
document.querySelectorAll('a, button, .skill-card, .project-card, .achieve-card, .basketball').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    cursor.style.background = 'var(--neon-purple)';
    cursorTrail.style.borderColor = 'rgba(180,0,255,0.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursor.style.background = 'var(--neon-blue)';
    cursorTrail.style.borderColor = 'rgba(0,212,255,0.4)';
  });
});


/* ============ PARTICLE SYSTEM ============ */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const PARTICLE_COUNT = 80;
const particles = [];

class Particle {
  constructor() { this.reset(true); }

  reset(initial = false) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = -(Math.random() * 0.6 + 0.2);
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '0,212,255' : '180,0,255';
    this.twinkle = Math.random() * Math.PI * 2;
    this.twinkleSpeed = Math.random() * 0.04 + 0.01;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.twinkle += this.twinkleSpeed;
    this.opacity = (Math.sin(this.twinkle) * 0.3 + 0.3);
    if (this.y < -10) this.reset();
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = `rgba(${this.color}, 1)`;
    ctx.shadowBlur = 6;
    ctx.shadowColor = `rgba(${this.color}, 0.8)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Basketball-shaped particles (rare)
class BallParticle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 20;
    this.size = Math.random() * 6 + 4;
    this.speedY = -(Math.random() * 0.5 + 0.1);
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.15 + 0.05;
    this.rotation = 0;
    this.rotSpeed = (Math.random() - 0.5) * 0.05;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotSpeed;
    if (this.y < -20) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.strokeStyle = 'rgba(255,107,26,0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-this.size, 0);
    ctx.lineTo(this.size, 0);
    ctx.stroke();
    ctx.restore();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
for (let i = 0; i < 12; i++) particles.push(new BallParticle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw connection lines between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i], p2 = particles[j];
      if (!(p1 instanceof Particle) || !(p2 instanceof Particle)) continue;
      const dx = p1.x - p2.x, dy = p1.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 100) * 0.08;
        ctx.strokeStyle = 'rgba(0,212,255,1)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();


/* ============ MOUSE REPEL PARTICLES ============ */
document.addEventListener('mousemove', (e) => {
  particles.forEach(p => {
    if (!(p instanceof Particle)) return;
    const dx = p.x - e.clientX, dy = p.y - e.clientY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 80) {
      p.x += (dx / dist) * 2;
      p.y += (dy / dist) * 2;
    }
  });
});


/* ============ NAVBAR SCROLL ============ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
  navLinks.style.flexDirection = 'column';
  navLinks.style.position = 'absolute';
  navLinks.style.top = '100%';
  navLinks.style.left = '0';
  navLinks.style.right = '0';
  navLinks.style.background = 'rgba(3,8,16,0.98)';
  navLinks.style.padding = '1rem 2rem';
  navLinks.style.borderBottom = '1px solid rgba(0,212,255,0.15)';
});

// Smooth scroll nav links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    if (window.innerWidth <= 768) navLinks.style.display = 'none';
  });
});


/* ============ SCROLL REVEAL ============ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
        // Trigger skill bars when visible
        const bar = entry.target.querySelector('.skill-bar');
        if (bar) {
          setTimeout(() => {
            bar.style.width = bar.dataset.width + '%';
          }, 200);
        }
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ============ COUNTER ANIMATION ============ */
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start).toLocaleString();
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// Hero stat counters
const heroCounterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.h-num').forEach(el => {
        animateCounter(el, parseInt(el.dataset.count), 1500);
      });
      heroCounterObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroCounterObserver.observe(heroStats);


/* ============ BASKETBALL INTERACTION ============ */
const basketball = document.getElementById('basketball');
let isDragging = false;
let velX = 0, velY = 0;
let ballX = 0, ballY = 0;
let lastX = 0, lastY = 0;
let animFrame;

if (basketball) {
  basketball.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    basketball.style.animation = 'none';
    basketball.style.cursor = 'grabbing';
    cancelAnimationFrame(animFrame);
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    velX = dx;
    velY = dy;
    ballX += dx;
    ballY += dy;
    basketball.style.transform = `translate(${ballX}px, ${ballY}px) rotate(${ballX * 0.5}deg)`;
    lastX = e.clientX;
    lastY = e.clientY;
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    basketball.style.cursor = 'grab';
    throwBall();
  });
}

function throwBall() {
  const friction = 0.92;
  const bounce = -0.6;

  function physics() {
    velY += 0.8; // gravity
    velX *= friction;
    ballX += velX;
    ballY += velY;

    // Floor bounce
    if (ballY > 100) {
      ballY = 100;
      velY *= bounce;
      // Squish effect
      basketball.style.transform = `translate(${ballX}px, ${ballY}px) scale(1.15, 0.85)`;
      setTimeout(() => {
        basketball.style.transform = `translate(${ballX}px, ${ballY}px)`;
      }, 100);
    }

    // Wall bounce
    const rect = basketball.getBoundingClientRect();
    if (rect.left < 0) { ballX += 20; velX *= -1; }
    if (rect.right > window.innerWidth) { ballX -= 20; velX *= -1; }

    basketball.style.transform = `translate(${ballX}px, ${ballY}px) rotate(${ballX * 0.3}deg)`;

    if (Math.abs(velX) > 0.1 || Math.abs(velY) > 0.1 || ballY < 100) {
      animFrame = requestAnimationFrame(physics);
    } else {
      // Return to original position smoothly
      returnToOrigin();
    }
  }
  animFrame = requestAnimationFrame(physics);
}

function returnToOrigin() {
  const duration = 800;
  const startX = ballX, startY = ballY;
  const startTime = performance.now();

  function ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

  function animate(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const eased = ease(t);
    ballX = startX + (0 - startX) * eased;
    ballY = startY + (0 - startY) * eased;
    basketball.style.transform = `translate(${ballX}px, ${ballY}px)`;
    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      ballX = 0; ballY = 0;
      basketball.style.transform = '';
      basketball.style.animation = 'bounce 2s ease-in-out infinite, spin 8s linear infinite';
    }
  }
  requestAnimationFrame(animate);
}

// Click to bounce basketball
basketball && basketball.addEventListener('click', () => {
  basketball.style.animation = 'none';
  basketball.style.transform = 'scale(0.9)';
  setTimeout(() => {
    basketball.style.transform = 'scale(1.1)';
    setTimeout(() => {
      basketball.style.transform = '';
      basketball.style.animation = 'bounce 2s ease-in-out infinite, spin 8s linear infinite';
    }, 150);
  }, 100);

  // Spawn glow burst
  spawnGlowBurst();
});

function spawnGlowBurst() {
  const wrap = document.querySelector('.hero-ball-wrap');
  if (!wrap) return;
  const burst = document.createElement('div');
  burst.style.cssText = `
    position:absolute;width:200px;height:200px;border-radius:50%;
    border:2px solid rgba(0,212,255,0.6);
    top:50%;left:50%;transform:translate(-50%,-50%) scale(1);
    animation:burst 0.6s ease-out forwards;pointer-events:none;z-index:3;
  `;
  wrap.appendChild(burst);
  setTimeout(() => burst.remove(), 700);
}

// Inject burst keyframe
const burstStyle = document.createElement('style');
burstStyle.textContent = `
  @keyframes burst {
    0%   { transform: translate(-50%,-50%) scale(1); opacity: 1; }
    100% { transform: translate(-50%,-50%) scale(2.5); opacity: 0; }
  }
`;
document.head.appendChild(burstStyle);


/* ============ 3D CARD TILT ============ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -8;
    const rotY = ((x - cx) / cx) * 8;

    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-12px)`;

    // Move glow
    const glow = card.querySelector('.card-glow');
    if (glow) {
      glow.style.setProperty('--mx', (x / rect.width * 100) + '%');
      glow.style.setProperty('--my', (y / rect.height * 100) + '%');
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


/* ============ SKILL BARS ON SCROLL ============ */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar').forEach(bar => {
        setTimeout(() => {
          bar.style.width = bar.dataset.width + '%';
        }, 300);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillObserver.observe(skillsSection);


/* ============ NEON SCANLINE EFFECT ============ */
const scanline = document.createElement('div');
scanline.style.cssText = `
  position:fixed;top:0;left:0;right:0;bottom:0;
  pointer-events:none;z-index:50;
  background:repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.03) 2px,
    rgba(0,0,0,0.03) 4px
  );
`;
document.body.appendChild(scanline);


/* ============ NEON GLOW FLICKER ============ */
function flicker(el, color) {
  const original = el.style.textShadow;
  const flickers = [0.9, 1, 0.7, 1, 0.85, 1];
  flickers.forEach((v, i) => {
    setTimeout(() => {
      el.style.opacity = v;
    }, i * 40);
  });
  setTimeout(() => { el.style.opacity = 1; }, flickers.length * 40 + 100);
}

// Random flicker on neon elements
setInterval(() => {
  const accents = document.querySelectorAll('.accent');
  if (accents.length > 0 && Math.random() > 0.7) {
    const el = accents[Math.floor(Math.random() * accents.length)];
    flicker(el);
  }
}, 3000);


/* ============ PARALLAX ON SCROLL ============ */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Court bg parallax
  const courtBg = document.querySelector('.court-bg');
  if (courtBg) courtBg.style.transform = `translateY(${scrollY * 0.3}px)`;

  // Section labels parallax
  document.querySelectorAll('.section-label').forEach(el => {
    const rect = el.getBoundingClientRect();
    const offset = (rect.top / window.innerHeight - 0.5) * 20;
    el.style.transform = `translateX(${offset}px)`;
  });
});


/* ============ TYPING EFFECT FOR HERO ============ */
const heroSub = document.querySelector('.hero-sub');
if (heroSub) {
  const originalText = heroSub.innerHTML;
  heroSub.innerHTML = '';
  let charIndex = 0;
  const plainText = 'Full-Stack Developer & Basketball Enthusiast\nPlaying the game of code at championship level';

  setTimeout(() => {
    heroSub.style.opacity = 1;
    function typeChar() {
      if (charIndex < plainText.length) {
        if (plainText[charIndex] === '\n') {
          heroSub.innerHTML += '<br/>';
        } else {
          heroSub.innerHTML += plainText[charIndex];
        }
        charIndex++;
        setTimeout(typeChar, Math.random() * 40 + 20);
      }
    }
    typeChar();
  }, 1000);
}


/* ============ CONTACT FORM ============ */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;

    btn.textContent = 'SENDING...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✓ PASS RECEIVED!';
      btn.style.background = '#1D9E75';
      btn.style.opacity = '1';
      contactForm.reset();

      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1500);
  });
}


/* ============ ACHIEVEMENT CARDS HOVER SOUND (VISUAL) ============ */
document.querySelectorAll('.achieve-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = '0 0 30px rgba(0,212,255,0.2), 0 20px 40px rgba(0,0,0,0.4)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});


/* ============ ACTIVE NAV HIGHLIGHT ON SCROLL ============ */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) {
        active.style.color = 'var(--neon-blue)';
        active.style.textShadow = 'var(--glow-blue)';
      }
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObserver.observe(s));


/* ============ COURT LINES ANIMATION ============ */
const courtLines = document.querySelectorAll('.court-lines > div');
courtLines.forEach((line, i) => {
  line.style.transition = `opacity 1s ease ${i * 0.2}s`;
  line.style.opacity = '0';
  setTimeout(() => { line.style.opacity = '1'; }, 500 + i * 200);
});


/* ============ PAGE LOAD ANIMATION ============ */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.8s ease';
  setTimeout(() => { document.body.style.opacity = '1'; }, 100);

  // Stagger hero elements
  const heroEls = document.querySelectorAll('#hero .reveal');
  heroEls.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 300 + i * 150);
  });
});


/* ============ JERSEY CARD 3D TILT ============ */
const jerseyCard = document.querySelector('.jersey-card');
if (jerseyCard) {
  jerseyCard.addEventListener('mousemove', (e) => {
    const rect = jerseyCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    jerseyCard.style.transform = `perspective(600px) rotateY(${x * 20}deg) rotateX(${-y * 20}deg) translateY(-10px)`;
  });
  jerseyCard.addEventListener('mouseleave', () => {
    jerseyCard.style.transform = '';
  });
}


/* ============ SCROLL PROGRESS BAR ============ */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position:fixed;top:0;left:0;height:2px;
  background:linear-gradient(to right, var(--neon-blue), var(--neon-purple));
  z-index:200;width:0%;transition:width 0.1s linear;
  box-shadow: 0 0 8px var(--neon-blue);
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const total = document.body.scrollHeight - window.innerHeight;
  const progress = (window.scrollY / total) * 100;
  progressBar.style.width = progress + '%';
});


/* ============ TRAIL CLICK SPARKS ============ */
document.addEventListener('click', (e) => {
  for (let i = 0; i < 8; i++) {
    const spark = document.createElement('div');
    const angle = (i / 8) * Math.PI * 2;
    const distance = Math.random() * 60 + 20;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    spark.style.cssText = `
      position:fixed;
      left:${e.clientX}px;top:${e.clientY}px;
      width:4px;height:4px;border-radius:50%;
      background:${Math.random() > 0.5 ? 'var(--neon-blue)' : 'var(--neon-purple)'};
      pointer-events:none;z-index:9999;
      box-shadow: 0 0 6px currentColor;
      transition: transform 0.4s ease, opacity 0.4s ease;
    `;
    document.body.appendChild(spark);
    requestAnimationFrame(() => {
      spark.style.transform = `translate(${dx}px, ${dy}px)`;
      spark.style.opacity = '0';
    });
    setTimeout(() => spark.remove(), 450);
  }
});


/* ============ CONSOLE EASTER EGG ============ */
console.log(`%c
██████╗ ██╗      █████╗ ██╗   ██╗███████╗██████╗      ██████╗ ███╗   ██╗███████╗
██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗    ██╔═══██╗████╗  ██║██╔════╝
██████╔╝██║     ███████║ ╚████╔╝ █████╗  ██████╔╝    ██║   ██║██╔██╗ ██║█████╗
██╔═══╝ ██║     ██╔══██║  ╚██╔╝  ██╔══╝  ██╔══██╗    ██║   ██║██║╚██╗██║██╔══╝
██║     ███████╗██║  ██║   ██║   ███████╗██║  ██║    ╚██████╔╝██║ ╚████║███████╗
╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝     ╚═════╝ ╚═╝  ╚═══╝╚══════╝
`, 'color: #00d4ff; font-family: monospace;');
console.log('%c🏀 Welcome to the court. Built with ❤️ and JavaScript.', 'color: #b400ff; font-size: 14px;');
console.log('%c👀 Looking at the source? Respect. You\'re already thinking like a dev.', 'color: #ff6b1a; font-size: 12px;');
