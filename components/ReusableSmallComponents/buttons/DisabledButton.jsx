const DisabledButton = ({ text, className }) => {
  return (
    <button
      className={`mx-auto         
             disabled:bg-errorBackgroundColor disabled:text-errorTextColor disabled:border-errorBorderColor"
             font-bold py-2 px-4 border-b-4
             cursor-default  ${className}`}
      type="submit"
      disabled
    >
      {text}
    </button>
  );
};

export default DisabledButton;
