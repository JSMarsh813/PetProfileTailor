// import React from 'react';
// import ReactDOM from 'react-dom';
// these react imports added behind the scenes writing it like this isn't needed for nextjs
import HeroTop from "../components/LandingPage/HeroTop";
import MediaObjectLeft from "../components/ReusableMediumComponents/MediaObjectLeft";
import MediaObjectRight from "../components/ReusableMediumComponents/MediaObjectRight";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";
import Image from "next/image";

import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import WideCenteredHeading from "../components/ReusableSmallComponents/TitlesOrHeadings/WideCenteredHeading";

import dbConnect from "../utils/db";
import YoutubeEmbed from "../components/ShowingListOfContent/YoutubeEmbed";
import { useState } from "react";

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  await dbConnect.connect();

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

  const [openVideo, setOpenVideo] = useState(null);

  function handleVideoClick(videoKey) {
    setOpenVideo(openVideo === videoKey ? null : videoKey);
  }
  return (
    <div className=" bg-violet-900">
      <Layout
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />

      <HeroTop
        updateImpactfulState={() => handleVideoClick("impactful")}
        updateFunState={() => handleVideoClick("fun")}
        updateTailorState={() => handleVideoClick("tailor")}
      />
      {openVideo === "impactful" && (
        <YoutubeEmbed
          embedId="y5cx0MeHuE8"
          styling="aspect-video"
          title="Fishtopher the cat gets adopted after going viral"
          showVideoFunction={() => setOpenVideo(null)}
          key="y5cx0MeHuE8"
        />
      )}
      {openVideo === "fun" && (
        <YoutubeEmbed
          embedId="_7SMbp-W6sM"
          styling="aspect-video"
          title="Woman Writes Hilariously Honest Adoption Post For Her Wild Foster Dog | The Dodo Adopt Me!"
          showVideoFunction={() => setOpenVideo(null)}
          key="_7SMbp-W6sM"
        />
      )}
      {openVideo === "tailor" && (
        <YoutubeEmbed
          embedId="T_lAGw4lpiM"
          styling="aspect-video"
          title="Woman's Brutally Honest Pet Adoption Ad Goes Viral"
          showVideoFunction={() => setOpenVideo(null)}
          key="T_lAGw4lpiM"
        />
      )}
      <section className="bg-violet-900 h-24 flex place-items-center justify-center">
        <h5 className="text-white text-xl md:text-2xl pr-2">Adoptions Ahoy!</h5>

        <Image
          width={110}
          height={110}
          src="/smallpirate.webp"
          alt="image of a guinea pig wearing a tiny pirate hat"
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
      </section>
      <section className="landingNamesSection bg-violet-900">
        <WideCenteredHeading heading="Find the Purrfect Name" />

        <MediaObjectLeft
          image="/chamil.jpg"
          listOfText={[
            "Find eye-catching pet names you wouldn't find on regular name sites",
            "Easily sort by personality, species, physical traits, and more",
            "Find names for themes such as Christmas, just in time for your adoption event!",
          ]}
          buttonTextLeft="Search for Names"
          buttonTextLeftLink="/fetchnames"
          alttext="a picture of a chameleon with a cartoony bling necklace drawn on his neck. The text underneath says: chamillionare, young, lizard, 210 miles away"
          imgwidth="220"
          imgheight="330"
        />
      </section>
      <section className="landingDescriptionsSection bg-violet-900">
        <WideCenteredHeading heading="Find Tailor-fit Descriptions" />

        <MediaObjectRight
          image="/obviousplant.webp"
          listOfText={[
            "Engaging and creative descriptions",
            "Honest and engaging wording for problem behaviors",
            "Easily sort by personality, species, physical traits, and more",
          ]}
          buttonTextLeft="Search Descriptions"
          buttonTextLeftLink="/fetchdescriptions"
          alttext="Picture of an adoption sign. There is a black and white cat with the text Honey next to it. Underneath it reads: Likes: catnip. Dislikes: Birds. And in quotation marks is They are lousy sky wizards that need to obey the laws of gravity! - honey. Sante D'or adoption center obvious plant"
          imgwidth="128"
          imgheight="113"
        />
      </section>
      <section className="landingSignUpSection">
        <WideCenteredHeading heading="Create a free profile to access extra features" />

        <MediaObjectLeft
          image="/profile.png"
          listOfText={[
            "Save your favorite names, descriptions, posts and comments for easy access",
            "Add new names, descriptions and posts",
            "Add comments and like posts",
            "Follow other users",
          ]}
          buttonTextLeft="Sign Up"
          buttonTextLeftLink="/register"
          alttext="screenshot of the dashboard for the site. It says welcome back, treats earned, shows the profile image and shows a your favorite section. A list of names is seen underneath it, all which have red hearts"
          imgwidth="517"
          imgheight="508"
        />
      </section>
      <section className="LandingWantToHelpSection">
        <WideCenteredHeading heading="Psst...Want To Help Some Pets 😸🐹?" />

        <MediaObjectRight
          image="/freepikhalloween.avif"
          listOfText={[
            "Do you want to help pets get adopted but you can't volunteer or foster? Excellent, you're barking up the right tree!",
            "Sign up to add names or descriptions. Animal welfare professionals can use your contributions to create creative and tailored pet profiles to help pets get adopted! ",
            "Or check out our play yard (community) where other users are asking for your help with names and other ideas!",
          ]}
          buttonTextLeft="Check Out Our Play Yard"
          buttonTextLeftLink="/community"
          buttonTextRight="Sign Up"
          buttonTextRightLink="/register"
          imgwidth="70"
          imgheight="100"
          alttext="picture of a cute white pomeranian sitting and lifting a paw up. Its wearing a black mask and a black cape, its tongue is sticking out in a relaxed manner."
        />
      </section>
    </div>
  );
}

export default HomePage;
