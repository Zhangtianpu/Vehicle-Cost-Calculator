interface NumberFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  min?: number;
  step?: number;
  hint?: string;
}

export default function NumberField({
  id,
  label,
  value,
  onChange,
  suffix,
  min = 0,
  step = 1,
  hint,
}: NumberFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={value}
          onChange={(event) => onChange(Math.max(min, Number(event.target.value) || 0))}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 pr-16 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
        {suffix && <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400">{suffix}</span>}
      </div>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
