import dbConnect from "@utils/db";
import NameLikes from "@models/NameLikes";
import Names from "@models/Names";
import NameTag from "@models/NameTag";
import Descriptions from "@/models/Description";
import DescriptionTag from "@/models/DescriptionTag";
import User from "@models/User";
import Profile from "@/components/profile";
import { getServerSession } from "next-auth";
import { serverAuthOptions } from "@/lib/auth";
import { leanWithStrings } from "@/utils/mongoDataCleanup";

// const ObjectId = require("mongodb").ObjectId;

export default async function ProfilePage({ params }) {
  const session = await getServerSession(serverAuthOptions);
  const { profilename } = params;

  console.log("profileName", profilename);
  const usersProfileName = profilename.toLowerCase();

  await dbConnect.connect();

  // ############# FIND A  USER ##################
  const userData = await leanWithStrings(
    User.findOne({ profilename: usersProfileName })
      .select("name followers profileimage profilename bioblurb location")
      .populate(
        "followers",
        "_id name profileimage profilename bioblurb location",
      ),
  );

  console.log("userData", userData);

  if (!userData) {
    return <div>User not found</div>;
  }
  const userId = userData._id.toString();

  // ########## grab created names #############
  const nameList = await leanWithStrings(
    Names.find({ createdby: userId })
      .populate({
        path: "createdby",
        select: ["name", "profilename", "profileimage"],
      })
      .populate("tags", "tag"),
  );

  //##### grabbing Tags for name edit function ###############

  //##### grabbing DESCRIPTIONS added by user

  const createdDescriptions = await leanWithStrings(
    Descriptions.find({
      createdby: userId,
    })
      .populate({
        path: "createdby",
        select: ["name", "profilename", "profileimage"],
      })
      .populate("tags", "tag"),
  );

  console.log("created descriptions", createdDescriptions);

  //TO CALCULATE USERS POINTS

  //### FOLLOWING LIST, followers is grabbed from userData

  let usersFollowing = await leanWithStrings(
    User.find({
      followers: userId,
    })
      .select("name followers name profileimage profilename bioblurb location")
      .populate(
        "followers",
        "name followers name profileimage profilename bioblurb location",
      ),
  );

  let usersLikedContent = [];

  if (session?.user) {
    const userId = session.user.id;
    usersLikedContent = await leanWithStrings(
      NameLikes.find({ userId }).select("nameId -_id"),
    );

    //TODO: change to likes context
  }

  return (
    <Profile
      nameList={JSON.parse(JSON.stringify(nameList))}
      createdDescriptions={JSON.parse(JSON.stringify(createdDescriptions))}
      usersFollowing={JSON.parse(JSON.stringify(usersFollowing))}
      userData={JSON.parse(JSON.stringify(userData))}
    />
  );
}
