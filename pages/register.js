import Link from 'next/Link'
import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import Layout from '../components/NavBar/NavLayoutwithSettingsMenu'
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import axios from 'axios';
import GeneralButton from '../components/GeneralButton'

import { authOptions } from "./api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"

export const getServerSideProps = async (context) => {

  const session = await unstable_getServerSession(context.req, context.res, authOptions)
 
   
  return {
    props: {    
      sessionFromServer: session,
         },
    }
}

export default function Register({sessionFromServer}) {

  let userName=""
  let profileImage=""

  if (sessionFromServer){
      userName=sessionFromServer.user.name
   profileImage=sessionFromServer.user.profileimage
 }
 

  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push('/');
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();
  
  const submitHandler = async ({ name, email, password, profilename }) => {
    try {
      await axios.post('/api/auth/signup', {
        name,
        email,
        password,
        profilename,
      });

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
      else {
        
        toast.success("Successfully signed up! Sending to profile page")
        console.log(result)
        // Object { error: null, status: 200, ok: true, url: "http://localhost:3000/api/auth/signin?csrf=true" }
        console.log(`email: ${email} pass:${password}`)
        //email: kyunyu@gmail.com pass:testtest
        //and appears in mongodb users collection
        router.push("/")
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <div className="bg-violet-900 h-screen">
    <Layout 
        title="Create Account"  
        profileImage={profileImage} 
        userName={userName} />

      <img 
            className="mx-auto h-60"
            src="https://media.tenor.com/IJBRrnPWOqoAAAAd/welcome-high-five.gif"/>

      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="my-4 text-2xl text-center">Create Account</h1>


        <div className="mb-4">
          <label htmlFor="name"> UserName (this can be changed later)</label>
          <input
            type="text"
            className="w-full"
            id="name"
            autoFocus
            {...register('name', {
              required: 'Please enter name',
            })}
          />
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="name"> Profile Name (this CAN'T be changed later)</label>
          <input
            type="text"
            className="w-full"
            id="name"
            autoFocus
            {...register('profilename', {
              required: 'Please enter a profilename',
            })}
          />
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>


        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'Please enter email',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'Please enter valid email',
              },
            })}
            className="w-full"
            id="email"
          ></input>
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>


        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            {...register('password', {
              required: 'Please enter password',
              minLength: { value: 6, message: 'password is more than 5 chars' },
            })}
            className="w-full"
            id="password"
            autoFocus
          ></input>
          {errors.password && (
            <div className="text-red-500 ">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="w-full"
            type="password"
            id="confirmPassword"
            {...register('confirmPassword', {
              required: 'Please enter confirm password',
              validate: (value) => value === getValues('password'),
              minLength: {
                value: 6,
                message: 'confirm password is more than 5 chars',
              },
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-500 ">
              {errors.confirmPassword.message}
            </div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === 'validate' && (
              <div className="text-red-500 ">Password do not match</div>
            )}
        </div>

            <GeneralButton text="register"/>
       
      </form>
    
    </div>
  );
}
