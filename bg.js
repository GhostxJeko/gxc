// Erweiterung deines bg.js für kosmische Explosion
let explodeTimer = 0;

function drawParticles() {
    drawBackground();

    particles.forEach(p => {
        if (!p.active) return;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 75%, ${p.alpha})`;
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 75%, ${p.alpha})`;
        ctx.fill();

        if (phase === "float") {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
        }
        else if (phase === "gather") {
            p.x += (centerX - p.x) * 0.08;
            p.y += (centerY - p.y) * 0.08;
        }
        else if (phase === "explode") {
            if (!p.exploded) {
                const angle = Math.random() * Math.PI * 2;
                const speed = rand(2, 5);
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
        else if (phase === "swirl") {
            const dx = p.x - centerX;
            const dy = p.y - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            let angle = Math.atan2(dy, dx) + 0.05;
            let radius = dist * 0.97;
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
    });
}

function animate() {
    drawParticles();
    requestAnimationFrame(animate);

    timer++;

    if (timer === 400) phase = "gather";          // zur Mitte ziehen
    if (timer === 650) phase = "explode";         // Lichtball explodiert
    if (timer === 950) {                          // Strudel
        activateMoreParticles();
        phase = "swirl";
    }
    if (timer === 1500) {                         // Reset
        phase = "float";
        timer = 0;
    }
}
