import { Circle, Text, Group } from "react-konva";

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
        stroke={isSelected ? "deeppink" : "black"}
        strokeWidth={4}
        shadowColor="deeppink"
        shadowBlur={10}
        shadowOffsetX={0}
        shadowForStrokeEnabled={true}
        shadowOpacity={isSelected ? 1 : 0}
        fill={"white"}
      />
      {isFinal && (
        <Circle
          radius={radius - 8}
          strokeWidth={2}
          stroke={isSelected ? "deeppink" : "black"}
          fill="white"
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
        fill={isSelected ? "deeppink" : "black"}
      />
    </Group>
  );
}

export default State;
