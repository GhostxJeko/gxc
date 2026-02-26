// bg.js – Ultimativer Partikel-Strudel-Tunnel mit Glow & Spiral
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width / 2, y: height / 2 };

const particles = [];
const particleCount = 180; // realistisch, nicht zu überladen
const layers = 3; // für Tiefen-Parallax

function random(min, max) { return Math.random() * (max - min) + min; }

function createParticles() {
  particles.length = 0;
  for (let i = 0; i < particleCount; i++) {
    const layer = Math.floor(random(1, layers + 1));
    particles.push({
      x: random(0, width),
      y: random(0, height),
      vx: 0,
      vy: 0,
      radius: random(1.5, 3) * layer,
      alpha: random(0.5, 1),
      decay: random(0.001, 0.003),
      layer: layer,
      // Anfangsfarbe Weiß-Blau
      color: `hsla(${[210,240,180][Math.floor(random(0,3))]},${random(60,100)}%,${random(70,100)}%,`
    });
  }
}

let phase = 'float';
let timer = 0;

function drawBackground() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
}

function drawParticles() {
  drawBackground();

  // Hintergrundsterne für Tiefenwirkung
  for (let i = 0; i < 6; i++) {
    const sx = random(0, width);
    const sy = random(0, height);
    const sr = random(0.3, 1.2);
    const sa = random(0.2, 0.5);
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${sa})`;
    ctx.fill();
  }

  // Partikel
  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.shadowBlur = 20 + 15 * p.alpha;
    ctx.shadowColor = p.color + p.alpha + ')';
    ctx.fill();

    if (phase === 'float') {
      p.vx += random(-0.005,0.005);
      p.vy += random(-0.005,0.005);
      p.x += p.vx;
      p.y += p.vy;
    } else if (phase === 'gather') {
      // Starker Spiral-Strudel zur Mitte
      const dx = center.x - p.x;
      const dy = center.y - p.y;
      const angle = Math.atan2(dy, dx);
      const swirl = 0.15; // Spiralstärke
      const speed = 2 * (0.5 + p.layer/3); // Layer-Geschwindigkeit
      p.x += Math.cos(angle + swirl) * speed;
      p.y += Math.sin(angle + swirl) * speed;

      p.alpha = Math.min(p.alpha + 0.01, 1);
    } else if (phase === 'explode') {
      const dx = p.x - center.x;
      const dy = p.y - center.y;
      const angle = Math.atan2(dy, dx);
      const swirl = 0.08; // Explosion-Strudel
      const speed = random(1.5, 3) * (0.5 + p.layer/3);
      p.x += Math.cos(angle + swirl) * speed + random(-0.3,0.3);
      p.y += Math.sin(angle + swirl) * speed + random(-0.3,0.3);
      p.alpha -= p.decay * 1.5;

      if (p.alpha <= 0) {
        const a = random(0, Math.PI*2);
        const r = random(width/3, width/2);
        p.x = center.x + Math.cos(a)*r;
        p.y = center.y + Math.sin(a)*r;
        p.alpha = random(0.5,1);
        p.radius = random(1.5,3);

        // Neue Farben für Strudel-Explosion: Weiß, Blau, Rot, Gelb
        const hues = [0, 60, 210, 240];
        const hue = hues[Math.floor(random(0, hues.length))];
        const sat = random(60,100);
        const light = random(70,100);
        p.color = `hsla(${hue},${sat}%,${light}%,`;
      }
    }

    if (phase === 'float') {
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }
  }

  // Glühende Linien zwischen nahen Partikeln (optional)
  for (let i=0; i<particles.length; i++) {
    for (let j=i+1; j<particles.length; j++) {
      const dx = particles[j].x - particles[i].x;
      const dy = particles[j].y - particles[i].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < 50) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(255,255,255,${0.05})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  drawParticles();
  requestAnimationFrame(animate);
  timer++;

  if(timer % 1500 === 0) phase='gather';
  if(timer % 1500 === 500) phase='explode';
  if(timer % 1500 === 1000) phase='float';
}

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  center.x = width/2;
  center.y = height/2;
});

createParticles();
animate();
