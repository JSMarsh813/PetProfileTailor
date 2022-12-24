import Link from 'next/Link'
import React, { useEffect } from 'react';
import { SessionProvider, signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import Layout from '../components/layout';
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export default function LoginScreen() {
  const session = useSession();
      //grab data from useSession and rename data to session
{console.log(`session on login.js:${session}`)}
{console.log(session)}
  const router = useRouter();
  const { redirect } = router.query;
  //extract redirect from router.query

  //import this from line 2/react
  useEffect(() => {
    if (session?.user) {
      //if the session exists, then the user is already signed in. So if this is true, push back to the homepage if there is no redirect in the string
      //we need to use router (line 8) to redirect user
      router.push('/');
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ email, password }) => {
    try {
      //import signIn on line 3 from nextAuth, which will be handled in the nextauth.js handler
      const result = await signIn('credentials', {
        redirect: false,
         //gets rid of callback url @10:20 https://www.youtube.com/watch?v=EFucgPdjeNg&t=594s&ab_channel=FullStackNiraj
        email,
        password,
      });
      if (result.error) {
        //if error when signing in
            //layout.js is where toast container is called/shown
        toast.error(result.error);
        
      }
      else {
        
        toast.success("Successfully signed in! Sending to profile page")
        console.log(result)
        // Object { error: null, status: 200, ok: true, url: "http://localhost:3000/api/auth/signin?csrf=true" }
        console.log(`email: ${email} pass:${password}`)
        //email: kyunyu@gmail.com pass:testtest
        router.push("/")
      }
      
    } catch (err) {
      //error.js file in utils, this is for if there is an error in the api
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="Login">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Login</h1>
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
            autoFocus
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
        <div className="mb-4 ">
          <button className="primary-button">Login</button>
        </div>
        <div className="mb-4 ">
          Don&apos;t have an account? &nbsp;
          <Link href={`/register?redirect=${redirect || '/'}`}>Register</Link>
        </div>
      </form>
    </Layout>
  );
}
