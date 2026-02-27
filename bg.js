// ================================
// Ghost-X Cosmic Background – Final Optimized
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
const MAX_COUNT = 150;    // maximale Partikel
const START_COUNT = 60;   // anfänglich aktive Partikel
const colors = [210, 220, 230, 240]; // blau/weiß Töne

function rand(min, max) { return Math.random() * (max - min) + min; }

// Partikel erstellen
for (let i = 0; i < MAX_COUNT; i++) {
    particles.push({
        x: rand(0, width),
        y: rand(0, height),
        vx: rand(-1, 1),
        vy: rand(-1, 1),
        radius: rand(1.5, 3),
        alpha: i < START_COUNT ? rand(0.6, 1) : 0,
        active: i < START_COUNT,
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

        if (!p.active) return;

        // FLOAT – freie Bewegung
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

        // GATHER – Lichtball Kreis
        else if (phase === "gather") {
            const dx = p.x - centerX;
            const dy = p.y - centerY;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const angle = Math.atan2(dy, dx);
            const pull = 0.08;

            // Perfekter Kreis: Richtung zum Zentrum proportional
            const moveX = Math.cos(angle) * dist * pull;
            const moveY = Math.sin(angle) * dist * pull;
            p.x -= moveX;
            p.y -= moveY;
        }

        // EXPLODE – nach außen
        else if (phase === "explode") {
            if (!p.exploded) {
                const angle = rand(0, Math.PI*2);
                const speed = rand(2.5, 4.5);
                p.vx = Math.cos(angle)*speed;
                p.vy = Math.sin(angle)*speed;
                p.exploded = true;
            }
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.005;

            if (p.alpha <= 0) {
                p.x = centerX;
                p.y = centerY;
                p.alpha = rand(0.6, 1);
                p.exploded = false;
            }
        }

        // SWIRL – kontrollierter Strudel
        else if (phase === "swirl") {
            const dx = p.x - centerX;
            const dy = p.y - centerY;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const angle = Math.atan2(dy, dx) + 0.06;
            const pull = 0.04;
            const newDist = dist * (1 - pull);

            p.x = centerX + Math.cos(angle) * newDist;
            p.y = centerY + Math.sin(angle) * newDist;

            // sanfte Gravitation zum Zentrum
            p.x += (centerX - p.x) * 0.01;
            p.y += (centerY - p.y) * 0.01;
        }

        // DRAW PARTICLE
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 80%, ${p.alpha})`;
        ctx.shadowBlur = 20; // stärkerer Glow
        ctx.shadowColor = `hsla(${p.hue}, 100%, 70%, 1)`;
        ctx.fill();
    });
}

// ================================
// ANIMATE LOOP
// ================================
function activateMoreParticles() {
    particles.forEach(p => {
        if (!p.active) {
            p.active = true;
            p.x = centerX;
            p.y = centerY;
            p.alpha = rand(0.6, 1);
        }
    });
}

function animate() {
    drawBackground();
    updateParticles();

    timer++;

    if (timer === 300) phase = "gather";      // Lichtball bilden
    if (timer === 600) phase = "explode";     // Explosion
    if (timer === 950) {
        activateMoreParticles();               // alle Partikel aktivieren
        phase = "swirl";                       // Strudel
    }
    if (timer === 1500) {
        phase = "float"; timer = 0;           // Reset
    }

    requestAnimationFrame(animate);
}

animate();
