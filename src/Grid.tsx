import { Line, Group } from "react-konva";

type LineProps = {
  width: number;
  height: number;
  gridSize: number;
  color: string;
};

function Grid({ width, height, gridSize, color }: LineProps) {
  const lines = [];
  // vertical lines
  for (let i = 0; i <= width / gridSize; i++) {
    lines.push(
      <Line
        key={`v-${i}`}
        points={[i * gridSize, 0, i * gridSize, height]}
        strokeWidth={1}
        stroke={color}
      />,
    );
  }

  // horizontal lines
  for (let i = 0; i <= height / gridSize; i++) {
    lines.push(
      <Line
        key={`h-${i}`}
        points={[0, i * gridSize, width, i * gridSize]}
        strokeWidth={1}
        stroke={color}
      />,
    );
  }

  return <Group>{lines}</Group>;
}

export default Grid;
