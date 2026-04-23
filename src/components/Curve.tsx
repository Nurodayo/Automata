import { Group, Arrow, Text } from "react-konva";
type CurveProps = {
  start: number[];
  end: number[];
  symbol: string[];
  radius: number;
};
// we don't need the id here but rather in the canvas
function Curve({ start, end, symbol, radius }: CurveProps) {
  // we calculate the centroid of the triangle to make the curve look a little better
  const c: number[] = [start[0], end[1]];

  // i dont think that passing arrays with more than two numbers will break it so i'll leave it like that
  const center = (a: number[], b: number[], c: number[]) => {
    const centroid = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3];
    return centroid;
  };
  // extra point that smooths out the line
  const centroid = center(start, end, c);

  // pendiente de una reta
  // const m: number = (end[1] - centroid[1]) / (end[0] - centroid[0]);

  // atan works in radians but konva needs the angle in degrees. bummer
  // const ang: number = Math.atan(m) * (180 / Math.PI);
  // We get the unit vector and then multiply it by the radius to start the curve at the edge of the state
  const normalize = (p: number[]) => {
    const denom = Math.sqrt(p[0] ** 2 + p[1] ** 2);
    const unitVector = [p[0] / denom, p[1] / denom];
    return unitVector;
  };

  const unitV1: number[] = normalize([
    -start[0] + centroid[0],
    -start[1] + centroid[1],
  ]);
  const unitV2: number[] = normalize([
    -centroid[0] + end[0],
    -centroid[1] + end[1],
  ]);

  const startEdge: number[] = [
    start[0] + radius * unitV1[0],
    start[1] + radius * unitV1[1],
  ];

  const endEdge: number[] = [
    end[0] - radius * unitV2[0],
    end[1] - radius * unitV2[1],
  ];
  // 3 is the radius of the polygon at the end of the curve
  // const endArrow: number[] = [
  //   end[0] - (radius + 3) * unitV2[0],
  //   end[1] - (radius + 3) * unitV2[1],
  // ];

  //need to find a better looking position for the transition symbols
  const textPos: number[] = [
    (startEdge[0] + endEdge[0]) / 2,
    (startEdge[1] + endEdge[1]) / 2,
  ];
  return (
    <Group>
      <Arrow
        points={[
          startEdge[0],
          startEdge[1],
          centroid[0],
          centroid[1],
          endEdge[0],
          endEdge[1],
        ]}
        stroke="black"
        strokeWidth={3}
        tension={0.6}
        fill="black"
      />
      <Text
        fontFamily="JetBrains Mono"
        align="center"
        verticalAlign="middle"
        padding={8}
        fontSize={24}
        text={symbol.toString()}
        x={textPos[0]}
        y={textPos[1]}
        stroke="lightgray"
        strokeWidth={0.75}
        fill="black"
      />
    </Group>
  );
}

export default Curve;
