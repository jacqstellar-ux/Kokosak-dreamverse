
/* ==========================================
   KOKOSAK DREAMVERSE — FIXED VERSION
========================================== */

const $ = (id) => document.getElementById(id);

const loader = $("loader");
const entrance = $("entrance");
const dreamverse = $("dreamverse");
const enterButton = $("enter-world");
const transition = $("transition-overlay");

const petButton = $("pet-cat");
const cat = $("companion-cat");
const petMessage = $("pet-message");
const heartCount = $("heart-count");
const surpriseButton = $("surprise-button");
const magicButton = $("magic-button");

let entered = false;
let lovePoints = 0;
let petCount = 0;

/* LOADER */

function hideLoader() {
  if (loader) loader.classList.add("loaded");
}

window.addEventListener("load", hideLoader);
setTimeout(hideLoader, 1800);

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
        { opacity: 0, transform: "translate(0,0) scale(.2)" },
        { opacity: 1, offset: .2 },
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

/* PORTAL */

function playPortal() {
  if (!transition) return;

  transition.innerHTML = `
    <div class="portal-cat">
      <div class="portal-ear left"></div>
      <div class="portal-ear right"></div>
      <div class="portal-face"><span>♡</span></div>
    </div>
    <div class="portal-text">WELCOME TO HER WORLD</div>
  `;

  transition.style.visibility = "visible";
  transition.style.pointerEvents = "all";
  transition.style.opacity = "1";

  const portal = transition.querySelector(".portal-cat");
  const label = transition.querySelector(".portal-text");

  if (portal) {
    portal.animate(
      [
        { transform: "scale(.05) rotate(-90deg)", opacity: 0 },
        { transform: "scale(1.1) rotate(0deg)", opacity: 1, offset: .4 },
        { transform: "scale(8) rotate(25deg)", opacity: 0 }
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
        { opacity: 0, transform: "translateY(20px)" },
        { opacity: 1, transform: "translateY(0)", offset: .35 },
        { opacity: 0, transform: "translateY(-15px)" }
      ],
      { duration: 1300, fill: "forwards" }
    );
  }

  for (let i = 0; i < 25; i++) {
    setTimeout(() => {
      burst(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight,
        2
      );
    }, i * 35);
  }
}

/* ENTER DREAMVERSE */

function enterDreamverse() {
  if (entered || !entrance || !dreamverse) return;

  entered = true;

  if (enterButton) enterButton.disabled = true;

  playPortal();

  setTimeout(() => {
    entrance.classList.add("hidden");
    entrance.style.display = "none";

    dreamverse.classList.remove("hidden");
    dreamverse.style.display = "block";
    dreamverse.style.visibility = "visible";
    dreamverse.style.opacity = "1";
    dreamverse.style.transform = "none";

    if (transition) {
      transition.style.animation = "none";
      transition.style.opacity = "0";
      transition.style.visibility = "hidden";
      transition.style.pointerEvents = "none";
      transition.innerHTML = "";
    }

    window.scrollTo(0, 0);

    dreamverse.animate(
      [
        { opacity: 0, transform: "scale(1.04)" },
        { opacity: 1, transform: "scale(1)" }
      ],
      {
        duration: 1000,
        easing: "ease-out"
      }
    );

    burst(window.innerWidth / 2, window.innerHeight / 2, 35);

  }, 1500);
}

if (enterButton) {
  enterButton.addEventListener("click", enterDreamverse);
}

/* MOCHI */

function petMochi() {
  if (!cat) return;

  petCount++;
  lovePoints += 5;

  if (heartCount) heartCount.textContent = lovePoints;

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
    { duration: 550, easing: "ease-out" }
  );

  const rect = cat.getBoundingClientRect();
  burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);

  if (petCount % 5 === 0) {
    lovePoints += 25;
    if (heartCount) heartCount.textContent = lovePoints;
    if (petMessage) petMessage.textContent = "Mochi gave you a BIG kiss! 💗 +25";
    burst(window.innerWidth / 2, window.innerHeight / 2, 35);
  }
}

if (petButton) petButton.addEventListener("click", petMochi);
if (cat) cat.addEventListener("click", petMochi);

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
        border:0;border-radius:30px;padding:13px 25px;
        color:white;background:linear-gradient(100deg,#ff95ca,#b69aff);
        font-weight:900;
      ">AWWW ♡</button>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector("#close-surprise").addEventListener("click", () => {
    burst(window.innerWidth / 2, window.innerHeight / 2, 25);
    modal.remove();
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.remove();
  });
}

if (surpriseButton) {
  surpriseButton.addEventListener("click", openSurprise);
}

/* MAGIC MOMENT */

if (magicButton) {
  magicButton.addEventListener("click", () => {
    burst(window.innerWidth / 2, window.innerHeight / 2, 55);

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

/* TOUCH MAGIC */

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

    avatarCard.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    avatarCard.style.transform = "";
  });
}

console.log("KOKOSAK DREAMVERSE — FIXED 🐾");
