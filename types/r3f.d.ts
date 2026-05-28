import { Object3DNode } from "@react-three/fiber";
import * as THREE from "three";

declare module "@react-three/fiber" {
  interface ThreeElements {
    mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
    group: Object3DNode<THREE.Group, typeof THREE.Group>;
    points: Object3DNode<THREE.Points, typeof THREE.Points>;
    instancedMesh: Object3DNode<THREE.InstancedMesh, typeof THREE.InstancedMesh>;
    tubeGeometry: Object3DNode<THREE.TubeGeometry, typeof THREE.TubeGeometry>;
    sphereGeometry: Object3DNode<THREE.SphereGeometry, typeof THREE.SphereGeometry>;
    icosahedronGeometry: Object3DNode<THREE.IcosahedronGeometry, typeof THREE.IcosahedronGeometry>;
    bufferGeometry: Object3DNode<THREE.BufferGeometry, typeof THREE.BufferGeometry>;
    shaderMaterial: Object3DNode<THREE.ShaderMaterial, typeof THREE.ShaderMaterial>;
    meshStandardMaterial: Object3DNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;
    meshPhysicalMaterial: Object3DNode<THREE.MeshPhysicalMaterial, typeof THREE.MeshPhysicalMaterial>;
    pointsMaterial: Object3DNode<THREE.PointsMaterial, typeof THREE.PointsMaterial>;
    pointLight: Object3DNode<THREE.PointLight, typeof THREE.PointLight>;
    spotLight: Object3DNode<THREE.SpotLight, typeof THREE.SpotLight>;
    ambientLight: Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
    directionalLight: Object3DNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>;
    perspectiveCamera: Object3DNode<THREE.PerspectiveCamera, typeof THREE.PerspectiveCamera>;
    bufferAttribute: Object3DNode<THREE.BufferAttribute, typeof THREE.BufferAttribute>;
    color: Object3DNode<THREE.Color, typeof THREE.Color>;
    fog: Object3DNode<THREE.Fog, typeof THREE.Fog>;
  }
}

export {};
