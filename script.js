
/* =========================================
   KOKOSAK DREAMVERSE — MAGIC EXPERIENCE ♡
========================================= */

const $ = (id) => document.getElementById(id);

const loader = $("loader");
const transition = $("transition-overlay");
const enterButton = $("enter-world");
const universe = document.querySelector(".universe-section");
const avatarCard = document.querySelector(".avatar-card");
const mochi = $("mochi");
const petButton = $("pet-mochi");
const mochiMessage = $("mochi-message");
const surpriseButton = $("surprise-button");

let entering = false;
let mochiLove = 0;

/* LOADER */

function hideLoader() {
  if (loader) loader.classList.add("loaded");
}

window.addEventListener("load", hideLoader);
window.setTimeout(hideLoader, 1800);

/* PARTICLES */

function burst(x, y, amount = 20) {
  const symbols = ["♡", "✦", "✧", "🐾", "⋆", "❀"];
  const colors = ["#ff83c5", "#c09cff", "#ffffff", "#ffb5dc"];

  for (let i = 0; i < amount; i++) {
    const particle = document.createElement("div");

    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    Object.assign(particle.style, {
      position: "fixed",
      left: x + "px",
      top: y + "px",
      zIndex: "10020",
      pointerEvents: "none",
      color: colors[Math.floor(Math.random() * colors.length)],
      fontSize: 15 + Math.random() * 25 + "px",
      textShadow: "0 0 15px #ff83c5"
    });

    document.body.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const distance = 70 + Math.random() * 180;

    const animation = particle.animate([
      {
        opacity: 0,
        transform: "translate(0,0) scale(.2)"
      },
      {
        opacity: 1,
        offset: .2
      },
      {
        opacity: 0,
        transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(.2) rotate(180deg)`
      }
    ], {
      duration: 900 + Math.random() * 800,
      easing: "cubic-bezier(.16,.8,.2,1)"
    });

    animation.onfinish = () => particle.remove();
  }
}

/* PORTAL STYLE */

const portalStyle = document.createElement("style");

portalStyle.textContent = `
  #transition-overlay {
    position: fixed;
    inset: 0;
    z-index: 99999;
    display: grid;
    place-items: center;
    overflow: hidden;
    background:
      radial-gradient(circle at center, #fff 0%, #ffe5f5 25%, #e4d1ff 65%, #b18ae9 100%);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  #transition-overlay.active {
    opacity: 1;
    visibility: visible;
    pointer-events: all;
  }

  .magic-portal {
    position: absolute;
    width: 30vmin;
    height: 30vmin;
    min-width: 180px;
    min-height: 180px;
    max-width: 380px;
    max-height: 380px;
    border-radius: 50%;
    background:
      radial-gradient(circle, #fff 0%, #fff5fc 25%, #ff9bd5 55%, #b99aff 75%, #fff 100%);
    box-shadow:
      0 0 35px #fff,
      0 0 90px #ff9bd5,
      0 0 180px #b99aff;
    transform: scale(.05);
    opacity: 0;
  }

  .magic-portal::before,
  .magic-portal::after {
    content: "";
    position: absolute;
    inset: -18px;
    border: 3px solid #fff;
    border-radius: 50%;
    box-shadow: 0 0 25px #ffb4e0;
  }

  .magic-portal::after {
    inset: -38px;
    border-color: #ffc1e6;
    border-style: dashed;
  }

  .portal-kitty {
    position: relative;
    z-index: 2;
    font-size: clamp(85px, 18vw, 150px);
    filter: drop-shadow(0 10px 20px #d18bc9);
    transform: scale(.2) rotate(-25deg);
    opacity: 0;
  }

  .portal-caption {
    position: absolute;
    top: calc(50% + 130px);
    width: 100%;
    text-align: center;
    color: white;
    font: 700 clamp(17px, 4vw, 27px) 'Fredoka', sans-serif;
    letter-spacing: 4px;
    text-shadow: 0 3px 15px #a77bc6;
    opacity: 0;
    transform: translateY(20px);
  }

  .portal-ring {
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid white;
    border-radius: 50%;
    opacity: 0;
  }

  .world-reveal {
    animation: worldReveal 1.1s cubic-bezier(.16,.8,.2,1) both;
  }

  @keyframes worldReveal {
    from {
      opacity: 0;
      filter: blur(15px);
      transform: translateY(35px) scale(.97);
    }
    to {
      opacity: 1;
      filter: blur(0);
      transform: translateY(0) scale(1);
    }
  }

  .avatar-arrive {
    animation: avatarArrive 1.3s cubic-bezier(.16,.8,.2,1) both;
  }

  @keyframes avatarArrive {
    from {
      opacity: 0;
      transform: translateY(70px) scale(.75) rotate(-5deg);
      filter: blur(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1) rotate(0);
      filter: blur(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .world-reveal, .avatar-arrive {
      animation-duration: .01ms;
    }
  }
`;

document.head.appendChild(portalStyle);

/* PORTAL EXPERIENCE */

function playPortal() {
  if (!transition) return Promise.resolve();

  transition.innerHTML = `
    <div class="magic-portal"></div>
    <div class="portal-kitty">🐱</div>
    <div class="portal-caption">WELCOME TO HER WORLD ♡</div>
  `;

  transition.classList.add("active");

  const portal = transition.querySelector(".magic-portal");
  const kitty = transition.querySelector(".portal-kitty");
  const caption = transition.querySelector(".portal-caption");

  const duration = 2400;

  portal.animate([
    { transform: "scale(.05) rotate(-90deg)", opacity: 0 },
    { transform: "scale(.8) rotate(0deg)", opacity: 1, offset: .25 },
    { transform: "scale(1.2) rotate(25deg)", opacity: 1, offset: .55 },
    { transform: "scale(16) rotate(80deg)", opacity: 1, offset: .85 },
    { transform: "scale(24) rotate(100deg)", opacity: 0 }
  ], {
    duration,
    easing: "cubic-bezier(.16,.8,.2,1)",
    fill: "forwards"
  });

  kitty.animate([
    { transform: "scale(.2) rotate(-25deg)", opacity: 0 },
    { transform: "scale(1.1) rotate(8deg)", opacity: 1, offset: .25 },
    { transform: "scale(1) rotate(0deg)", opacity: 1, offset: .55 },
    { transform: "scale(3) rotate(20deg)", opacity: 0 }
  ], {
    duration: 1800,
    easing: "cubic-bezier(.16,.8,.2,1)",
    fill: "forwards"
  });

  caption.animate([
    { opacity: 0, transform: "translateY(20px)" },
    { opacity: 1, transform: "translateY(0)", offset: .3 },
    { opacity: 1, transform: "translateY(0)", offset: .6 },
    { opacity: 0, transform: "translateY(-20px)" }
  ], {
    duration: 1700,
    fill: "forwards"
  });

  for (let i = 0; i < 35; i++) {
    window.setTimeout(() => {
      burst(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight,
        3
      );
    }, i * 45);
  }

  return new Promise(resolve => {
    window.setTimeout(resolve, duration);
  });
}

/* ENTER HER WORLD */

async function enterWorld() {
  if (entering) return;

  entering = true;
  if (enterButton) enterButton.disabled = true;

  await playPortal();

  if (transition) {
    transition.classList.remove("active");
    transition.innerHTML = "";
  }

  if (universe) {
    universe.classList.remove("world-reveal");
    void universe.offsetWidth;
    universe.classList.add("world-reveal");

    universe.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  if (avatarCard) {
    avatarCard.classList.remove("avatar-arrive");
    void avatarCard.offsetWidth;
    avatarCard.classList.add("avatar-arrive");
  }

  burst(window.innerWidth / 2, window.innerHeight / 2, 45);

  entering = false;
  if (enterButton) enterButton.disabled = false;
}

if (enterButton) {
  enterButton.addEventListener("click", enterWorld);
}

/* MOCHI */

function petMochi() {
  if (!mochi) return;

  mochiLove++;

  const messages = [
    "Mochi loves you!! ♡",
    "Prrrrr... so happy!",
    "Mochi wants more cuddles!",
    "You are Mochi's favourite human!",
    "Mochi is making biscuits! 🐾",
    "A tiny kiss for you! 💗",
    "Mochi is melting from happiness!"
  ];

  if (mochiMessage) {
    mochiMessage.textContent =
      messages[Math.floor(Math.random() * messages.length)];
  }

  mochi.animate([
    { transform: "scale(1) rotate(0deg)" },
    { transform: "scale(1.2) rotate(-8deg)", offset: .3 },
    { transform: "scale(.92) rotate(8deg)", offset: .65 },
    { transform: "scale(1) rotate(0deg)" }
  ], {
    duration: 550,
    easing: "ease-out"
  });

  const rect = mochi.getBoundingClientRect();

  burst(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2,
    12
  );

  if (mochiLove % 5 === 0 && mochiMessage) {
    mochiMessage.textContent = "Mochi gave you a BIG kiss! 💗";
    burst(window.innerWidth / 2, window.innerHeight / 2, 35);
  }
}

if (petButton) petButton.addEventListener("click", petMochi);
if (mochi) mochi.addEventListener("click", petMochi);

/* SURPRISE */

function openSurprise() {
  const modal = document.createElement("div");

  Object.assign(modal.style, {
    position: "fixed",
    inset: "0",
    zIndex: "10002",
    display: "grid",
    placeItems: "center",
    padding: "25px",
    background: "#76568a88",
    backdropFilter: "blur(12px)"
  });

  modal.innerHTML = `
    <div class="surprise-modal">
      <div class="surprise-gift">🎀</div>
      <h2>A little gift!</h2>
      <p>
        You are the main character of this little universe.
        Never forget how special you are. ♡
      </p>
      <div class="surprise-emojis">🐱 💗 ✨</div>
      <button id="close-surprise">AWWW ♡</button>
    </div>
  `;

  const style = document.createElement("style");

  style.textContent = `
    .surprise-modal {
      width: 100%;
      max-width: 340px;
      padding: 35px 25px;
      text-align: center;
      border: 2px solid white;
      border-radius: 30px;
      background: linear-gradient(145deg,#fff7fc,#f1e3ff);
      box-shadow: 0 20px 80px #704b8b55;
      animation: surpriseAppear .5s ease both;
    }
    .surprise-gift { font-size: 65px; }
    .surprise-modal h2 {
      font: 700 30px 'Fredoka', sans-serif;
      color: #a67bbd;
      margin: 15px 0;
    }
    .surprise-modal p {
      font: 600 14px 'Nunito', sans-serif;
      color: #a78bb5;
      line-height: 1.8;
    }
    .surprise-emojis { font-size: 30px; margin: 20px; }
    .surprise-modal button {
      border: 0;
      border-radius: 30px;
      padding: 13px 25px;
      color: white;
      background: linear-gradient(100deg,#ff95ca,#b69aff);
      font-weight: 900;
    }
    @keyframes surpriseAppear {
      from { opacity: 0; transform: scale(.7) translateY(20px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(modal);

  modal.querySelector("#close-surprise").addEventListener("click", () => {
    burst(window.innerWidth / 2, window.innerHeight / 2, 25);
    modal.remove();
    style.remove();
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.remove();
      style.remove();
    }
  });
}

if (surpriseButton) {
  surpriseButton.addEventListener("click", openSurprise);
}

/* MAGIC TOUCH */

document.addEventListener("pointerdown", (event) => {
  if (
    event.target.closest("button") ||
    event.target.closest("a") ||
    event.target.closest(".mochi-character")
  ) return;

  burst(event.clientX, event.clientY, 4);
}, { passive: true });

/* AVATAR MOVEMENT */

if (avatarCard) {
  window.addEventListener("pointermove", (event) => {
    if (window.innerWidth < 700) return;

    const x = (event.clientX / window.innerWidth - .5) * 10;
    const y = (event.clientY / window.innerHeight - .5) * -10;

    avatarCard.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    avatarCard.style.transform = "";
  });
}

console.log("KOKOSAK DREAMVERSE — MAGIC READY ♡");
