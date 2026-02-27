// ================================
// Ghost-X Cosmic Background Final
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
const MAX_COUNT = 150;
const colors = [210, 220, 230, 240];

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

for (let i = 0; i < MAX_COUNT; i++) {
    particles.push({
        x: rand(0, width),
        y: rand(0, height),
        vx: rand(-1.5, 1.5),
        vy: rand(-1.5, 1.5),
        radius: rand(1.5, 3),
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

        // GATHER – ziehen zum Zentrum (Lichtball)
        else if (phase === "gather") {
            const dx = centerX - p.x;
            const dy = centerY - p.y;
            p.vx = dx * 0.05;
            p.vy = dy * 0.05;
            p.x += p.vx;
            p.y += p.vy;
            p.alpha += (1 - p.alpha) * 0.05;
        }

        // EXPLODE – nach außen
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
                p.x = centerX + rand(-20, 20);
                p.y = centerY + rand(-20, 20);
                p.alpha = rand(0.6, 1);
                p.exploded = false;
            }
        }

        // SWIRL – Strudel
        else if (phase === "swirl") {
            const dx = p.x - centerX;
            const dy = p.y - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) + 0.06 + Math.sin(timer * 0.01) * 0.02;
            const radius = dist * 0.97;

            p.x = centerX + Math.cos(angle) * radius;
            p.y = centerY + Math.sin(angle) * radius;

            p.x += (Math.random() - 0.5) * 1.5;
            p.y += (Math.random() - 0.5) * 1.5;

            p.alpha -= 0.002;
            if (p.alpha <= 0) {
                p.x = centerX;
                p.y = centerY;
                p.alpha = rand(0.6, 1);
            }
        }

        // DRAW PARTICLE
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 80%, ${p.alpha})`;
        ctx.shadowBlur = 15;
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

    if (timer === 300) phase = "gather";    // Lichtball bilden
    if (timer === 600) phase = "explode";   // Explosion
    if (timer === 950) phase = "swirl";     // Strudel
    if (timer === 1500) {                    // Reset auf float
        phase = "float";
        timer = 0;
    }

    requestAnimationFrame(animate);
}

// START
animate();
