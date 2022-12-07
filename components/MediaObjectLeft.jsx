import PawPrintIcon from './PawPrintIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaw } from '@fortawesome/free-solid-svg-icons'
import GeneralButton from './GeneralButton'

const MediaObject= () =>{

    return (
    <div className="flex justify-center w-screen my-6">

    <div className="self-center">
        
            <img className=" max-h-96 ml-auto mr-6 " src="https://pbs.twimg.com/media/FW0rgc-XwAYbgS9?format=jpg&name=medium" alt="" />
    </div>

  <div className="max-w-1/2 ml-2 mr-8 self-center
  ">


        <ul className="text-lg text-white pb-8">
           <li className="my-2" > 
             <p> <PawPrintIcon/>  Find eye-catching pet names you wouldn't find on regular name sites</p>
         </li>

        <li className="my-2" >
          <p> <PawPrintIcon/>  Easily sort by personality, species, and characteristics</p>
        </li>

        <li className="my-2" >
            <p> <PawPrintIcon/>  Find names matching themes such as Christmas, just in time for your adoption event! </p>
        </li>
    </ul>

    <div className="flex items-center">

         <GeneralButton text="search Names"/>

         <GeneralButton text="Add A Name"/>
   
    </div>
 

  </div>
</div>)
    }
export default MediaObject