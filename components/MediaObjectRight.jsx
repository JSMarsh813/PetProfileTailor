import PawPrintIcon from './PawPrintIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaw } from '@fortawesome/free-solid-svg-icons'
import GeneralButton from './GeneralButton'

const MediaObjectRight= () =>{

    return (
    <div className="flex justify-center w-screen my-6">

     <div className="max-w-1/2 ml-2 mr-8 self-center
    ">

        <ul className="text-lg text-white pb-8">
           <li className="my-2" > 
             <p> <PawPrintIcon/>  Engaging and creative descriptions</p>
         </li>

        <li className="my-2" >
          <p> <PawPrintIcon/>  Honest and engaging wording for problem behaviors</p>
        </li>

        <li className="my-2" >
            <p> <PawPrintIcon/> Easily sort by personality, species, and characteristics</p>
        </li>
    </ul>

    <div className="flex items-center">

         <GeneralButton text="search Descriptions"/>

         <GeneralButton text="Add A Description"/>
   
    </div> 

  </div>

    <div className="self-center">
        
        <img className=" max-h-96 ml-auto mr-6 " src="https://media-be.chewy.com/wp-content/uploads/2018/05/honey.jpg" alt="" />
    </div>

</div>)
    }
export default MediaObjectRight