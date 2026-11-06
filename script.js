
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
        new THREE.SphereGeometry(
          0.65 + Math.random() * 0.35,
          12,
          12
        ),
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

  return {
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
// ROBLOX AVATAR — FIXED
// =====================================

async function loadRobloxAvatar() {
  const avatar = $("#roblox-avatar");
  if (!avatar) return;

  const apiUrl =
    "https://thumbnails.roblox.com/v1/users/avatar?userIds=4406875273&size=420x420&format=Png&isCircular=false";

  try {
    const response = await fetch(
      "https://proxy.cors.dev/" + apiUrl
    );

    if (!response.ok) {
      throw new Error(`Roblox API error: ${response.status}`);
    }

    const data = await response.json();
    const thumbnail = data.data?.[0];

    if (thumbnail?.state === "Completed" && thumbnail.imageUrl) {
      avatar.src = thumbnail.imageUrl;
    } else {
      throw new Error("Roblox avatar is not ready yet");
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

// ============================================
// KOKOSAK — CUSTOM 3D CHIBI AVATAR
// ============================================

const kokosakAvatar = (() => {
  if (!worldTwo) return null;

  const avatar = new THREE.Group();
  avatar.position.set(0, -1.8, 2.2);
  avatar.scale.setScalar(0.01);
  worldTwo.scene.add(avatar);

  const mat = (color, roughness = 0.4, metalness = 0) =>
    new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness
    });

  const skin = mat(0xf3dfd0);
  const pink = mat(0xff91ce, 0.24);
  const lightPink = mat(0xffc8e8, 0.25);
  const darkPink = mat(0xd95fa8);
  const blonde = mat(0xffdf8c, 0.32);
  const blondeLight = mat(0xffedba, 0.3);
  const white = mat(0xffffff, 0.2);
  const black = mat(0x493747);
  const purple = mat(0xd9b4ff, 0.25);

  function sphere(parent, material, position, scale, detail = 24) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, detail, detail),
      material
    );
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    parent.add(mesh);
    return mesh;
  }

  function cylinder(parent, material, position, radiusTop, radiusBottom, height) {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 24),
      material
    );
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  }

  // BODY AND DRESS

  sphere(avatar, skin, [0, 1.45, 0], [0.48, 0.57, 0.32]);

  const dress = new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 0.9, 1.05, 32),
    pink
  );
  dress.position.set(0, 0.65, 0);
  dress.rotation.z = Math.PI;
  avatar.add(dress);

  sphere(avatar, lightPink, [0, 0.12, 0], [0.9, 0.12, 0.55]);

  // DRESS DECORATION

  for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * Math.PI * 2;
    sphere(
      avatar,
      white,
      [
        Math.cos(angle) * 0.68,
        0.24,
        Math.sin(angle) * 0.43
      ],
      [0.075, 0.075, 0.075],
      12
    );
  }

  // LEGS AND SHOES

  for (const side of [-1, 1]) {
    cylinder(
      avatar,
      skin,
      [side * 0.25, -0.35, 0],
      0.14, 0.13, 0.55
    );

    sphere(
      avatar,
      white,
      [side * 0.25, -0.67, 0.08],
      [0.2, 0.13, 0.28]
    );

    sphere(
      avatar,
      pink,
      [side * 0.25, -0.68, 0.18],
      [0.19, 0.09, 0.2]
    );
  }

  // ARMS

  const leftArm = new THREE.Group();
  const rightArm = new THREE.Group();

  leftArm.position.set(-0.53, 1.48, 0);
  rightArm.position.set(0.53, 1.48, 0);

  avatar.add(leftArm, rightArm);

  for (const [arm, side] of [[leftArm, -1], [rightArm, 1]]) {
    const limb = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.13, 0.55, 5, 12),
      skin
    );
    limb.rotation.z = side * -0.25;
    limb.position.y = -0.25;
    arm.add(limb);

    sphere(arm, skin, [side * -0.12, -0.58, 0], [0.16, 0.16, 0.16]);
  }

  // HEAD

  const head = new THREE.Group();
  head.position.set(0, 2.55, 0.04);
  avatar.add(head);

  sphere(head, skin, [0, 0, 0], [0.77, 0.83, 0.65], 32);

  // BIG KAWAII EYES

  for (const side of [-1, 1]) {
    sphere(
      head,
      white,
      [side * 0.29, 0.03, 0.565],
      [0.19, 0.24, 0.075]
    );

    sphere(
      head,
      black,
      [side * 0.29, 0.025, 0.63],
      [0.115, 0.17, 0.055]
    );

    sphere(
      head,
      white,
      [side * 0.32, 0.11, 0.68],
      [0.045, 0.06, 0.025],
      12
    );

    sphere(
      head,
      pink,
      [side * 0.48, -0.23, 0.54],
      [0.14, 0.075, 0.025]
    );
  }

  // TINY NOSE AND SMILE

  sphere(head, darkPink, [0, -0.13, 0.64], [0.055, 0.035, 0.025]);

  const smile = new THREE.Mesh(
    new THREE.TorusGeometry(0.09, 0.018, 8, 20, Math.PI),
    darkPink
  );
  smile.position.set(0, -0.27, 0.63);
  smile.rotation.z = Math.PI;
  head.add(smile);

  // LONG BLONDE HAIR

  sphere(
    head,
    blonde,
    [0, 0.55, -0.02],
    [0.8, 0.55, 0.7]
  );

  // Hair framing the face

  for (const side of [-1, 1]) {
    sphere(
      head,
      blonde,
      [side * 0.68, -0.05, 0.13],
      [0.2, 0.67, 0.3]
    );

    sphere(
      head,
      blondeLight,
      [side * 0.7, -0.55, 0.1],
      [0.19, 0.22, 0.22]
    );

    // Long curls behind the shoulders
    for (let i = 0; i < 4; i++) {
      sphere(
        head,
        i % 2 ? blonde : blondeLight,
        [
          side * (0.67 + Math.sin(i) * 0.07),
          -0.55 - i * 0.28,
          -0.13
        ],
        [0.2, 0.24, 0.22]
      );
    }
  }

  // BANGS

  for (let i = 0; i < 5; i++) {
    sphere(
      head,
      i % 2 ? blonde : blondeLight,
      [-0.42 + i * 0.21, 0.42 - Math.abs(i - 2) * 0.045, 0.48],
      [0.24, 0.25, 0.2]
    );
  }

  // PINK SAKURA ANTLERS

  for (const side of [-1, 1]) {
    const antler = new THREE.Group();
    antler.position.set(side * 0.43, 0.75, 0);
    antler.rotation.z = side * -0.25;
    head.add(antler);

    cylinder(
      antler,
      lightPink,
      [0, 0.23, 0],
      0.065, 0.11, 0.5
    );

    cylinder(
      antler,
      lightPink,
      [side * 0.12, 0.42, 0],
      0.035, 0.07, 0.35
    ).rotation.z = side * -0.55;

    // Sakura flowers
    for (let p = 0; p < 5; p++) {
      const angle = (p / 5) * Math.PI * 2;
      sphere(
        antler,
        lightPink,
        [
          Math.cos(angle) * 0.13,
          0.55 + Math.sin(angle) * 0.13,
          0.05
        ],
        [0.09, 0.09, 0.07],
        12
      );
    }

    sphere(
      antler,
      darkPink,
      [0, 0.55, 0.12],
      [0.07, 0.07, 0.07],
      12
    );
  }

  // BIG PINK BOW

  const bow = new THREE.Group();
  bow.position.set(0, 0.64, 0.61);
  head.add(bow);

  sphere(bow, pink, [-0.17, 0, 0], [0.2, 0.13, 0.07]);
  sphere(bow, pink, [0.17, 0, 0], [0.2, 0.13, 0.07]);
  sphere(bow, white, [0, 0, 0.04], [0.075, 0.075, 0.06]);

  // FAIRY WINGS

  for (const side of [-1, 1]) {
    const wing = sphere(
      avatar,
      white,
      [side * 0.75, 1.45, -0.28],
      [0.4, 0.65, 0.12]
    );
    wing.rotation.z = side * -0.5;

    wing.material = white.clone();
    wing.material.transparent = true;
    wing.material.opacity = 0.7;
    wing.material.emissive = new THREE.Color(0xffb7e5);
    wing.material.emissiveIntensity = 0.25;
  }

  // FLOATING MAGIC HEARTS

  const magic = [];

  for (let i = 0; i < 9; i++) {
    const heart = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.12),
      i % 2 ? lightPink : purple
    );

    const angle = (i / 9) * Math.PI * 2;
    heart.position.set(
      Math.cos(angle) * 1.35,
      1 + Math.sin(angle) * 1.3,
      0.2
    );

    avatar.add(heart);
    magic.push(heart);
  }

  // FLOATING PLATFORM

  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15, 1.3, 0.16, 48),
    lightPink
  );
  platform.position.set(0, -0.92, 0);
  avatar.add(platform);

  const platformRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.16, 0.035, 12, 64),
    white
  );
  platformRing.rotation.x = Math.PI / 2;
  platformRing.position.y = -0.81;
  avatar.add(platformRing);

  return {
    group: avatar,
    head,
    leftArm,
    rightArm,
    magic
  };
})();


