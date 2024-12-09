import { Select, Option } from '@material-tailwind/react';

// Amount Input Area
export default function AmountInputArea({
  min,
  max,
  defaultValue,
  onChange,
}: {
  min: number;
  max: number;
  defaultValue: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="w-full relative">
      <Select
        label="Quantity"
        value={defaultValue.toString()}
        onChange={(value) => onChange(Number(value))}
      >
        {Array.from({ length: max - min + 1 }, (_, i) => (
          <Option key={i + min} value={`${i + min}`}>
            {i + min}
          </Option>
        ))}
      </Select>
    </div>
  );
}
