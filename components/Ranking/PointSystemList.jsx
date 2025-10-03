import RankingTotals from "./RankingTotals";

export default function EngagementTable({
  namesAdds,

  descriptionsAdds,
}) {
  const totalPoints = descriptionsAdds + namesAdds;

  // console.log(
  //   "namesAdd",
  //   namesAdds,

  //   "descriptionAdds",
  //   descriptionsAdds,
  // );
  return (
    <div className="w-full max-w-xl mx-auto ">
      <RankingTotals totalPoints={totalPoints} />

      {/* Desktop Table */}
      <div className="hidden sm:block rounded-xl shadow-lg overflow-hidden pt-2 ">
        <table className="min-w-full text-gray-100  ">
          <thead className="">
            <tr>
              <th className="px-4 py-2 text-center">Names</th>
              <th className="px-4 py-2 text-center">Descriptions</th>
            </tr>
          </thead>
          <tbody className="">
            <tr className="bg-primary">
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

            Adds: namesAdds,
          },
          {
            category: "Descriptions",

            Adds: descriptionsAdds,
          },
        ].map((cat) => (
          <div
            key={cat.category}
            className=" rounded-lg shadow-lg p-4"
            role="region"
            aria-labelledby={`cat-${cat.category}`}
          >
            <h3
              id={`cat-${cat.category}`}
              className="text-lg font-semibold text-subtleWhite mb-2  py-2 rounded-2xl"
            >
              {cat.category}
            </h3>

            <div className="flex justify-between text-gray-100 mt-1 py-2 px-6 rounded-2xl bg-primary">
              <span>Adds:</span>
              <span>{cat.Adds}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