// ============================================
// AVATAR ENTRANCE AND IDLE ANIMATION
// ============================================

if (kokosakAvatar) {
  const { group, head, leftArm, rightArm, magic } = kokosakAvatar;

  let avatarProgress = 0;
  let avatarTime = 0;

  function animateKokosak() {
    requestAnimationFrame(animateKokosak);

    if (activeWorld !== 2) return;

    const delta = Math.min(clock.getDelta(), 0.04);
    avatarTime += delta;

    avatarProgress = Math.min(1, avatarProgress + delta * 0.65);

    const eased = 1 - Math.pow(1 - avatarProgress, 3);

    group.scale.setScalar(eased * 1.05);
    group.position.x = -3.5 + eased * 3.5;
    group.position.y = -1.8 + Math.sin(avatarTime * 1.7) * 0.09;

    group.rotation.y = Math.sin(avatarTime * 0.55) * 0.12;

    head.rotation.z = Math.sin(avatarTime * 1.2) * 0.035;
    head.rotation.y = Math.sin(avatarTime * 0.8) * 0.08;

    leftArm.rotation.z = Math.sin(avatarTime * 1.8) * 0.12;
    rightArm.rotation.z = Math.sin(avatarTime * 1.8 + 1) * 0.12;

    magic.forEach((heart, index) => {
      heart.position.y =
        1 + Math.sin(avatarTime * 1.8 + index) * 0.18;

      heart.rotation.y += delta;
      heart.rotation.x += delta * 0.5;
    });
  }

  animateKokosak();
}
