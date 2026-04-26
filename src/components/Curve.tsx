import { Group, Arrow, Text } from "react-konva";
import { useRef, useEffect } from "react";
import Konva from "konva";

type CurveProps = {
  start: number[];
  end: number[];
  symbol: string[];
  radius: number;
};
// we don't need the id here but rather in the canvas
function Curve({ start, end, symbol, radius }: CurveProps) {
  // we calculate the centroid of the triangle to make the curve look a little better
  const TextRef = useRef<Konva.Text | null>(null);
  const c: number[] = [start[0], end[1]];
  useEffect(() => {
    const text = TextRef.current;
    if (text) {
      text.offsetX(text.width() / 2);
      text.offsetY(text.height() / 2);
    }
  }, [symbol]); // importante si cambia el texto
  // i dont think that passing arrays with more than two numbers will break it so i'll leave it like that
  const center = (a: number[], b: number[], c: number[]) => {
    const centroid = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3];
    return centroid;
  };
  // extra point that smooths out the line
  let centroid = center(start, end, c);

  // pendiente de una reta
  // const m: number = (end[1] - centroid[1]) / (end[0] - centroid[0]);

  // atan works in radians but konva needs the angle in degrees. bummer
  // const ang: number = Math.atan(m) * (180 / Math.PI);
  // We get the unit vector and then multiply it by the radius to start the curve at the edge of the state
  const normalize = (p: number[]) => {
    const denom = Math.sqrt(p[0] ** 2 + p[1] ** 2);
    // avoid divide by 0
    if (denom === 0) {
      return [0, 0];
    }
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

  // Perdon profe diego por usar let se que lo defraude
  // Medina le manda saludos
  const sqrt2: number = Math.sqrt(2);

  let startEdge: number[];
  let endEdge: number[];
  // estaba checkeando si la distancia era 0 antes pero esto es mas facil
  if (start[0] !== end[0] && start[1] !== end[1]) {
    startEdge = [start[0] + radius * unitV1[0], start[1] + radius * unitV1[1]];

    endEdge = [end[0] - radius * unitV2[0], end[1] - radius * unitV2[1]];
  } else {
    startEdge = [
      start[0] + radius * (sqrt2 / 2),
      start[1] + radius * (sqrt2 / 2),
    ];

    endEdge = [end[0] - radius * (sqrt2 / 2), end[1] + radius * (sqrt2 / 2)];

    centroid = [(startEdge[0] + endEdge[0]) / 2, start[1] + 90];
  }
  // 3 is the radius of the polygon at the end of the curve
  // const endArrow: number[] = [
  //   end[0] - (radius + 3) * unitV2[0],
  //   end[1] - (radius + 3) * unitV2[1],
  // ];

  //need to find a better looking position for the transition symbols
  let textPos: number[];

  if (start[0] !== end[0] && start[1] !== end[1]) {
    textPos = [
      (startEdge[0] + endEdge[0]) / 2,
      (startEdge[1] + endEdge[1]) / 2,
    ];
  } else {
    // it does not matter if we chose start or end
    textPos = [(startEdge[0] + endEdge[0]) / 2, start[1] + 110];
  }
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
        ref={TextRef}
        fontFamily="JetBrains Mono"
        align="center"
        verticalAlign="middle"
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
