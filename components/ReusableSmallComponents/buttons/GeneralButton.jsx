const GeneralButton = ({ text, className, onClick, type, active = false }) => {
  return (
    <button
      className={`text-darkPurple font-bold my-3 py-1 px-4 border-b-4 
        shadow-lg shadow-stone-900/70 rounded-2xl ${
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
