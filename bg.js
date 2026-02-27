// ================================
// Ghost-X Cosmic Neon Background
// ================================
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
let centerX = width / 2;
let centerY = height / 2;

window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    centerX = width / 2;
    centerY = height / 2;
});

// ================================
// PARTICLE SETTINGS
// ================================
const particles = [];
const MAX_COUNT = 200;
const START_COUNT = 50;
const colorHue = 140; // Neon-Grün, für weiß: 0/0/100 Lightness anpassen

function rand(min,max){ return Math.random()*(max-min)+min; }

// Partikel erzeugen
for(let i=0;i<MAX_COUNT;i++){
    particles.push({
        x: rand(0,width),
        y: rand(0,height),
        vx: 0,
        vy: 0,
        radius: rand(1.5,3),
        alpha: i<START_COUNT?rand(0.6,1):0,
        active: i<START_COUNT,
        exploded:false
    });
}

// ================================
// PHASES
// ================================
let phase = "float";
let timer = 0;

// ================================
// DRAW & UPDATE
// ================================
function drawParticles(){
    ctx.clearRect(0,0,width,height);

    particles.forEach(p=>{
        if(!p.active) return;

        // DRAW
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
        ctx.fillStyle = `hsla(${colorHue},100%,75%,${p.alpha})`;
        ctx.shadowBlur = 15*p.alpha;
        ctx.shadowColor = `hsla(${colorHue},100%,75%,${p.alpha})`;
        ctx.fill();

        // FLOAT
        if(phase==="float"){
            p.x += p.vx; p.y += p.vy;
            p.vx += rand(-0.05,0.05);
            p.vy += rand(-0.05,0.05);
            p.vx *= 0.98; p.vy *= 0.98;
            if(p.x<0)p.x=width;if(p.x>width)p.x=0;
            if(p.y<0)p.y=height;if(p.y>height)p.y=0;
        }

        // GATHER – ziehen zur Mitte
        else if(phase==="gather"){
            const dx=centerX-p.x;
            const dy=centerY-p.y;
            p.vx = dx*0.05; p.vy = dy*0.05;
            p.x += p.vx; p.y += p.vy;
            p.alpha += (1-p.alpha)*0.05;
        }

        // EXPLODE
        else if(phase==="explode"){
            if(!p.exploded){
                const angle = rand(0,Math.PI*2);
                const speed = rand(3,6);
                p.vx=Math.cos(angle)*speed;
                p.vy=Math.sin(angle)*speed;
                p.exploded=true;
            }
            p.x += p.vx; p.y += p.vy;
            p.alpha -= 0.004;
            if(p.alpha<=0){
                p.x=centerX+rand(-30,30);
                p.y=centerY+rand(-30,30);
                p.alpha=rand(0.6,1);
                p.exploded=false;
            }
        }

        // SWIRL – Wurmloch-Strudel
        else if(phase==="swirl"){
            const dx = p.x-centerX;
            const dy = p.y-centerY;
            const dist = Math.sqrt(dx*dx+dy*dy);
            const angle = Math.atan2(dy,dx)+0.08+Math.sin(timer*0.02)*0.03;
            const radius = dist*0.95;

            // Partikel in Richtung Zentrum + leichte Rotation
            p.x=centerX+Math.cos(angle)*radius;
            p.y=centerY+Math.sin(angle)*radius;

            // zufällige kleine Variationen für organische Bewegung
            p.x += (Math.random()-0.5)*2;
            p.y += (Math.random()-0.5)*2;

            // Alpha leicht verringern, damit Partikel neu gestartet werden
            p.alpha -= 0.003;
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

// ================================
// ANIMATE LOOP
// ================================
function animate(){
    drawParticles();
    timer++;

    if(timer===150) phase="gather";       // Lichtball bilden
    if(timer===500) phase="explode";      // Explosion
    if(timer===900){ activateMoreParticles(); phase="swirl"; } // Strudel
    if(timer===1500){ phase="float"; timer=0; }               // Reset

    requestAnimationFrame(animate);
}

// ================================
// START
// ================================
animate();
