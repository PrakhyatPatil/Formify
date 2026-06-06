interface ExampleChipProps {
  text: string;
  onClick: () => void;
}

export default function ExampleChip({ text, onClick }: ExampleChipProps & { key?: any }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="example-chip"
    >
      {text}
    </button>
  );
}
