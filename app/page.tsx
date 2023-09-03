"use client";

import { useDraw } from "@/hooks/useDraw";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";

import { io } from "socket.io-client";
import drawLine from "../utils/drawLine";
const socket = io("http://localhost:3001");

type DrawLineProps = {
  prev: Point;
  curr: Point;
  color: string;
};

export default function Home() {
  const [color, setColor] = useState("#000");
  const { canvasRef, clear } = useDraw(createLine);

  function createLine({ prev, curr, ctx }: Draw) {
    socket.emit("draw-line", { prev, curr, color });
    drawLine({ prev, curr, ctx, color });
  }

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    // Get canvas state from server
    socket.emit("client-ready");

    socket.on("get-canvas-state", () => {
      if (!canvasRef.current?.toDataURL()) return;
      console.log("sending canvas state");
      socket.emit("canvas-state", canvasRef.current.toDataURL());
    });

    socket.on("canvas-state-from-server", (state: string) => {
      console.log("I received the state");
      const img = new Image();
      img.src = state;
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
    });

    socket.on("draw-line", ({ prev, curr, color }: DrawLineProps) => {
      if (!ctx) return console.log("no ctx here");
      drawLine({ prev, curr, ctx, color });
    });

    socket.on("clear", clear);

    return () => {
      socket.off("draw-line");
      socket.off("get-canvas-state");
      socket.off("canvas-state-from-server");
      socket.off("clear");
    };
  }, [canvasRef, clear]);

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-slate-300 gap-2">
      <div className="flex flex-col gap-4">
        <HexColorPicker color={color} onChange={setColor} />
        <button
          onClick={() => socket.emit("clear")}
          className="bg-slate-400 px-4 rounded-md py-1"
        >
          Clear
        </button>{" "}
      </div>
      <canvas
        ref={canvasRef}
        className="border border-black rounded-md "
        width={750}
        height={750}
      />
    </div>
  );
}
