import GeneralButton from "./GeneralButton";

export default function ClosingXButton({ onClick, className }) {
  return (
    <GeneralButton
      type="button"
      text="X"
      className={className}
      plain
      onClick={onClick}
    />
  );
}
