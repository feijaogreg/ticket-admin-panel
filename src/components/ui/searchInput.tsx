import { useId } from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Shown next to the input and announced to screen readers, e.g. "12 of 500 tickets". */
  resultSummary?: string;
}

export function SearchInput({ label, value, onChange, placeholder, resultSummary }: SearchInputProps) {
  const id = useId();

  return (
    <div className="search">
      <label className="search__label" htmlFor={id}>
        {label}
      </label>
      <div className="search__row">
        <div className="search__field">
          <Search size={16} aria-hidden="true" className="search__icon" />
          <input
            id={id}
            type="search"
            className="search__input"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        {/* Always rendered: live regions only announce changes to elements already in the DOM. */}
        <span className="search__summary" aria-live="polite">
          {resultSummary}
        </span>
      </div>
    </div>
  );
}
