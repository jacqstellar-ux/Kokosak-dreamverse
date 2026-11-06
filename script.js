
import * as THREE from "three";

// ========================================
// KOKOSAK DREAMVERSE — WORLD ENGINE
// ========================================

const $ = (selector) => document.querySelector(selector);

const loader = $("#loader");
const entrance = $("#entrance");
const dreamverse = $("#dreamverse");
const enterButton = $("#enter-world");
const transition = $("#transition-overlay");

let activeWorld = 1;
let transitionRunning = false;

const worlds = [];
const clock = new THREE.Clock();

// ========================================
// WORLD CREATION
// ========================================

function createWorld(canvasId, type) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    48,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  camera.position.set(0, 3, 13);

  let renderer;

  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "low-power"
    });
  } catch (error) {
    console.warn("3D graphics unavailable:", error);
    return null;
  }

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 1.5)
  );

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  // LIGHTING

  scene.add(new THREE.AmbientLight(0xffffff, 2));

  const pinkLight = new THREE.PointLight(0xff8ecb, 100, 40);
  pinkLight.position.set(-5, 5, 5);
  scene.add(pinkLight);

  const purpleLight = new THREE.PointLight(0xb59aff, 90, 40);
  purpleLight.position.set(5, 3, -5);
  scene.add(purpleLight);

  const whiteLight = new THREE.DirectionalLight(0xffffff, 2);
  whiteLight.position.set(2, 8, 5);
  scene.add(whiteLight);

  const objects = [];

  const pinkMaterial = new THREE.MeshStandardMaterial({
    color: 0xffa9d9,
    roughness: 0.3
  });

  const purpleMaterial = new THREE.MeshStandardMaterial({
    color: 0xc7aaff,
    roughness: 0.32
  });

  const whiteMaterial = new THREE.MeshStandardMaterial({
    color: 0xfff7ff,
    roughness: 0.2
  });

  // FLOATING ISLANDS

  function createIsland(x, y, z, scale) {
    const group = new THREE.Group();

    const top = new THREE.Mesh(
      new THREE.CylinderGeometry(2.1, 1.7, 0.55, 8),
      pinkMaterial
    );

    group.add(top);

    const bottom = new THREE.Mesh(
      new THREE.ConeGeometry(1.65, 2.2, 8),
      purpleMaterial
    );

    bottom.position.y = -1.2;
    bottom.rotation.y = Math.PI / 8;
    group.add(bottom);

    const crystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.42),
      whiteMaterial
    );

    crystal.position.set(0.2, 0.7, 0.2);
    group.add(crystal);

    group.position.set(x, y, z);
    group.scale.setScalar(scale);
    scene.add(group);

    objects.push({
      mesh: group,
      baseY: y,
      speed: 0.5 + Math.random()
    });
  }

  createIsland(-5, -3, -3, 1.2);
  createIsland(5, -2, -5, 0.9);
  createIsland(-7, 2, -9, 0.7);
  createIsland(7, 3, -10, 0.8);
  createIsland(0, -5, -9, 1.3);

  // DREAM CLOUDS

  function createCloud(x, y, z, scale) {
    const group = new THREE.Group();

    for (let i = 0; i < 6; i++) {
      const part = new THREE.Mesh(
        new THREE.SphereGeometry(
          0.65 + Math.random() * 0.35,
          12,
          12
        ),
        whiteMaterial
      );

      part.position.set(
        (Math.random() - 0.5) * 2.2,
        Math.random() * 0.5,
        (Math.random() - 0.5) * 0.8
      );

      group.add(part);
    }

    group.position.set(x, y, z);
    group.scale.setScalar(scale);
    scene.add(group);

    objects.push({
      mesh: group,
      baseY: y,
      speed: 0.25 + Math.random() * 0.3,
      cloud: true
    });
  }

  createCloud(-5, 1, -2, 1.4);
  createCloud(5, -1, -4, 1.1);
  createCloud(0, 5, -8, 1.8);
  createCloud(-8, -2, -8, 1);
  createCloud(8, 2, -7, 1.2);

  // FLOATING CRYSTALS AND HEARTS

  function createDecoration(x, y, z, type) {
    const geometry = type === "heart"
      ? new THREE.TorusGeometry(0.42, 0.12, 12, 32)
      : new THREE.OctahedronGeometry(0.35);

    const material = new THREE.MeshStandardMaterial({
      color: type === "heart" ? 0xff8dc9 : 0xe4c8ff,
      emissive: type === "heart" ? 0xff4fa9 : 0x9b6bff,
      emissiveIntensity: 0.45,
      roughness: 0.2
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    scene.add(mesh);

    objects.push({
      mesh,
      baseY: y,
      speed: 0.8 + Math.random()
    });
  }

  for (let i = 0; i < 22; i++) {
    createDecoration(
      (Math.random() - 0.5) * 19,
      (Math.random() - 0.5) * 12,
      -Math.random() * 13,
      i % 2 === 0 ? "heart" : "crystal"
    );
  }

  // STAR PARTICLES

  const count = 450;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 28;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 2] = -Math.random() * 20;
  }

  const particleGeometry = new THREE.BufferGeometry();

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const starField = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: type === 1 ? 0xffffff : 0xffa7dc,
      size: 0.075,
      transparent: true,
      opacity: 0.85
    })
  );

  scene.add(starField);

  return {
    scene,
    camera,
    renderer,
    objects,
    starField,
    pinkLight,
    purpleLight,
    type
  };
}

