const canvas = document.getElementById('bgCanvas');  
const ctx = canvas.getContext('2d');  
  
let width = canvas.width = window.innerWidth;  
let height = canvas.height = window.innerHeight;  
  
const particles = [];  
const particleCount = 200;  
  
// Mittelpunkt  
const center = {x: width/2, y: height/2};  
  
function random(min,max){ return Math.random()*(max-min)+min; }  
  
// Partikel erzeugen  
function createParticles(){  
  for(let i=0;i<particleCount;i++){  
    particles.push({  
      x: random(0,width),  
      y: random(0,height),  
      vx: random(-0.3,0.3),  
      vy: random(-0.3,0.3),  
      radius: random(1,3),  
      alpha: random(0.3,0.9),  
      decay: random(0.002,0.008),  
      color: `rgba(255,${Math.floor(random(150,255))},0,`  
    });  
  }  
}  
  
// Animation Phasen  
let phase = 'float';  
let timer = 0;  
  
function drawParticles(){  
  // dunkler digitaler Hintergrund  
  ctx.fillStyle = 'rgba(0,0,0,0.12)';  
  ctx.fillRect(0,0,width,height);  
  
  for(let p of particles){  
    // Lichtpunkte  
    ctx.beginPath();  
    ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);  
    ctx.fillStyle = p.color + p.alpha + ')';  
    ctx.shadowBlur = 10 + 10*p.alpha;  
    ctx.shadowColor = '#ff7f00';  
    ctx.fill();  
  
    // Bewegung nach Phase  
    if(phase==='float'){  
      p.x += p.vx;  
      p.y += p.vy;  
    } else if(phase==='gather'){  
      p.x += (center.x - p.x)*0.05;  
      p.y += (center.y - p.y)*0.05;  
    } else if(phase==='explode'){  
      p.x += p.vx*5;  
      p.y += p.vy*5;  
      p.alpha -= p.decay*2;  
      if(p.alpha <= 0){  
        p.x = random(0,width);  
        p.y = random(0,height);  
        p.vx = random(-0.3,0.3);  
        p.vy = random(-0.3,0.3);  
        p.alpha = random(0.3,0.9);  
      }  
    }  
  
    // Float-Grenzen  
    if(phase==='float'){  
      if(p.x<0||p.x>width)p.vx*=-1;  
      if(p.y<0||p.y>height)p.vy*=-1;  
    }  
  }  
}  
  
// Animation Loop  
function animate(){  
  drawParticles();  
  requestAnimationFrame(animate);  
  timer++;  
  
  if(timer%600===0) phase='gather';  
  if(timer%600===150) phase='explode';  
  if(timer%600===300) phase='float';  
}  
  
// Resize  
window.addEventListener('resize',()=>{  
  width=canvas.width=window.innerWidth;  
  height=canvas.height=window.innerHeight;  
  center.x=width/2;  
  center.y=height/2;  
});  
  
// Sternen-Overlay (zufällige kleine Lichter)  
setInterval(()=>{  
  const star = {x:random(0,width), y:random(0,height), radius:random(0.5,1.5), alpha:random(0.3,0.8)};  
  ctx.beginPath();  
  ctx.arc(star.x,star.y,star.radius,0,Math.PI*2);  
  ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;  
  ctx.fill();  
}, 200);  
  
createParticles();  
animate();
