
/* =====================================
   KOKOSAK DREAMVERSE
   STABLE MOBILE VERSION
   ===================================== */

const loader = document.getElementById("loader");
const entrance = document.getElementById("entrance");
const dreamverse = document.getElementById("dreamverse");
const enterButton = document.getElementById("enter-world");
const transition = document.getElementById("transition-overlay");
const avatar = document.getElementById("roblox-avatar");

let entered = false;

// =====================================
// INITIAL PAGE SETUP
// =====================================

// Nastavení stránky hned po načtení skriptu
if (entrance) {
  entrance.classList.remove("hidden");
}

if (dreamverse) {
  dreamverse.classList.add("hidden");
}

// Loader se vždy schová
if (loader) {
  requestAnimationFrame(() => {
    loader.classList.add("loaded");
  });

  // Záložní pojistka
  setTimeout(() => {
    loader.classList.add("loaded");
  }, 1200);
}

// =====================================
// ROBLOX AVATAR
// =====================================

if (avatar) {
  avatar.loading = "eager";
  avatar.decoding = "async";

  avatar.addEventListener("load", () => {
    avatar.classList.add("avatar-loaded");
  });

  avatar.addEventListener("error", () => {
    console.warn("Roblox avatar failed to load.");
  });
}

// =====================================
// ENTER DREAMVERSE
// =====================================

if (enterButton) {
  enterButton.addEventListener("click", () => {
    if (entered) return;

    entered = true;
    enterButton.disabled = true;

    if (transition) {
      transition.classList.add("active");
    }

    // Přechod na hlavní stránku
    setTimeout(() => {
      if (entrance) {
        entrance.classList.add("hidden");
      }

      if (dreamverse) {
        dreamverse.classList.remove("hidden");
      }

      window.scrollTo({
        top: 0,
        behavior: "auto"
      });

      // Dokončení přechodu
      setTimeout(() => {
        if (transition) {
          transition.classList.remove("active");
        }

        enterButton.disabled = false;
      }, 500);

    }, 650);
  });
}

// =====================================
// MOBILE & MOUSE MOVEMENT
// =====================================

let pointerFrame = null;

window.addEventListener("pointermove", (event) => {
  if (pointerFrame) return;

  pointerFrame = requestAnimationFrame(() => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;

    document.documentElement.style.setProperty(
      "--pointer-x",
      x.toFixed(3)
    );

    document.documentElement.style.setProperty(
      "--pointer-y",
      y.toFixed(3)
    );

    pointerFrame = null;
  });
}, { passive: true });

// =====================================
// SCREEN SIZE
// =====================================

function updateScreenSize() {
  document.documentElement.style.setProperty(
    "--screen-width",
    window.innerWidth + "px"
  );

  document.documentElement.style.setProperty(
    "--screen-height",
    window.innerHeight + "px"
  );
}

updateScreenSize();

window.addEventListener("resize", updateScreenSize, {
  passive: true
});

// =====================================
// SAFETY
// =====================================

window.addEventListener("pageshow", () => {
  if (loader) {
    loader.classList.add("loaded");
  }
});
