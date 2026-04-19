import { Group, Line, Text } from "react-konva";

type CurveProps = {
  start: number[];
  end: number[];
  symbol: string[];
};

function Curve({ start, end, symbol }: CurveProps) {
  // we calculate the centroid of the triangle to make the curve look a little better
  const center = (a: number[], b: number[]) => {
    const c: number[] = [a[0], b[1]];
    const centroid = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3];
    return centroid;
  };
  // extra point that smooths out the line
  const centroid = center(start, end);

  return (
    <Group>
      <Line
        points={[start[0], start[1], centroid[0], centroid[1], end[0], end[1]]}
        stroke="black"
        strokeWidth={5}
        tension={0.5}
      />
      <Text fontFamily="JetBrains Mono" text={symbol[0]} />
    </Group>
  );
}

export default Curve;
