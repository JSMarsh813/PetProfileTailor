import RankingTotals from "./RankingTotals";

export default function EngagementTable({
  namesLikes,
  namesAdds,
  descriptionsLikes,
  descriptionsAdds,
}) {
  const addPoints = (descriptionsAdds + namesAdds) * 3;
  const likePoints = descriptionsLikes + namesLikes;
  const totalPoints = addPoints + likePoints;

  console.log(
    "nameLikes",
    namesLikes,
    "namesAdd",
    namesAdds,
    "descriptionLikes",
    descriptionsLikes,
    "descriptionAdds",
    descriptionsAdds,
  );
  return (
    <div className="w-full max-w-xl mx-auto  pt-10">
      <RankingTotals totalPoints={totalPoints} />

      {/* Desktop Table */}
      <div className="hidden sm:block bg-primary rounded-3xl shadow-lg overflow-hidden">
        <table className="min-w-full text-gray-100 border-t  border-subtleWhite ">
          <thead className="bg-secondary">
            <tr>
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2 text-center">Names</th>
              <th className="px-4 py-2 text-center">Descriptions</th>
            </tr>
          </thead>
          <tbody className="border-b  border-subtleWhite ">
            <tr className="">
              <th className="px-4 py-2 text-left">Likes</th>
              <td className="px-4 py-2 text-center">{namesLikes}</td>
              <td className="px-4 py-2 text-center">{descriptionsLikes}</td>
            </tr>
            <tr className="">
              <th className="px-4 py-2 text-left">Adds</th>
              <td className="px-4 py-2 text-center">{namesAdds}</td>
              <td className="px-4 py-2 text-center">{descriptionsAdds}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden flex flex-col gap-4">
        {[
          {
            category: "Names",
            Likes: namesLikes,
            Adds: namesAdds,
          },
          {
            category: "Descriptions",
            Likes: descriptionsLikes,
            Adds: descriptionsAdds,
          },
        ].map((cat) => (
          <div
            key={cat.category}
            className="bg-primary rounded-lg shadow-lg p-4"
            role="region"
            aria-labelledby={`cat-${cat.category}`}
          >
            <h3
              id={`cat-${cat.category}`}
              className="text-lg font-semibold text-subtleWhite mb-2 bg-secondary py-2 rounded-2xl border-b border-subtleWhite"
            >
              {cat.category}
            </h3>
            <div className="flex justify-between text-gray-100">
              <span>Likes:</span>
              <span>{cat.Likes}</span>
            </div>
            <div className="flex justify-between text-gray-100 mt-1">
              <span>Adds:</span>
              <span>{cat.Adds}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
