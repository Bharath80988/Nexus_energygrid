import React, { useEffect, useRef } from 'react';

const NetworkBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const isMobile = width < 768;
    const numParticles = isMobile ? 24 : 45;
    const maxDist = 125;
    const maxDistSq = maxDist * maxDist;

    const particles = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.2 + 0.6,
      });
    }

    let animationFrameId;
    let isPaused = false;

    const onVisibilityChange = () => {
      isPaused = document.hidden;
      if (!isPaused) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    let lastTime = performance.now();

    const draw = (now) => {
      if (isPaused) return;

      // Smooth step
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      for (let i = 0; i < numParticles; i++) {
        const p = particles[i];
        p.x += p.vx * dt * 60;
        p.y += p.vy * dt * 60;

        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        else if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        else if (p.y > height) { p.y = height; p.vy *= -1; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 6.28318);
        ctx.fillStyle = 'rgba(230, 57, 70, 0.45)';
        ctx.fill();

        // Optimized squared distance network connections
        for (let j = i + 1; j < numParticles; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const alpha = (1 - distSq / maxDistSq) * 0.14;
            ctx.strokeStyle = `rgba(230, 57, 70, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0 opacity-40 will-change-transform"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};

export default React.memo(NetworkBackground);
