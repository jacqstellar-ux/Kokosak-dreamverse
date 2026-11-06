
import * as THREE from 'three';

const loader = document.getElementById('loader');
const entrance = document.getElementById('entrance');
const dreamverse = document.getElementById('dreamverse');
const enterButton = document.getElementById('enter-world');

const scene = new THREE.Scene();
scene.background = new THREE.Color('#f9eafa');
scene.fog = new THREE.Fog('#f9eafa', 13, 32);

const camera = new THREE.PerspectiveCamera(
  38,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 3.5, 12);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('dream-scene'),
  antialias: true,
  alpha: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

scene.add(new THREE.HemisphereLight('#fff8ff', '#b99bcf', 2.1));

const sun = new THREE.DirectionalLight('#ffffff', 3);
sun.position.set(5, 9, 7);
sun.castShadow = true;
scene.add(sun);

const pinkLight = new THREE.PointLight('#ff9bd5', 35, 18);
pinkLight.position.set(-4, 3, 3);
scene.add(pinkLight);

const lavenderLight = new THREE.PointLight('#bcaaff', 30, 18);
lavenderLight.position.set(4, 2, -3);
scene.add(lavenderLight);

const world = new THREE.Group();
scene.add(world);

const mat = (color, roughness = 0.65, metalness = 0) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness
  });

const grassMat = mat('#a8d8c2');
const pinkMat = mat('#ffb3dc');
const lightPinkMat = mat('#ffe2f2');
const purpleMat = mat('#c5b0f6');
const whiteMat = mat('#fff9ff');
const goldMat = mat('#f5d68c', 0.3, 0.6);

function addMesh(geometry, material, parent, x, y, z) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

// FLOATING ISLAND
const island = new THREE.Group();
world.add(island);

const top = addMesh(
  new THREE.CylinderGeometry(3.5, 2.7, 0.8, 9, 1),
  grassMat,
  island,
  0, -0.3, 0
);
top.rotation.y = 0.3;

const underside = addMesh(
  new THREE.ConeGeometry(2.7, 2.5, 9),
  mat('#a88acb'),
  island,
  0, -1.75, 0
);
underside.rotation.x = Math.PI;

const islandRing = addMesh(
  new THREE.TorusGeometry(3.15, 0.06, 12, 80),
  goldMat,
  island,
  0, 0.05, 0
);
islandRing.rotation.x = Math.PI / 2;

// TINY FLOWERS
for (let i = 0; i < 28; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 1 + Math.random() * 2.5;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  const flower = new THREE.Group();
  flower.position.set(x, 0.16, z);
  island.add(flower);

  addMesh(
    new THREE.SphereGeometry(0.055, 10, 8),
    pinkMat,
    flower, 0, 0, 0
  );

  for (let p = 0; p < 5; p++) {
    const a = p * Math.PI * 2 / 5;
    addMesh(
      new THREE.SphereGeometry(0.07, 10, 8),
      whiteMat,
      flower,
      Math.cos(a) * 0.1,
      0,
      Math.sin(a) * 0.1
    );
  }
}

// DREAM PALACE
const palace = new THREE.Group();
palace.position.set(-1.1, 0.1, -1.1);
island.add(palace);

addMesh(
  new THREE.BoxGeometry(1.55, 1.2, 1.3),
  lightPinkMat,
  palace, 0, 0.6, 0
);

addMesh(
  new THREE.ConeGeometry(1.05, 1.35, 4),
  purpleMat,
  palace, 0, 1.85, 0
).rotation.y = Math.PI / 4;

for (const x of [-0.48, 0.48]) {
  addMesh(
    new THREE.CylinderGeometry(0.16, 0.2, 1.7, 12),
    whiteMat,
    palace, x, 1.15, 0
  );

  addMesh(
    new THREE.ConeGeometry(0.25, 0.5, 12),
    pinkMat,
    palace, x, 2.25, 0
  );
}

const door = addMesh(
  new THREE.BoxGeometry(0.35, 0.65, 0.06),
  purpleMat,
  palace, 0, 0.35, 0.67
);

// CUSTOM 3D KITTEN
const kitten = new THREE.Group();
kitten.position.set(1.05, 0.2, 0.7);
island.add(kitten);

const fur = mat('#fff1e9', 0.88);
const innerEar = mat('#ffb0d3');
const eyeMat = mat('#503347', 0.12);
const noseMat = mat('#ee91b8');
const shineMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });

const body = addMesh(
  new THREE.SphereGeometry(0.43, 32, 24),
  fur,
  kitten, 0, 0.42, 0
);
body.scale.set(0.9, 1.05, 0.85);

const head = new THREE.Group();
head.position.set(0, 1.05, 0.03);
kitten.add(head);

addMesh(
  new THREE.SphereGeometry(0.62, 40, 32),
  fur,
  head, 0, 0, 0
);

for (const side of [-1, 1]) {
  const ear = addMesh(
    new THREE.ConeGeometry(0.23, 0.48, 32),
    fur,
    head, side * 0.39, 0.47, 0
  );
  ear.rotation.z = side * -0.22;

  const earInside = addMesh(
    new THREE.SphereGeometry(0.12, 24, 16),
    innerEar,
    head, side * 0.39, 0.45, 0.15
  );
  earInside.scale.set(0.85, 1.35, 0.3);

  const eye = addMesh(
    new THREE.SphereGeometry(0.105, 24, 20),
    eyeMat,
    head, side * 0.22, 0.03, 0.53
  );
  eye.scale.set(0.85, 1.15, 0.6);

  addMesh(
    new THREE.SphereGeometry(0.033, 12, 12),
    shineMat,
    head, side * 0.22 - 0.025, 0.075, 0.59
  );

  addMesh(
    new THREE.SphereGeometry(0.035, 12, 12),
    mat('#f6b3b9'),
    head, side * 0.38, -0.17, 0.46
  );

  const paw = addMesh(
    new THREE.SphereGeometry(0.19, 24, 16),
    fur,
    kitten, side * 0.29, 0.13, 0.25
  );
  paw.scale.set(0.8, 0.7, 1);
}

