import { useEffect, useRef } from "react";

export function Grainient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      time += 0.005;

      const gradient = ctx.createRadialGradient(
        canvas.width * 0.5 + Math.sin(time) * 100,
        canvas.height * 0.5 + Math.cos(time) * 100,
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.8,
      );

      gradient.addColorStop(0, "rgba(139, 26, 26, 0.3)");
      gradient.addColorStop(0.5, "rgba(10, 10, 10, 0.8)");
      gradient.addColorStop(1, "rgba(10, 10, 10, 1)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
