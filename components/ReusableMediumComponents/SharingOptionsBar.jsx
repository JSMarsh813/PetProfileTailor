import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentDots, faShareFromSquare, faFaceGrinWink, faUserTie, faCircleChevronDown, faClock, faDeleteLeft, faTrash, faTrashCan, faPenToSquare, faLink } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

import {
    FacebookShareButton,
    FacebookIcon,
    RedditShareButton,
    RedditIcon,
    TumblrShareButton,
    TumblrIcon,
    TwitterShareButton,
    TwitterIcon,
    WhatsappShareButton,
    WhatsappIcon,
    FacebookMessengerShareButton,
    FacebookMessengerIcon,
    EmailShareButton,
    EmailIcon,
  } from 'next-share';

  import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function SharingOptionsBar({
    linkToShare
}) {
  return (
    <section
      className="flex justify-evenly "> 

    <button
       className="bg-amber-300 px-4 py-2
                  rounded-full
                  text-violet-800
                  font-semibold
                  shadow-md
                  shadow-darkPurple"

        onClick={() => { 
            navigator.clipboard.writeText(linkToShare)
            toast.success("link saved to clipboard")
           }}>
          <FontAwesomeIcon 
              icon={faLink}
              className="mr-2"/>
            Copy link
      </button>
      
      <EmailShareButton
        url={linkToShare}
        subject={'Link from Pet Profile Tailor'}
        >
  <EmailIcon       
      size={40} round />
</EmailShareButton>

      <FacebookShareButton
            url={linkToShare}           
            hashtag={'#PetProfileTailor'}
            >
        <FacebookIcon size={40} round />
     </FacebookShareButton>

<TwitterShareButton
  url={linkToShare}
>
  <TwitterIcon size={40} round />
</TwitterShareButton>

     <RedditShareButton
       url={linkToShare}
>
  <RedditIcon size={40} round />
</RedditShareButton>

<TumblrShareButton
  url={linkToShare}
>
  <TumblrIcon size={40} round />
</TumblrShareButton>

<WhatsappShareButton
  url={linkToShare}
  separator=":: "
>
  <WhatsappIcon size={40} round />
</WhatsappShareButton>

</section>
  )
}

export default SharingOptionsBar