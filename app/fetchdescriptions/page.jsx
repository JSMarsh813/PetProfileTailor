import dbConnect from "@utils/db";

import CoreListingPageLogic from "@/components/CoreListingPagesLogic";

export default async function FetchDescriptions() {
  await dbConnect.connect();

  return <CoreListingPageLogic dataType="descriptions" />;
}
