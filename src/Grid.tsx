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
  for (let i = -(width / 2); i <= width / 2; i += gridSize) {
    lines.push(
      <Line
        key={`v-${i}`}
        points={[i, -height / 2, i, height / 2]}
        strokeWidth={1}
        stroke={color}
      />,
    );
  }

  // horizontal lines
  for (let i = -(height / 2); i <= height / 2; i += gridSize) {
    lines.push(
      <Line
        key={`h-${i}`}
        points={[-width / 2, i, width / 2, i]}
        strokeWidth={1}
        stroke={color}
      />,
    );
  }

  return <Group>{lines}</Group>;
}

export default Grid;
