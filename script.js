/* ==========================================
   KOKOSAK DREAMVERSE
   CAT UNIVERSE EXPERIENCE
========================================== */

const loader = document.getElementById("loader");
const entrance = document.getElementById("entrance");
const dreamverse = document.getElementById("dreamverse");
const enterButton = document.getElementById("enter-world");
const transition = document.getElementById("transition-overlay");

const petButton = document.getElementById("pet-cat");
const cat = document.getElementById("companion-cat");
const petMessage = document.getElementById("pet-message");
const heartCount = document.getElementById("heart-count");

const surpriseButton = document.getElementById("surprise-button");
const magicButton = document.getElementById("magic-button");

let entered = false;
let lovePoints = 0;
let petCount = 0;

/* LOADER */

function hideLoader() {
  if (loader) loader.classList.add("loaded");
}

window.addEventListener("load", hideLoader);
setTimeout(hideLoader, 1600);

/* PARTICLE ENGINE */

function createParticle(x, y, symbol, color, size = 24) {
  const particle = document.createElement("div");

  particle.textContent = symbol;

  Object.assign(particle.style, {
    position: "fixed",
    left: x + "px",
    top: y + "px",
    zIndex: "10001",
    pointerEvents: "none",
    color: color,
    fontSize: size + "px",
    textShadow: "0 0 15px " + color,
    transform: "translate(-50%, -50%)",
    willChange: "transform, opacity"
  });

  document.body.appendChild(particle);

  const destinationX = (Math.random() - 0.5) * 260;
  const destinationY = -80 - Math.random() * 260;
  const rotation = (Math.random() - 0.5) * 180;

  const animation = particle.animate(
    [
      {
        opacity: 0,
        transform: "translate(-50%, -50%) scale(.2) rotate(0deg)"
      },
      {
        opacity: 1,
        offset: .2,
        transform: "translate(-50%, -50%) scale(1.3) rotate(20deg)"
      },
      {
        opacity: 0,
        transform:
          `translate(calc(-50% + ${destinationX}px), calc(-50% + ${destinationY}px)) scale(.2) rotate(${rotation}deg)`
      }
    ],
    {
      duration: 1000 + Math.random() * 1000,
      easing: "cubic-bezier(.15,.7,.3,1)"
    }
  );

  animation.onfinish = () => particle.remove();
}

function burst(x, y, amount = 20) {
  const symbols = ["♡", "✦", "✧", "🐾", "⋆"];
  const colors = ["#ff83c5", "#c09cff", "#ffffff", "#ffb5dc"];

  for (let i = 0; i < amount; i++) {
    createParticle(
      x,
      y,
      symbols[Math.floor(Math.random() * symbols.length)],
      colors[Math.floor(Math.random() * colors.length)],
      14 + Math.random() * 22
    );
  }
}

/* CAT PAW PORTAL */

function createPortal() {
  if (!transition) return;

  transition.innerHTML = "";

  const portal = document.createElement("div");
  portal.className = "portal-cat";

  portal.innerHTML = `
    <div class="portal-ear left"></div>
    <div class="portal-ear right"></div>
    <div class="portal-face"><span>♡</span></div>
  `;

  const label = document.createElement("div");
  label.className = "portal-text";
  label.textContent = "WELCOME TO HER WORLD";

  const paw = document.createElement("div");
  paw.textContent = "🐾";

  Object.assign(paw.style, {
    position: "absolute",
    fontSize: "100px",
    opacity: "0",
    filter: "drop-shadow(0 0 25px #ff8dce)",
    zIndex: "4"
  });

  transition.append(portal, label, paw);

  const symbols = ["♡", "✦", "୨୧", "✧", "🐾", "⋆"];

  for (let i = 0; i < 45; i++) {
    const sparkle = document.createElement("span");
    sparkle.textContent = symbols[i % symbols.length];

    Object.assign(sparkle.style, {
      position: "absolute",
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      color: "white",
      fontSize: 15 + Math.random() * 30 + "px",
      opacity: "0",
      pointerEvents: "none",
      textShadow: "0 0 15px #ff70c6"
    });

    transition.appendChild(sparkle);
  }

  return { portal, label, paw };
}

