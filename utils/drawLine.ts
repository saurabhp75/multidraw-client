type DrawLineProps = Draw & {
  color: string;
};

export default function drawLine({ ctx, prev, curr, color }: DrawLineProps) {

  ctx.lineJoin = "round"; // round where lines meet
  ctx.lineCap = "round"; // round where lines end
  ctx.strokeStyle = color; // line color
  ctx.lineWidth = 10; // line width

  // Initiate line drawing
  ctx.beginPath();

  // Starting point of line
  ctx.moveTo(prev.x, prev.y);

  // Ending point of line
  ctx.lineTo(curr.x, curr.y);

  // Draw the line on canvas
  ctx.stroke();
}
