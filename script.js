
import * as THREE from "three";

// ========================================
// KOKOSAK DREAMVERSE — OPTIMIZED ENGINE
// ========================================

const entrance = document.getElementById("entrance");
const dreamverse = document.getElementById("dreamverse");
const enterButton = document.getElementById("enter-world");
const transition = document.getElementById("transition");
const loader = document.getElementById("loader");

let worldOne = null;
let worldTwo = null;
let activeWorld = null;
let animationFrame = null;
let entered = false;

// ========================================
// 3D WORLD CREATOR
// ========================================

function createWorld(elementId, worldType = 1) {
  const container = document.getElementById(elementId);
  if (!container) return null;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / Math.max(container.clientHeight, 1),
    0.1,
    100
  );

  camera.position.set(0, 0, 11);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: false,
    powerPreference: "low-power"
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 1.25)
  );

  renderer.setSize(
    container.clientWidth || window.innerWidth,
    container.clientHeight || window.innerHeight
  );

  renderer.outputColorSpace = THREE.SRGBColorSpace;

  container.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 2));

  const mainLight = new THREE.PointLight(0xffd8ef, 30);
  mainLight.position.set(3, 5, 7);
  scene.add(mainLight);

  const pinkLight = new THREE.PointLight(0xffa9dc, 20);
  pinkLight.position.set(-5, -2, 4);
  scene.add(pinkLight);

  // Floating islands
  const islandGeometry = new THREE.IcosahedronGeometry(1, 1);

  const islandMaterial = new THREE.MeshStandardMaterial({
    color: worldType === 1 ? 0xf6c8e5 : 0xe8c8ff,
    roughness: 0.65,
    metalness: 0.05,
    flatShading: true
  });

  const islands = [];

  for (let i = 0; i < 7; i++) {
    const island = new THREE.Mesh(
      islandGeometry,
      islandMaterial
    );

    const scale = 0.35 + Math.random() * 0.65;

    island.scale.set(
      scale * 1.5,
      scale * 0.55,
      scale
    );

    island.position.set(
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 9,
      -2 - Math.random() * 5
    );

    group.add(island);

    islands.push({
      mesh: island,
      speed: 0.3 + Math.random() * 0.5,
      offset: Math.random() * 10
    });
  }

  // Floating crystals
  const crystals = [];
  const crystalGeometry = new THREE.OctahedronGeometry(0.22, 0);

  const crystalMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd9f2,
    emissive: 0xff9edc,
    emissiveIntensity: 0.4,
    roughness: 0.25,
    metalness: 0.25
  });

  for (let i = 0; i < 14; i++) {
    const crystal = new THREE.Mesh(
      crystalGeometry,
      crystalMaterial
    );

    crystal.position.set(
      (Math.random() - 0.5) * 18,
      (Math.random() - 0.5) * 11,
      Math.random() * 2 - 4
    );

    const scale = 0.5 + Math.random() * 1.2;
    crystal.scale.setScalar(scale);

    group.add(crystal);
    crystals.push(crystal);
  }

  // Small stars
  const starCount = 100;
  const positions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 24;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 2] = -3 - Math.random() * 8;
  }

  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.055,
    transparent: true,
    opacity: 0.8
  });

  const stars = new THREE.Points(
    starGeometry,
    starMaterial
  );

  scene.add(stars);

  return {
    scene,
    camera,
    renderer,
    group,
    islands,
    crystals,
    stars,
    clock: new THREE.Clock(),
    container
  };
}

// ========================================
// INITIALIZE ONLY FIRST WORLD
// ========================================

function initializeFirstWorld() {
  if (worldOne) return;

  worldOne = createWorld("dream-scene", 1);
  activeWorld = worldOne;
}

initializeFirstWorld();

// ========================================
// ANIMATION — ONLY ACTIVE WORLD
// ========================================

function animate() {
  animationFrame = requestAnimationFrame(animate);

  if (!activeWorld) return;

  const world = activeWorld;
  const delta = Math.min(world.clock.getDelta(), 0.04);
  const elapsed = world.clock.elapsedTime;

  world.group.rotation.y += delta * 0.035;

  world.islands.forEach((item) => {
    item.mesh.position.y +=
      Math.sin(elapsed * item.speed + item.offset) *
      delta * 0.16;

    item.mesh.rotation.y += delta * 0.12;
  });

  world.crystals.forEach((crystal, index) => {
    crystal.rotation.x += delta * 0.35;
    crystal.rotation.y += delta * 0.5;

    crystal.position.y +=
      Math.sin(elapsed + index) * delta * 0.12;
  });

  world.stars.rotation.z = elapsed * 0.008;

  world.renderer.render(world.scene, world.camera);
}

animate();

// ========================================
// ENTER DREAMVERSE
// ========================================

if (enterButton) {
  enterButton.addEventListener("click", () => {
    if (entered) return;

    entered = true;

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

      // Create second scene ONLY now
      if (!worldTwo) {
        worldTwo = createWorld("roblox-scene", 2);
      }

      activeWorld = worldTwo;

      if (activeWorld) {
        activeWorld.clock.start();
      }

      if (transition) {
        transition.classList.remove("active");
      }

      window.dispatchEvent(new Event("resize"));
    }, 650);
  });
}

// ========================================
// RESPONSIVE RESIZE
// ========================================

function resizeWorld(world) {
  if (!world) return;

  const width = world.container.clientWidth || window.innerWidth;
  const height = world.container.clientHeight || window.innerHeight;

  world.camera.aspect = width / height;
  world.camera.updateProjectionMatrix();

  world.renderer.setSize(width, height, false);
}

window.addEventListener("resize", () => {
  resizeWorld(worldOne);
  resizeWorld(worldTwo);
});

// ========================================
// MOUSE / TOUCH MOVEMENT
// ========================================

let pointerX = 0;
let pointerY = 0;

function movePointer(x, y) {
  pointerX = (x / window.innerWidth - 0.5) * 0.5;
  pointerY = (y / window.innerHeight - 0.5) * 0.35;
}

window.addEventListener("pointermove", (event) => {
  movePointer(event.clientX, event.clientY);
});

function updateCameraMovement() {
  if (activeWorld) {
    activeWorld.camera.position.x +=
      (pointerX - activeWorld.camera.position.x * 0.04) * 0.025;

    activeWorld.camera.position.y +=
      (-pointerY - activeWorld.camera.position.y * 0.04) * 0.025;
  }

  requestAnimationFrame(updateCameraMovement);
}

updateCameraMovement();

// ========================================
// LOADER
// ========================================

window.addEventListener("load", () => {
  setTimeout(() => {
    if (loader) {
      loader.classList.add("loaded");
    }
  }, 250);
});
