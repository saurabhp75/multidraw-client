type Draw = {
  ctx: CanvasRenderingContext2D;
  curr: Point;
  prev: Point | null;
};

type Point = { x: number; y: number };
