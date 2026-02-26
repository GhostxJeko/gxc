// bg.js – Realistische Partikel im Universum, richtig schwarz
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const center = { x: width/2, y: height/2 };
const particles = [];
const particleCount = 80;

function random(min,max){return Math.random()*(max-min)+min;}

// Partikel erzeugen
function createParticles(){
  particles.length = 0;
  for(let i=0;i<particleCount;i++){
    const hue = random(40,60); // warmes Lichtgelb
    particles.push({
      x: random(0,width),
      y: random(0,height),
      vx: random(-0.1,0.1),
      vy: random(-0.1,0.1),
      radius: random(1.5,3),
      alpha: random(0.5,1),
      decay: random(0.0008,0.002),
      color: `hsla(${hue},100%,85%,`
    });
  }
}

// Hintergrund komplett schwarz
function drawBackground(){
  ctx.fillStyle = '#000'; // KEIN transparentes Schwarz
  ctx.fillRect(0,0,width,height);

  // Kleine Sterne
  for(let i=0;i<3;i++){
    const sx=random(0,width);
    const sy=random(0,height);
    const sr=random(0.3,0.8);
    const sa=random(0.2,0.5);
    ctx.beginPath();
    ctx.arc(sx,sy,sr,0,Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${sa})`;
    ctx.fill();
  }
}

let phase='float';
let timer=0;

function drawParticles(){
  for(let p of particles){
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
    ctx.fillStyle=p.color+p.alpha+')';
    ctx.shadowBlur=10 + 5*p.alpha;
    ctx.shadowColor='hsla(50,100%,90%,'+p.alpha+')';
    ctx.fill();

    if(phase==='float'){
      p.vx += random(-0.01,0.01);
      p.vy += random(-0.01,0.01);
      p.x += p.vx;
      p.y += p.vy;
      if(p.x<0||p.x>width)p.vx*=-1;
      if(p.y<0||p.y>height)p.vy*=-1;
    } else if(phase==='gather'){
      p.x += (center.x - p.x)*0.03;
      p.y += (center.y - p.y)*0.03;
      p.alpha = Math.min(p.alpha+0.015,1);
    } else if(phase==='explode'){
      const angle=Math.atan2(p.y-center.y,p.x-center.x);
      const speed=random(1.5,3);
      p.x += Math.cos(angle)*speed + random(-0.2,0.2);
      p.y += Math.sin(angle)*speed + random(-0.2,0.2);
      p.alpha -= p.decay*1.2;
      if(p.alpha<=0){
        const a=random(0,Math.PI*2);
        const r=random(width/2,width);
        p.x=center.x+Math.cos(a)*r;
        p.y=center.y+Math.sin(a)*r;
        p.alpha=random(0.5,1);
        p.radius=random(1.5,3);
      }
    }
  }
}

function animate(){
  drawBackground();
  drawParticles();
  requestAnimationFrame(animate);

  timer++;
  if(timer%1200===0) phase='gather';
  if(timer%1200===400) phase='explode';
  if(timer%1200===800) phase='float';
}

window.addEventListener('resize',()=>{
  width=canvas.width=window.innerWidth;
  height=canvas.height=window.innerHeight;
  center.x=width/2;
  center.y=height/2;
});

createParticles();
animate();
