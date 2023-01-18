import React from 'react'
import GeneralButton from '../GeneralButton'
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faImage,faShareFromSquare, faFaceGrinWink, faUserTie, faCircleChevronDown } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

function AddPost() {

    //image
    //title
    //paragraphText
  return (
    <div>


  <div 
        className="mx-auto flex flex-col font-semibold text-darkPurple bg-violet-900
                 border-2 border-violet-400 border-dotted 
                 p-4 shadow-lg max-w-3xl">
    <input 
                className="border bg-violet-50  border-violet-200 p-2 mb-4 outline-none placeholder-darkPurple"                  
                placeholder="Type a title here" 
                type="text"/>

    <textarea 
            className="description bg-violet-50 sec p-3 h-30 border border-violet-500 outline-none placeholder-darkPurple"           
            placeholder="Describe everything about this post here">
    </textarea>       

    <div>
    <FontAwesomeIcon icon={faImage} 
                        className="text-3xl text-yellow-300 mr-2 align-middle inline-block"/>
     <input
        // onChange={}
        accept=".jpg, .png, .jpeg, .gif"
        className="fileInput mt-4 text-white align-bottom"
        type="file">
      </input>
      </div>

      <label 
                    className="font-bold block mt-4 text-white"
                    htmlFor="nameTags">Tags</label>

        <Select className="text-darkPurple mb-4"
                  id="nameTags"
                //   options={tagList.map((opt,index) => ({
                //      label: opt.individualTag, value: opt.individualTag,
                //    }))}
                 
                  isMulti
                  isSearchable
                  placeholder="If you type in the tags field, it will filter the tags"
                //   onChange={() => setTags(opt.map(=>tag.label))              

               
                />
      {/* <ToastContainer 
          position="top-center"
           limit={1} /> */}
  
    <div className="buttons flex">
      <div className="btn border border-gray-300 p-1 px-4 font-semibold cursor-pointer text-white ml-auto">Cancel</div>
      <div className="btn border border-indigo-500 p-1 px-4 font-semibold cursor-pointer text-gray-200 ml-2 bg-indigo-500">Post</div>
    </div>
  </div>

  </div>
  )
}

export default AddPost