// ======================================
// COSMIC BLACK HOLE – FINAL VERSION
// ======================================

const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

let width, height, centerX, centerY;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    centerX = width / 2;
    centerY = height / 2;
}
window.addEventListener("resize", resize);
resize();

// ===============================
// SETTINGS
// ===============================

const particles = [];
const COUNT = 180; // Mehr Teilchen
const hueOptions = [220, 230, 240, 25, 30]; // Blau + Orange

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

// ===============================
// CREATE PARTICLES
// ===============================

function createParticles() {
    particles.length = 0;

    for (let i = 0; i < COUNT; i++) {
        particles.push({
            x: rand(0, width),
            y: rand(0, height),

            // Schnelle Anfangsbewegung
            vx: rand(-2.5, 2.5),
            vy: rand(-2.5, 2.5),

            radius: rand(1.2, 2.8),
            alpha: rand(0.7, 1),
            hue: hueOptions[Math.floor(rand(0, hueOptions.length))]
        });
    }
}

createParticles();

// ===============================
// BACKGROUND
// ===============================

function drawBackground() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.fillRect(0, 0, width, height);
}

// ===============================
// CORE GLOW
// ===============================

function drawCore() {
    const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 250
    );

    gradient.addColorStop(0, "rgba(255,140,0,1)");
    gradient.addColorStop(0.2, "rgba(255,90,0,0.8)");
    gradient.addColorStop(0.5, "rgba(255,50,0,0.4)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 250, 0, Math.PI * 2);
    ctx.fill();
}

// ===============================
// UPDATE PARTICLES
// ===============================

function updateParticles() {

    particles.forEach(p => {

        const dx = p.x - centerX;
        const dy = p.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // 🌪 STRONG BLACK HOLE EFFECT
        if (dist < 500) {

            const angle = Math.atan2(dy, dx) + 0.28; // starke Rotation
            const pullStrength = 0.08;

            const newDist = dist * (1 - pullStrength);

            p.x = centerX + Math.cos(angle) * newDist;
            p.y = centerY + Math.sin(angle) * newDist;
        }

        // 💫 Freies Fliegen außerhalb
        p.x += p.vx;
        p.y += p.vy;

        // leichte Zufallsbewegung für Kosmos-Effekt
        p.vx += rand(-0.05, 0.05);
        p.vy += rand(-0.05, 0.05);

        p.vx *= 0.99;
        p.vy *= 0.99;

        // Wrap-around statt Bounce
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // 🔥 DRAW PARTICLE
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.alpha})`;
        ctx.shadowBlur = 40;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 60%, 1)`;
        ctx.fill();

        // Wenn im Zentrum → neu verteilen (Explosion Loop)
        if (dist < 15) {
            p.x = rand(0, width);
            p.y = rand(0, height);
        }
    });
}

// ===============================
// ANIMATION LOOP
// ===============================

function animate() {

    drawBackground();
    drawCore();
    updateParticles();

    requestAnimationFrame(animate);
}

animate();
