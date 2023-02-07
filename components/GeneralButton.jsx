const GeneralButton= ({text, className,onClick,type}) => {
    
    return (

        <button className={`mx-auto bg-yellow-300 text-violet-800  font-bold py-3 px-4 border-b-4 border-yellow-100    
        shadow-lg shadow-stone-900/70
        hover:bg-blue-400                            hover:text-white                            hover:border-blue-500 rounded ${className}`}
    
    onClick={onClick}
    type={type}  
    
    >{text}</button>

    )
}

export default GeneralButton