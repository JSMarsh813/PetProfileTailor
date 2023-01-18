import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faShareFromSquare, faFaceGrinWink, faUserTie, faCircleChevronDown } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import AddComment from "../AddingNewData/AddComment"
import GeneralButton from '../GeneralButton';
import CommentListing from './CommentListing';

function batsignalPost({
    image,title,paragraphText,postersProfileImage,postersName,postDate,amountOfComments,amountOfShares,amountOfLikes,tagList,className}) {
  
    const [commentsShowing,SetCommentsShowing]=useState(false)

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

                <div className="md:flex-shrink-0 pt-4">
                <img src={image} alt="mountains" className="max-w-full mx-auto h-96 rounded-lg rounded-b-none"/>
            </div>

                    <p className="text-sm  px-2 mr-1">
                        {paragraphText}
                    </p>
                  
                <div className="author flex items-center -ml-3 my-3">
                    <div className="user-logo">
                        <img className="w-12 h-12 object-cover rounded-full mx-4  shadow" src={postersProfileImage} alt="avatar"/>
                    </div>
                    <h2 className="text-sm tracking-tighter">
                        <a href="#">By {postersName}</a> 
                        <span className="">{postDate}</span>
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
           
            <AddComment/>
                  

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

export default batsignalPost