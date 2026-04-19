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
};

const radius = 40;

// Basic state for AFD with visual indicators for selection and Accepting state
//
// TODO: Make a stylesheet to make switching from dark mode to light mode easier

function State({ id, name, x, y, isSelected, isFinal, onClick }: StateProps) {
  return (
    <Group
      x={x}
      y={y}
      draggable
      onClick={() => onClick(id)}
      onDragStart={() => onClick(id)}
    >
      {isFinal && (
        <Circle
          radius={radius + 10}
          strokeWidth={4}
          stroke={isSelected ? "deeppink" : "black"}
          fill="white"
          shadowColor="deeppink"
          shadowBlur={10}
          shadowOffsetX={0}
          shadowForStrokeEnabled={true}
          shadowOpacity={isSelected ? 1 : 0}
        />
      )}
      <Circle
        radius={radius}
        stroke={isSelected ? "deeppink" : "black"}
        strokeWidth={4}
        shadowColor="deeppink"
        shadowBlur={10}
        shadowOffsetX={0}
        shadowForStrokeEnabled={true}
        shadowOpacity={isSelected && !isFinal ? 1 : 0}
        fill={"white"}
      />
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
