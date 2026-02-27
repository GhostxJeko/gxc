// ================================
// Ghost-X Cosmic Background – Lichtkugel, Explosion, starker Strudel
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
  const MAX_COUNT = 200; // Gesamtanzahl
  const colors = [210, 220, 230, 240]; // blau/weiß Töne

  for(let i=0;i<MAX_COUNT;i++){
      particles.push({
          x: centerX + (Math.random()-0.5)*50, // direkt Kugel
          y: centerY + (Math.random()-0.5)*50,
          vx: 0,
          vy: 0,
          radius: Math.random()*2+1.5,
          alpha: Math.random()*0.5+0.5,
          hue: colors[Math.floor(Math.random()*colors.length)],
          exploded: false
      });
  }

  let phase = "gather"; // sofort Lichtkugel
  let timer = 0;

  function rand(min,max){return Math.random()*(max-min)+min;}

  function drawParticles(){
      ctx.clearRect(0,0,width,height);

      particles.forEach(p=>{
          // Zeichnen
          ctx.beginPath();
          ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
          ctx.fillStyle = `hsla(${p.hue}, 100%, 80%, ${p.alpha})`; 
          ctx.shadowBlur = 15;
          ctx.shadowColor = `hsla(${p.hue}, 100%, 70%, 1)`;
          ctx.fill();

          // PHASEN
          if(phase==="gather"){ // Partikel kugelförmig sammeln
              p.x += (centerX - p.x)*0.08;
              p.y += (centerY - p.y)*0.08;
              p.alpha += (1-p.alpha)*0.05;
          }
          else if(phase==="explode"){ // Explosion
              if(!p.exploded){
                  const angle = rand(0,Math.PI*2);
                  const speed = rand(4,7); // stärker
                  p.vx = Math.cos(angle)*speed;
                  p.vy = Math.sin(angle)*speed;
                  p.exploded=true;
              }
              p.x += p.vx;
              p.y += p.vy;
              p.alpha -= 0.004;
              if(p.alpha<=0){
                  p.x = centerX + (Math.random()-0.5)*50;
                  p.y = centerY + (Math.random()-0.5)*50;
                  p.alpha = rand(0.6,1);
                  p.exploded = false;
              }
          }
          else if(phase==="swirl"){ // Starker Strudel
              const dx = p.x-centerX;
              const dy = p.y-centerY;
              const dist = Math.sqrt(dx*dx+dy*dy);
              const angle = Math.atan2(dy,dx)+0.12; // schneller
              const radius = dist*0.90; // stärkeres einsaugen
              p.x = centerX + Math.cos(angle)*radius + (Math.random()-0.5)*3;
              p.y = centerY + Math.sin(angle)*radius + (Math.random()-0.5)*3;
              p.alpha -= 0.003;
              if(p.alpha<=0){p.x=centerX;p.y=centerY;p.alpha=rand(0.6,1);}
          }
          else if(phase==="float"){ // freies Schweben
              p.x += p.vx;
              p.y += p.vy;
              p.vx += rand(-0.05,0.05);
              p.vy += rand(-0.05,0.05);
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

      if(timer===200) phase="explode";
      if(timer===700) phase="swirl";
      if(timer===1400){phase="float"; timer=0;}

      requestAnimationFrame(animate);
  }

  animate();
}
