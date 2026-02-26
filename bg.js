// bg.js – Kosmische Lichtkugel mit Strudel-Explosion (Weiß & Blau)
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width / 2, y: height / 2 };

const particles = [];
const START_COUNT = 20;   // Partikel am Anfang
const MAX_COUNT = 220;    // Gesamt

function rand(min, max) { return Math.random() * (max - min) + min; }

// Partikel erzeugen
function createParticles() {
  particles.length = 0;
  for (let i = 0; i < MAX_COUNT; i++) {
    const hues = [210, 220, 230, 240]; // Weiß-Blau
    const hue = hues[Math.floor(rand(0, hues.length))];
    particles.push({
      x: rand(0, width),
      y: rand(0, height),
      vx: rand(-0.3, 0.3),
      vy: rand(-0.3, 0.3),
      radius: rand(1.2, 3.2),
      alpha: i < START_COUNT ? rand(0.6, 1) : 0,
      active: i < START_COUNT,
      hue: hue,
      baseRadius: rand(1.2, 3.2)
    });
  }
}

let phase = 'float';
let timer = 0;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  center.x = width / 2;
  center.y = height / 2;
}
window.addEventListener('resize', resize);

// Hintergrund
function drawBackground() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);
}

// Partikel zeichnen
function drawParticles() {
  drawBackground();

  for (let p of particles) {
    if (!p.active) continue;

    // Leichter Pulsschlag der Partikel
    const radius = p.baseRadius + Math.sin(timer * 0.05) * 0.5;

    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 90%, 75%, ${p.alpha})`;
    ctx.shadowBlur = 15 + 10 * p.alpha;
    ctx.shadowColor = `hsla(${p.hue}, 90%, 75%, ${p.alpha})`;
    ctx.fill();

    if (phase === 'float') {
      p.vx += rand(-0.005, 0.005);
      p.vy += rand(-0.005, 0.005);
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }

    else if (phase === 'gather') {
      // Anziehung → Kugel
      const dx = center.x - p.x;
      const dy = center.y - p.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const pull = 0.03 + (dist/width)*0.02; // stärker wenn weiter weg
      p.x += dx * pull + Math.sin(timer * 0.01) * 0.5;
      p.y += dy * pull + Math.cos(timer * 0.01) * 0.5;
      p.alpha = Math.min(p.alpha + 0.01, 1);
    }

    else if (phase === 'explode') {
      // Strudelartige Explosion
      const dx = p.x - center.x;
      const dy = p.y - center.y;
      const angle = Math.atan2(dy, dx);
      const swirl = rand(0.12, 0.18);  // variabler Strudel
      const speed = rand(1.5, 3.5);
      p.x += Math.cos(angle + swirl) * speed + rand(-0.2, 0.2);
      p.y += Math.sin(angle + swirl) * speed + rand(-0.2, 0.2);
      p.alpha -= 0.002;

      if (p.alpha <= 0) {
        p.x = center.x + rand(-20, 20);
        p.y = center.y + rand(-20, 20);
        p.alpha = rand(0.6, 1);
        p.radius = p.baseRadius = rand(1.2, 3.2);
      }
    }
  }

  // Glow-Halo während Gathering/Explosion
  if (phase === 'gather' || phase === 'explode') {
    ctx.beginPath();
    ctx.arc(center.x, center.y, 80 + Math.sin(timer*0.03)*40, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// Aktivierung zusätzlicher Partikel
function activateMoreParticles() {
  particles.forEach(p => {
    if (!p.active) {
      p.active = true;
      // Direkt von der Mitte aus starten → Kugel entsteht
      const r = rand(0, 20);
      const angle = rand(0, Math.PI*2);
      p.x = center.x + Math.cos(angle)*r;
      p.y = center.y + Math.sin(angle)*r;
      p.alpha = rand(0.6, 1);
    }
  });
}

// Animation Loop
function animate() {
  drawParticles();
  requestAnimationFrame(animate);
  timer++;

  if (timer === 300) phase = 'gather';         // Partikel sammeln sich → Kugel
  if (timer === 900) {
    activateMoreParticles();                    // mehr Partikel fliegen in die Kugel
    phase = 'explode';                          // Kugel explodiert → Strudel
  }
  if (timer === 2000) {
    phase = 'float';                            // Partikel verteilen sich
    timer = 0;
  }
}

createParticles();
animate();
