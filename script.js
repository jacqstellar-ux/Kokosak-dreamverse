
(() => {
  "use strict";

  const $ = (s) => document.querySelector(s);

  const welcome = $("#welcome");
  const world = $("#world");
  const enter = $("#enter");

  if (!welcome || !world || !enter) return;

  const style = document.createElement("style");
  style.textContent = `
    body { overflow-x:hidden; }
    #world { display:none; opacity:0; }
    #world.unlocked {
      display:block;
      animation: worldReveal 1.5s cubic-bezier(.16,1,.3,1) forwards;
    }
    @keyframes worldReveal {
      from { opacity:0; transform:scale(1.07); filter:blur(14px); }
      to { opacity:1; transform:scale(1); filter:blur(0); }
    }

    #universe-canvas {
      position:fixed; inset:0; width:100%; height:100%;
      pointer-events:none; z-index:6;
    }

    .welcome-content { position:relative; z-index:8; }
    .portal { transition:filter 1s, transform 1s; }

    .cinema {
      position:fixed; inset:0; z-index:100;
      pointer-events:none; opacity:0;
      background:#080511;
      display:grid; place-items:center;
      overflow:hidden;
    }
    .cinema.active {
      opacity:1;
      animation:cinemaIn 4.2s cubic-bezier(.7,0,.2,1) forwards;
    }
    @keyframes cinemaIn {
      0% { opacity:0; }
      12% { opacity:1; }
      55% { opacity:1; }
      100% { opacity:0; visibility:hidden; }
    }
    .cinema-word {
      font-family:'Space Grotesk',sans-serif;
      font-size:clamp(55px,14vw,160px);
      font-weight:800;
      letter-spacing:-.09em;
      white-space:nowrap;
      color:#fff0fb;
      text-shadow:0 0 30px #ff78d8, 0 0 100px #b17cff;
      transform:scale(.15) rotate(-8deg);
      animation:wordZoom 3.5s cubic-bezier(.12,.8,.2,1) forwards;
    }
    @keyframes wordZoom {
      0% { transform:scale(.15) rotate(-8deg); opacity:0; filter:blur(30px); }
      25% { opacity:1; }
      65% { transform:scale(1.1) rotate(2deg); filter:blur(0); }
      100% { transform:scale(9) rotate(10deg); opacity:0; filter:blur(15px); }
    }

    .cinema-flash {
      position:absolute; inset:0;
      background:radial-gradient(circle,#fff 0%,#f8b6f0 8%,#9c5bda 30%,transparent 70%);
      opacity:0;
      animation:flash 3.8s ease forwards;
    }
    @keyframes flash {
      0%,55% { opacity:0; transform:scale(.1); }
      68% { opacity:.9; transform:scale(1.8); }
      100% { opacity:0; transform:scale(4); }
    }

    .cat-runner {
      position:fixed; z-index:30; left:-150px; bottom:12%;
      font-size:65px; pointer-events:none;
      filter:drop-shadow(0 0 20px #ff9ce6);
      animation:catRun 8s ease-in-out infinite;
    }
    @keyframes catRun {
      0% { transform:translateX(-150px) rotate(-8deg); }
      40% { transform:translateX(45vw) translateY(-35px) rotate(5deg); }
      65% { transform:translateX(75vw) translateY(0) rotate(-4deg); }
      100% { transform:translateX(calc(100vw + 200px)) rotate(8deg); }
    }

    .secret-button {
      margin-top:22px; border:1px solid #e9b6ff70;
      background:#ffffff0c; color:#fce6ff;
      padding:13px 22px; border-radius:30px;
      font:600 10px 'Manrope',sans-serif;
      letter-spacing:2px; cursor:pointer;
      backdrop-filter:blur(15px); transition:.35s;
    }
    .secret-button:active { transform:scale(.94); }
    .secret-button:hover { background:#ff9bd8; color:#26112d; }

    .secret-message {
      position:fixed; inset:0; z-index:120;
      display:grid; place-items:center; padding:25px;
      background:#10091eea; backdrop-filter:blur(22px);
      opacity:0; visibility:hidden; transition:.5s;
    }
    .secret-message.open { opacity:1; visibility:visible; }
    .secret-card {
      max-width:380px; width:100%; text-align:center;
      padding:38px 25px; border-radius:28px;
      border:1px solid #ffc1ed70;
      background:linear-gradient(145deg,#48264e,#201331);
      box-shadow:0 0 90px #e77bff35;
      transform:translateY(25px) scale(.94);
      transition:.5s;
    }
    .secret-message.open .secret-card {
      transform:translateY(0) scale(1);
    }
    .secret-card h3 { color:#ffb9e7; font-size:27px; margin:15px 0; }
    .secret-card p { color:#ead2ee; line-height:1.8; font-size:13px; }
    .secret-close {
      margin-top:25px; padding:12px 25px;
      border:0; border-radius:25px;
      background:#ffaddf; color:#28122e;
      font-weight:800; cursor:pointer;
    }

    .world nav, .hero > * {
      animation:floatIn 1s cubic-bezier(.16,1,.3,1) both;
    }
    .hero > *:nth-child(2) { animation-delay:.1s; }
    .hero > *:nth-child(3) { animation-delay:.2s; }
    .hero > *:nth-child(4) { animation-delay:.3s; }
    .hero > *:nth-child(5) { animation-delay:.4s; }
    @keyframes floatIn {
      from { opacity:0; transform:translateY(25px); }
      to { opacity:1; transform:translateY(0); }
    }

    @media(prefers-reduced-motion:reduce) {
      *,*::before,*::after {
        animation-duration:.01ms !important;
        transition-duration:.01ms !important;
      }
    }
  `;
  document.head.appendChild(style);

  // PARTICLE ENGINE
  const canvas = document.createElement("canvas");
  canvas.id = "universe-canvas";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let width, height, particles = [];
  let pointer = { x:-1000, y:-1000 };
  let entered = false;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr,0,0,dpr,0,0);

    particles = Array.from({length:Math.min(130,Math.floor(width/5))}, () => ({
      x:Math.random()*width,
      y:Math.random()*height,
      r:Math.random()*1.8+.3,
      speed:Math.random()*.35+.08,
      phase:Math.random()*Math.PI*2,
      hue:Math.random()>.5 ? 320 : 270
    }));
  }

  function draw() {
    ctx.clearRect(0,0,width,height);
    const time = performance.now()*.001;

    particles.forEach(p => {
      p.y -= p.speed;
      p.x += Math.sin(time+p.phase)*.18;
      if (p.y < -5) {
        p.y = height+5;
        p.x = Math.random()*width;
      }

      const dx = pointer.x-p.x;
      const dy = pointer.y-p.y;
      const distance = Math.sqrt(dx*dx+dy*dy);

      if (distance < 100 && distance > 0) {
        p.x -= dx/distance*1.2;
        p.y -= dy/distance*1.2;
      }

      const alpha = .3 + (Math.sin(time*2+p.phase)+1)*.3;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = `hsla(${p.hue},100%,85%,${alpha})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#e99cff";
      ctx.fill();
    });

    ctx.shadowBlur = 0;
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize",resize);

  function movePointer(x,y) {
    pointer.x=x;
    pointer.y=y;
    const glow = $(".cursor-glow");
    if (glow) {
      glow.style.left=(x-140)+"px";
      glow.style.top=(y-140)+"px";
    }
  }

  window.addEventListener("pointermove",e => movePointer(e.clientX,e.clientY));
  window.addEventListener("touchmove",e => {
    if (e.touches[0]) movePointer(e.touches[0].clientX,e.touches[0].clientY);
  },{passive:true});

  // FLOATING CAT
  const cat = document.createElement("div");
  cat.className = "cat-runner";
  cat.textContent = "🐈‍⬛";
  document.body.appendChild(cat);

  // SECRET MESSAGE
  const secret = document.createElement("div");
  secret.className = "secret-message";
  secret.innerHTML = `
    <div class="secret-card">
      <div style="font-size:42px">୨୧ 🐈 ୨୧</div>
      <h3>A little secret...</h3>
      <p>This little universe is yours.<br>
      Every star, every tiny detail,<br>
      every little cat. ♡</p>
      <button class="secret-close">CLOSE ♡</button>
    </div>
  `;
  document.body.appendChild(secret);

  function closeSecret() {
    secret.classList.remove("open");
  }
  secret.querySelector(".secret-close").addEventListener("click",closeSecret);
  secret.addEventListener("click",e => {
    if (e.target === secret) closeSecret();
  });

  const surprise = document.createElement("button");
  surprise.className = "secret-button";
  surprise.textContent = "✧ OPEN A LITTLE SECRET ✧";
  $(".hero").appendChild(surprise);
  surprise.addEventListener("click",() => secret.classList.add("open"));

  // CINEMATIC ENTRY
  enter.addEventListener("click",() => {
    if (entered) return;
    entered = true;
    enter.disabled = true;

    const cinema = document.createElement("div");
    cinema.className = "cinema";
    cinema.innerHTML = `
      <div class="cinema-flash"></div>
      <div class="cinema-word">KOKOSAK ♡</div>
    `;
    document.body.appendChild(cinema);

    welcome.style.transition = "transform 2.5s cubic-bezier(.7,0,.2,1), opacity 2s";
    welcome.style.transform = "scale(1.7)";
    welcome.style.opacity = "0";

    cinema.classList.add("active");

    setTimeout(() => {
      welcome.style.display = "none";
      world.classList.add("unlocked");
      window.scrollTo({top:0,behavior:"instant"});
    },3000);

    setTimeout(() => {
      cinema.remove();
      canvas.style.opacity = "1";
    },4500);
  });

  canvas.style.transition = "opacity 1s";
  canvas.style.opacity = "0";
  setTimeout(() => {
    canvas.style.opacity = "1";
  },800);
})();
