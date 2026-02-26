// bg.js – Professionelle Partikelanimation: sanft schweben, sammeln, expandieren
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const center = { x: width/2, y: height/2 };
const particles = [];
const particleCount = 300;

function random(min,max){return Math.random()*(max-min)+min;}

// Partikel erstellen
function createParticles(){
  particles.length = 0;
  for(let i=0;i<particleCount;i++){
    particles.push({
      x: random(0,width),
      y: random(0,height),
      vx: random(-0.3,0.3),
      vy: random(-0.3,0.3),
      radius: random(1.5,3),
      alpha: random(0.4,1),
      decay: random(0.001,0.004),
      color: `rgba(255,${Math.floor(random(140,255))},0,`
    });
  }
}

// Animation-Phasen
let phase = 'float'; // float -> gather -> explode
let timer = 0;

// Hintergrund zeichnen
function drawBackground(){
  ctx.fillStyle = '#000'; // Dunkles Universum
  ctx.fillRect(0,0,width,height);

  // Kleine Sterne zufällig
  for(let i=0;i<3;i++){
    const sx = random(0,width);
    const sy = random(0,height);
    const sr = random(0.3,1.2);
    const sa = random(0.2,0.6);
    ctx.beginPath();
    ctx.arc(sx,sy,sr,0,Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${sa})`;
    ctx.fill();
  }
}

// Partikel bewegen & zeichnen
function drawParticles(){
  for(let p of particles){
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.shadowBlur = 20 + 15*p.alpha;
    ctx.shadowColor = '#ff7f00';
    ctx.fill();

    // Bewegung je nach Phase
    if(phase==='float'){
      p.x += p.vx;
      p.y += p.vy;

      if(p.x<0||p.x>width)p.vx*=-1;
      if(p.y<0||p.y>height)p.vy*=-1;
    } 
    else if(phase==='gather'){
      // Kreismittelpunkt: alle Partikel bewegen sich langsam in die Mitte
      const dx = center.x - p.x;
      const dy = center.y - p.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      p.x += dx*0.02;
      p.y += dy*0.02;

      // Alpha erhöhen beim Sammeln für Aufleuchten
      p.alpha = Math.min(p.alpha + 0.01,1);
    } 
    else if(phase==='explode'){
      // Explosion nach außen
      const angle = Math.atan2(p.y - center.y, p.x - center.x);
      const speed = 0.5 + Math.random()*1.5;
      p.x += Math.cos(angle)*speed;
      p.y += Math.sin(angle)*speed;
      p.alpha -= p.decay;

      if(p.alpha<=0.1){
        // Partikel neu am Rand positionieren
        const rad = random(width/2, width);
        const ang = random(0,Math.PI*2);
        p.x = center.x + Math.cos(ang)*rad;
        p.y = center.y + Math.sin(ang)*rad;
        p.alpha = random(0.4,1);
        p.radius = random(1.5,3);
        p.vx = random(-0.3,0.3);
        p.vy = random(-0.3,0.3);
      }
    }
  }
}

// Animation Loop
function animate(){
  drawBackground();
  drawParticles();
  requestAnimationFrame(animate);
  timer++;

  // Steuerung Phasen für smoothes Verhalten
  if(timer%1200===0) phase='gather';      // Partikel sammeln
  if(timer%1200===400) phase='explode';   // langsam auseinander
  if(timer%1200===800) phase='float';     // wieder frei schweben
}

// Resize
window.addEventListener('resize',()=>{
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  center.x = width/2;
  center.y = height/2;
});

// Start
createParticles();
animate();
