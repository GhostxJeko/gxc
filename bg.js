// bg.js – Ultra-realistische Partikel im Universum mit Glow & Explosion
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Zentrum
const center = { x: width / 2, y: height / 2 };

// Partikel
const particles = [];
const particleCount = 100; // Weniger, damit es realistisch wirkt

function random(min, max) { return Math.random() * (max - min) + min; }

// Partikel erzeugen
function createParticles() {
  particles.length = 0;
  for (let i = 0; i < particleCount; i++) {
    const hue = random(45, 55); // warme Lichtfarbe
    particles.push({
      x: random(0, width),
      y: random(0, height),
      vx: random(-0.1, 0.1),
      vy: random(-0.1, 0.1),
      radius: random(1.5, 3.5),
      alpha: random(0.5, 1),
      decay: random(0.001, 0.003),
      color: `hsla(${hue},100%,70%,`
    });
  }
}

// Hintergrund
function drawBackground() {
  // Dunkel + leicht transparent für Trails
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.fillRect(0, 0, width, height);

  // Sanfte Nebel-Lichter (Glow-Effekt)
  for (let i = 0; i < 4; i++) {
    const lx = random(0, width);
    const ly = random(0, height);
    const lr = random(60, 150);
    const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, lr);
    grad.addColorStop(0, 'rgba(255,180,120,0.03)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(lx, ly, lr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Sterne
  for (let i = 0; i < 3; i++) {
    const sx = random(0, width);
    const sy = random(0, height);
    const sr = random(0.4, 1.2);
    const sa = random(0.3, 0.7);
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${sa})`;
    ctx.fill();
  }
}

// Partikel zeichnen & bewegen
function drawParticles() {
  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.shadowBlur = 20 + 15 * p.alpha;
    ctx.shadowColor = 'hsla(45,100%,80%,' + p.alpha + ')';
    ctx.fill();

    // Phase-basiertes Verhalten
    if (phase === 'float') {
      // sanftes Schweben
      p.vx += random(-0.01, 0.01);
      p.vy += random(-0.01, 0.01);
      p.x += p.vx;
      p.y += p.vy;
    } 
    else if (phase === 'gather') {
      // Zusammenziehen
      p.x += (center.x - p.x) * 0.04;
      p.y += (center.y - p.y) * 0.04;
      p.alpha = Math.min(p.alpha + 0.015, 1);
    } 
    else if (phase === 'explode') {
      // Explosion nach außen
      const angle = Math.atan2(p.y - center.y, p.x - center.x);
      const speed = random(2, 4);
      p.x += Math.cos(angle) * speed + random(-0.5,0.5);
      p.y += Math.sin(angle) * speed + random(-0.5,0.5);
      p.alpha -= p.decay * 2;

      if (p.alpha <= 0) {
        // Neu-Spawn am Rand für realistische Wirkung
        const a = random(0, Math.PI * 2);
        const r = random(width / 2, width 
