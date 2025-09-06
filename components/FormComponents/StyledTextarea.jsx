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
      className={`bg-darkPurple border-subtleWhite text-subtleWhite block w-full rounded-2xl ${className}`}
      aria-label={ariaLabel}
      onChange={onChange}
      required={required}
      maxLength={maxLength}
      value={value}
      name={name}
    ></textarea>
  );
}
