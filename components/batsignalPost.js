import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faShareFromSquare, faFaceGrinWink, faUserTie, faCircleChevronDown } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Comment from "../components/Comment"

function batsignalPost({
    image,title,paragraphText,postersProfileImage,postersName,postDate,amountOfComments,amountOfShares,amountOfLikes,tagList}) {
  

  return (
    <div className="mx-auto px-4 py-8 max-w-xl ">
        <div className="bg-white shadow-2xl rounded-lg mb-6 tracking-wide" >
            <div className="md:flex-shrink-0 pt-4">
                <img src={image} alt="mountains" className="max-w-full mx-auto h-64 rounded-lg rounded-b-none"/>
            </div>
            <div className="px-4 py-2 mt-2">
                <h2 className="font-bold text-2xl text-gray-800 tracking-normal">
                    {title}
                </h2>
                    <p className="text-sm text-gray-700 px-2 mr-1">
                        {paragraphText}
                    </p>
                    <div className="flex items-center justify-between mt-2 mx-6">
                        <a href="#" className="text-blue-500 text-xs -ml-3 ">Show More</a>
                       
                    </div>
                <div className="author flex items-center -ml-3 my-3">
                    <div className="user-logo">
                        <img className="w-12 h-12 object-cover rounded-full mx-4  shadow" src={postersProfileImage} alt="avatar"/>
                    </div>
                    <h2 className="text-sm tracking-tighter text-gray-900">
                        <a href="#">By {postersName}</a> <span className="text-gray-600">{postDate}</span>
                        </h2>
                    </div>
                <h4> Tags: {tagList}</h4>

                <div className="flex border-y-2 border-slate-200 py-2">
                    <a href="#" className="flex-1 text-gray-700 inline ml-6">
                        <FontAwesomeIcon icon={faCommentDots} 
                        className="text-3xl text-slate-400 mr-2"/>
                            <span
                            className="text-xl">{amountOfComments} </span> 
                    </a>

                    <a href="#" className="flex-1 text-gray-700 inline">
                           <FontAwesomeIcon icon={faHeart} 
                           className="text-3xl text-slate-400 mr-2 inline flex-1"/>
                            <span
                            className="text-xl">{amountOfLikes} </span>
                    </a>

                    <a href="#" className="flex-1 text-gray-700 inline">
                           <FontAwesomeIcon icon={faShareFromSquare} 
                           className="text-3xl text-slate-400 mr-2 inline flex-1"/>
                            <span
                            className="text-xl">{amountOfShares} </span>
                    </a>
            </div>
           
            <Comment/>

            <div className="text-black"> Show Comments </div>

            </div>

            
            
        </div>
    </div>
  )
}

export default batsignalPost