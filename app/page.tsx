"use client";

import { useDraw } from "@/hooks/useDraw";

export default function Home() {
  const { canvasRef, clear } = useDraw();

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-slate-300">
      <button onClick={clear}>Clear</button>
      <canvas
        ref={canvasRef}
        className="border border-black rounded-md "
        width={750}
        height={750}
      />
    </div>
  );
}
