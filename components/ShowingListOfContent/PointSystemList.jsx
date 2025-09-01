import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCookieBite,
  faRankingStar,
  faHeart,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import RankNames from "../RankNames";
import GeneralOpenCloseButton from "../ReusableSmallComponents/buttons/generalOpenCloseButton";

export default function PointSystemList({
  favNames,
  namesCreated,
  createdDescriptions,
  likedDescriptions,
}) {
  const [treatBreakdownMenuOpen, settreatBreakdownMenuOpen] = useState(false);

  //##############POINTS###########

  const [namesLikedPoints, setNamesLikedPoints] = useState(0);

  const [namesAddedPoints, setNamesAddedPoints] = useState(0);

  const [descriptionsLikedPoints, setDescriptionsLikedPoints] = useState(0);

  const [descriptionsAddedPoints, setDescriptionsAddedPoints] = useState(0);

  const [totalPoints, setTotalPoints] = useState();

  //setting the points for the point categories
  useEffect(() => {
    setNamesLikedPoints(favNames.length);
    setNamesAddedPoints(namesCreated.length * 3);

    setDescriptionsLikedPoints(likedDescriptions.length);
    setDescriptionsAddedPoints(createdDescriptions.length);
  }, [favNames, namesCreated, createdDescriptions, likedDescriptions]);
  //for total points
  useEffect(() => {
    setTotalPoints(
      +namesLikedPoints +
        +namesAddedPoints +
        +descriptionsLikedPoints +
        +descriptionsAddedPoints,
    );
  }, [
    namesLikedPoints,
    namesAddedPoints,
    descriptionsLikedPoints,
    descriptionsAddedPoints,
  ]);

  return (
    <section className="userStatsSection pt-4 text-base">
      <section className="overallStats mb-2 font-bold text-white text-center">
        <div>
          <FontAwesomeIcon
            icon={faCookieBite}
            className="text-2xl mr-2 text-yellow-400"
          />
          Treats Earned:
          <span className="text-yellow-400 ml-2">{totalPoints}</span>
        </div>

        <div>
          <section>
            <FontAwesomeIcon
              icon={faRankingStar}
              className="text-2xl mr-2 text-yellow-400"
            />
            Rank:
            <RankNames points={totalPoints} />
          </section>
        </div>
      </section>

      <section className="mt-4">
        <GeneralOpenCloseButton
          text="Treat Points Breakdown "
          setStatus={settreatBreakdownMenuOpen}
          styling="w-full text-base"
          status={treatBreakdownMenuOpen}
        />

        {treatBreakdownMenuOpen == true && (
          <section className="bg-darkPurple font-bold border-2 border-yellow-300 p-4 text-white">
            <section
              className="userStatsBreakdownDropDown 
         grid grid-cols-2 grid-flow-row  gap-2 pb-2
         "
            >
              <div>
                <FontAwesomeIcon
                  icon={faHeart}
                  className="text-xl mr-1 text-red-500"
                />
                Names=
                <span className="text-yellow-300">{namesLikedPoints}</span>
              </div>

              <div>
                <FontAwesomeIcon
                  icon={faHeart}
                  className="text-xl mr-1 text-red-500"
                />
                Descriptions=
                <span className="text-yellow-300">
                  {descriptionsLikedPoints}
                </span>
              </div>

              <div>
                <FontAwesomeIcon
                  icon={faCirclePlus}
                  className="text-xl mr-1 text-green-500"
                />
                Names =
                <span className="text-yellow-300"> {namesAddedPoints}</span>
              </div>

              <div>
                <FontAwesomeIcon
                  icon={faCirclePlus}
                  className="text-xl mr-1 text-green-500"
                />
                Descriptions=
                <span className="text-yellow-300">
                  {descriptionsAddedPoints}
                </span>
              </div>
            </section>

            <span className="text-yellow-300">
              Added content is worth *3 bonus points!
            </span>
          </section>
        )}
      </section>
    </section>
  );
}
