import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faFaceGrinWink, faUserTie } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

import React from 'react'

function Namelisting(name) {
  return (
    <tr key={name._id} >
    {/* start of likes checkbox section*/}
     <td className="text-purple-200 border-b-2 border-amber-300 px-4 py-2 text-left font-black">
         <label>
        
             <input
                   style={{display:"none"}}
                     type="checkbox"
                    checked={nameLiked}
                     onChange={handlelikes}
                    id={name._id}
                   //  data-amount-of-likes={name.likedby.length}
             
             />
              <FontAwesomeIcon icon={faHeart} className="text-4xl" color={likesColor} />

           
              {/* {console.log(name.likedby.filter(e=>e=="63"))} */}

            {name.likedby}
          {/* { console.log(name.likedby)}
          {console.log(typeof (userId))} */}
           {/* {userId} */}
            
        </label>
             
     </td> 
  {/* end of likes checkbox section*/}


<td className="text-purple-200 border-b-2 border-amber-300 px-4 py-2 text-left font-black">{name.name}</td>

<td className="border-b-2 border-amber-200 px-4 py-2 text-left font-medium">{name.description}</td>

<td className="border-b-2 border-amber-100 px-4 py-2 text-left font-medium">{name.tags}</td>

</tr>
)
 
}

export default Namelisting