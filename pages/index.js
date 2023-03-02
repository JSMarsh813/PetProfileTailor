// import React from 'react';
// import ReactDOM from 'react-dom';
// these react imports added behind the scenes writing it like this isn't needed for nextjs
import HeroTop from "../components/HeroTop";
import pirate from "../pirate.webp";
import MediaObjectLeft from "../components/ReusableMediumComponents/MediaObjectLeft";
import MediaObjectRight from "../components/ReusableMediumComponents/MediaObjectRight";
import PawPrintIcon from "../components/ReusableSmallComponents/PawPrintIcon";
import Profile from "../public/profile.png";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";

import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import WideCenteredHeading from "../components/ReusableSmallComponents/WideCenteredHeading";

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  return {
    props: {
      sessionFromServer: session,
    },
  };
};

function HomePage({ sessionFromServer }) {
  //for Nav menu profile name and image
  //let section exists in case the user is not signed in
  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }
  //end of section for nav menu

  return (
    <div className="w-fit bg-violet-900">
      <Layout profileImage={profileImage} userName={userName} />

      <HeroTop />

      <section className="w-full bg-violet-900 ~ h-24 flex place-items-center justify-center">
        <h5 className="text-white text-2xl">Adoptions Ahoy!</h5>

        <img
          src={
            "https://static.wikia.nocookie.net/southpark/images/e/e7/Guinea-pigs-stripe.png"
          }
          style={{
            height: "160px",
            paddingBottom: "27px",
            paddingLeft: "50px",
          }}
        />
      </section>

      <section className="landingNamesSection bg-violet-900">
        <WideCenteredHeading heading="Find the Purrfect Name" />

        <MediaObjectLeft
          image="https://pbs.twimg.com/media/FW0rgc-XwAYbgS9?format=jpg&name=medium"
          listOfText={[
            "Find eye-catching pet names you wouldn't find on regular name sites",
            "Easily sort by personality, species, and characteristics",
            "Find names matching themes such as Christmas, just in time for your adoption event!",
          ]}
          buttonTextLeft="Search for Names"
          buttonTextLeftLink="/fetchnames"
        />
      </section>

      <section className="landingDescriptionsSection bg-violet-900">
        <WideCenteredHeading heading="Find Tailor-fit Descriptions" />

        <MediaObjectRight
          image="https://media-be.chewy.com/wp-content/uploads/2018/05/honey.jpg"
          listOfText={[
            "Engaging and creative descriptions",
            " Honest and engaging wording for problem behaviors",
            "Easily sort by personality, species, and characteristics",
          ]}
          buttonTextLeft="Search Descriptions"
          buttonTextLeftLink="/fetchdescriptions"
        />
      </section>

      <section className="landingSignUpSection">
        <WideCenteredHeading heading="Create a free profile to access extra features" />

        <MediaObjectLeft
          image="/profile.png"
          listOfText={[
            "Save your favorite names, behaviors and inspiration posts for easy access",
            "Add new names, behaviors, and inspiration posts",
            "Can add comments and like posts",
            "Can follow other users",
          ]}
          buttonTextLeft="Sign Up"
          buttonTextLeftLink="/register"
        />
      </section>

      <section className="LandingWantToHelpSection">
        <WideCenteredHeading heading="Psst...Want To Help Some Pets 😸🐹?" />

        <MediaObjectRight
          image="https://media.istockphoto.com/id/1267466399/photo/happy-puppy-dog-smiling-on-isolated-yellow-background.jpg?b=1&s=170667a&w=0&k=20&c=BoRUS0nBttBCTjLYpECarqTPfLNv2GmMLkSCsFrllFs="
          listOfText={[
            "Do you want to help pets get adopted but you can't volunteer or foster?",
            "Excellent, you're barking up the right tree!",
            "Sign up to add names or behavior descriptions. Animal welfare professionals can use your contributions to create creative and tailored pet profiles to help pets get adopted! ",
            "Or check out our batSignal and playyard area where other users are asking for your help with names and other ideas!",
          ]}
          buttonTextLeft="Check out Batsignal & Play Yard"
          buttonTextLeftLink="/batsignal"
        />
      </section>
    </div>
  );
}

export default HomePage;
// must export homepage so nextJs knows where to find it
