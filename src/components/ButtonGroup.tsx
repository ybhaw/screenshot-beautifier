interface ButtonGroupProps<T extends string> {
  options: readonly T[]
  value: T
  onChange: (value: T) => void
  labels?: Record<T, string>
}

export function ButtonGroup<T extends string>({
  options,
  value,
  onChange,
  labels,
}: ButtonGroupProps<T>) {
  return (
    <div className="button-group">
      {options.map((option) => (
        <button
          key={option}
          className={value === option ? 'active' : ''}
          onClick={() => onChange(option)}
        >
          {labels?.[option] ?? option}
        </button>
      ))}
    </div>
  )
}
