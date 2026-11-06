/* ======================================
   KOKOSAK DREAMVERSE
   Complete interactive experience ♡
====================================== */

const $ = (id) => document.getElementById(id);

const loader = $("loader");
const transition = $("transition-overlay");
const enterButton = $("enter-world");
const universe = document.querySelector(".universe-section");

const mochi = $("mochi");
const petButton = $("pet-mochi");
const mochiMessage = $("mochi-message");
const surpriseButton = $("surprise-button");
const avatarCard = document.querySelector(".avatar-card");

let mochiLove = 0;
let entering = false;

/* LOADER */

function hideLoader() {
  if (loader) loader.classList.add("loaded");
}

window.addEventListener("load", hideLoader);
window.setTimeout(hideLoader, 1800);

/* PARTICLES */

function burst(x, y, amount = 18) {
  const symbols = ["♡", "✦", "✧", "🐾", "⋆"];
  const colors = ["#ff83c5", "#c09cff", "#ffffff", "#ffb5dc"];

  for (let i = 0; i < amount; i++) {
    const particle = document.createElement("div");

    particle.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    Object.assign(particle.style, {
      position: "fixed",
      left: x + "px",
      top: y + "px",
      zIndex: "10001",
      pointerEvents: "none",
      color: colors[Math.floor(Math.random() * colors.length)],
      fontSize: 16 + Math.random() * 22 + "px",
      textShadow: "0 0 15px #ff83c5"
    });

    document.body.appendChild(particle);

    const animation = particle.animate(
      [
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
          transform:
            `translate(${(Math.random() - .5) * 220}px,${-100 - Math.random() * 200}px) scale(.3) rotate(100deg)`
        }
      ],
      {
        duration: 1000 + Math.random() * 700,
        easing: "ease-out"
      }
    );

    animation.onfinish = () => particle.remove();
  }
}

/* PORTAL TRANSITION */

function playPortal() {
  if (!transition) return;

  transition.innerHTML = `
    <div class="portal-content">
      <div class="portal-cat">
        <div class="portal-ear left"></div>
        <div class="portal-ear right"></div>
        <div class="portal-face"><span>♡</span></div>
      </div>
      <div class="portal-text">WELCOME TO HER WORLD</div>
    </div>
  `;

  transition.classList.add("active");

  const portal = transition.querySelector(".portal-cat");
  const label = transition.querySelector(".portal-text");

  if (portal) {
    portal.animate(
      [
        {
          transform: "scale(.05) rotate(-90deg)",
          opacity: 0
        },
        {
          transform: "scale(1.1) rotate(0deg)",
          opacity: 1,
          offset: .4
        },
        {
          transform: "scale(8) rotate(25deg)",
          opacity: 0
        }
      ],
      {
        duration: 1400,
        fill: "forwards",
        easing: "cubic-bezier(.16,.8,.2,1)"
      }
    );
  }

  if (label) {
    label.animate(
      [
        {
          opacity: 0,
          transform: "translateY(20px)"
        },
        {
          opacity: 1,
          transform: "translateY(0)",
          offset: .35
        },
        {
          opacity: 0,
          transform: "translateY(-15px)"
        }
      ],
      {
        duration: 1300,
        fill: "forwards"
      }
    );
  }

  for (let i = 0; i < 25; i++) {
    window.setTimeout(() => {
      burst(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight,
        2
      );
    }, i * 35);
  }
}

/* ENTER HER WORLD */

function enterWorld() {
  if (entering) return;

  entering = true;

  if (enterButton) {
    enterButton.disabled = true;
  }

  playPortal();

  window.setTimeout(() => {
    if (transition) {
      transition.classList.remove("active");
      transition.innerHTML = "";
    }

    if (universe) {
      universe.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

    burst(
      window.innerWidth / 2,
      window.innerHeight / 2,
      35
    );

    entering = false;

    if (enterButton) {
      enterButton.disabled = false;
    }
  }, 1500);
}

if (enterButton) {
  enterButton.addEventListener("click", enterWorld);
}

/* MOCHI */

function petMochi() {
  if (!mochi) return;

  mochiLove += 1;

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

  mochi.animate(
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

  const rect = mochi.getBoundingClientRect();

  burst(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2,
    12
  );

  if (mochiLove % 5 === 0) {
    if (mochiMessage) {
      mochiMessage.textContent =
        "Mochi gave you a BIG kiss! 💗";
    }

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

if (mochi) {
  mochi.addEventListener("click", petMochi);
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
    <div class="surprise-modal">
      <div class="surprise-gift">🎀</div>

      <h2>A little gift!</h2>

      <p>
        You are the main character of this little universe.
        Never forget how special you are. ♡
      </p>

      <div class="surprise-emojis">🐱 💗 ✨</div>

      <button id="close-surprise">
        AWWW ♡
      </button>
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

    .surprise-gift {
      font-size: 65px;
    }

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

    .surprise-emojis {
      font-size: 30px;
      margin: 20px;
    }

    .surprise-modal button {
      border: 0;
      border-radius: 30px;
      padding: 13px 25px;
      color: white;
      background: linear-gradient(100deg,#ff95ca,#b69aff);
      font-weight: 900;
    }

    @keyframes surpriseAppear {
      from {
        opacity: 0;
        transform: scale(.7) translateY(20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(modal);

  modal.querySelector("#close-surprise").addEventListener("click", () => {
    burst(
      window.innerWidth / 2,
      window.innerHeight / 2,
      25
    );

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

/* MAGIC TOUCH EFFECT */

document.addEventListener("pointerdown", (event) => {
  if (
    event.target.closest("button") ||
    event.target.closest("a") ||
    event.target.closest(".mochi-character")
  ) {
    return;
  }

  burst(event.clientX, event.clientY, 4);
}, { passive: true });

/* AVATAR 3D MOVEMENT */

if (avatarCard) {
  window.addEventListener("pointermove", (event) => {
    if (window.innerWidth < 700) return;

    const x =
      (event.clientX / window.innerWidth - .5) * 10;

    const y =
      (event.clientY / window.innerHeight - .5) * -10;

    avatarCard.style.transform =
      `rotateY(${x}deg) rotateX(${y}deg)`;
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    avatarCard.style.transform = "";
  });
}

console.log("KOKOSAK DREAMVERSE — READY ♡");
