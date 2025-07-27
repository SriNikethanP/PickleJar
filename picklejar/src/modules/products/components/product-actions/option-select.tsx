import { Button } from "@medusajs/ui";

type OptionSelectProps = {
  title: string;
  current: string | undefined;
  updateOption: (title: string, value: string) => void;
  disabled?: boolean;
};

const OptionSelect = ({
  title,
  current,
  updateOption,
  disabled,
}: OptionSelectProps) => {
  return (
    <div className="flex flex-col gap-y-2">
      <span className="text-base-semi">{title}</span>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={current === "default" ? "primary" : "secondary"}
          onClick={() => updateOption(title, "default")}
          disabled={disabled}
          className="w-full"
        >
          Default
        </Button>
      </div>
    </div>
  );
};

export default OptionSelect;
