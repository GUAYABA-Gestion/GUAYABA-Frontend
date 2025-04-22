import React from "react";

type Operator = ">" | "<" | "=";

interface NumericFilterProps {
  label: string;
  value: { operator: string; number: number | string };
  onChange: (val: { operator: string; number: number | string }) => void;
}

const NumericFilter: React.FC<NumericFilterProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col text-black">
      {label && <label className="font-semibold mb-1 text-black">{label}</label>}
      <div className="flex items-center space-x-2">
        <select
          value={value.operator}
          onChange={(e) => onChange({ ...value, operator: e.target.value as Operator })}
          className="border rounded px-2 py-1 text-black"
        >
          <option value=">">Mayor que</option>
          <option value="<">Menor que</option>
          <option value="=">Igual a</option>
        </select>
        <input
          type="number"
          value={value.number === "" ? "" : value.number}
          onChange={(e) =>
            onChange({ ...value, number: e.target.value === "" ? "" : Number(e.target.value) })
          }
          className="border rounded px-2 py-1 w-24 text-black"
          placeholder="Valor"
        />
      </div>
    </div>
  );
};

export default NumericFilter;
