import bcryptjs from "bcryptjs";
import User from "../../../models/User";
import db from "../../../utils/db";
import regexInvalidInput from "../../../utils/stringManipulation/check-for-valid-names";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }
  const { name, email, password, profilename } = req.body;

  let passwordChecked = password;

  if (passwordChecked === "") {
    passwordChecked = null;
  }

  if (!name || !email || !profilename || !email.includes("@")) {
    res.status(422).json({
      message: `Validation error, please check the name ${name},  profilename ${profilename} and email ${email} fields`,
    });
    return;
  }

  let checkForInvalidInput = regexInvalidInput(profilename);

  if (checkForInvalidInput != null) {
    res.status(422).json({
      message: `Invalid characters entered ${checkForInvalidInput}`,
    });
  }
  if (passwordChecked != null && passwordChecked.length < 5) {
    res.status(422).json({
      message: "Invalid Password length",
    });
    return;
  }

  console.log(`this is passwordchecked $passwordChecked}`);
  await db.connect();

  const existingEmail = await User.findOne({ email: email });

  if (existingEmail) {
    res.status(422).json({ message: "Email is already used!" });

    return;
  }

  const existingUserProfile = await User.findOne({ profilename: profilename });
  if (existingUserProfile) {
    res.status(422).json({ message: "That profile name is already used!" });

    return;
  }

  // !password?

  const newUser = new User({
    name,
    email,
    profilename: profilename.toLowerCase(),
    ...(passwordChecked != null && {
      password: bcryptjs.hashSync(passwordChecked),
    }),
  });

  // https://www.freecodecamp.org/news/how-to-conditionally-build-an-object-in-javascript-with-es6-e2c49022c448/

  const user = await newUser.save();

  res.status(201).send({
    message: "Created user!",
    _id: user._id,
    profilename: user.profilename,
    name: user.name,
    email: user.email,
  });
}

export default handler;
