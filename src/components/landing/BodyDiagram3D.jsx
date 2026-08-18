import { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import { BODY_PARTS, estimatePremiumForPart, NUTRITION_META } from '../../lib/bodyInsuranceMap'
import { BODY_PARTS_3D } from '../../lib/bodyMap3D'

function Figure({ activeKey, highlightKeys, onPick }) {
  const skinProps = { color: '#E2E8F0', roughness: 0.6, metalness: 0.02 }
  return (
    <group>
      <mesh position={[0, 3.35, 0]} castShadow>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.55} metalness={0.02} />
      </mesh>
      <mesh position={[0, 3.0, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.13, 0.22, 16]} />
        <meshStandardMaterial {...skinProps} />
      </mesh>
      <mesh position={[0, 2.3, 0]} castShadow>
        <capsuleGeometry args={[0.5, 1.3, 8, 20]} />
        <meshStandardMaterial {...skinProps} />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.42, 20, 20]} />
        <meshStandardMaterial {...skinProps} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <capsuleGeometry args={[0.42, 1.4, 8, 20]} />
        <meshStandardMaterial {...skinProps} />
      </mesh>
      <mesh position={[-0.18, -0.42, 0.08]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial {...skinProps} />
      </mesh>
      <mesh position={[0.18, -0.42, 0.08]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial {...skinProps} />
      </mesh>
      <mesh position={[-0.72, 2.1, 0]} rotation={[0, 0, 0.15]} castShadow>
        <capsuleGeometry args={[0.12, 1.3, 6, 16]} />
        <meshStandardMaterial {...skinProps} />
      </mesh>
      <mesh position={[0.72, 2.1, 0]} rotation={[0, 0, -0.15]} castShadow>
        <capsuleGeometry args={[0.12, 1.3, 6, 16]} />
        <meshStandardMaterial {...skinProps} />
      </mesh>
      <mesh position={[-0.88, 1.42, 0]} castShadow>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial {...skinProps} />
      </mesh>
      <mesh position={[0.88, 1.42, 0]} castShadow>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial {...skinProps} />
      </mesh>

      {BODY_PARTS_3D.map((p3d) => {
        const meta = BODY_PARTS.find((b) => b.key === p3d.key)
        if (!meta) return null
        const isActive = activeKey === p3d.key
        const isHighlighted = highlightKeys?.includes(p3d.key)
        const scale = isHighlighted && !isActive ? 1.25 : isActive ? 1.15 : 1
        return (
          <mesh
            key={p3d.key}
            position={p3d.position}
            scale={scale}
            onClick={(e) => {
              e.stopPropagation()
              onPick(p3d.key)
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto'
            }}
          >
            <sphereGeometry args={[p3d.args[0], 24, 24]} />
            <meshStandardMaterial
              color="#1D4ED8"
              emissive={isActive || isHighlighted ? '#1D4ED8' : '#000000'}
              emissiveIntensity={isActive ? 0.35 : isHighlighted ? 0.4 : 0}
              transparent
              opacity={isActive ? 0.9 : isHighlighted ? 0.8 : 0.45}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export default function BodyDiagram3D({ highlightKeys = [], focusKey = null }) {
  const [activeKey, setActiveKey] = useState(focusKey || 'heart')
  const active = BODY_PARTS.find((p) => p.key === activeKey)
  const activeIndex = BODY_PARTS.findIndex((p) => p.key === activeKey)

  useEffect(() => {
    if (focusKey) setActiveKey(focusKey)
  }, [focusKey])

  return (
    <section className="px-6 py-10 md:py-14">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-[1fr_340px] gap-8">
          <div>
            <div className="h-80 md:h-[440px] bg-canvas border border-line">
              <Suspense fallback={null}>
                <Canvas camera={{ position: [0, 2.2, 5], fov: 40 }} shadows>
                  <ambientLight intensity={0.75} />
                  <directionalLight position={[3, 5, 4]} intensity={0.9} castShadow />
                  <directionalLight position={[-3, 2, -2]} intensity={0.35} />
                  <Figure activeKey={activeKey} highlightKeys={highlightKeys} onPick={setActiveKey} />
                  <ContactShadows position={[-0.6, 0]} opacity={0.25} scale={4} blur={2.2} />
                  <OrbitControls
                    enablePan={false}
                    minDistance={3}
                    maxDistance={8}
                    target={[0, 2, 0]}
                    autoRotate
                    autoRotateSpeed={1}
                  />
                </Canvas>
              </Suspense>
            </div>
            <p className="text-xs text-subink text-center mt-3">드래그해서 회전 · 부위를 클릭하세요</p>
          </div>

          {active && (
            <div>
              <h2 className="font-display text-xl font-bold text-ink mb-1">{active.label}</h2>
              <p className="text-xs text-subink mb-6">{activeIndex + 1} / {BODY_PARTS.length}</p>

              <Field label="통계">
                <p className="text-sm text-ink leading-relaxed">{active.stat}</p>
              </Field>

              <Field label="예시 예상 보험료">
                <p className="text-2xl font-bold text-ink tabular font-mono">
                  ₩{estimatePremiumForPart(active.key).premium.toLocaleString()}
                </p>
                <p className="text-xs text-subink mt-1">참고용 예시값입니다. 개인 진단이 아니에요.</p>
              </Field>

              {active.nutrition && (
                <Field label="영양소 참고 기준">
                  <table className="w-full mb-3">
                    <tbody>
                      {active.nutrition.nutrients.map((n) => (
                        <tr key={n.name} className="border-t border-line first:border-0">
                          <td className="py-2 text-sm text-ink">{n.name}</td>
                          <td className="py-2 text-sm text-subink text-right tabular whitespace-nowrap">
                            {n.amount} {n.unit}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-[13px] text-subink leading-relaxed mb-2">
                    <span className="text-ink">도움이 되는 식품</span> · {active.nutrition.foods.join(', ')}
                  </p>
                  <p className="text-xs text-subink leading-relaxed">{active.nutrition.mechanism}</p>
                  <p className="text-[11px] text-subink/70 mt-2">출처 · {NUTRITION_META.source}</p>
                </Field>
              )}

              <Field label="관련 보험 상품군">
                <ul>
                  {active.insuranceCategories.map((c) => (
                    <li
                      key={c}
                      className="flex items-center justify-between text-sm text-ink py-2.5 border-t border-line first:border-0"
                    >
                      {c}
                      <span className="text-subink text-xs">→</span>
                    </li>
                  ))}
                </ul>
              </Field>

              <Field>
                <p className="text-sm text-subink leading-relaxed">{active.tip}</p>
              </Field>

              <p className="text-[11px] text-subink/70 leading-relaxed">
                보험료와 영양소 수치는 성인 평균 기준 참고 정보이며, 개인의 실제 진단·처방을
                대체하지 않아요.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Field({ label, children }) {
  return (
    <div className="border-t border-line py-4 first:border-0 first:pt-0">
      {label && <p className="text-xs font-medium text-subink mb-2">{label}</p>}
      {children}
    </div>
  )
}
