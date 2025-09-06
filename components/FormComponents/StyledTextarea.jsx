export default function StyledTextarea({
  className,
  onChange,
  required,
  maxLength,
  value,
  ariaLabel,
  name,
}) {
  return (
    <textarea
      className={`bg-secondary border-subtleWhite text-subtleWhite block w-full rounded-2xl h-32 ${className}`}
      aria-label={ariaLabel}
      onChange={onChange}
      required={required}
      maxLength={maxLength}
      value={value}
      name={name}
    ></textarea>
  );
}
