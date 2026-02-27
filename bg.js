// ================================
// Ghost-X Cosmic Background v1.0
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
const MAX_COUNT = 180;

function rand(min, max) { return Math.random() * (max - min) + min; }

for (let i = 0; i < MAX_COUNT; i++) {
    particles.push({
        x: rand(0, width),
        y: rand(0, height),
        vx: rand(-2, 2),
        vy: rand(-2, 2),
        radius: rand(1.2, 2.8),
        alpha: rand(0.6, 1),
        hue: Math.random() < 0.5 ? 210 : 240, // blau oder weiß
        exploded: false
    });
}

// ================================
// ANIMATION PHASES
// ================================

let phase = "float";
let timer = 0;

// ================================
// BACKGROUND DRAW
// ================================
function drawBackground() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
}

// ================================
// PARTICLE UPDATE
// ================================
function updateParticles() {
    particles.forEach(p => {
        // -------------------
        // FLOAT PHASE
        // -------------------
        if (phase === "float") {
            p.x += p.vx;
            p.y += p.vy;
            p.vx += rand(-0.05, 0.05);
            p.vy += rand(-0.05, 0.05);
            p.vx *= 0.99;
            p.vy *= 0.99;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
        }

        // -------------------
        // GATHER PHASE – Lichtball
        // -------------------
        else if (phase === "gather") {
            p.x += (centerX - p.x) * 0.08;
            p.y += (centerY - p.y) * 0.08;
        }

        // -------------------
        // EXPLODE PHASE
        // -------------------
        else if (phase === "explode") {
            if (!p.exploded) {
                const angle = rand(0, Math.PI * 2);
                const speed = rand(2.5, 5);
                p.vx = Math.cos(angle) * speed;
                p.vy = Math.sin(angle) * speed;
                p.exploded = true;
            }
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.004;

            if (p.alpha <= 0) {
                p.x = centerX;
                p.y = centerY;
                p.alpha = rand(0.6, 1);
                p.exploded = false;
            }
        }

        // -------------------
        // SWIRL PHASE – Black Hole
        // -------------------
        else if (phase === "swirl") {
            const dx = p.x - centerX;
            const dy = p.y - centerY;
            const dist = Math.sqrt(dx*dx + dy*dy);

            // Rotation
            const angle = Math.atan2(dy, dx) + 0.25;

            // Anziehung
            const pull = 0.08;
            const newDist = dist * (1 - pull);

            p.x = centerX + Math.cos(angle) * newDist;
            p.y = centerY + Math.sin(angle) * newDist;

            // leichte Gravitation auf Zentrum
            p.x += (centerX - p.x) * 0.02;
            p.y += (centerY - p
