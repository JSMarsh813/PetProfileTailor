import React, {useEffect, useState} from 'react'
import { useSession, getSession } from "next-auth/react"
import Layout from '../components/Layout'


export default function plain({category,nameList, pageProps}) {
    let [userId,setUserId]=useState()

    useEffect(() => {
        const data = localStorage.getItem("session") 
        // console.log(data);
        setUserId(data)
    }, [])
         

  return (
    <Layout> 
  
    <p> {userId}</p>
 
    
    </Layout>
  )

  }
