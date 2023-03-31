const DisabledButton = ({ text, className }) => {
  return (
    <button
      className={`mx-auto         
             bg-gray-900 text-slate-300
             font-bold py-2 px-4 border-b-4 border-slate-100
             cursor-default  ${className}`}
      type="submit"
      disabled
    >
      {text}
    </button>
  );
};

export default DisabledButton;
