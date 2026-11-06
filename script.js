
import * as THREE from "three";

// =====================================
// KOKOSAK DREAMVERSE
// 3D WORLD ENGINE
// =====================================

const $ = (selector) => document.querySelector(selector);

const loader = $("#loader");
const entrance = $("#entrance");
const dreamverse = $("#dreamverse");
const enterButton = $("#enter-world");
const transition = $("#transition-overlay");

let worldOne;
let worldTwo;
let activeWorld = 1;
let transitionRunning = false;

const clock = new THREE.Clock();


// =====================================
// CREATE 3D WORLD
// =====================================

function createWorld(canvasId, type) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    48,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
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

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  // LIGHTS

  const ambient = new THREE.AmbientLight(0xffffff, 2.2);
  scene.add(ambient);

  const pinkLight = new THREE.PointLight(0xff8ecb, 120, 35);
  pinkLight.position.set(-5, 5, 5);
  scene.add(pinkLight);

  const purpleLight = new THREE.PointLight(0xb59aff, 100, 35);
  purpleLight.position.set(5, 3, -5);
  scene.add(purpleLight);

  const whiteLight = new THREE.DirectionalLight(0xffffff, 2);
  whiteLight.position.set(2, 8, 5);
  scene.add(whiteLight);

  const objects = [];
  const particles = [];

  // MATERIALS

  const pinkMaterial = new THREE.MeshStandardMaterial({
    color: 0xffa9d9,
    roughness: 0.3,
    metalness: 0.05
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

    top.position.y = 0;
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
      const cloudPart = new THREE.Mesh(
        new THREE.SphereGeometry(0.65 + Math.random() * 0.35, 12, 12),
        whiteMaterial
      );

      cloudPart.position.set(
        (Math.random() - 0.5) * 2.2,
        Math.random() * 0.5,
        (Math.random() - 0.5) * 0.8
      );

      group.add(cloudPart);
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

  // FLOATING HEARTS AND CRYSTALS

  function createDecoration(x, y, z, type) {
    let geometry;

    if (type === "heart") {
      geometry = new THREE.TorusGeometry(0.42, 0.12, 12, 32);
    } else {
      geometry = new THREE.OctahedronGeometry(0.35);
    }

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

  const particleCount = 450;

  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 28;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 2] = -Math.random() * 20;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const particleMaterial = new THREE.PointsMaterial({
    color: type === 1 ? 0xffffff : 0xffa7dc,
    size: 0.075,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true
  });

  const starField = new THREE.Points(
    particleGeometry,
    particleMaterial
  );

  scene.add(starField);

  // CAMERA SETTINGS

  const cameraData = {
    targetX: 0,
    targetY: 3,
    currentX: 0,
    currentY: 3
  };

  const world = {
    scene,
    camera,
    renderer,
    objects,
    starField,
    cameraData,
    type,
    pinkLight,
    purpleLight
  };

  return world;
}


// =====================================
// BUILD BOTH WORLDS
// =====================================

worldOne = createWorld("dream-scene", 1);
worldTwo = createWorld("roblox-scene", 2);


// =====================================
// CAMERA MOVEMENT
// =====================================

window.addEventListener("pointermove", (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 2;
  const y = (event.clientY / window.innerHeight - 0.5) * 2;

  [worldOne, worldTwo].forEach((world) => {
    if (!world) return;

    world.cameraData.targetX = x * 1.2;
    world.cameraData.targetY = 3 - y * 0.65;
  });
});


// =====================================
// ANIMATION LOOP
// =====================================

function animate() {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();

  const world = activeWorld === 1 ? worldOne : worldTwo;

  if (!world) return;

  world.objects.forEach((item, index) => {
    const mesh = item.mesh;

    mesh.position.y =
      item.baseY + Math.sin(elapsed * item.speed + index) * 0.22;

    mesh.rotation.y += 0.0025 * item.speed;

    if (!item.cloud) {
      mesh.rotation.z += 0.0015;
    }
  });

  world.starField.rotation.y = elapsed * 0.008;
  world.starField.rotation.x = Math.sin(elapsed * 0.15) * 0.04;

  const cam = world.cameraData;

  cam.currentX += (cam.targetX - cam.currentX) * 0.025;
  cam.currentY += (cam.targetY - cam.currentY) * 0.025;

  world.camera.position.x =
    Math.sin(elapsed * 0.18) * 0.4 + cam.currentX;

  world.camera.position.y =
    cam.currentY + Math.sin(elapsed * 0.3) * 0.15;

  world.camera.position.z =
    13 + Math.sin(elapsed * 0.2) * 0.5;

  world.camera.lookAt(0, 0, -3);

  world.pinkLight.position.x = Math.sin(elapsed * 0.5) * 5;
  world.purpleLight.position.x = Math.cos(elapsed * 0.4) * 5;

  world.renderer.render(world.scene, world.camera);
}

animate();


// =====================================
// WORLD TRANSITION
// =====================================

enterButton?.addEventListener("click", () => {
  if (transitionRunning) return;

  transitionRunning = true;

  transition.classList.add("active");

  const core = $(".portal-core");

  if (core) {
    core.style.transition = "transform 1s ease";
    core.style.transform = "scale(12)";
  }

  setTimeout(() => {
    entrance.classList.add("hidden");
    dreamverse.classList.remove("hidden");

    activeWorld = 2;

    if (worldTwo) {
      worldTwo.camera.position.set(0, 3, 18);
    }

    loadRobloxAvatar();

    setTimeout(() => {
      transition.classList.remove("active");

      if (core) {
        core.style.transform = "scale(1)";
      }

      transitionRunning = false;
    }, 500);

  }, 1100);
});


// =====================================
// ROBLOX AVATAR
// =====================================

async function loadRobloxAvatar() {
  const avatar = $("#roblox-avatar");

  if (!avatar) return;

  try {
    const response = await fetch(
      "https://thumbnails.roblox.com/v1/users/avatar?userIds=4406875273&size=420x420&format=Png&isCircular=false"
    );

    if (!response.ok) throw new Error("Roblox API unavailable");

    const data = await response.json();
    const imageUrl = data.data?.[0]?.imageUrl;

    if (imageUrl) {
      avatar.src = imageUrl;
    }

  } catch (error) {
    console.warn("Roblox avatar could not load:", error);
  }
}


// =====================================
// INITIAL LOADING
// =====================================

window.addEventListener("load", () => {
  setTimeout(() => {
    loader?.classList.add("done");
  }, 1300);
});


// =====================================
// RESIZE
// =====================================

window.addEventListener("resize", () => {
  [worldOne, worldTwo].forEach((world) => {
    if (!world) return;

    world.camera.aspect =
      window.innerWidth / window.innerHeight;

    world.camera.updateProjectionMatrix();

    world.renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    world.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 1.5)
    );
  });
});
