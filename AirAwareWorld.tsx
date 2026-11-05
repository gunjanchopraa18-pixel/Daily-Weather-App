import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface AirAwareWorldProps {
  currentSceneIndex: number; // 0 to 7
  scrollProgress: number; // 0 to 1
  mascotReaction?: 'happy' | 'thinking' | 'waving' | 'idle';
}

export const AirAwareWorld: React.FC<AirAwareWorldProps> = ({
  currentSceneIndex,
  scrollProgress,
  mascotReaction = 'idle'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    currentSceneIndex,
    scrollProgress,
    mascotReaction,
    targetCamPos: new THREE.Vector3(0, 22, 38),
    targetCamLook: new THREE.Vector3(0, 4, -10),
    currentCamPos: new THREE.Vector3(0, 22, 38),
    currentCamLook: new THREE.Vector3(0, 4, -10),
  });

  // Keep stateRef in sync with props
  useEffect(() => {
    stateRef.current.currentSceneIndex = currentSceneIndex;
    stateRef.current.scrollProgress = scrollProgress;
    stateRef.current.mascotReaction = mascotReaction;
  }, [currentSceneIndex, scrollProgress, mascotReaction]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Software WebGL detection per Three.js skill
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#EBF5FF');
    // Horizon pastel fog matching sky
    scene.fog = new THREE.FogExp2('#EBF5FF', 0.016);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      200
    );
    camera.position.set(0, 22, 38);
    camera.lookAt(0, 4, -10);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment reflection using RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // -------------------------------------------------------------
    // LIGHTING RIG (Warm key + Cool hemisphere fill + Soft rim)
    // -------------------------------------------------------------
    const hemiLight = new THREE.HemisphereLight('#FFFFFF', '#DDD6FE', 0.9);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const keySun = new THREE.DirectionalLight('#FFFBEB', 1.6);
    keySun.position.set(25, 40, 20);
    keySun.castShadow = !isSoftwareGl;
    keySun.shadow.mapSize.width = 1024;
    keySun.shadow.mapSize.height = 1024;
    keySun.shadow.camera.near = 0.5;
    keySun.shadow.camera.far = 120;
    keySun.shadow.camera.left = -30;
    keySun.shadow.camera.right = 30;
    keySun.shadow.camera.top = 30;
    keySun.shadow.camera.bottom = -30;
    keySun.shadow.bias = -0.0005;
    keySun.shadow.normalBias = 0.02;
    scene.add(keySun);

    const rimLight = new THREE.DirectionalLight('#BAE6FD', 0.8);
    rimLight.position.set(-20, 25, -20);
    scene.add(rimLight);

    // -------------------------------------------------------------
    // PASTEL PALETTE MATERIALS (Soft clay PBR)
    // -------------------------------------------------------------
    const matClayGround = new THREE.MeshStandardMaterial({
      color: '#E0F2FE',
      roughness: 0.8,
      metalness: 0.05,
    });

    const matParkGrass = new THREE.MeshStandardMaterial({
      color: '#D1FAE5',
      roughness: 0.75,
      metalness: 0.05,
    });

    const matGardenEarth = new THREE.MeshStandardMaterial({
      color: '#EDE9FE',
      roughness: 0.7,
      metalness: 0.05,
    });

    const matRoad = new THREE.MeshStandardMaterial({
      color: '#F1F5F9',
      roughness: 0.6,
      metalness: 0.02,
    });

    const buildingMaterials = [
      new THREE.MeshStandardMaterial({ color: '#FCE7F3', roughness: 0.55, metalness: 0.05 }), // blush
      new THREE.MeshStandardMaterial({ color: '#E0F2FE', roughness: 0.55, metalness: 0.05 }), // sky blue
      new THREE.MeshStandardMaterial({ color: '#EDE9FE', roughness: 0.55, metalness: 0.05 }), // lavender
      new THREE.MeshStandardMaterial({ color: '#FEF08A', roughness: 0.55, metalness: 0.05 }), // butter
      new THREE.MeshStandardMaterial({ color: '#D1FAE5', roughness: 0.55, metalness: 0.05 }), // mint
      new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.45, metalness: 0.05 }), // pearl white
    ];

    const matWindow = new THREE.MeshStandardMaterial({
      color: '#BAE6FD',
      roughness: 0.2,
      metalness: 0.2,
      emissive: '#BAE6FD',
      emissiveIntensity: 0.15,
    });

    const matTreeFoliage = new THREE.MeshStandardMaterial({
      color: '#A7F3D0',
      roughness: 0.65,
      metalness: 0.05,
    });

    const matTreeTrunk = new THREE.MeshStandardMaterial({
      color: '#DDD6FE',
      roughness: 0.8,
      metalness: 0.05,
    });

    const matCloudClay = new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      roughness: 0.5,
      metalness: 0.05,
    });

    const matCloudBlush = new THREE.MeshStandardMaterial({
      color: '#FCE7F3',
      roughness: 0.5,
      metalness: 0.05,
    });

    // -------------------------------------------------------------
    // PROCEDURAL CLOUD FACTORY (Multi-part organic puffs)
    // -------------------------------------------------------------
    function createProceduralCloud(scale = 1, isBlush = false): THREE.Group {
      const group = new THREE.Group();
      const material = isBlush ? matCloudBlush : matCloudClay;

      const sphereGeo = new THREE.SphereGeometry(1, 16, 16);

      const parts = [
        { x: 0, y: 0, z: 0, s: 1.4 },
        { x: 1.1, y: -0.15, z: 0.2, s: 1.0 },
        { x: -1.0, y: -0.2, z: -0.1, s: 0.95 },
        { x: 0.5, y: 0.5, z: -0.15, s: 0.85 },
        { x: -0.4, y: 0.4, z: 0.2, s: 0.9 },
        { x: 0.8, y: -0.2, z: -0.4, s: 0.75 },
      ];

      parts.forEach((p) => {
        const mesh = new THREE.Mesh(sphereGeo, material);
        mesh.position.set(p.x * scale, p.y * scale, p.z * scale);
        mesh.scale.setScalar(p.s * scale);
        mesh.castShadow = !isSoftwareGl;
        mesh.receiveShadow = !isSoftwareGl;
        group.add(mesh);
      });

      return group;
    }

    // -------------------------------------------------------------
    // CONTINUOUS CLOUD LAYERS (3 distinct drifting speeds & depths)
    // -------------------------------------------------------------
    interface CloudData {
      group: THREE.Group;
      baseX: number;
      baseY: number;
      baseZ: number;
      speed: number;
      frequency: number;
      phase: number;
      amp: number;
    }

    const cloudLayers: CloudData[] = [];

    // Layer 1: High sky backdrop clouds (slow, majestic)
    for (let i = 0; i < 9; i++) {
      const cloud = createProceduralCloud(2.2 + Math.random() * 1.2, i % 3 === 0);
      const baseX = -45 + i * 11 + (Math.random() - 0.5) * 5;
      const baseY = 24 + Math.random() * 10;
      const baseZ = -35 + Math.random() * 15;
      cloud.position.set(baseX, baseY, baseZ);
      scene.add(cloud);

      cloudLayers.push({
        group: cloud,
        baseX,
        baseY,
        baseZ,
        speed: 0.012 + Math.random() * 0.006,
        frequency: 0.6 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        amp: 0.4 + Math.random() * 0.3,
      });
    }

    // Layer 2: Mid-altitude atmospheric clouds
    for (let i = 0; i < 10; i++) {
      const cloud = createProceduralCloud(1.4 + Math.random() * 0.8, i % 4 === 1);
      const baseX = -40 + i * 9 + (Math.random() - 0.5) * 4;
      const baseY = 12 + Math.random() * 8;
      const baseZ = -15 + Math.random() * 20;
      cloud.position.set(baseX, baseY, baseZ);
      scene.add(cloud);

      cloudLayers.push({
        group: cloud,
        baseX,
        baseY,
        baseZ,
        speed: 0.02 + Math.random() * 0.01,
        frequency: 0.8 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        amp: 0.3 + Math.random() * 0.3,
      });
    }

    // Layer 3: Foreground whimsical drifting miniature clouds
    for (let i = 0; i < 6; i++) {
      const cloud = createProceduralCloud(0.9 + Math.random() * 0.5);
      const baseX = -30 + i * 12 + (Math.random() - 0.5) * 3;
      const baseY = 6 + Math.random() * 5;
      const baseZ = 10 + Math.random() * 15;
      cloud.position.set(baseX, baseY, baseZ);
      scene.add(cloud);

      cloudLayers.push({
        group: cloud,
        baseX,
        baseY,
        baseZ,
        speed: 0.03 + Math.random() * 0.015,
        frequency: 1.1 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        amp: 0.25 + Math.random() * 0.2,
      });
    }

    // -------------------------------------------------------------
    // FLOATING PARTICLES & CLEAN AIR BUBBLES
    // -------------------------------------------------------------
    const particleCount = 45;
    const particleGeometry = new THREE.SphereGeometry(0.12, 8, 8);
    const particleColors = ['#BAE6FD', '#DDD6FE', '#FBCFE8', '#FEF08A', '#A7F3D0'];
    const particleMeshes: { mesh: THREE.Mesh; seed: number; speedY: number; speedX: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const color = particleColors[i % particleColors.length];
      const pMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: 0.75,
      });
      const pMesh = new THREE.Mesh(particleGeometry, pMat);
      pMesh.position.set(
        (Math.random() - 0.5) * 50,
        2 + Math.random() * 20,
        (Math.random() - 0.5) * 40
      );
      scene.add(pMesh);
      particleMeshes.push({
        mesh: pMesh,
        seed: Math.random() * 100,
        speedY: 0.008 + Math.random() * 0.012,
        speedX: 0.01 + Math.random() * 0.015,
      });
    }

    // -------------------------------------------------------------
    // MINIATURE WORLD SCENERY BUILDER
    // -------------------------------------------------------------
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 1. Base Terrain Islands (Rolling clay mounds)
    const baseTerrainGeo = new THREE.CylinderGeometry(36, 40, 3, 48);
    const baseTerrainMesh = new THREE.Mesh(baseTerrainGeo, matClayGround);
    baseTerrainMesh.position.y = -1.5;
    baseTerrainMesh.receiveShadow = !isSoftwareGl;
    worldGroup.add(baseTerrainMesh);

    // Rolling gentle hill mounds
    const moundGeo = new THREE.SphereGeometry(1, 24, 16);
    const mounds = [
      { x: -14, y: -0.2, z: -10, sx: 10, sy: 2.5, sz: 8, mat: matParkGrass },
      { x: 12, y: -0.3, z: -8, sx: 9, sy: 2.2, sz: 9, mat: matClayGround },
      { x: 3, y: -0.4, z: 6, sx: 12, sy: 1.8, sz: 10, mat: matGardenEarth },
      { x: -6, y: -0.3, z: 12, sx: 8, sy: 2.0, sz: 8, mat: matParkGrass },
    ];
    mounds.forEach((m) => {
      const mesh = new THREE.Mesh(moundGeo, m.mat);
      mesh.position.set(m.x, m.y, m.z);
      mesh.scale.set(m.sx, m.sy, m.sz);
      mesh.receiveShadow = !isSoftwareGl;
      worldGroup.add(mesh);
    });

    // Winding pastel road ribbon
    const roadCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-20, 0.05, -15),
      new THREE.Vector3(-10, 0.05, -6),
      new THREE.Vector3(0, 0.05, 0),
      new THREE.Vector3(8, 0.05, 6),
      new THREE.Vector3(18, 0.05, 12),
    ]);
    const roadPoints = roadCurve.getPoints(40);
    const roadGeo = new THREE.BufferGeometry().setFromPoints(roadPoints);
    const roadLine = new THREE.Line(
      roadGeo,
      new THREE.LineBasicMaterial({ color: '#E2E8F0', linewidth: 3 })
    );
    worldGroup.add(roadLine);

    // Helper: Composite Procedural Clay Tree (Trunk + 3-sphere crown)
    function createClayTree(scale = 1): THREE.Group {
      const tree = new THREE.Group();
      const trunkGeo = new THREE.CylinderGeometry(0.12 * scale, 0.18 * scale, 1.2 * scale, 10);
      const trunk = new THREE.Mesh(trunkGeo, matTreeTrunk);
      trunk.position.y = 0.6 * scale;
      trunk.castShadow = !isSoftwareGl;
      tree.add(trunk);

      const crownGeo = new THREE.SphereGeometry(0.6 * scale, 12, 10);
      const c1 = new THREE.Mesh(crownGeo, matTreeFoliage);
      c1.position.set(0, 1.3 * scale, 0);
      c1.castShadow = !isSoftwareGl;
      tree.add(c1);

      const c2 = new THREE.Mesh(crownGeo, matTreeFoliage);
      c2.position.set(0.3 * scale, 1.1 * scale, 0.2 * scale);
      c2.scale.setScalar(0.75);
      tree.add(c2);

      const c3 = new THREE.Mesh(crownGeo, matTreeFoliage);
      c3.position.set(-0.25 * scale, 1.15 * scale, -0.2 * scale);
      c3.scale.setScalar(0.7);
      tree.add(c3);

      return tree;
    }

    // Helper: Composite Procedural Building (Main block + roof bevel + windows + accent)
    function createClayBuilding(
      width: number,
      height: number,
      depth: number,
      material: THREE.Material,
      roofColor = '#DDD6FE'
    ): THREE.Group {
      const bGroup = new THREE.Group();

      // Main body
      const bodyGeo = new THREE.BoxGeometry(width, height, depth);
      const body = new THREE.Mesh(bodyGeo, material);
      body.position.y = height / 2;
      body.castShadow = !isSoftwareGl;
      body.receiveShadow = !isSoftwareGl;
      bGroup.add(body);

      // Roof cap
      const roofGeo = new THREE.BoxGeometry(width * 1.05, 0.3, depth * 1.05);
      const roofMat = new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.6 });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = height + 0.15;
      roof.castShadow = !isSoftwareGl;
      bGroup.add(roof);

      // Windows strips
      const winRows = Math.floor(height / 1.1);
      const winCols = Math.floor(width / 0.8);
      const winGeo = new THREE.BoxGeometry(0.35, 0.45, 0.05);

      for (let r = 1; r <= winRows; r++) {
        for (let c = 0; c < winCols; c++) {
          const winFront = new THREE.Mesh(winGeo, matWindow);
          const xPos = -width / 2 + 0.45 + c * 0.7;
          const yPos = r * 1.0 - 0.2;
          winFront.position.set(xPos, yPos, depth / 2 + 0.02);
          bGroup.add(winFront);
        }
      }

      // Rooftop miniature garden / solar panel
      const solarGeo = new THREE.BoxGeometry(width * 0.5, 0.08, depth * 0.4);
      const solarMat = new THREE.MeshStandardMaterial({
        color: '#7DD3FC',
        roughness: 0.3,
        metalness: 0.3,
      });
      const solar = new THREE.Mesh(solarGeo, solarMat);
      solar.position.set(0, height + 0.35, 0);
      solar.rotation.x = -0.15;
      bGroup.add(solar);

      return bGroup;
    }

    // -------------------------------------------------------------
    // SCENE 2 ZONE: MINIATURE CITY (Pastel skyscrapers & plazas)
    // -------------------------------------------------------------
    const cityGroup = new THREE.Group();
    cityGroup.position.set(0, 0, -8);
    worldGroup.add(cityGroup);

    const cityBuildings = [
      { x: -3.5, z: -3, w: 2.2, h: 6.5, d: 2.2, m: 0, r: '#DDD6FE' },
      { x: -1.0, z: -4.5, w: 2.6, h: 8.8, d: 2.4, m: 1, r: '#BAE6FD' },
      { x: 2.2, z: -4, w: 2.4, h: 7.2, d: 2.2, m: 2, r: '#FBCFE8' },
      { x: 4.8, z: -2.5, w: 2.0, h: 5.5, d: 2.0, m: 3, r: '#FEF08A' },
      { x: -5.5, z: -1.5, w: 1.8, h: 4.2, d: 1.8, m: 4, r: '#A7F3D0' },
      { x: 0.5, z: -1.8, w: 2.0, h: 5.0, d: 2.0, m: 5, r: '#DDD6FE' },
      { x: 3.0, z: -0.5, w: 1.6, h: 3.8, d: 1.6, m: 0, r: '#FCE7F3' },
    ];

    cityBuildings.forEach((b) => {
      const building = createClayBuilding(b.w, b.h, b.d, buildingMaterials[b.m], b.r);
      building.position.set(b.x, 0, b.z);
      cityGroup.add(building);
    });

    // Street trees around city
    for (let i = 0; i < 10; i++) {
      const tree = createClayTree(0.8 + Math.random() * 0.3);
      tree.position.set(-6 + i * 1.3 + (Math.random() - 0.5) * 0.6, 0, 1.2 + (Math.random() - 0.5) * 0.8);
      cityGroup.add(tree);
    }

    // -------------------------------------------------------------
    // SCENE 3 ZONE: PLAN MY DAY PARK (Gazebo, benches, paths)
    // -------------------------------------------------------------
    const parkGroup = new THREE.Group();
    parkGroup.position.set(-11, 0, 4);
    worldGroup.add(parkGroup);

    // Park Pond
    const pondGeo = new THREE.CylinderGeometry(3.2, 3.4, 0.1, 24);
    const pondMat = new THREE.MeshStandardMaterial({
      color: '#BAE6FD',
      roughness: 0.15,
      metalness: 0.2,
    });
    const pond = new THREE.Mesh(pondGeo, pondMat);
    pond.position.set(0, 0.05, 0);
    parkGroup.add(pond);

    // Park Gazebo
    const gazebo = new THREE.Group();
    const pillarGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.6, 8);
    const pillarMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.5 });
    for (let a = 0; a < 6; a++) {
      const angle = (a / 6) * Math.PI * 2;
      const pil = new THREE.Mesh(pillarGeo, pillarMat);
      pil.position.set(Math.cos(angle) * 0.9, 0.8, Math.sin(angle) * 0.9);
      pil.castShadow = !isSoftwareGl;
      gazebo.add(pil);
    }
    const domeGeo = new THREE.ConeGeometry(1.2, 0.8, 16);
    const domeMat = new THREE.MeshStandardMaterial({ color: '#FCE7F3', roughness: 0.6 });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 1.9;
    dome.castShadow = !isSoftwareGl;
    gazebo.add(dome);
    gazebo.position.set(3.5, 0, -2);
    parkGroup.add(gazebo);

    // Park trees cluster
    for (let i = 0; i < 8; i++) {
      const pTree = createClayTree(0.9 + Math.random() * 0.4);
      pTree.position.set(-3 + (i % 3) * 2.2, 0, -2 + Math.floor(i / 3) * 2.2);
      parkGroup.add(pTree);
    }

    // -------------------------------------------------------------
    // SCENE 4 ZONE: CAMPUS AIR (Academic hall, clock tower, courtyard)
    // -------------------------------------------------------------
    const campusGroup = new THREE.Group();
    campusGroup.position.set(11, 0, 3);
    worldGroup.add(campusGroup);

    // Main Academic Quad Hall
    const mainHall = createClayBuilding(4.5, 3.2, 2.5, buildingMaterials[5], '#BAE6FD');
    mainHall.position.set(0, 0, -2);
    campusGroup.add(mainHall);

    // Clock / Bell Tower
    const towerGroup = new THREE.Group();
    const towerBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 6.2, 1.4),
      new THREE.MeshStandardMaterial({ color: '#EDE9FE', roughness: 0.55 })
    );
    towerBody.position.y = 3.1;
    towerBody.castShadow = !isSoftwareGl;
    towerGroup.add(towerBody);

    const clockFace = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.35, 0.05, 16),
      new THREE.MeshStandardMaterial({ color: '#FEF08A', roughness: 0.3 })
    );
    clockFace.rotation.x = Math.PI / 2;
    clockFace.position.set(0, 5.0, 0.72);
    towerGroup.add(clockFace);

    const towerSpire = new THREE.Mesh(
      new THREE.ConeGeometry(0.9, 1.6, 8),
      new THREE.MeshStandardMaterial({ color: '#7DD3FC', roughness: 0.5 })
    );
    towerSpire.position.y = 6.9;
    towerSpire.castShadow = !isSoftwareGl;
    towerGroup.add(towerSpire);

    towerGroup.position.set(3.2, 0, -1);
    campusGroup.add(towerGroup);

    // Campus trees & courtyard ring
    for (let i = 0; i < 6; i++) {
      const cTree = createClayTree(0.75 + Math.random() * 0.3);
      cTree.position.set(-2.5 + i * 1.1, 0, 1.4 + (i % 2) * 0.6);
      campusGroup.add(cTree);
    }

    // -------------------------------------------------------------
    // SCENE 5 ZONE: 3D CLAY CLOUD MASCOT ("Nimbus")
    // -------------------------------------------------------------
    const mascotGroup = new THREE.Group();
    mascotGroup.position.set(2.5, 4.2, 4.5);
    scene.add(mascotGroup);

    // Mascot Body (5 soft puffy spheres)
    const mascotBodyPuffs = [
      { x: 0, y: 0, z: 0, s: 1.0 },
      { x: 0.8, y: -0.1, z: 0.1, s: 0.7 },
      { x: -0.8, y: -0.1, z: -0.1, s: 0.7 },
      { x: 0.35, y: 0.45, z: 0, s: 0.65 },
      { x: -0.35, y: 0.4, z: 0.1, s: 0.65 },
    ];
    mascotBodyPuffs.forEach((p) => {
      const puff = new THREE.Mesh(
        new THREE.SphereGeometry(p.s, 24, 20),
        new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.45, metalness: 0.05 })
      );
      puff.position.set(p.x, p.y, p.z);
      puff.castShadow = !isSoftwareGl;
      mascotGroup.add(puff);
    });

    // Mascot Eyes (cute deep navy clay beads)
    const eyeMat = new THREE.MeshStandardMaterial({ color: '#0F172A', roughness: 0.2 });
    const eyeGeo = new THREE.SphereGeometry(0.1, 16, 16);

    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.25, 0.12, 0.95);
    mascotGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.25, 0.12, 0.95);
    mascotGroup.add(rightEye);

    // Blushing Cheeks (cute blush pink disks)
    const blushMat = new THREE.MeshStandardMaterial({
      color: '#F472B6',
      roughness: 0.6,
      transparent: true,
      opacity: 0.8,
    });
    const blushGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const leftBlush = new THREE.Mesh(blushGeo, blushMat);
    leftBlush.position.set(-0.45, -0.05, 0.88);
    leftBlush.scale.set(1.2, 0.7, 0.5);
    mascotGroup.add(leftBlush);

    const rightBlush = new THREE.Mesh(blushGeo, blushMat);
    rightBlush.position.set(0.45, -0.05, 0.88);
    rightBlush.scale.set(1.2, 0.7, 0.5);
    mascotGroup.add(rightBlush);

    // Smile line
    const smileCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.12, -0.06, 0.97),
      new THREE.Vector3(0, -0.16, 0.98),
      new THREE.Vector3(0.12, -0.06, 0.97)
    );
    const smilePoints = smileCurve.getPoints(12);
    const smileGeo = new THREE.BufferGeometry().setFromPoints(smilePoints);
    const smileLine = new THREE.Line(
      smileGeo,
      new THREE.LineBasicMaterial({ color: '#0F172A', linewidth: 2 })
    );
    mascotGroup.add(smileLine);

    // -------------------------------------------------------------
    // SCENE 7 ZONE: ECO GARDEN (Seedling sprouts, flower beds)
    // -------------------------------------------------------------
    const gardenGroup = new THREE.Group();
    gardenGroup.position.set(4, 0, 7);
    worldGroup.add(gardenGroup);

    // Earthen raised planter beds
    const bedGeo = new THREE.BoxGeometry(3.5, 0.4, 2.0);
    const bedMat = new THREE.MeshStandardMaterial({ color: '#DDD6FE', roughness: 0.7 });
    const bed = new THREE.Mesh(bedGeo, bedMat);
    bed.position.set(0, 0.2, 0);
    gardenGroup.add(bed);

    // Seedling Sprouts (Stem + 2 tiny leaves)
    function createSeedling(sproutScale = 1): THREE.Group {
      const sprout = new THREE.Group();
      const stemGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.6 * sproutScale, 8);
      const stemMat = new THREE.MeshStandardMaterial({ color: '#34D399', roughness: 0.5 });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = 0.3 * sproutScale;
      sprout.add(stem);

      const leafGeo = new THREE.SphereGeometry(0.18 * sproutScale, 12, 10);
      const leafMat = new THREE.MeshStandardMaterial({ color: '#6EE7B7', roughness: 0.5 });

      const leaf1 = new THREE.Mesh(leafGeo, leafMat);
      leaf1.scale.set(1.5, 0.4, 0.8);
      leaf1.position.set(0.15 * sproutScale, 0.55 * sproutScale, 0);
      leaf1.rotation.z = -0.4;
      sprout.add(leaf1);

      const leaf2 = new THREE.Mesh(leafGeo, leafMat);
      leaf2.scale.set(1.5, 0.4, 0.8);
      leaf2.position.set(-0.15 * sproutScale, 0.55 * sproutScale, 0);
      leaf2.rotation.z = 0.4;
      sprout.add(leaf2);

      return sprout;
    }

    for (let s = 0; s < 5; s++) {
      const seedling = createSeedling(0.9 + Math.random() * 0.4);
      seedling.position.set(-1.2 + s * 0.6, 0.4, (s % 2) * 0.4 - 0.2);
      gardenGroup.add(seedling);
    }

    // Miniature Wind Turbine
    const turbine = new THREE.Group();
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.12, 4.0, 10);
    const pole = new THREE.Mesh(poleGeo, new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.4 }));
    pole.position.y = 2.0;
    turbine.add(pole);

    const bladesGroup = new THREE.Group();
    bladesGroup.position.y = 4.0;
    for (let b = 0; b < 3; b++) {
      const bladeAngle = (b / 3) * Math.PI * 2;
      const bladeGeo = new THREE.BoxGeometry(0.1, 1.4, 0.02);
      const blade = new THREE.Mesh(bladeGeo, new THREE.MeshStandardMaterial({ color: '#BAE6FD', roughness: 0.3 }));
      blade.position.set(Math.sin(bladeAngle) * 0.7, Math.cos(bladeAngle) * 0.7, 0.1);
      blade.rotation.z = -bladeAngle;
      bladesGroup.add(blade);
    }
    turbine.add(bladesGroup);
    turbine.position.set(3.2, 0, 1.2);
    gardenGroup.add(turbine);

    // -------------------------------------------------------------
    // CAMERA WAYPOINTS PER SCENE (8 SCENES)
    // -------------------------------------------------------------
    const sceneCameraWaypoints = [
      // 0: The Sky (Hero)
      { pos: new THREE.Vector3(0, 22, 38), look: new THREE.Vector3(0, 4, -10) },
      // 1: The City (Dashboard)
      { pos: new THREE.Vector3(0, 10, 22), look: new THREE.Vector3(0, 4, -2) },
      // 2: Plan My Day (Park)
      { pos: new THREE.Vector3(-8, 6, 14), look: new THREE.Vector3(-4, 2, 2) },
      // 3: The Campus (CampusAir)
      { pos: new THREE.Vector3(9, 7, 12), look: new THREE.Vector3(4, 2, -1) },
      // 4: AI Companion (Mascot Close-up)
      { pos: new THREE.Vector3(3.5, 5.0, 10.5), look: new THREE.Vector3(2.5, 4.2, 4.5) },
      // 5: Pollution Alerts (Overlook)
      { pos: new THREE.Vector3(-6, 9, 18), look: new THREE.Vector3(-1, 3.5, 0) },
      // 6: Eco Quests (Garden)
      { pos: new THREE.Vector3(5, 4.5, 12), look: new THREE.Vector3(3.5, 1.8, 4) },
      // 7: A Brighter Tomorrow (Final Panoramic Pullback)
      { pos: new THREE.Vector3(0, 26, 42), look: new THREE.Vector3(0, 2, -4) },
    ];

    // -------------------------------------------------------------
    // CONTINUOUS ANIMATION LOOP
    // -------------------------------------------------------------
    let frameId = 0;
    const clock = new THREE.Clock();

    function tick() {
      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      // 1. CONTINUOUS CLOUD DRIFTING (defining feature: moves even when stopped)
      cloudLayers.forEach((c) => {
        // Continuous organic X velocity
        c.group.position.x += c.speed;
        if (c.group.position.x > 45) {
          c.group.position.x = -45;
        }
        // Continuous organic vertical bobbing
        c.group.position.y = c.baseY + Math.sin(elapsedTime * c.frequency + c.phase) * c.amp;
      });

      // 2. DRIFTING PARTICLES & CLEAN AIR BUBBLES
      particleMeshes.forEach((p) => {
        p.mesh.position.x += p.speedX;
        p.mesh.position.y += Math.sin(elapsedTime * 0.8 + p.seed) * 0.015;
        if (p.mesh.position.x > 25) {
          p.mesh.position.x = -25;
        }
      });

      // 3. WIND TURBINE BLADES ROTATION
      bladesGroup.rotation.z += 0.035;

      // 4. MASCOT IDLE & REACTION ANIMATION
      const reaction = stateRef.current.mascotReaction;
      let bobAmp = 0.25;
      let bobFreq = 1.6;
      if (reaction === 'happy') {
        bobAmp = 0.5;
        bobFreq = 3.5;
        mascotGroup.rotation.y = Math.sin(elapsedTime * 4) * 0.4;
      } else if (reaction === 'thinking') {
        mascotGroup.rotation.z = Math.sin(elapsedTime * 2) * 0.15;
      } else {
        mascotGroup.rotation.y = Math.sin(elapsedTime * 0.8) * 0.12;
        mascotGroup.rotation.z = 0;
      }
      mascotGroup.position.y = 4.2 + Math.sin(elapsedTime * bobFreq) * bobAmp;

      // 5. CAMERA SMOOTH INTERPOLATION (damped toward waypoint)
      const targetWaypoint = sceneCameraWaypoints[stateRef.current.currentSceneIndex] || sceneCameraWaypoints[0];
      const targetPos = targetWaypoint.pos;
      const targetLook = targetWaypoint.look;

      // Frame-rate independent exponential damping
      const dampFactor = 0.045;
      stateRef.current.currentCamPos.lerp(targetPos, dampFactor);
      stateRef.current.currentCamLook.lerp(targetLook, dampFactor);

      camera.position.copy(stateRef.current.currentCamPos);
      camera.lookAt(stateRef.current.currentCamLook);

      // Render frame
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    }

    tick();

    // -------------------------------------------------------------
    // RESIZE LISTENER
    // -------------------------------------------------------------
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // CLEANUP
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #E0F2FE 0%, #EDE9FE 60%, #FCE7F3 100%)',
      }}
    />
  );
};
