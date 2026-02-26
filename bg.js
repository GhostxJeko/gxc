// bg.js – Realistische Partikel im Universum
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const center = { x: width/2, y: height/2 };
const particles = [];
const particleCount = 100; // realistisch und sichtbar

function random(min,max){return Math.random()*(max-min)+min;}

// Partikel erzeugen
function createParticles(){
  particles.length = 0;
  for(let i=0;i<particleCount;i++){
    particles.push({
      x: random(0,width),
      y: random(0,height),
      vx: random(-0.05,0.05),
      vy: random(-0.05,0.05),
      radius: random(1.8,3),
      alpha: random(0.7,1),
      color: `rgba(255,255,255,`
    });
  }
}

// Schwarzer Hintergrund + Sterne
function drawBackground(){
  ctx.fillStyle = '#000'; // Schwarz
  ctx.fillRect(0,0,width,height);

  // Sterne
  for(let i=0;i<5;i++){
    const sx=random(0,width);
    const sy=random(0,height);
    const sr=random(0.4,1.5);
    const sa=random(0.3,0.8);
    ctx.beginPath();
    ctx.arc(sx,sy,sr,0,Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${sa})`;
    ctx.fill();
  }
}

let phase='float';
let timer=0;

// Partikel bewegen & zeichnen
function drawParticles(){
  for(let p of particles){
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.fill();

    if(phase==='float'){
      p.vx += random(-0.01,0.01);
      p.vy += random(-0.01,0.01);
      p.x += p.vx;
      p.y += p.vy;
      if(p.x<0||p.x>width)p.vx*=-1;
      if(p.y<0||p.y>height)p.vy*=-1;
    }
    else if(phase==='gather'){
      p.x += (center.x - p.x)*0.03;
      p.y += (center.y - p.y)*0.03;
      p.alpha = Math.min(p.alpha+0.02,1);
    }
    else if(phase==='explode'){
      const angle = Math.atan2(p.y-center.y,p.x-center.x);
      const speed = random(1.5,3);
      p.x += Math.cos(angle)*speed + random(-0.3,0.3);
      p.y += Math.sin(angle)*speed + random(-0.3,0.3);
      p.alpha -= 0.005;
      if(p.alpha<=0){
        const a=random(0,Math.PI*2);
        const r=random(width/2,width);
        p.x=center.x+Math.cos(a)*r;
        p.y=center.y+Math.sin(a)*r;
        p.alpha=random(0.7,1);
        p.radius=random(1.8,3);
      }
    }
  }
}

// Animation
function animate(){
  drawBackground();
  drawParticles();
  requestAnimationFrame(animate);
  timer++;
  if(timer%1800===0) phase='gather';
  if(timer%1800===800) phase='explode';
  if(timer%1800===1400) phase='float';
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
