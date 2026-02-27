// ================================
// Ghost-X Cosmic Background Enhanced
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
const MAX_COUNT = 180; // etwas mehr Partikel für dichteren Lichtball
const colors = [210, 220, 230, 240]; // blau/weiß Töne

function rand(min, max) { return Math.random() * (max - min) + min; }

for (let i = 0; i < MAX_COUNT; i++) {
    particles.push({
        x: rand(0, width),
        y: rand(0, height),
        vx: rand(-1.5, 1.5),
        vy: rand(-1.5, 1.5),
        radius: rand(1.5, 3.5),
        alpha: rand(0.6, 1),
        hue: colors[Math.floor(rand(0, colors.length))],
        exploded: false
    });
}

// ================================
// ANIMATION PHASES
// ================================
let phase = "float";
let timer = 0;

// ================================
// DRAW BACKGROUND
// ================================
function drawBackground() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
}

// ================================
// UPDATE PARTICLES
// ================================
function updateParticles() {
    particles.forEach(p => {
        if (phase === "float") {
            p.x += p.vx;
            p.y += p.vy;
            p.vx += rand(-0.05, 0.05);
            p.vy += rand(-0.05, 0.05);
            p.vx *= 0.98;
            p.vy *= 0.98;
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
        }
        else if (phase === "gather") {
            // dichteres Zusammenziehen zum Zentrum
            p.x += (centerX - p.x) * 0.08;
            p.y += (centerY - p.y) * 0.08;
            // zusätzliche leichte Puls-Alpha
            p.alpha += (1 - p.alpha) * 0.05;
        }
        else if (phase === "explode") {
            if (!p.exploded) {
                const angle = rand(0, Math.PI*2);
                const speed = rand(1.5, 4); // etwas variabler
                p.vx = Math.cos(angle)*speed;
                p.vy = Math.sin(angle)*speed;
                p.exploded = true;
            }
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.003; // langsamer Ausblenden
            if (p.alpha <= 0) {
                p.x = centerX + rand(-20,20); // kleine Variation für Reset
                p.y = centerY + rand(-20,20);
                p.alpha = rand(0.6, 1);
                p.exploded = false;
            }
        }
        else if (phase === "swirl") {
            const dx = p.x - centerX;
            const dy = p.y - centerY;
            const dist = Math.sqrt(dx*dx + dy*dy);

            // Rotation + Strudel-Effekt
            const angle = Math.atan2(dy, dx) + 0.07 + Math.sin(timer*0.01)*0.02;
            const pull = 0.035;
            const newDist = dist * (1 - pull);

            p.x = centerX + Math.cos(angle) * newDist;
            p.y = centerY + Math.sin(angle) * newDist;

            // leichte Gravitation
            p.x += (centerX - p.x) * 0.008;
            p.y += (centerY - p.y) * 0.008;
        }

        // ================================
        // DRAW PARTICLE
        // ================================
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 80%, ${p.alpha})`;
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 70%, 1)`;
        ctx.fill();
    });
}

// ================================
// ANIMATE LOOP
// ================================
function animate() {
    drawBackground();
    updateParticles();

    timer++;

    if (timer === 200) phase = "gather";   // Lichtball schneller bilden
    if (timer === 500) phase = "explode";  // Explosion
    if (timer === 850) phase = "swirl";    // Strudel
    if (timer === 1400) {                  // Reset
        phase = "float";
        timer = 0;
    }

    requestAnimationFrame(animate);
}

animate();  
