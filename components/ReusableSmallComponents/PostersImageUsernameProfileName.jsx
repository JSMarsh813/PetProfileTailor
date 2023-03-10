import React from 'react'
import ShowTime from './ShowTime'

export default function PostersImageUsernameProfileName({
    postersProfileImage,
    postersName,
    profileName,
    postDate,
    showtime
}) {

        
    return (
    <div className="author flex items-center -ml-3 my-3">

                     <div>
                        <img className="w-12 h-12  object-cover rounded-full mx-4 shadow" 
                        src={postersProfileImage} 
                        alt="posters avatar image"/>
                    </div>


                    <h2 className="text-sm tracking-tighter">

                        <a 
                          className="font-bold block text-left" href="#">
                              By {postersName}
                        </a> 

                        <a 
                          className="" 
                          href="#">
                            @{profileName}
                        </a> 
               {postDate&&showtime==true&&
                     <ShowTime
                         postDate={postDate}/>
                        }
                       
                    </h2>

                </div>
  )
}