// ========================================
// INITIALIZE WORLDS
// ========================================

const worldOne = createWorld("dream-scene", 1);
const worldTwo = createWorld("roblox-scene", 2);

worlds.push(worldOne, worldTwo);

// ========================================
// CAMERA MOVEMENT
// ========================================

let pointerX = 0;
let pointerY = 0;

window.addEventListener("pointermove", (event) => {
  pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
  pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
});

// ========================================
// MAIN ANIMATION
// ========================================

function animate() {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();
  const delta = Math.min(clock.getDelta(), 0.04);

  const world = activeWorld === 1 ? worldOne : worldTwo;

  if (!world) return;

  world.objects.forEach((item, index) => {
    const mesh = item.mesh;

    mesh.position.y =
      item.baseY +
      Math.sin(elapsed * item.speed + index) * 0.22;

    mesh.rotation.y += delta * 0.25 * item.speed;

    if (!item.cloud) {
      mesh.rotation.z += delta * 0.15;
    }
  });

  world.starField.rotation.y = elapsed * 0.008;
  world.starField.rotation.x =
    Math.sin(elapsed * 0.15) * 0.04;

  world.camera.position.x +=
    (pointerX * 1.2 - world.camera.position.x) * 0.025;

  world.camera.position.y +=
    (3 - pointerY * 0.65 - world.camera.position.y) * 0.025;

  world.camera.position.z =
    13 + Math.sin(elapsed * 0.2) * 0.5;

  world.camera.lookAt(0, 0, -3);

  world.pinkLight.position.x = Math.sin(elapsed * 0.5) * 5;
  world.purpleLight.position.x = Math.cos(elapsed * 0.4) * 5;

  world.renderer.render(world.scene, world.camera);
}

animate();

// ========================================
// ENTER HER WORLD
// ========================================

enterButton?.addEventListener("click", () => {
  if (transitionRunning) return;

  transitionRunning = true;
  transition?.classList.add("active");

  const core = $(".portal-core");

  if (core) {
    core.style.transition = "transform 1s ease";
    core.style.transform = "scale(12)";
  }

  setTimeout(() => {
    entrance?.classList.add("hidden");
    dreamverse?.classList.remove("hidden");

    activeWorld = 2;

    if (worldTwo) {
      worldTwo.camera.position.set(0, 3, 13);
    }

    setTimeout(() => {
      transition?.classList.remove("active");

      if (core) {
        core.style.transform = "scale(1)";
      }

      transitionRunning = false;
    }, 650);

  }, 1100);
});

// ========================================
// REAL ROBLOX AVATAR
// The official thumbnail is in index.html.
// No fake character is generated here.
// ========================================

const avatar = $("#roblox-avatar");

if (avatar) {
  avatar.addEventListener("error", () => {
    console.warn("Official Roblox avatar image failed to load.");
  });

  avatar.addEventListener("load", () => {
    console.log("Kokosak's real Roblox avatar loaded!");
  });
}

// ========================================
// LOADER
// ========================================

window.addEventListener("load", () => {
  setTimeout(() => {
    loader?.classList.add("loaded");
  }, 1000);
});

// ========================================
// RESPONSIVE RESIZE
// ========================================

window.addEventListener("resize", () => {
  worlds.forEach((world) => {
    if (!world) return;

    world.camera.aspect =
      window.innerWidth / window.innerHeight;

    world.camera.updateProjectionMatrix();

    world.renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    world.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 1.5)
    );
  });
});
