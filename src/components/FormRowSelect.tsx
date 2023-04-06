import React from "react";

interface FormRowSelectProps {
  options: string[];
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  value: string;
  labelText?: string;
}
export default function FormRowSelect({
  options,
  handleChange,
  name,
  value,
  labelText,
}: FormRowSelectProps) {
  return (
    <div className="form-row">
      <label htmlFor="status" className="form-label">
        {labelText ?? name}
      </label>
      <select
        name={name}
        id={name}
        value={value}
        onChange={handleChange}
        className="form-select"
      >
        {options.map((itemValue, index) => {
          return (
            <option key={index} value={itemValue}>
              {itemValue}
            </option>
          );
        })}
      </select>
    </div>
  );
}
