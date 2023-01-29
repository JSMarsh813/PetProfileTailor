import PawPrintIcon from '../PawPrintIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaw } from '@fortawesome/free-solid-svg-icons'
import GeneralButton from '../GeneralButton'
import ListWithPawPrintIcon from '../ReusableSmallComponents/ListWithPawPrintIcon'

const MediaObjectRight= ({image, listOfText, buttonTextLeft,buttonTextRight,buttonTextLeftLink,buttonTextRightLink}) =>{

    return (
      <div className="flex justify-center w-screen my-6 flex-col md:flex-row">

     <div className="max-w-md ml-4 mr-8 self-center 
    ">

        <ul className="text-lg text-white pb-8 ">
           {listOfText.map(sentence=>
             <ListWithPawPrintIcon text={sentence}/>
           )}       
        </ul>

    <div className="flex items-center mb-4">
    {buttonTextLeft&&
        <a href={buttonTextLeftLink}>
         <GeneralButton text={buttonTextLeft}/>
         </a>
        }

         {buttonTextRight&&
          <a href={buttonTextRightLink}>
         <GeneralButton text={buttonTextRight}/>
         </a>
          }

    </div> 

  </div>

    <div className="self-center ">
        
        <img 
        className=" max-h-96 ml-auto mr-8 
        shadow-xl shadow-slate-900/70
        border-b-8  border-r-8 border-amber-300" 
        src={image}
        alt="" />
    </div>

</div>)
    }
export default MediaObjectRight