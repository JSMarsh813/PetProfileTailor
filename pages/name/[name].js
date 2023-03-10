import React, { useEffect, useState } from "react";
import Layout from "../../components/NavBar/NavLayoutwithSettingsMenu";
import Namelisting from "../../components/ShowingListOfContent/Namelisting";
import { authOptions } from "../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import NameListingAsSections from "../../components/ShowingListOfContent/NameListingAsSections";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCommentDots,
  faFaceGrinWink,
  faUserTie,
  faCircleChevronDown,
  faLocationDot,
  faRankingStar,
  faUserPlus,
  faEnvelopeOpenText,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import NavLayoutwithSettingsMenu from "../../components/NavBar/NavLayoutwithSettingsMenu";

export const getServerSideProps = async (context) => {
  //allows us to grab the dynamic value from the url
  const name = context.params.name;

  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const UserId = session ? session.user._id : "";

  let nameResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/api/names/findonenamebyname/` +
      name
  );
  let nameData = await nameResponse.json();

  if (!nameData.length) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        nameData: nameData,
        sessionFromServer: session,
      },
    };
  }
};

export default function Postid({ sessionFromServer, nameData }) {
  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }

  return (
    <div>
      {console.log(nameData)}
      <NavLayoutwithSettingsMenu
        profileImage={profileImage}
        userName={userName}
      />

      <div className="h-32 mb-4 bg-[url('https://img.freepik.com/free-photo/silly-brown-newfoundland-dog-with-black-top-hat_493961-1702.jpg?w=1380&t=st=1675080477~exp=1675081077~hmac=ebcf283bee382e2b28fbe047a36223e929aa9da840f7c07b8a1c6ca695988922')] bg-repeat-x bg-contain">
        <h3
          className="text-center pt-2 
    w-96 mx-auto  h-32
    text-5xl text-yellow-300   bg-darkPurple
    font-semibold
    border-y-4 border-amber-300"
          style={{
            marginBottom: "-90px",
            background: "hsla(260, 90%, 60%, 0.6)",
            backdropFilter: "blur(20px)",
          }}
        >
          {" "}
          {nameData[0].name}{" "}
        </h3>
      </div>

      <div className="mx-2">
        <section
          className=" grid md:grid-cols-5
                          grid-cols-3 gap-4 
                          bg-purple-100
                          text-darkPurple p-2"
        >
          <span> Like </span>
          <span> Name </span>
          <span> Description</span>
          <span> Tags </span>
          <span> Created By </span>
        </section>

        <NameListingAsSections
          name={nameData[0]}
          key={nameData._id}
          sessionFromServer={sessionFromServer}
        />
        <footer className="text-white mt-2">
          <span>
            Banner image by{" "}
            <a href="https://www.freepik.com/free-photo/silly-brown-newfoundland-dog-with-black-top-hat_26464041.htm#query=silly%20pet&position=19&from_view=search&track=sph">
              Freepik
            </a>
          </span>
        </footer>
      </div>
    </div>
  );
}
