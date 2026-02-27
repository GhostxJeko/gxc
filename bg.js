// bg.js – Ghost-X Cosmic Background – finale GitHub-kompatible Version
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
let centerX = width / 2;
let centerY = height / 2;

// ================================
// PARTICLE SETTINGS
// ================================
const particles = [];
const START_COUNT = 50;
const MAX_COUNT = 150;
const hueOptions = [210, 220, 230, 240];

function rand(min, max){ return Math.random()*(max-min)+min; }

function createParticles(){
    particles.length = 0;
    for(let i=0;i<MAX_COUNT;i++){
        const hue = hueOptions[Math.floor(rand(0,hueOptions.length))];
        particles.push({
            x: rand(0,width),
            y: rand(0,height),
            vx: rand(-0.2,0.2),
            vy: rand(-0.2,0.2),
            radius: rand(1.5,3),
            alpha: i<START_COUNT?rand(0.6,1):0,
            active: i<START_COUNT,
            hue: hue,
            exploded: false
        });
    }
}

// ================================
// RESIZE HANDLER
// ================================
function resize(){
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    centerX = width / 2;
    centerY = height / 2;
}
window.addEventListener("resize", resize);

// ================================
// DRAW & UPDATE PARTICLES
// ================================
let phase = "float";
let timer = 0;

function drawParticles(){
    ctx.clearRect(0,0,width,height);

    particles.forEach(p=>{
        if(!p.active) return;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
        ctx.fillStyle = `hsla(${p.hue},90%,75%,${p.alpha})`;
        ctx.shadowBlur = 15*p.alpha;
        ctx.shadowColor = `hsla(${p.hue},90%,80%,${p.alpha})`;
        ctx.fill();

        // FLOAT
        if(phase==="float"){
            p.x += p.vx; p.y += p.vy;
            if(p.x<0||p.x>width)p.vx*=-1;
            if(p.y<0||p.y>height)p.vy*=-1;
        }
        // GATHER – Lichtball
        else if(phase==="gather"){
            p.x += (centerX-p.x)*0.08;
            p.y += (centerY-p.y)*0.08;
            p.alpha += (1-p.alpha)*0.05;
        }
        // EXPLODE – nach außen
        else if(phase==="explode"){
            if(!p.exploded){
                const angle = rand(0,Math.PI*2);
                const speed = rand(2.5,5);
                p.vx = Math.cos(angle)*speed;
                p.vy = Math.sin(angle)*speed;
                p.exploded = true;
            }
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.004;
            if(p.alpha<=0){
                p.x = centerX + rand(-20,20);
                p.y = centerY + rand(-20,20);
                p.alpha = rand(0.6,1);
                p.exploded = false;
            }
        }
        // SWIRL – Strudel
        else if(phase==="swirl"){
            const dx = p.x-centerX;
            const dy = p.y-centerY;
            const dist = Math.sqrt(dx*dx+dy*dy);
            let angle = Math.atan2(dy,dx)+0.06+Math.sin(timer*0.01)*0.02;
            let radius = dist*0.97;

            p.x = centerX + Math.cos(angle)*radius;
            p.y = centerY + Math.sin(angle)*radius;

            p.x += (Math.random()-0.5)*1.5;
            p.y += (Math.random()-0.5)*1.5;

            p.alpha -= 0.002;
            if(p.alpha<=0){p.x=centerX;p.y=centerY;p.alpha=rand(0.6,1);}
        }
    });
}

// Aktiviere alle Partikel für Strudel
function activateMoreParticles(){
    particles.forEach(p=>{
        if(!p.active){
            p.active = true;
            p.x=centerX;
            p.y=centerY;
            p.alpha=rand(0.6,1);
        }
    });
}

// ================================
// ANIMATION LOOP
// ================================
function animate(){
    drawParticles();
    timer++;

    if(timer===350) phase="gather";
    if(timer===600) phase="explode";
    if(timer===950){ activateMoreParticles(); phase="swirl"; }
    if(timer===1500){ phase="float"; timer=0; }

    requestAnimationFrame(animate);
}

// ================================
// START
// ================================
createParticles();
animate(); 
