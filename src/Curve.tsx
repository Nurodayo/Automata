import { Group, Line, Text } from "react-konva";
// TODO: Add arrow indicating flow direction
type CurveProps = {
  start: number[];
  end: number[];
  symbol: string[];
};
// we don't need the id here but rather in the canvas
function Curve({ start, end, symbol }: CurveProps) {
  // we calculate the centroid of the triangle to make the curve look a little better
  const c: number[] = [start[0], end[1]];

  // i dont think that passing arrays with more than two numbers will break it so i'll leave it like that
  const center = (a: number[], b: number[], c: number[]) => {
    const centroid = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3];
    return centroid;
  };
  // extra point that smooths out the line
  const centroid = center(start, end, c);
  const textPos: number[] = [
    (c[0] + centroid[0]) / 2,
    (c[1] + centroid[1]) / 2,
  ];
  return (
    <Group>
      <Line
        points={[start[0], start[1], centroid[0], centroid[1], end[0], end[1]]}
        stroke="black"
        strokeWidth={5}
        tension={0.5}
      />
      <Text
        fontFamily="JetBrains Mono"
        text={symbol[0]}
        x={textPos[0]}
        y={textPos[1]}
      />
    </Group>
  );
}

export default Curve;
