import { useEffect, useRef } from 'react';

export function ParticleSphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    // Particle nodes in spherical coordinates
    const NUM_PARTICLES = 650;
    const radius = Math.min(width, height) * 0.38;
    const particles: { theta: number; phi: number; baseRadius: number; speed: number }[] = [];

    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push({
        theta: Math.random() * Math.PI * 2,
        phi: Math.acos(Math.random() * 2 - 1),
        baseRadius: radius + (Math.random() - 0.5) * 20,
        speed: 0.0002 + Math.random() * 0.0003,
      });
    }

    let rotX = 0;
    let rotY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / width - 0.5) * 0.0015;
      targetMouseY = ((e.clientY - rect.top) / height - 0.5) * 0.0015;
    };

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 500;
      height = canvas.height = canvas.parentElement?.clientHeight || 500;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation and gentle, slow celestial rotation
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      rotX += 0.0003 + currentMouseY;
      rotY += 0.0008 + currentMouseX;

      const cx = width / 2;
      const cy = height / 2;

      // Glow backdrop
      const radial = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.4);
      radial.addColorStop(0, 'rgba(197, 155, 39, 0.08)');
      radial.addColorStop(0.6, 'rgba(197, 155, 39, 0.02)');
      radial.addColorStop(1, 'rgba(10, 13, 26, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // Render 3D particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.theta += p.speed;

        // Spherical to 3D Cartesian
        let x = p.baseRadius * Math.sin(p.phi) * Math.cos(p.theta);
        let y = p.baseRadius * Math.sin(p.phi) * Math.sin(p.theta);
        let z = p.baseRadius * Math.cos(p.phi);

        // Rotation around Y
        const x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
        const z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);

        // Rotation around X
        const y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
        const z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);

        // Perspective projection
        const fov = 400;
        const scale = fov / (fov + z2);
        const projX = cx + x1 * scale;
        const projY = cy + y2 * scale;

        // Depth alpha
        const alpha = Math.max(0.12, (z2 + radius) / (2 * radius));
        const dotSize = Math.max(0.8, scale * 1.8);

        ctx.fillStyle = i % 5 === 0 ? `rgba(234, 88, 12, ${alpha * 0.9})` : `rgba(222, 196, 98, ${alpha * 0.85})`;
        ctx.beginPath();
        ctx.arc(projX, projY, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative w-full h-[420px] sm:h-[480px] lg:h-[540px] flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

