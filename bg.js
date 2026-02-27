
// ===============================
// COSMIC CINEMATIC BACKGROUND
// ===============================

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
const COUNT = 140;
const hueOptions = [220, 230, 25, 30]; // Blau + Orange

let phase = "float";
let timer = 0;

// ===============================
// UTIL
// ===============================

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
            vx: rand(-0.3, 0.3),
            vy: rand(-0.3, 0.3),
            radius: rand(1.2, 2.6),
            alpha: rand(0.7, 1),
            hue: hueOptions[Math.floor(rand(0, hueOptions.length))],
            exploded: false
        });
    }
}

createParticles();

// ===============================
// DRAW BACKGROUND
// ===============================

function drawBackground() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
}

// ===============================
// DRAW CORE GLOW
// ===============================

function drawCore(intensity = 1) {
    const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 180
    );

    gradient.addColorStop(0, `rgba(255,140,0,${0.9 * intensity})`);
    gradient.addColorStop(0.3, `rgba(255,90,0,${0.5 * intensity})`);
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 180, 0, Math.PI * 2);
    ctx.fill();
}

// ===============================
// PARTICLES
// ===============================

function updateParticles() {

    particles.forEach(p => {

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.alpha})`;
        ctx.shadowBlur = 25 + 20 * p.alpha;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 60%, ${p.alpha})`;
        ctx.fill();

        // FLOAT
        if (phase === "float") {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
        }

        // GATHER
        else if (phase === "gather") {
            p.x += (centerX - p.x) * 0.12;
            p.y += (centerY - p.y) * 0.12;
        }

        // EXPLOSION
        else if (phase === "explode") {

            if (!p.exploded) {
                const angle = rand(0, Math.PI * 2);
                const speed = rand(4, 7);
                p.vx = Math.cos(angle) * speed;
                p.vy = Math.sin(angle) * speed;
                p.exploded = true;
            }

            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.006;

            if (p.alpha <= 0) {
                p.x = centerX;
                p.y = centerY;
                p.alpha = rand(0.7, 1);
                p.exploded = false;
            }
        }

        // EXTREME SWIRL
        else if (phase === "swirl") {

            const dx = p.x - centerX;
            const dy = p.y - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const angle = Math.atan2(dy, dx) + 0.14;
            const radius = dist * 0.90;

            p.x = centerX + Math.cos(angle) * radius;
            p.y = centerY + Math.sin(angle) * radius;

            p.alpha -= 0.003;

            if (p.alpha <= 0) {
                p.x = centerX;
                p.y = centerY;
                p.alpha = rand(0.7, 1);
            }
        }

    });
}

// ===============================
// ANIMATION LOOP
// ===============================

function animate() {

    drawBackground();

    if (phase === "gather" || phase === "swirl") {
        drawCore(1.2);
    }

    if (phase === "explode") {
        drawCore(1.8);
    }

    updateParticles();

    requestAnimationFrame(animate);

    timer++;

    if (timer === 350) phase = "gather";
    if (timer === 550) phase = "explode";
    if (timer === 850) phase = "swirl";
    if (timer === 1600) {
        phase = "float";
        timer = 0;
    }
}

animate();
