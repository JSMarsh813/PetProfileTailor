const GeneralButton = ({
  text,
  className,
  onClick,
  type,
  active = false,
  disabled,
}) => {
  const baseClasses =
    "font-bold my-3 py-1 px-4 border-b-4 shadow-lg shadow-stone-900/70 rounded-2xl text-base";

  // Compute background & border
  let bgClass =
    "bg-yellow-200 border-yellow-600 text-darkPurple hover:bg-blue-400 hover:text-white hover:border-blue-500";
  if (active && !disabled)
    bgClass =
      "bg-white border-indigo-600 text-darkPurple hover:bg-blue-400 hover:text-white hover:border-blue-500";
  if (disabled)
    bgClass =
      "bg-slate-300 border-gray-400 text-gray-500 cursor-not-allowed hover:bg-slate-300 hover:text-gray-500 hover:border-gray-400";

  return (
    <button
      className={`${baseClasses} ${bgClass} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default GeneralButton;
