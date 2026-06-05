// =====================
// CUSTOM CURSOR
// =====================

const cursor = document.getElementById("cursor");
const cursorTrail = document.getElementById("cursorTrail");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";

  cursorTrail.style.left = e.clientX + "px";
  cursorTrail.style.top = e.clientY + "px";
});

// =====================
// PARTICLES
// =====================

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const particles = [];

for (let i = 0; i < 120; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    dx: (Math.random() - 0.5) * 0.6,
    dy: (Math.random() - 0.5) * 0.6
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "#00d4ff";
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();

// =====================
// REVEAL ANIMATION
// =====================

const reveals = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.15
  }
);

reveals.forEach((item) => revealObserver.observe(item));

// =====================
// COUNTERS
// =====================

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const counter = entry.target;
    const target = +counter.dataset.target;

    let current = 0;
    const increment = target / 100;

    const updateCounter = () => {
      current += increment;

      if (current < target) {
        counter.innerText = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.innerText = target;
      }
    };

    updateCounter();

    counterObserver.unobserve(counter);
  });
});

counters.forEach((counter) => {
  counterObserver.observe(counter);
});

// =====================
// HERO STATS COUNTER
// =====================

document.querySelectorAll(".h-num").forEach((num) => {
  const target = parseInt(num.dataset.count);

  if (!target) return;

  let count = 0;

  const update = () => {
    count++;

    num.textContent = count;

    if (count < target) {
      requestAnimationFrame(update);
    }
  };

  update();
});

// =====================
// SKILL BARS
// =====================

const skillBars = document.querySelectorAll(".skill-bar");

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      bar.style.width = bar.dataset.width + "%";
    }
  });
});

skillBars.forEach((bar) => {
  skillObserver.observe(bar);
});

// =====================
// NAVBAR SCROLL
// =====================

const nav = document.getElementById("nav");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

// =====================
// PROJECT CARD GLOW
// =====================

document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);
  });
});

// =====================
// BASKETBALL CLICK
// =====================

const basketball = document.getElementById("basketball");

if (basketball) {
  basketball.addEventListener("click", () => {
    basketball.style.transform = "scale(1.2) rotate(360deg)";

    setTimeout(() => {
      basketball.style.transform = "";
    }, 600);
  });
}

// =====================
// CONTACT FORM
// =====================

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    alert("🏀 Message sent successfully!");
    contactForm.reset();
  });
}