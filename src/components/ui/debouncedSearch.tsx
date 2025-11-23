import { memo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "./input";

interface search extends Omit<React.ComponentProps<"input">, "onChange"> {
  onChange: (v: string) => void;
  delay?: number;
}

export const DebouncedSearch = memo(
  ({
    onChange,
    delay = 200,
    type = "text",
    placeholder = "",
    ...props
  }: search) => {
    const [searchInput, setSearchInput] = useState("");

    const debounced = useDebouncedCallback((value) => {
      onChange(value);
    }, delay);

    const handleSearchChange = (val: string) => {
      setSearchInput(val);

      debounced(val);
    };

    return (
      <Input
        type={type}
        value={searchInput}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder={placeholder}
        {...props}
      />
    );
  }
);
