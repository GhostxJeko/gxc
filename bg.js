// ================================
// Ghost-X Cosmic Background – Ultimate Cosmic Version
// ================================
window.onload = function() {
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

  const particles = [];
  const MAX_COUNT = 250;  // etwas mehr für volle Wirkung
  const colors = [210, 220, 230, 240]; // Blau/Weiß Töne

  for(let i=0;i<MAX_COUNT;i++){
      const angle = Math.random()*Math.PI*2;
      const radius = Math.random()*Math.max(width,height)/2 + 100; // außen starten
      particles.push({
          x: centerX + Math.cos(angle)*radius,
          y: centerY + Math.sin(angle)*radius,
          vx: 0,
          vy: 0,
          radius: Math.random()*2+1,
          alpha: Math.random()*0.5+0.5,
          hue: colors[Math.floor(Math.random()*colors.length)],
          exploded: false
      });
  }

  let phase = "gather"; // sofort Partikel sammeln
  let timer = 0;

  function rand(min,max){return Math.random()*(max-min)+min;}

  function drawParticles(){
      ctx.clearRect(0,0,width,height);

      particles.forEach(p=>{
          // Partikel zeichnen – scharf, klar
          ctx.beginPath();
          ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
          ctx.fillStyle = `hsla(${p.hue},100%,80%,${p.alpha})`;
          ctx.shadowBlur = 10; // subtil, nicht verschwommen
          ctx.shadowColor = `hsla(${p.hue},100%,75%,1)`;
          ctx.fill();

          // PHASEN
          if(phase==="gather"){
              // elegante Anziehung zur Mitte
              const dx = centerX - p.x;
              const dy = centerY - p.y;
              p.x += dx * 0.02 + (Math.random()-0.5)*0.3;
              p.y += dy * 0.02 + (Math.random()-0.5)*0.3;
              p.alpha += (1-p.alpha)*0.02;
          }
          else if(phase==="explode"){
              if(!p.exploded){
                  const angle = rand(0,Math.PI*2);
                  const speed = rand(2,5); // flüssig sichtbar
                  p.vx = Math.cos(angle)*speed;
                  p.vy = Math.sin(angle)*speed;
                  p.exploded = true;
              }
              p.x += p.vx;
              p.y += p.vy;
              p.alpha -= 0.002;
              if(p.alpha<=0){
                  const angle = Math.random()*Math.PI*2;
                  const radius = Math.random()*Math.max(width,height)/2 + 100;
                  p.x = centerX + Math.cos(angle)*radius;
                  p.y = centerY + Math.sin(angle)*radius;
                  p.alpha = rand(0.5,1);
                  p.exploded = false;
              }
          }
          else if(phase==="swirl"){
              // starker Strudel/Wurmloch
              const dx = p.x - centerX;
              const dy = p.y - centerY;
              const dist = Math.sqrt(dx*dx + dy*dy);
              const angle = Math.atan2(dy,dx) + 0.06; // nicht zu schnell
              const pull = 0.92; // Einsaugen stärker
              p.x = centerX + Math.cos(angle)*dist*pull + (Math.random()-0.5)*2;
              p.y = centerY + Math.sin(angle)*dist*pull + (Math.random()-0.5)*2;
              p.alpha -= 0.0015;
              if(p.alpha<=0){p.x=centerX;p.y=centerY;p.alpha=rand(0.6,1);}
          }
          else if(phase==="float"){
              // freies, langsames Schweben
              p.x += p.vx;
              p.y += p.vy;
              p.vx += rand(-0.03,0.03);
              p.vy += rand(-0.03,0.03);
              p.vx *= 0.98;
              p.vy *= 0.98;
              if(p.x<0)p.x=width; if(p.x>width)p.x=0;
              if(p.y<0)p.y=height; if(p.y>height)p.y=0;
          }
      });
  }

  function animate(){
      drawParticles();
      timer++;

      if(timer===300) phase="explode";
      if(timer===900) phase="swirl";
      if(timer===1600){phase="float"; timer=0;}

      requestAnimationFrame(animate);
  }

  animate();
}
