// bg.js – Kosmisches Universum: Lichtkugel, Explosion & Strudel (weiß & blau)
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
let center = { x: width/2, y: height/2 };

const particles = [];
const MAX_COUNT = 250;
const START_COUNT = 20;

function rand(min,max){ return Math.random()*(max-min)+min; }

// Partikel erzeugen – starten verstreut im Kosmos
function createParticles(){
  particles.length = 0;
  for(let i=0;i<MAX_COUNT;i++){
    const hue = [210,220,230,240][Math.floor(rand(0,4))];
    particles.push({
      x: rand(0,width),
      y: rand(0,height),
      vx: rand(-0.1,0.1),
      vy: rand(-0.1,0.1),
      radius: rand(1.5,3),
      alpha: i<START_COUNT?rand(0.6,1):0,
      active: i<START_COUNT,
      hue: hue
    });
  }
}

let phase = 'float';
let timer = 0;

window.addEventListener('resize',()=>{
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  center.x = width/2;
  center.y = height/2;
});

function drawBackground(){
  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,width,height);
}

function drawParticles(){
  drawBackground();

  for(let p of particles){
    if(!p.active) continue;

    ctx.beginPath();
    ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
    ctx.fillStyle = `hsla(${p.hue},90%,80%,${p.alpha})`;
    ctx.shadowBlur = 20 + 15*p.alpha;
    ctx.shadowColor = `hsla(${p.hue},90%,80%,${p.alpha})`;
    ctx.fill();

    // Bewegungen je Phase
    if(phase==='float'){
      p.vx += rand(-0.002,0.002);
      p.vy += rand(-0.002,0.002);
      p.x += p.vx;
      p.y += p.vy;
    }
    else if(phase==='gather'){
      // Anziehung zur Lichtkugel
      const dx = center.x - p.x;
      const dy = center.y - p.y;
      p.x += dx*0.02;
      p.y += dy*0.02;
      p.alpha = Math.min(p.alpha + 0.01,1);
    }
    else if(phase==='explode'){
      // Explosion & Strudel
      const dx = p.x - center.x;
      const dy = p.y - center.y;
      const angle = Math.atan2(dy,dx);
      const swirl = 0.15; // Strudelstärke
      const speed = rand(2,4);
      p.x += Math.cos(angle+swirl)*speed + rand(-0.3,0.3);
      p.y += Math.sin(angle+swirl)*speed + rand(-0.3,0.3);
      p.alpha -= 0.003;

      if(p.alpha<=0){
        // Reset Partikel kosmisch verstreut
        p.x = rand(center.x-width/3, center.x+width/3);
        p.y = rand(center.y-height/3, center.y+height/3);
        p.alpha = rand(0.5,1);
        p.radius = rand(1.5,3);
      }
    }
    else if(phase==='swirl'){
      // sanfter Strudel nach Explosion
      const dx = p.x - center.x;
      const dy = p.y - center.y;
      const angle = Math.atan2(dy,dx);
      const swirl = 0.12;
      const speed = 1.5;
      p.x += Math.cos(angle+swirl)*speed;
      p.y += Math.sin(angle+swirl)*speed;
    }
  }
}

// Aktiviert Partikel nach Explosion
function activateMoreParticles(){
  particles.forEach(p=>{
    if(!p.active){
      p.active=true;
      p.alpha = rand(0.6,1);
    }
  });
}

function animate(){
  drawParticles();
  requestAnimationFrame(animate);
  timer++;

  if(timer===400) phase='gather';         // Zusammenziehen
  if(timer===650){
    activateMoreParticles();              // Explosion vorbereiten
    phase='explode';
  }
  if(timer===1300) phase='swirl';        // Strudelbewegung
  if(timer===2000){
    phase='float';                        // Ruhephase
    timer=0;
  }
}

createParticles();
animate();
