// bg.js – Smooth Space Animation (Professional Version)

const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const particles = [];
const particleCount = 220;

function random(min,max){return Math.random()*(max-min)+min;}

// Mittelpunkt dynamisch
let center = { x: width/2, y: height/2 };

// Partikel erzeugen
function createParticles(){
  particles.length = 0;
  for(let i=0;i<particleCount;i++){
    particles.push({
      x: random(0,width),
      y: random(0,height),
      vx: random(-0.2,0.2), // langsamer
      vy: random(-0.2,0.2),
      radius: random(1,2.5),
      alpha: random(0.5,1),
      decay: random(0.0008,0.002), // langsamere Explosion
      color: `rgba(255,${Math.floor(random(140,255))},0,`
    });
  }
}

// Animation-Zustände
let phase = 'float';
let timer = 0;

// Zeichnen
function drawParticles(){

  // Tiefer schwarzer Hintergrund mit weichem Fade
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);

  for(let p of particles){

    ctx.beginPath();
    ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
    ctx.fillStyle = p.color + p.alpha + ')';

    // stärkerer Glow
    ctx.shadowBlur = 25;
    ctx.shadowColor = 'rgba(255,120,0,0.9)';
    ctx.fill();

    // FLOAT (sanft)
    if(phase==='float'){
      p.x += p.vx;
      p.y += p.vy;

      if(p.x<0||p.x>width)p.vx*=-1;
      if(p.y<0||p.y>height)p.vy*=-1;
    }

    // GATHER (weicher Magnet-Effekt)
    else if(phase==='gather'){
      p.x += (center.x - p.x)*0.015;
      p.y += (center.y - p.y)*0.015;
    }

    // EXPLODE (langsam & episch)
    else if(phase==='explode'){
      p.x += p.vx*1.5;
      p.y += p.vy*1.5;
      p.alpha -= p.decay;

      if(p.alpha<=0.1){
        p.x = center.x;
        p.y = center.y;
        p.alpha = random(0.6,1);
      }
    }
  }
}

// Animation Loop
function animate(){
  drawParticles();
  requestAnimationFrame(animate);

  timer++;

  if(timer===600) phase='gather';     // sammeln
  if(timer===1000) phase='explode';  // langsam explodieren
  if(timer===1600){                  // zurück zu float
    phase='float';
    timer=0;
  }
}

// Resize
window.addEventListener('resize',()=>{
  width=canvas.width=window.innerWidth;
  height=canvas.height=window.innerHeight;
  center.x=width/2;
  center.y=height/2;
});

// Start
createParticles();
animate();
