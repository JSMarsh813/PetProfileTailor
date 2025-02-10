import React from 'react'

export default function ParagraphRenderBasedOnStringProperty({content, text}) {
  return (
    <p className="whitespace-pre-line mt-2">
    <span className="text-amber-100 font-bold">
          Description: </span>
       {content.description == "" ? `no ${text}` : content.description}
   
        </p>
  )
}
