import { useEffect, useRef, useState } from "react";

export const useDraw = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    const currCanvas = canvasRef.current;
    const ctx = currCanvas?.getContext("2d");

    const mouseUpHandler = () => {
      isDrawing.current = false;
    };

    const mouseOutHandler = () => {
      isDrawing.current = false;
    };

    const mouseDownHandler = (e: MouseEvent) => {
      isDrawing.current = true;
      // Update line start when mouseDown
      [lastX.current, lastY.current] = [e.offsetX, e.offsetY];
    };

    if (ctx) {
      ctx.lineJoin = "round"; // round where lines meet
      ctx.lineCap = "round"; // round where lines end
      ctx.strokeStyle = "#000"; // line color
      ctx.lineWidth = 10; // line width
    }

    const handleDraw = (e: MouseEvent) => {
      // console.log("mousedown");

      if (!isDrawing.current || !ctx) return;

      // Initiate line drawing
      ctx.beginPath();

      // Starting point off line
      ctx.moveTo(lastX.current, lastY.current);

      // Ending point off line
      ctx.lineTo(e.offsetX, e.offsetY);

      // Draw the line on canvas
      ctx.stroke();

      // Update starting point of line
      [lastX.current, lastY.current] = [e.offsetX, e.offsetY];
    };

    // Draw when mouse moves (and isDrawing is true)
    currCanvas?.addEventListener("mousemove", handleDraw);

    // Stop drawing when mouse is released
    currCanvas?.addEventListener("mouseup", mouseUpHandler);

    // Stop drawing when mouse moves out of canvas
    currCanvas?.addEventListener("mouseout", mouseOutHandler);
    currCanvas?.addEventListener("mousedown", mouseDownHandler);

    // Remove event listeners
    return () => {
      currCanvas?.removeEventListener("mousemove", handleDraw);
      currCanvas?.removeEventListener("mouseup", mouseUpHandler);
      currCanvas?.removeEventListener("mouseout", mouseOutHandler);
      currCanvas?.removeEventListener("mousedown", mouseDownHandler);
    };
  }, []);

  return { canvasRef, clear };
};
