// bg.js – Professionelle Partikel im Universum, dynamisch und realistisch
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Mittelpunkt
const center = { x: width / 2, y: height / 2 };

// Realistische Partikel
const particles = [];
const particleCount = 120; // weniger, damit es professionell wirkt

function random(min, max) { return Math.random() * (max - min) + min; }

// Partikel erzeugen
function createParticles() {
  particles.length = 0;
  for(let i=0;i<particleCount;i++){
    const angle = random(0, Math.PI * 2);
    const radius = random(50, Math.max(width, height)/2); 
    particles.push({
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius,
      vx: random(-0.1,0.1),
      vy: random(-0.1,0.1),
      radius: random(1.5,3),
      alpha: random(0.4,0.9),
      decay: random(0.001,0.004),
      color: `rgba(${Math.floor(random(200,255))},${Math.floor(random(180,230))},${Math.floor(random(100,160))},`
    });
  }
}

// Hintergrund wie Universum
function drawBackground() {
  ctx.fillStyle = '#000'; // komplett dunkel
  ctx.fillRect(0,0,width,height);

  // leichte Nebel/Lichtpunkte für Bewegung
  for(let i=0;i<4;i++){
    const lx = random(0,width);
    const ly = random(0,height);
    const lr = random(80,200);
    const grad = ctx.createRadialGradient(lx,ly,0,lx,ly,lr);
    grad.addColorStop(0, `rgba(255,180,100,0.02)`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(lx,ly,lr,0,Math.PI*2);
    ctx.fill();
  }

  // vereinzelte Sterne
  for(let i=0;i<3;i++){
    const sx = random(0,width);
    const sy = random(0,height);
    const sr = random(0.5,1.2);
    const sa = random(0.2,0.6);
    ctx.beginPath();
    ctx.arc(sx,sy,sr,0,Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${sa})`;
    ctx.fill();
  }
}

// Partikel bewegen
function drawParticles() {
  for(let p of particles){
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.shadowBlur = 20*p.alpha;
    ctx.shadowColor = p.color + p.alpha + ')';
    ctx.fill();

    // Phasenbewegung
    if(phase==='float'){
      p.vx += random(-0.01,0.01);
      p.vy += random(-0.01,0.01);
      p.x += p.vx;
      p.y += p.vy;
    } 
    else if(phase==='gather'){
      p.x += (center.x - p.x) * 0.03;
      p.y += (center.y - p.y) * 0.03;
      p.alpha = Math.min(p.alpha + 0.005,1);
    } 
    else if(phase==='explode'){
      const dx = p.x - center.x;
      const dy = p.y - center.y;
      const dist = Math.sqrt(dx*dx + dy*dy) + 0.1;
      const force = 0.07; // sanft
      p.x += dx/dist*force*dist + random(-0.5,0.5);
      p.y += dy/dist*force*dist + random(-0.5,0.5);
      p.alpha -= p.decay;
      if(p.alpha <= 0.05){
        // Reset zufällig im Raum
        const angle = random(0,Math.PI*2);
        const radius = random(50,Math.max(width,height)/2);
        p.x = center.x + Math.cos(angle)*radius;
        p.y = center.y + Math.sin(angle)*radius;
        p.alpha = random(0.4,0.9);
        p.radius = random(1.5,3);
        p.vx = random(-0.1,0.1);
        p.vy = random(-0.1,0.1);
      }
    }
  }
}

// Animation
let phase = 'float';
let timer = 0;
function animate(){
  drawBackground();
  drawParticles();
  requestAnimationFrame(animate);
  timer++;

  if(timer%900===0) phase='gather';
  if(timer%900===300) phase='explode';
  if(timer%900===600) phase='float';
}

// Resize
window.addEventListener('resize',()=>{
  width=canvas.width=window.innerWidth;
  height=canvas.height=window.innerHeight;
  center.x = width/2;
  center.y = height/2;
});

// Start
createParticles();
animate();
