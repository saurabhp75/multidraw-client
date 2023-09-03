import { useEffect, useRef, useState } from "react";

export const useDraw = (drawLine: (draw: Draw) => void) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);

  // Clear the canvas
  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Attach event handlers to canvas
  useEffect(() => {
    const currCanvas = canvasRef.current;
    if (!currCanvas) return;

    const ctx = currCanvas.getContext("2d");
    if (!ctx) return;

    const mouseUpOutHandler = () => {
      isDrawing.current = false;
    };

    const mouseDownHandler = (e: MouseEvent) => {
      isDrawing.current = true;

      // Update line start when mouseDown
      [lastX.current, lastY.current] = [e.offsetX, e.offsetY];
    };

    const handleDraw = (e: MouseEvent) => {
      if (!isDrawing.current || !ctx) return;

      drawLine({
        ctx: ctx,
        prev: { x: lastX.current, y: lastY.current },
        curr: { x: e.offsetX, y: e.offsetY },
      });

      // Update starting point of line
      [lastX.current, lastY.current] = [e.offsetX, e.offsetY];
    };

    // Draw when mouse moves (and isDrawing is true)
    currCanvas.addEventListener("mousemove", handleDraw);

    // Stop drawing when mouse is released
    currCanvas.addEventListener("mouseup", mouseUpOutHandler);

    // Stop drawing when mouse moves out of canvas
    currCanvas.addEventListener("mouseout", mouseUpOutHandler);
    currCanvas.addEventListener("mousedown", mouseDownHandler);

    // Remove event listeners
    return () => {
      currCanvas.removeEventListener("mousemove", handleDraw);
      currCanvas.removeEventListener("mouseup", mouseUpOutHandler);
      currCanvas.removeEventListener("mouseout", mouseUpOutHandler);
      currCanvas.removeEventListener("mousedown", mouseDownHandler);
    };
  }, [drawLine]);

  return { canvasRef, clear };
};
