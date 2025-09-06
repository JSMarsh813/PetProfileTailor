import Link from "next/link";

export default function LinkButton({
  href,
  className,
  text,
  defaultStyle,
  subtle,
  warning,
  active,
  disabled,
}) {
  const baseClasses =
    "font-bold my-3 py-1 px-4 border-b-4 shadow-lg shadow-stone-900/70 rounded-2xl text-base";

  let bgClass = "";

  if (defaultStyle)
    bgClass = `${baseClasses} bg-yellow-200 border-yellow-600 text-secondary 
  hover:bg-blue-400 hover:text-white hover:border-blue-500 `;

  if (subtle)
    bgClass = `${baseClasses}  bg-subtleBackground text-white hover:text-white hover:border-blue-500 hover:bg-blue-400`;
  if (warning)
    bgClass = `${baseClasses}   bg-red-900 text-subtleWhite hover:text-white hover:border-blue-500 hover:bg-blue-400`;
  if (active && !disabled)
    bgClass = `${baseClasses} bg-subtleWhite border-indigo-600 text-secondary hover:bg-blue-400 hover:text-white hover:border-blue-500`;
  if (disabled)
    bgClass = `${baseClasses}  bg-slate-300 border-gray-400 text-gray-500 cursor-not-allowed hover:bg-slate-300 hover:text-gray-500 hover:border-gray-400`;

  return (
    <Link
      href={href}
      className={` ${bgClass}  ${className} `}
    >
      {text}
    </Link>
  );
}
