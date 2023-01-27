import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faShareFromSquare, faFaceGrinWink, faUserTie, faCircleChevronDown, faClock } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import AddComment from "../AddingNewData/AddComment"
import GeneralButton from '../GeneralButton';
import CommentListing from './CommentListing';
import axios from 'axios';

function BatsignalPost({
    image,title,paragraphText,postersId,postDate,amountOfComments,amountOfShares,amountOfLikes,tagList,className,postId}) {
        //postersProfileImage,
  
    const [commentsShowing,SetCommentsShowing]=useState(false)
    const [postersName,setPostersName]=useState("posters name test")
    const [postersProfileImage,setPostersProfileImage]=useState("")
    const [  profileName, setProfileName]=useState("")
 
     const fetchUserData = async () =>{

        await axios.get(`api/user/${postersId}`)
        .then((res)=>{
                     console.log(res.data.data)
            setPostersName(res.data.data.name)
            setPostersProfileImage(res.data.data.profileimage)
            setProfileName(res.data.data.profilename)
          
            return postersProfileImage, postersName
            //i'm not sure if the return here is needed
        })
           }

            //  #########   FORMATTING DATE  #################
  const dateFormatter= new Intl.DateTimeFormat(undefined,
           {dateStyle: "medium",
           timeStyle: "short",
             })

    let formattedPostDate= dateFormatter.format(Date.parse(postDate))
            //undefined that way it'll reset to the correct timezone based on the users computer
            // To use the browser's default locale, omit this argument or pass undefined. http://udn.realityripple.com/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
            //@58:00 he goes over the time https://www.youtube.com/watch?v=lyNetvEfvT0&ab_channel=WebDevSimplified
 
  

    useEffect(()=>{
        
        fetchUserData()
    },[])
   
    //console,console.log(Date.parse(postDate).toLocaleDateString(en-DE', options));
    // let date= new Date(postDate)
    // date.toLocaleString('en-GB', {day:'numeric', month: 'long',  year:'numeric'})
    // setCurrentDate(date)



    // grab postersId from postersId prop
                //pass it to an api which finds a user with that id
                        // we get that data back from the api (user object)
                        //grab user.name
                        // setPosterName(user.name)
                // import db from '../utils/db'
                // import User from "../models/User"
                // await db.connect()
                // const result = await User.find({_id:UserId})

  return (
    <div className="mx-auto px-6 py-8 
             ">
                {/* above is the background of posts
                below is the start of the posts actually squares */}
        <div className={`bg-violet-900 text-white rounded-lg tracking-wide max-w-3xl text-center mx-auto shadow-lg shadow-slate-900/70 border-2 border-violet-400 ${className}`} >
          


            <div className="px-4 py-2 mt-2 flex-1  ">

            <h2 className="font-semibold text-2xl  tracking-normal text-center">
                    {title}
                </h2>

                {image.length!=0 &&
                <div className="md:flex-shrink-0 pt-4">
                           <img src={image} alt="" className="max-w-full mx-auto h-96 rounded-lg rounded-b-none"/>
            </div>}

                    <p className="text-sm py-2 px-2 mr-1">
                        {paragraphText}
                    </p>
                  
                <div className="author flex items-center -ml-3 my-3">
                    <div className="user-logo">
                        <img className="w-12 h-12  object-cover rounded-full mx-4  shadow" src={postersProfileImage} alt="avatar"/>
                    </div>
                    <h2 className="text-sm tracking-tighter">
                        <a className="font-bold block text-left" href="#">By {postersName}</a> 
                        <a className="" href="#">@{profileName}</a> 
                        <span >
                             <FontAwesomeIcon 
                                icon={faClock}
                                className="mx-2" >
                            </FontAwesomeIcon> 
                            {formattedPostDate}
                        </span>
                       
                    </h2>
                </div>

                <h4> Tags: {tagList}</h4>

                <div className="flex border-y-2 border-slate-200 py-2 bg-violet-900 text-white">

                    <span className="flex-1  inline ml-6">
                        <FontAwesomeIcon icon={faCommentDots} 
                        onClick={()=>SetCommentsShowing(!commentsShowing)}    
                        className="text-3xl mr-2"/>
                            <span
                            className="text-xl">{amountOfComments} </span> 
                    </span>

                    <span className="flex-1 inline">
                           <FontAwesomeIcon icon={faHeart} 
                           className="text-3xl mr-2 inline flex-1"/>
                            <span
                            className="text-xl">{amountOfLikes} </span>
                    </span>

                    <span className="flex-1 inline">
                           <FontAwesomeIcon icon={faShareFromSquare} 
                           className="text-3xl mr-2 inline flex-1"/>
                            <span
                            className="text-xl">{amountOfShares} </span>
                    </span>
            </div>
           
            <AddComment postId={postId} hasParent={null}/>
                  

            </div>

       {commentsShowing&&
            <section>
                    <CommentListing/>
            
                    <CommentListing/>
             </section>
             }
        </div>
    </div>
  )
}

export default BatsignalPost