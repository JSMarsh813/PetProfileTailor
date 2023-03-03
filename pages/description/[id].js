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
import DescriptionListingAsSections from "../../components/ShowingListOfContent/DescriptionListingAsSections";
import HeadersForDescriptions from "../../components/ShowingListOfContent/HeadersForDescriptions";
import PageTitleWithImages from "../../components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";

export const getServerSideProps = async (context) => {
  //allows us to grab the dynamic value from the url
  const id = context.params.id;

  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  let descriptionResponse = await fetch(
    "http://localhost:3000/api/description/getASpecificDescriptionById/" + id
  );
  let descriptionData = await descriptionResponse.json();

  if (!descriptionData) {
    console.log(descriptionData);
    return {
      notFound: true,
    };
  } else {
    let descriptionTagList = await fetch(
      "http://localhost:3000/api/descriptiontag"
    );
    let descriptionTagData = await descriptionTagList.json();

    let tagListProp = descriptionTagData
      .map((tag) => tag.tag)
      .reduce((sum, value) => sum.concat(value), []);

    return {
      props: {
        description: descriptionData,
        sessionFromServer: session,
        tagList: tagListProp,
      },
    };
  }
};

export default function Postid({ sessionFromServer, description, tagList }) {
  //for Nav menu profile description and image
  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }

  //end of section for nav menu

  return (
    <div>
      <NavLayoutwithSettingsMenu
        profileImage={profileImage}
        userName={userName}
      />

      <PageTitleWithImages
        imgSrc="bg-[url('https://img.freepik.com/free-photo/happy-woman-with-labrador-park_23-2148345919.jpg?w=826&t=st=1676723047~exp=1676723647~hmac=461f234d41e2f8fa984e028db04245a9a4580f1719bf21a5882b091cca91bfa7')] "
        title="description"
      />

      <div className="mx-2">
        <HeadersForDescriptions />

        <DescriptionListingAsSections
          description={description}
          key={description._id}
          sessionFromServer={sessionFromServer}
          tagList={tagList}
        />
        <footer className="text-white mt-2">
          <span>
            Banner image by{" "}
            <a href="https://img.freepik.com/free-photo/happy-woman-with-labrador-park_23-2148345919.jpg?w=826&t=st=1676723047~exp=1676723647~hmac=461f234d41e2f8fa984e028db04245a9a4580f1719bf21a5882b091cca91bfa7">
              Freepik
            </a>
          </span>
        </footer>
      </div>
    </div>
  );
}
