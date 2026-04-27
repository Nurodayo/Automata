import { Circle, Text, Group } from "react-konva";
import useTheme from "../hooks/useTheme";
//props
type StateProps = {
  id: string;
  name: string;
  x: number;
  y: number;
  isSelected: boolean;
  isFinal: boolean;
  onClick: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onDragoMove: (id: string, x: number, y: number) => void;
};

const radius = 40;

// Basic state for AFD with visual indicators for selection and Accepting state
//
// TODO: Make a stylesheet to make switching from dark mode to light mode easier

function State({
  id,
  name,
  x,
  y,
  isSelected,
  isFinal,
  onClick,
  onDragStart,
  onDragEnd,
}: StateProps) {
  const theme = useTheme((e) => e.bool);

  return (
    <Group
      x={x}
      y={y}
      draggable
      onClick={() => onClick(id)}
      onDragStart={() => onDragStart(id)}
      onDragEnd={(e) => {
        const pos = e.target.position();
        if (!pos) return;

        onDragEnd(id, pos.x, pos.y);
      }}
      onDragMove={(e) => {
        const { x, y } = e.target.position();
        onDragEnd(id, x, y);
      }}
    >
      <Circle
        radius={radius}
        stroke={isSelected ? "deeppink" : theme ? "black" : "white"}
        strokeWidth={4}
        shadowColor="deeppink"
        shadowBlur={10}
        shadowOffsetX={0}
        shadowForStrokeEnabled={true}
        shadowOpacity={isSelected ? 1 : 0}
        fill={theme ? "white" : "black"}
      />
      {isFinal && (
        <Circle
          radius={radius - 8}
          strokeWidth={2}
          stroke={isSelected ? "deeppink" : theme ? "black" : "white"}
          fill={theme ? "white" : "black"}
          shadowColor="deeppink"
        />
      )}
      <Text
        fontStyle="bold"
        fontFamily="JetBrains Mono"
        fontSize={35}
        width={79}
        height={79}
        offsetY={20}
        offsetX={40}
        align="center"
        text={name}
        fill={isSelected ? "deeppink" : theme ? "black" : "white"}
      />
    </Group>
  );
}

export default State;
