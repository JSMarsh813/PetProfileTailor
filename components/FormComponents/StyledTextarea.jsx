export default function StyledTextarea({
  className,
  onChange,
  required,
  maxLength,
  value,
}) {
  return (
    <textarea
      className={`bg-darkPurple border-subtleWhite text-subtleWhite block w-full ${className}`}
      onChange={onChange}
      required={required}
      maxLength={maxLength}
      value={value}
    ></textarea>
  );
}
