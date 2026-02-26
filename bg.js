// bg.js – Glühende Partikel im Weltall, kreisförmiges Sammeln & Explosion
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

let width, height;
function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const particles = [];
const particleCount = 250; // etwas mehr für Dichte

// Mittelpunkt
const center = { x: () => width / 2, y: () => height / 2 };

// Zufallsfunktion
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Partikel erzeugen
function createParticles() {
  particles.length = 0;
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2; // gleichmäßige Verteilung im Kreis
    const radius = random(50, Math.max(width, height)/2); // Start in größerem Radius
    particles.push({
      x: center.x() + radius * Math.cos(angle),
      y: center.y() + radius * Math.sin(angle),
      vx: random(-0.2, 0.2),
      vy: random(-0.2, 0.2),
      radius: random(1, 3),
      alpha: random(0.3, 1),
      decay: random(0.0005, 0.0015),
      baseAngle: angle,
      baseRadius: radius
    });
  }
}
createParticles();

let phase = "float";
let phaseTimer = 0;

// Hintergrund als Universum
function drawBackground() {
  // tiefer Schwarzton + leichte Farbvariationen für Universumsgefühl
  ctx.fillStyle = "#010010";
  ctx.fillRect(0, 0, width, height);

  // zufällige Sternenpunkte
  for (let i = 0; i < 2; i++) {
    const starX = Math.random() * width;
    const starY = Math.random() * height;
    const starRadius = Math.random() * 1.5;
    ctx.beginPath();
    ctx.arc(starX, starY, starRadius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255," + Math.random() + ")";
    ctx.fill();
  }
}

// Partikel zeichnen und bewegen
function drawParticles() {
  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,${Math.floor(random(140,200))},0,${p.alpha})`;
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#ff7f00";
    ctx.fill();

    if (phase === "float") {
      p.x += p.vx;
      p.y += p.vy;
      // Grenzen
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }
    else if (phase === "gather") {
      // kreisförmiges Zusammenziehen
      const dx = center.x() - p.x;
      const dy = center.y() - p.y;
      const distance = Math.sqrt(dx*dx + dy*dy);
      const angle = Math.atan2(dy, dx);

      // sanft in Richtung Kreisradius bewegen
      const targetRadius = 50 + Math.random()*20; // kleine Variation
      p.x += Math.cos(angle) * distance * 0.02;
      p.y += Math.sin(angle) * distance * 0.02;
    }
    else if (phase === "explode") {
      // Explosion nach außen
      const angle = Math.random() * Math.PI * 2;
      const speed = random(1.5, 3);
      p.x += Math.cos(angle) * speed;
      p.y += Math.sin(angle) * speed;
      p.alpha -= p.decay*2;
      if (p.alpha <= 0) {
        // Reset zu Randposition
        const startAngle = Math.random() * Math.PI * 2;
        const startRadius = random(100, Math.max(width, height)/2);
        p.x = center.x() + startRadius * Math.cos(startAngle);
        p.y = center.y() + startRadius * Math.sin(startAngle);
        p.alpha = random(0.4, 1);
        p.decay = random(0.0005, 0.0015);
      }
    }
  }
}

// Hauptanimation
function animate() {
  drawBackground();
  drawParticles();

  phaseTimer++;
  if (phaseTimer === 800) phase = "gather";      // langsamere Phasen
  if (phaseTimer === 1200) phase = "explode";
  if (phaseTimer === 2000) {
    phase = "float";
    phaseTimer = 0;
  }

  requestAnimationFrame(animate);
}

animate();
