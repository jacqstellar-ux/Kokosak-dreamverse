
/* =====================================
   KOKOSAK DREAMVERSE
   LIGHTWEIGHT MOBILE ENGINE
   ===================================== */

const entrance = document.getElementById("entrance");
const dreamverse = document.getElementById("dreamverse");
const enterButton = document.getElementById("enter-world");
const transition = document.getElementById("transition");
const loader = document.getElementById("loader");

let entered = false;

// =====================================
// FAST INITIALIZATION
// =====================================

document.addEventListener("DOMContentLoaded", () => {
  if (loader) {
    requestAnimationFrame(() => {
      loader.classList.add("loaded");
    });
  }

  if (entrance) {
    entrance.classList.remove("hidden");
  }

  if (dreamverse) {
    dreamverse.classList.add("hidden");
  }
});

// =====================================
// ROBLOX AVATAR
// =====================================

const avatar = document.getElementById("roblox-avatar");

if (avatar) {
  avatar.loading = "eager";
  avatar.decoding = "async";

  avatar.addEventListener("error", () => {
    console.warn("Roblox avatar could not be loaded.");
  });
}

// =====================================
// ENTER DREAMVERSE
// =====================================

if (enterButton) {
  enterButton.addEventListener("click", () => {
    if (entered) return;

    entered = true;
    enterButton.style.pointerEvents = "none";

    if (transition) {
      transition.classList.add("active");
    }

    setTimeout(() => {
      if (entrance) {
        entrance.classList.add("hidden");
      }

      if (dreamverse) {
        dreamverse.classList.remove("hidden");
      }

      window.scrollTo({
        top: 0,
        behavior: "instant"
      });

      setTimeout(() => {
        if (transition) {
          transition.classList.remove("active");
        }
      }, 100);

    }, 650);
  });
}

// =====================================
// LIGHTWEIGHT POINTER EFFECT
// =====================================

let pointerX = 0;
let pointerY = 0;

window.addEventListener("pointermove", (event) => {
  pointerX = event.clientX / window.innerWidth - 0.5;
  pointerY = event.clientY / window.innerHeight - 0.5;

  document.documentElement.style.setProperty(
    "--pointer-x",
    pointerX.toFixed(3)
  );

  document.documentElement.style.setProperty(
    "--pointer-y",
    pointerY.toFixed(3)
  );
}, { passive: true });

// =====================================
// RESIZE
// =====================================

window.addEventListener("resize", () => {
  document.documentElement.style.setProperty(
    "--screen-width",
    window.innerWidth + "px"
  );
}, { passive: true });