function playPortal() {
  if (!transition) return;

  const elements = createPortal();
  const { portal, label, paw } = elements;

  transition.style.visibility = "visible";
  transition.style.pointerEvents = "all";

  transition.animate(
    [
      { opacity: 0 },
      { opacity: 1, offset: .15 },
      { opacity: 1 }
    ],
    { duration: 450, fill: "forwards" }
  );

  portal.animate(
    [
      { transform: "scale(.05) rotate(-90deg)", opacity: 0 },
      { transform: "scale(.8) rotate(0deg)", opacity: 1, offset: .45 },
      { transform: "scale(1.25) rotate(8deg)", opacity: 1 },
      { transform: "scale(8) rotate(25deg)", opacity: 0 }
    ],
    {
      duration: 1900,
      fill: "forwards",
      easing: "cubic-bezier(.16,.8,.2,1)"
    }
  );

  label.animate(
    [
      { opacity: 0, transform: "translateY(20px)" },
      { opacity: 1, transform: "translateY(0)", offset: .4 },
      { opacity: 0, transform: "translateY(-15px)" }
    ],
    { duration: 1700, fill: "forwards" }
  );

  paw.animate(
    [
      { opacity: 0, transform: "translate(100vw, 100vh) rotate(-60deg) scale(.2)" },
      { opacity: 1, offset: .25, transform: "translate(0, 0) rotate(0deg) scale(1.3)" },
      { opacity: 0, transform: "translate(-100vw, -100vh) rotate(60deg) scale(2)" }
    ],
    {
      duration: 1500,
      delay: 250,
      fill: "forwards",
      easing: "ease-in-out"
    }
  );

  transition.querySelectorAll("span").forEach((sparkle, index) => {
    sparkle.animate(
      [
        { opacity: 0, transform: "scale(.2) rotate(0deg)" },
        { opacity: 1, transform: "scale(1.5) rotate(90deg)", offset: .5 },
        { opacity: 0, transform: "scale(.1) rotate(180deg)" }
      ],
      {
        duration: 1200 + Math.random() * 1000,
        delay: index * 15,
        fill: "forwards"
      }
    );
  });
}

/* ENTER THE SECOND WORLD */

if (enterButton) {
  enterButton.addEventListener("click", () => {
    if (entered) return;

    entered = true;
    enterButton.disabled = true;

    playPortal();

    setTimeout(() => {
      entrance.classList.add("hidden");
      dreamverse.classList.remove("hidden");

      window.scrollTo({ top: 0, behavior: "instant" });

      dreamverse.animate(
        [
          { opacity: 0, transform: "scale(1.08)" },
          { opacity: 1, transform: "scale(1)" }
        ],
        {
          duration: 1100,
          easing: "cubic-bezier(.16,.8,.2,1)"
        }
      );

      setTimeout(() => {
        transition.animate(
          [{ opacity: 1 }, { opacity: 0 }],
          { duration: 850, fill: "forwards" }
        );

        setTimeout(() => {
          transition.style.visibility = "hidden";
          transition.style.pointerEvents = "none";
        }, 900);

      }, 400);

    }, 1450);
  });
}

/* MOCHI - PET THE CAT */

