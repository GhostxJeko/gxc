// bg.js – Weiß/Blau starker natürlicher Strudel (kein Kreis, kein Reset)

const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let centerX = width / 2;
let centerY = height / 2;

const particles = [];
const START_COUNT = 90;     // Mehr sichtbar am Anfang
const MAX_COUNT = 200;      // Viele im Strudel

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function createParticles() {
  particles.length = 0;

  for (let i = 0; i < MAX_COUNT; i++) {

    const hueOptions = [210, 220, 230, 240]; // nur blau/weiß
    const hue = hueOptions[Math.floor(rand(0, hueOptions.length))];

    particles.push({
      x: rand(0, width),
      y: rand(0, height),
      vx: rand(-0.2, 0.2),
      vy: rand(-0.2, 0.2),
      radius: rand(1.2, 2.4),
      alpha: i < START_COUNT ? rand(0.7, 1) : 0,
      active: i < START_COUNT,
      hue: hue
    });
  }
}

let phase = "float";
let timer = 0;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  centerX = width / 2;
  centerY = height / 2;
}

window.addEventListener("resize", resize);

function drawBackground() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);
}

function drawParticles() {

  drawBackground();

  particles.forEach(p => {

    if (!p.active) return;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 95%, 75%, ${p.alpha})`;
    ctx.shadowBlur = 22;
    ctx.shadowColor = `hsla(${p.hue}, 95%, 75%, ${p.alpha})`;
    ctx.fill();

    if (phase === "float") {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }

    if (phase === "gather") {
      p.x += (centerX - p.x) * 0.05;
      p.y += (centerY - p.y) * 0.05;
    }

    if (phase === "swirl") {

      const dx = p.x - centerX;
      const dy = p.y - centerY;

      const angle = Math.atan2(dy, dx);

      // Stärkerer Spiralimpuls
      const swirlStrength = 0.28;
      const outwardDrift = 1.8;

      p.x += Math.cos(angle + swirlStrength) * outwardDrift;
      p.y += Math.sin(angle + swirlStrength) * outwardDrift;

      // Natürliches Ausblenden wenn draußen
      if (p.x < -100 || p.x > width + 100 ||
          p.y < -100 || p.y > height + 100) {

        // Neustart zufällig irgendwo – NICHT in der Mitte
        p.x = rand(0, width);
        p.y = rand(0, height);
      }
    }

  });
}

function activateMoreParticles() {
  particles.forEach(p => {
    if (!p.active) {
      p.active = true;
      p.alpha = rand(0.7, 1);
    }
  });
}

function animate() {

  drawParticles();
  requestAnimationFrame(animate);

  timer++;

  if (timer === 350) phase = "gather";

  if (timer === 600) {
    activateMoreParticles();
    phase = "swirl";
  }

  if (timer === 1700) {
    phase = "float";
    timer = 0;
  }
}

createParticles();
animate();
