import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCookieBite, faRankingStar } from "@fortawesome/free-solid-svg-icons";
import RankNames from "./RankNames"; // assuming you have this component

export default function RankingTotals({ totalPoints }) {
  function rankingLine(totalPoints, faIcon, label, rankNames) {
    return (
      <div className="w-full   ">
        {/* Icon and label */}
        <section className="flex items-center w-fit  mx-auto mb-4  ">
          <div className="flex  items-center">
            <div className="mr-2 text-right">
              <FontAwesomeIcon
                icon={faIcon}
                className="text-xl  mx-auto text-yellow-300"
              />
            </div>
            <span className="inline-block  text-right">{label}:</span>
          </div>

          {/* Rank or Total */}
          <div className="w-full text-left ml-1">
            {rankNames ? (
              <RankNames points={totalPoints} />
            ) : (
              <span>{totalPoints}</span>
            )}
          </div>
        </section>
      </div>
    );
  }

  return (
    <section className="overallStats mb-2 font-bold text-white mx-auto">
      <div className="w-full mx-auto space-y-2">
        {/* Row 1: Treats */}
        {rankingLine(totalPoints, faCookieBite, "Treats", false)}
        {/* Row 2: Rank */}

        {rankingLine(totalPoints, faRankingStar, "Rank", true)}
      </div>
    </section>
  );
}
