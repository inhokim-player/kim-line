// 실제 해부학적 3D 메시(GLTF) 대신, 기본 지오메트리(구·캡슐)를 조합해 만든
// 클릭 가능한 3D 인체 모델의 부위별 좌표입니다. bodyInsuranceMap.js의 정보(key)를
// 그대로 재사용하고, 여기서는 3D 위치/크기만 정의합니다.

export const BODY_PARTS_3D = [
  { key: 'brain', position: [0, 3.42, 0.12], geometry: 'sphere', args: [0.14] },
  { key: 'mind', position: [0, 3.42, -0.12], geometry: 'sphere', args: [0.14] },
  { key: 'heart', position: [-0.18, 2.55, 0.15], geometry: 'sphere', args: [0.18] },
  { key: 'lungs', position: [0.22, 2.55, 0.12], geometry: 'sphere', args: [0.2] },
  { key: 'stomach', position: [0, 2.05, 0.15], geometry: 'sphere', args: [0.22] },
  { key: 'spine', position: [0, 1.5, -0.15], geometry: 'sphere', args: [0.2] },
  { key: 'skin', position: [0.42, 1.9, 0], geometry: 'sphere', args: [0.13] },
  { key: 'legs', position: [0, 0.3, 0], geometry: 'sphere', args: [0.24] }
]
