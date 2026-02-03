// Type declarations for three.js to avoid TypeScript errors
declare module 'three' {
  export * from 'three';
}

declare module 'three/examples/jsm/loaders/GLTFLoader.js' {
  import { Loader, LoadingManager } from 'three';
  import { Object3D } from 'three';
  
  export interface GLTF {
    scene: Object3D;
    scenes: Object3D[];
    cameras: any[];
    animations: any[];
    asset: any;
    parser: any;
    userData: any;
  }
  
  export class GLTFLoader extends Loader {
    constructor(manager?: LoadingManager);
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (progress: ProgressEvent) => void,
      onError?: (error: ErrorEvent) => void
    ): void;
    parse(data: ArrayBuffer | string, path: string, onLoad: (gltf: GLTF) => void, onError?: (error: ErrorEvent) => void): void;
  }
}

