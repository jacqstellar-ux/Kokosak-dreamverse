
/* ==========================================
   KOKOSAK DREAMVERSE
   CINEMATIC PORTAL ENGINE
   ========================================== */

const loader = document.getElementById("loader");
const entrance = document.getElementById("entrance");
const dreamverse = document.getElementById("dreamverse");
const enterButton = document.getElementById("enter-world");
const transition = document.getElementById("transition-overlay");
const avatar = document.getElementById("roblox-avatar");

let entered = false;

// ==========================================
// INITIALIZATION
// ==========================================

if (entrance) entrance.classList.remove("hidden");
if (dreamverse) dreamverse.classList.add("hidden");

function hideLoader() {
  if (loader) loader.classList.add("loaded");
}

hideLoader();
window.addEventListener("load", hideLoader);

setTimeout(hideLoader, 1500);

// ==========================================
// AVATAR
// ==========================================

if (avatar) {
  avatar.loading = "eager";
  avatar.decoding = "async";

  avatar.addEventListener("load", () => {
    avatar.classList.add("avatar-loaded");
  });
}

// ==========================================
// PORTAL VISUAL ENGINE
// ==========================================

function createPortal() {
  if (!transition) return null;

  transition.innerHTML = "";

  Object.assign(transition.style, {
    position: "fixed",
    inset: "0",
    zIndex: "9999",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    overflow: "hidden",
    opacity: "0",
    visibility: "hidden",
    pointerEvents: "none",
    background: "radial-gradient(circle, #fff 0%, #ffe0f2 35%, #d6baff 100%)"
  });

  const portal = document.createElement("div");

  Object.assign(portal.style, {
    position: "absolute",
    width: "min(75vw, 420px)",
    aspectRatio: "1",
    borderRadius: "50%",
    border: "5px solid white",
    background: "radial-gradient(circle, #ffffff 0%, #ffb9e2 35%, #d7aaff 65%, #ffffff 100%)",
    boxShadow: "0 0 25px #fff, 0 0 65px #ff8ed0, 0 0 130px #c79aff, inset 0 0 45px white",
    transform: "scale(0) rotate(-90deg)",
    opacity: "0"
  });

  const heart = document.createElement("div");
  heart.textContent = "♡";

  Object.assign(heart.style, {
    position: "relative",
    zIndex: "2",
    color: "white",
    fontSize: "clamp(100px, 25vw, 170px)",
    textShadow: "0 0 20px #ff73c5, 0 0 55px #ff8bd1",
    opacity: "0",
    transform: "scale(.2)"
  });

  const label = document.createElement("div");
  label.textContent = "ENTERING HER WORLD";

  Object.assign(label.style, {
    position: "relative",
    zIndex: "3",
    marginTop: "30px",
    color: "#a66da9",
    fontFamily: "sans-serif",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "4px",
    opacity: "0"
  });

  transition.appendChild(portal);
  transition.appendChild(heart);
  transition.appendChild(label);

  // Floating sparkles
  const symbols = ["✦", "♡", "✧", "୨୧", "✩", "⋆"];

  for (let i = 0; i < 32; i++) {
    const sparkle = document.createElement("span");
    sparkle.textContent = symbols[i % symbols.length];

    Object.assign(sparkle.style, {
      position: "absolute",
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      color: "white",
      fontSize: (16 + Math.random() * 30) + "px",
      textShadow: "0 0 15px #ff69c7",
      pointerEvents: "none",
      opacity: "0",
      transform: "scale(.2)"
    });

    transition.appendChild(sparkle);
  }

  return { portal, heart, label };
}

// ==========================================
// PORTAL ANIMATION
// ==========================================

