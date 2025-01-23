const GeneralButton = ({ text, className, onClick, type }) => {
  return (
    <button
      className={`bg-yellow-200 text-violet-800  font-bold my-3 py-3 px-4 border-b-4 border-yellow-600
        shadow-lg shadow-stone-900/70
        hover:bg-blue-400                            hover:text-white                            hover:border-blue-500 rounded text-base ${className}`}
      onClick={onClick}
      type={type}
    >
      {text}
    </button>
  );
};

export default GeneralButton;
