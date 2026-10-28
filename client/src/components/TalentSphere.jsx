import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

// Authentic fallback avatar images downloaded from tal.club
const FALLBACK_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
];

export default function TalentSphere({ candidates = [], onSelectCandidate, onExploreNetwork }) {
  const [rotation, setRotation] = useState({ x: 15, y: 0 });
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);

  // Auto-rotation loop
  useEffect(() => {
    let animId;
    const animate = () => {
      if (!isPaused) {
        setRotation((prev) => ({
          x: prev.x,
          y: (prev.y + 0.35) % 360
        }));
      }
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isPaused]);

  // Select 36 items arranged on Fibonacci sphere
  const sphereItems = React.useMemo(() => {
    const list = candidates.length > 0 ? candidates : [];
    const count = 38;
    const items = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle

    for (let i = 0; i < count; i++) {
      const candidate = list[i % (list.length || 1)] || {
        id: `mock-${i}`,
        name: `Member ${i + 1}`,
        category: 'Software Engineer',
        location: 'Bengaluru'
      };

      const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
      const radius = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i; // golden angle increment

      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      // Assign avatar
      const avatarUrl = FALLBACK_AVATARS[i % FALLBACK_AVATARS.length];

      items.push({
        candidate,
        x,
        y,
        z,
        avatarUrl,
        initial: (candidate.name || 'T').charAt(0).toUpperCase()
      });
    }
    return items;
  }, [candidates]);

  // Interactive mouse drag to rotate sphere
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    // Subtle tilt on mouse move
    setRotation((prev) => ({
      ...prev,
      x: 15 - (e.clientY - (rect.top + rect.height / 2)) * 0.03
    }));
  };

  const sphereRadius = 230; // Radius in px

  return (
    <section className="tal-sphere-section" id="meet-members">
      <div className="container tal-sphere-header">
        <h2 className="tal-serif-title">Meet Global Minds Candidates</h2>
        <p className="tal-sphere-sub" onClick={onExploreNetwork}>
          <span>Browse the Global Minds network</span>
          <ArrowRight size={14} />
        </p>
      </div>

      <div
        ref={containerRef}
        className="tal-sphere-viewport"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onMouseMove={handleMouseMove}
      >
        <div
          className="tal-sphere-globe"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
          }}
        >
          {sphereItems.map((item, idx) => {
            // Convert sphere coordinates to 3D translation
            const px = item.x * sphereRadius;
            const py = item.y * sphereRadius;
            const pz = item.z * sphereRadius;

            // Compute depth based on current rotation
            const radY = (rotation.y * Math.PI) / 180;
            const radX = (rotation.x * Math.PI) / 180;
            // Rotated Z
            const curZ = item.x * Math.sin(radY) + item.z * Math.cos(radY);
            const scale = Math.max(0.45, (curZ + sphereRadius) / (2 * sphereRadius));
            const opacity = Math.max(0.2, (curZ + sphereRadius) / (2 * sphereRadius));

            return (
              <div
                key={idx}
                className="tal-sphere-node"
                style={{
                  transform: `translate3d(${px}px, ${py}px, ${pz}px) scale(${scale})`,
                  opacity: opacity,
                  zIndex: Math.round(curZ + sphereRadius)
                }}
                onClick={() => onSelectCandidate && onSelectCandidate(item.candidate)}
                title={`${item.candidate.name} • ${item.candidate.category}`}
              >
                <div className="tal-sphere-avatar-wrap">
                  <img
                    src={item.avatarUrl}
                    alt={item.candidate.name}
                    className="tal-sphere-avatar-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="tal-sphere-avatar-fallback" style={{ display: 'none' }}>
                    {item.initial}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
