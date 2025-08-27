const GeneralButton = ({ text, className, onClick, type, active = false }) => {
  return (
    <button
      className={`text-violet-800  font-bold my-3 py-3 px-4 border-b-4 
        shadow-lg shadow-stone-900/70  ${
          active
            ? "bg-white border-indigo-600"
            : "bg-yellow-200 border-yellow-600"
        }
        hover:bg-blue-400                            hover:text-white                            hover:border-blue-500 rounded text-base ${className}`}
      onClick={onClick}
      type={type}
    >
      {text}
    </button>
  );
};

export default GeneralButton;
