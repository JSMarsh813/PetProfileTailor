export default function ContainerForLikeShareFlag({ children }) {
  return (
    <div className="text-center bg-subtleBackground rounded-2xl w-20 h-9 flex justify-center items-center border-b-4 border-subtleWhite hover:border-blue-500 hover:bg-blue-400 ">
      {children}
    </div>
  );
}
