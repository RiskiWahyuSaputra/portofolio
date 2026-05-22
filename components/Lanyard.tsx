"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import type { ThreeElement } from "@react-three/fiber";
import {
  useGLTF,
  useTexture,
  Environment,
  Lightformer,
} from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";
import "./Lanyard.css";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  height?: number | string;
}

const CARD_ASPECT = 0.7163921594626769;
const CARD_FACE_NORMAL_THRESHOLD = 0.5;

type LanyardGLTF = {
  nodes: {
    card: THREE.Mesh;
    clip: THREE.Mesh;
    clamp: THREE.Mesh;
  };
  materials: {
    metal: THREE.Material;
  };
};

type SmoothedRigidBody = RapierRigidBody & {
  lerped?: THREE.Vector3;
};

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  height = "100vh",
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="lanyard-wrapper" style={{ height }}>
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band isMobile={isMobile} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
}: {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
}) {
  const band = useRef<
    THREE.Mesh<
      InstanceType<typeof MeshLineGeometry>,
      InstanceType<typeof MeshLineMaterial>
    >
  >(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<SmoothedRigidBody>(null!);
  const j2 = useRef<SmoothedRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);
  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const segmentProps = {
    type: "dynamic" as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  };
  const { nodes, materials } = useGLTF(
    "/assets/lanyard/card.glb",
  ) as unknown as LanyardGLTF;
  const baseLanyardTexture = useTexture("/assets/lanyard/lanyard.png");
  const baseFrontCardTexture = useTexture("/images/card-lanyard.png");
  const baseBackCardTexture = useTexture("/images/belakang-card.jpeg");
  const lanyardTexture = useMemo(
    () => createLanyardTexture(baseLanyardTexture),
    [baseLanyardTexture],
  );
  const frontCardTexture = useMemo(
    () => createFittedCardTexture(baseFrontCardTexture),
    [baseFrontCardTexture],
  );
  const backCardTexture = useMemo(
    () => createFittedCardTexture(baseBackCardTexture),
    [baseBackCardTexture],
  );
  const cardGeometry = nodes.card.geometry;
  const cardFaces = useMemo(
    () => splitCardGeometry(cardGeometry),
    [cardGeometry],
  );

  useEffect(() => {
    return () => {
      lanyardTexture.dispose();
      frontCardTexture.dispose();
      backCardTexture.dispose();
    };
  }, [backCardTexture, frontCardTexture, lanyardTexture]);

  const curve = useMemo(() => {
    const ropeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    ropeCurve.curveType = "chordal";

    return ropeCurve;
  }, []);
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [
    [0, 0, 0],
    [0, 0, 0],
    1,
  ]);
  useRopeJoint(j1, j2, [
    [0, 0, 0],
    [0, 0, 0],
    1,
  ]);
  useRopeJoint(j2, j3, [
    [0, 0, 0],
    [0, 0, 0],
    1,
  ]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => void (document.body.style.cursor = "auto");
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec
        .set(state.pointer.x, state.pointer.y, 0.5)
        .unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current) {
      const j1Lerped = updateLerpedSegment(j1.current, delta, minSpeed, maxSpeed);
      const j2Lerped = updateLerpedSegment(j2.current, delta, minSpeed, maxSpeed);

      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2Lerped);
      curve.points[2].copy(j1Lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({
        x: ang.x,
        y: ang.y - rot.y * 0.25,
        z: ang.z,
      }, true);
    }
  });

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => (
              (e.target as HTMLElement).releasePointerCapture(e.pointerId), drag(false)
            )}
            onPointerDown={(e) => (
              (e.target as HTMLElement).setPointerCapture(e.pointerId),
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation())),
              )
            )}
          >
            <mesh geometry={cardFaces.front}>
              <meshPhysicalMaterial
                map={frontCardTexture}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.5}
                metalness={0.3}
              />
            </mesh>
            <mesh geometry={cardFaces.back}>
              <meshPhysicalMaterial
                map={backCardTexture}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.5}
                metalness={0.3}
              />
            </mesh>
            <mesh geometry={cardFaces.edge}>
              <meshPhysicalMaterial
                color="#f2f2f2"
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.5}
                metalness={0.2}
              />
            </mesh>
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
            <mesh
              geometry={nodes.clamp.geometry}
              material={materials.metal}
            />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={lanyardTexture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

function updateLerpedSegment(
  body: SmoothedRigidBody,
  delta: number,
  minSpeed: number,
  maxSpeed: number,
) {
  const translation = body.translation();
  const lerped = body.lerped ?? new THREE.Vector3().copy(translation);
  const clampedDistance = Math.max(
    0.1,
    Math.min(1, lerped.distanceTo(translation)),
  );

  lerped.lerp(translation, delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
  body.lerped = lerped;

  return lerped;
}

function splitCardGeometry(geometry: THREE.BufferGeometry) {
  geometry.computeBoundingBox();
  const boundingBox = geometry.boundingBox;
  const position = geometry.getAttribute("position");
  const normal = geometry.getAttribute("normal");
  const index = geometry.index;

  if (!boundingBox || !position || !normal || !index) {
    return {
      front: geometry,
      back: geometry,
      edge: geometry,
    };
  }

  const frontIndices: number[] = [];
  const backIndices: number[] = [];
  const edgeIndices: number[] = [];

  for (let i = 0; i < index.count; i += 3) {
    const a = index.getX(i);
    const b = index.getX(i + 1);
    const c = index.getX(i + 2);
    const normalZ = (normal.getZ(a) + normal.getZ(b) + normal.getZ(c)) / 3;
    const target =
      normalZ > CARD_FACE_NORMAL_THRESHOLD
        ? frontIndices
        : normalZ < -CARD_FACE_NORMAL_THRESHOLD
          ? backIndices
          : edgeIndices;

    target.push(a, b, c);
  }

  return {
    front: createCardGeometryPart(geometry, frontIndices, boundingBox, false),
    back: createCardGeometryPart(geometry, backIndices, boundingBox, true),
    edge: createCardGeometryPart(geometry, edgeIndices, boundingBox, false),
  };
}

function createCardGeometryPart(
  source: THREE.BufferGeometry,
  indices: number[],
  boundingBox: THREE.Box3,
  flipX: boolean,
) {
  const geometry = source.clone();
  const indexArray =
    source.getAttribute("position").count > 65535
      ? new Uint32Array(indices)
      : new Uint16Array(indices);

  geometry.setIndex(new THREE.BufferAttribute(indexArray, 1));
  normalizeCardUv(geometry, boundingBox, flipX);
  geometry.computeBoundingSphere();

  return geometry;
}

function normalizeCardUv(
  geometry: THREE.BufferGeometry,
  boundingBox: THREE.Box3,
  flipX: boolean,
) {
  const position = geometry.getAttribute("position");
  const normalizedUv = new Float32Array(position.count * 2);
  const width = boundingBox.max.x - boundingBox.min.x;
  const height = boundingBox.max.y - boundingBox.min.y;

  for (let i = 0; i < position.count; i += 1) {
    const x = (position.getX(i) - boundingBox.min.x) / width;
    const y = (position.getY(i) - boundingBox.min.y) / height;
    normalizedUv[i * 2] = flipX ? 1 - x : x;
    normalizedUv[i * 2 + 1] = y;
  }

  geometry.setAttribute("uv", new THREE.BufferAttribute(normalizedUv, 2));
}

function createLanyardTexture(source: THREE.Texture) {
  const texture = source.clone();

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function createFittedCardTexture(source: THREE.Texture) {
  const texture = source.clone();
  const image = texture.image as { width?: number; height?: number } | undefined;
  const imageAspect =
    image?.width && image?.height ? image.width / image.height : CARD_ASPECT;

  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.center.set(0.5, 0.5);
  texture.repeat.set(1, 1);
  texture.offset.set(0, 0);

  if (imageAspect > CARD_ASPECT) {
    const repeatX = CARD_ASPECT / imageAspect;
    texture.repeat.x = repeatX;
    texture.offset.x = (1 - repeatX) / 2;
  } else {
    const repeatY = imageAspect / CARD_ASPECT;
    texture.repeat.y = repeatY;
    texture.offset.y = (1 - repeatY) / 2;
  }

  texture.needsUpdate = true;

  return texture;
}
