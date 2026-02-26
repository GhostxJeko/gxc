// bg.js – Kosmischer Partikel-Ball mit sanftem Strudel (weiß & blau)
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width/2, y: height/2 };

const particles = [];
const particleCount = 250; // mehr Partikel für sanfte Wirkung

function random(min, max) { return Math.random() * (max - min) + min; }

// Partikel erzeugen – kugelförmig um die Mitte
function createParticles() {
  particles.length = 0;
  for (let i = 0; i < particleCount; i++) {
    const angle = random(0, Math.PI*2);
    const radius = random(0, Math.min(width, height)/3); // kugelförmig
    const hues = [210, 220, 230, 240]; // Weiß-Blau
    const hue = hues[Math.floor(random(0, hues.length))];
    const sat = random(60, 100);
    const light = random(80, 100);
    particles.push({
      x: center.x + Math.cos(angle)*radius,
      y: center.y + Math.sin(angle)*radius,
      vx: 0,
      vy: 0,
      radius: random(1.5,3),
      alpha: random(0.6,1),
      decay: random(0.001,0.002),
      color: `hsla(${hue},${sat}%,${light}%,`
    });
  }
}

let phase = 'float';
let timer = 0;
let lastTime = performance.now();

function drawBackground() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,width,height);
}

function drawParticles(delta) {
  drawBackground();

  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.shadowBlur = 12 + 8*p.alpha;
    ctx.shadowColor = 'rgba(255,255,255,' + p.alpha + ')';
    ctx.fill();

    if (phase === 'float') {
      // sanftes kosmisches Schweben
      p.vx += random(-0.004,0.004)*delta;
      p.vy += random(-0.004,0.004)*delta;
      p.x += p.vx*delta + (center.x - p.x)*0.0005*delta; // kleine Anziehung
      p.y += p.vy*delta + (center.y - p.y)*0.0005*delta;
    } else if (phase === 'gather') {
      // Partikel leicht zur Mitte ziehen
      p.x += (center.x - p.x) * 0.02 * delta;
      p.y += (center.y - p.y) * 0.02 * delta;
      p.alpha = Math.min(p.alpha + 0.005*delta, 1);
    } else if (phase === 'swirl') {
      // sanfter Strudel
      const dx = p.x - center.x;
      const dy = p.y - center.y;
      const angle = Math.atan2(dy, dx);
      const swirlStrength = 0.02 * delta; // leicht rotierend
      const speed = 0.8 * delta + random(0,0.5)*delta;
      p.x += Math.cos(angle + swirlStrength)*speed;
      p.y += Math.sin(angle + swirlStrength)*speed;
      p.alpha -= p.decay*0.5*delta; // langsamer Alpha-Verlust

      if(p.alpha <= 0){
        // Partikel wieder sanft in die Kugel zurücksetzen
        const a = random(0, Math.PI*2);
        const r = random(0, Math.min(width,height)/3);
        p.x = center.x + Math.cos(a)*r;
        p.y = center.y + Math.sin(a)*r;
        p.alpha = random(0.6,1);
        p.radius = random(1.5,3);
      }
    }
  }
}

function animate(now = performance.now()){
  const delta = (now - lastTime)/16.666; // 60fps Referenz
  lastTime = now;

  drawParticles(delta);
  requestAnimationFrame(animate);

  timer += delta;
  if(timer >= 1500){ phase='gather'; timer=0; }
  if(timer >= 500 && phase!=='swirl') phase='swirl';
  if(timer >= 1000 && phase!=='float') phase='float';
}

window.addEventListener('resize', ()=>{
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  center.x = width/2;
  center.y = height/2;
});

createParticles();
animate();
