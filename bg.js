// bg.js – Kosmischer Lichtball + Explosion + Strudel – finale Version
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
let centerX = width / 2;
let centerY = height / 2;

const particles = [];
const MAX_COUNT = 150;
const START_COUNT = 50;
const hueOptions = [210, 220, 230, 240];

function rand(min, max) { return Math.random()*(max-min)+min; }

// Partikel erstellen
function createParticles(){
    particles.length = 0;
    for(let i=0;i<MAX_COUNT;i++){
        const hue = hueOptions[Math.floor(rand(0,hueOptions.length))];
        // Alle Partikel starten **außerhalb der Mitte**
        const x = rand(0, width);
        const y = rand(0, height);
        particles.push({
            x:x,
            y:y,
            vx:0,
            vy:0,
            radius:rand(1.5,3),
            alpha: i<START_COUNT?rand(0.6,1):0,
            active: i<START_COUNT,
            hue:hue,
            exploded:false
        });
    }
}

// Resize Handler
function resize(){
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    centerX = width/2;
    centerY = height/2;
}
window.addEventListener("resize", resize);

let phase="float";
let timer=0;

function drawParticles(){
    ctx.clearRect(0,0,width,height);

    particles.forEach(p=>{
        if(!p.active) return;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
        ctx.fillStyle=`hsla(${p.hue},90%,75%,${p.alpha})`;
        ctx.shadowBlur=15*p.alpha;
        ctx.shadowColor=`hsla(${p.hue},90%,80%,${p.alpha})`;
        ctx.fill();

        // FLOAT
        if(phase==="float"){
            p.x += p.vx; p.y += p.vy;
            if(p.x<0||p.x>width)p.vx*=-1;
            if(p.y<0||p.y>height)p.vy*=-1;
        }

        // GATHER – Partikel bewegen sich zur Mitte → Lichtball
        else if(phase==="gather"){
            const dx=centerX-p.x;
            const dy=centerY-p.y;
            p.vx = dx*0.05;
            p.vy = dy*0.05;
            p.x += p.vx;
            p.y += p.vy;
            // Alpha puls
            p.alpha += (1-p.alpha)*0.05;
        }

        // EXPLODE – Partikel fliegen nach außen
        else if(phase==="explode"){
            if(!p.exploded){
                const angle = rand(0,Math.PI*2);
                const speed = rand(2.5,5);
                p.vx = Math.cos(angle)*speed;
                p.vy = Math.sin(angle)*speed;
                p.exploded=true;
            }
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.004;
            if(p.alpha<=0){
                p.x=centerX + rand(-20,20);
                p.y=centerY + rand(-20,20);
                p.alpha=rand(0.6,1);
                p.exploded=false;
            }
        }

        // SWIRL – Partikel rotieren um die Mitte
        else if(phase==="swirl"){
            const dx=p.x-centerX;
            const dy=p.y-centerY;
            const dist=Math.sqrt(dx*dx+dy*dy);
            const angle=Math.atan2(dy,dx)+0.06+Math.sin(timer*0.01)*0.02;
            const radius=dist*0.97;

            p.x=centerX+Math.cos(angle)*radius;
            p.y=centerY+Math.sin(angle)*radius;

            p.x += (Math.random()-0.5)*1.5;
            p.y += (Math.random()-0.5)*1.5;

            p.alpha -= 0.002;
            if(p.alpha<=0){p.x=centerX;p.y=centerY;p.alpha=rand(0.6,1);}
        }
    });
}

// Aktiviert alle Partikel für Strudel
function activateMoreParticles(){
    particles.forEach(p=>{
        if(!p.active){
            p.active=true;
            p.x=centerX;
            p.y=centerY;
            p.alpha=rand(0.6,1);
        }
    });
}

// Animation Loop
function animate(){
    drawParticles();
    timer++;

    if(timer===100) phase="gather";     // Lichtball bilden
    if(timer===400) phase="explode";    // Explosion
    if(timer===700){ activateMoreParticles(); phase="swirl"; } // Strudel
    if(timer===1200){ phase="float"; timer=0; }               // Reset

    requestAnimationFrame(animate);
}

// START
createParticles();
animate();  
