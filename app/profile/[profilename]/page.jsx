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

// const ObjectId = require("mongodb").ObjectId;

export default async function ProfilePage({ params }) {
  const session = await getServerSession(serverAuthOptions);
  const { profilename } = params;

  console.log("profileName", profilename);
  const usersProfileName = profilename.toLowerCase();

  await dbConnect.connect();

  // ############# FIND A  USER ##################
  const userData = await User.findOne({ profilename: usersProfileName })
    .select("name followers profileimage profilename bioblurb location")
    .populate(
      "followers",
      "_id name profileimage profilename bioblurb location",
    )
    .lean();

  console.log("userData", userData);

  if (!userData) {
    return <div>User not found</div>;
  }
  const userId = userData._id.toString();

  // ########## grab created names #############
  const nameList = await Names.find({ createdby: userId })
    .populate({
      path: "createdby",
      select: ["name", "profilename", "profileimage"],
    })
    .populate("tags", "tag")
    .lean();

  //##### grabbing Tags for name edit function ###############

  //##### grabbing DESCRIPTIONS added by user

  const createdDescriptions = await Descriptions.find({
    createdby: userId,
  })
    .populate({
      path: "createdby",
      select: ["name", "profilename", "profileimage"],
    })
    .populate("tags", "tag")
    .lean();

  //TO CALCULATE USERS POINTS

  //USERS FAVED NAMES //

  const likedNames = await Names.find({
    likedby: userId,
  }).lean();

  const likedDescriptions = await Descriptions.find({
    likedby: userId,
  }).lean();

  //### FOLLOWING LIST, followers is grabbed from userData

  let usersFollowing = await User.find({
    followers: userId,
  })
    .select("name followers name profileimage profilename bioblurb location")
    .populate(
      "followers",
      "name followers name profileimage profilename bioblurb location",
    )
    .lean();

  let usersLikedContent = [];

  if (session?.user) {
    const userId = session.user.id;
    const likes = await NameLikes.find({ userId }).select("nameId -_id").lean();
    usersLikedContent = likes.map((l) => l.nameId.toString());
    //TODO: change to likes context
  }

  return (
    <Profile
      nameList={JSON.parse(JSON.stringify(nameList))}
      usersLikedContent={usersLikedContent}
      likedNames={JSON.parse(JSON.stringify(likedNames))}
      createdDescriptions={JSON.parse(JSON.stringify(createdDescriptions))}
      likedDescriptions={JSON.parse(JSON.stringify(likedDescriptions))}
      usersFollowing={JSON.parse(JSON.stringify(usersFollowing))}
      userData={JSON.parse(JSON.stringify(userData))}
    />
  );
}