addMesh(
  new THREE.SphereGeometry(0.065, 20, 16),
  noseMat,
  head, 0, -0.12, 0.57
);

// LITTLE BOW
const bow = new THREE.Group();
bow.position.set(0, 0.52, 0.04);
head.add(bow);

const bowMat = mat('#ff83bd', 0.3);

for (const side of [-1, 1]) {
  const loop = addMesh(
    new THREE.SphereGeometry(0.15, 20, 16),
    bowMat,
    bow, side * 0.14, 0, 0
  );
  loop.scale.set(1.2, 0.7, 0.4);
}

addMesh(
  new THREE.SphereGeometry(0.075, 20, 16),
  goldMat,
  bow, 0, 0, 0.05
);

// CURLED TAIL
const tailCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0.3, 0.3, -0.2),
  new THREE.Vector3(0.65, 0.2, -0.3),
  new THREE.Vector3(0.75, 0.5, -0.4),
  new THREE.Vector3(0.55, 0.7, -0.4)
]);

const tail = addMesh(
  new THREE.TubeGeometry(tailCurve, 32, 0.105, 12, false),
  fur,
  kitten, 0, 0, 0
);

// CLOUDS
const cloudMat = mat('#ffffff');

for (let i = 0; i < 12; i++) {
  const cloud = new THREE.Group();
  cloud.position.set(
    (Math.random() - 0.5) * 18,
    -1 + Math.random() * 5,
    -4 - Math.random() * 9
  );

  const size = 0.35 + Math.random() * 0.45;

  for (let j = 0; j < 5; j++) {
    const puff = addMesh(
      new THREE.SphereGeometry(size * (0.65 + Math.random() * 0.4), 16, 12),
      cloudMat,
      cloud,
      (j - 2) * size * 0.55,
      Math.random() * size * 0.3,
      0
    );
  }

  scene.add(cloud);
}

// FLOATING STARS
const starGroup = new THREE.Group();
scene.add(starGroup);

for (let i = 0; i < 100; i++) {
  const star = addMesh(
    new THREE.SphereGeometry(0.025 + Math.random() * 0.035, 8, 8),
    new THREE.MeshBasicMaterial({
      color: Math.random() > 0.5 ? '#ffffff' : '#f6b5dc'
    }),
    starGroup,
    (Math.random() - 0.5) * 24,
    (Math.random() - 0.5) * 13,
    -2 - Math.random() * 12
  );
}

// ANIMATION
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const t = clock.getElapsedTime();

  island.position.y = Math.sin(t * 0.7) * 0.13;
  island.rotation.y = Math.sin(t * 0.18) * 0.12;

  kitten.position.y = 0.2 + Math.sin(t * 1.8) * 0.07;
  kitten.rotation.y = Math.sin(t * 0.65) * 0.16;
  head.rotation.z = Math.sin(t * 1.3) * 0.035;
  bow.rotation.z = Math.sin(t * 1.8) * 0.05;
  tail.rotation.x = Math.sin(t * 2) * 0.1;

  starGroup.rotation.y = t * 0.012;

  renderer.render(scene, camera);
}

animate();

// TOUCH PARALLAX
let targetX = 0;
let targetY = 0;

window.addEventListener('pointermove', (event) => {
  targetX = (event.clientX / window.innerWidth - 0.5) * 0.7;
  targetY = (event.clientY / window.innerHeight - 0.5) * 0.35;
});

function moveCamera() {
  camera.position.x += (targetX - camera.position.x * 0.035) * 0.025;
  camera.position.y += (3.5 - targetY - camera.position.y) * 0.025;
  camera.lookAt(0, 0.2, 0);
  requestAnimationFrame(moveCamera);
}
moveCamera();

// RESIZE
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
});

// ENTRANCE
enterButton.addEventListener('click', () => {
  entrance.classList.add('hidden');
  dreamverse.classList.remove('hidden');
  window.scrollTo(0, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// CAT CLUB
const cats = [
  { name: 'Mochi', mood: 'The sweetest little dreamer', art: '♡' },
  { name: 'Peachy', mood: 'A tiny ball of sunshine', art: '✧' },
  { name: 'Luna', mood: 'The sleepy moon princess', art: '☾' }
];

const collection = document.getElementById('cat-collection');

cats.forEach(cat => {
  const card = document.createElement('article');
  card.className = 'cat-card';
  card.innerHTML = `
    <div class="cat-art">${cat.art}</div>
    <h3>${cat.name}</h3>
    <p>${cat.mood}</p>
  `;
  collection.appendChild(card);
});

// LOADER
window.addEventListener('load', () => {
  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 900);
  }, 500);
});
async function loadRobloxAvatar() {
  const avatar = document.getElementById("roblox-avatar");

  if (!avatar) return;

  try {
    const response = await fetch(
      "https://thumbnails.roblox.com/v1/users/avatar?userIds=4406875273&size=420x420&format=Png&isCircular=false"
    );

    const data = await response.json();

    if (data.data && data.data[0]?.imageUrl) {
      avatar.src = data.data[0].imageUrl;
    }
  } catch (error) {
    console.error("Avatar could not load:", error);
  }
}

loadRobloxAvatar();