function petMochi() {
  if (!cat) return;

  petCount++;
  lovePoints += 5;

  if (heartCount) {
    heartCount.textContent = lovePoints;
  }

  const messages = [
    "Mochi loves you!! ♡",
    "Prrrrr... so happy!",
    "Mochi wants more cuddles!",
    "You are Mochi's favourite human!",
    "Mochi is making biscuits! 🐾",
    "A tiny kiss for you! 💗",
    "Mochi is melting from happiness!"
  ];

  if (petMessage) {
    petMessage.textContent =
      messages[Math.floor(Math.random() * messages.length)];
  }

  cat.animate(
    [
      { transform: "scale(1) rotate(0deg)" },
      { transform: "scale(1.2) rotate(-8deg)", offset: .3 },
      { transform: "scale(.92) rotate(8deg)", offset: .65 },
      { transform: "scale(1) rotate(0deg)" }
    ],
    {
      duration: 550,
      easing: "ease-out"
    }
  );

  const rect = cat.getBoundingClientRect();

  burst(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2,
    12
  );

  if (petCount % 5 === 0 && petMessage) {
    petMessage.textContent = "Mochi gave you a BIG kiss! 💗 +25";
    lovePoints += 25;
    heartCount.textContent = lovePoints;
    burst(
      window.innerWidth / 2,
      window.innerHeight / 2,
      35
    );
  }
}

if (petButton) {
  petButton.addEventListener("click", petMochi);
}

if (cat) {
  cat.addEventListener("click", petMochi);
}

/* SECRET SURPRISE */

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
    <div style="
      width:100%;
      max-width:340px;
      padding:35px 25px;
      text-align:center;
      border:2px solid white;
      border-radius:30px;
      background:linear-gradient(145deg,#fff7fc,#f1e3ff);
      box-shadow:0 20px 80px #704b8b55;
      animation:surprisePop .5s cubic-bezier(.2,1.5,.4,1);
    ">
      <div style="font-size:65px">🎀</div>
      <h2 style="font:700 30px Fredoka;color:#a67bbd;margin:15px 0">
        A little gift!
      </h2>
      <p style="font:600 14px Nunito;color:#a78bb5;line-height:1.8">
        You are the main character of this little universe.
        Never forget how special you are. ♡
      </p>
      <div style="font-size:30px;margin:20px">🐱 💗 ✨</div>
      <button id="close-surprise" style="
        border:0;
        border-radius:30px;
        padding:13px 25px;
        color:white;
        background:linear-gradient(100deg,#ff95ca,#b69aff);
        font-weight:900;
        letter-spacing:1px;
      ">AWWW ♡</button>
    </div>
  `;

  document.body.appendChild(modal);

  const style = document.createElement("style");
  style.textContent = `
    @keyframes surprisePop {
      from { transform:scale(.5) rotate(-8deg); opacity:0; }
      to { transform:scale(1) rotate(0); opacity:1; }
    }
  `;

  document.head.appendChild(style);

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

/* MAGIC MOMENT */

if (magicButton) {
  magicButton.addEventListener("click", () => {
    burst(
      window.innerWidth / 2,
      window.innerHeight / 2,
      55
    );

    magicButton.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.08) rotate(2deg)" },
        { transform: "scale(.97) rotate(-2deg)" },
        { transform: "scale(1)" }
      ],
      { duration: 550 }
    );
  });
}

/* BACKGROUND TOUCH MAGIC */

document.addEventListener("pointerdown", (event) => {
  if (!dreamverse || dreamverse.classList.contains("hidden")) return;

  if (
    event.target.closest("button") ||
    event.target.closest("a") ||
    event.target.closest(".companion-cat")
  ) return;

  burst(event.clientX, event.clientY, 5);
}, { passive: true });

/* AVATAR PARALLAX */

const avatarCard = document.querySelector(".real-avatar-card");

if (avatarCard) {
  window.addEventListener("pointermove", (event) => {
    if (window.innerWidth < 700) return;

    const x = (event.clientX / window.innerWidth - .5) * 10;
    const y = (event.clientY / window.innerHeight - .5) * -10;

    avatarCard.style.transform =
      `rotateY(${x}deg) rotateX(${y}deg)`;
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    avatarCard.style.transform = "";
  });
}

/* FINISH */

console.log("KOKOSAK DREAMVERSE — CAT UNIVERSE READY 🐾");