function playPortal() {
  if (!transition) return;

  const elements = createPortal();
  if (!elements) return;

  const { portal, heart, label } = elements;
  const sparkles = transition.querySelectorAll("span");

  transition.style.visibility = "visible";
  transition.style.pointerEvents = "all";

  const overlayAnimation = transition.animate(
    [
      { opacity: 0 },
      { opacity: 1, offset: 0.15 },
      { opacity: 1 }
    ],
    {
      duration: 400,
      fill: "forwards",
      easing: "ease-out"
    }
  );

  portal.animate(
    [
      { transform: "scale(0) rotate(-90deg)", opacity: 0 },
      { transform: "scale(.7) rotate(0deg)", opacity: 1, offset: .45 },
      { transform: "scale(1.35) rotate(180deg)", opacity: 1 }
    ],
    {
      duration: 1450,
      fill: "forwards",
      easing: "cubic-bezier(.16,.8,.2,1)"
    }
  );

  heart.animate(
    [
      { transform: "scale(.2)", opacity: 0 },
      { transform: "scale(1)", opacity: 1, offset: .4 },
      { transform: "scale(1.25)", opacity: 1 },
      { transform: "scale(2.5)", opacity: 0 }
    ],
    {
      duration: 1750,
      fill: "forwards",
      easing: "ease-in-out"
    }
  );

  label.animate(
    [
      { opacity: 0, transform: "translateY(15px)" },
      { opacity: 1, transform: "translateY(0)" }
    ],
    {
      duration: 700,
      delay: 350,
      fill: "forwards"
    }
  );

  sparkles.forEach((sparkle, index) => {
    sparkle.animate(
      [
        { opacity: 0, transform: "scale(.2) rotate(0deg)" },
        { opacity: 1, transform: "scale(1.3) rotate(90deg)", offset: .5 },
        { opacity: 0, transform: "scale(.2) rotate(180deg)" }
      ],
      {
        duration: 1200 + Math.random() * 900,
        delay: index * 18,
        fill: "forwards",
        easing: "ease-out"
      }
    );
  });

  return overlayAnimation;
}

// ==========================================
// ENTER DREAMVERSE
// ==========================================

if (enterButton) {
  enterButton.addEventListener("click", async () => {
    if (entered) return;

    entered = true;
    enterButton.disabled = true;

    playPortal();

    // Wait for the portal to open
    setTimeout(() => {
      if (entrance) entrance.classList.add("hidden");
      if (dreamverse) dreamverse.classList.remove("hidden");

      window.scrollTo({
        top: 0,
        behavior: "instant"
      });

      // Reveal the new world
      if (dreamverse) {
        dreamverse.animate(
          [
            { opacity: 0, transform: "scale(1.04)" },
            { opacity: 1, transform: "scale(1)" }
          ],
          {
            duration: 900,
            easing: "ease-out"
          }
        );
      }

      setTimeout(() => {
        if (transition) {
          transition.animate(
            [{ opacity: 1 }, { opacity: 0 }],
            {
              duration: 750,
              fill: "forwards",
              easing: "ease-in-out"
            }
          );

          setTimeout(() => {
            transition.style.visibility = "hidden";
            transition.style.pointerEvents = "none";
            transition.style.opacity = "0";
          }, 800);
        }
      }, 350);

    }, 1750);
  });
}

// ==========================================
// POINTER EFFECT
// ==========================================

let pointerFrame = null;

window.addEventListener("pointermove", (event) => {
  if (pointerFrame) return;

  pointerFrame = requestAnimationFrame(() => {
    document.documentElement.style.setProperty(
      "--pointer-x",
      (event.clientX / window.innerWidth - .5).toFixed(3)
    );

    document.documentElement.style.setProperty(
      "--pointer-y",
      (event.clientY / window.innerHeight - .5).toFixed(3)
    );

    pointerFrame = null;
  });
}, { passive: true });

// ==========================================
// RESPONSIVE SCREEN
// ==========================================

function updateScreen() {
  document.documentElement.style.setProperty(
    "--screen-width",
    window.innerWidth + "px"
  );

  document.documentElement.style.setProperty(
    "--screen-height",
    window.innerHeight + "px"
  );
}

updateScreen();

window.addEventListener("resize", updateScreen, {
  passive: true
});
