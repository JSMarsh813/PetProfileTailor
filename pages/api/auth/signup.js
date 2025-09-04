import bcryptjs from "bcryptjs";
import User from "../../../models/User";
import db from "../../../utils/db";
import regexInvalidInput from "../../../utils/stringManipulation/check-for-valid-names";
import { getUserByProfileName } from "../../../utils/getUserByProfileName";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }
  const { name, email, password, profilename } = req.body;

  const errors = {};

  // ############  Basic required field validation ###############
  if (!name) errors.name = "Please enter a name";
  if (!email) errors.email = "Please enter an email";
  if (email && !email.includes("@"))
    errors.email = "Please enter a valid email";
  if (!profilename) errors.profilename = "Please enter a profile name";

  // ############ Profile name checks ###############
  if (profilename) {
    const invalidProfileNameInput = regexInvalidInput(profilename);
    if (invalidProfileNameInput != null) {
      errors.profilename = `Invalid characters entered: ${invalidProfileNameInput}`;
    }

    const existingUserProfile = await getUserByProfileName(profilename);
    if (existingUserProfile) {
      errors.profilename = "That profile name is already used!";
    }
  }

  // ############ Password checks ###############
  const passwordChecked = password === "" ? null : password;

  if (passwordChecked != null && passwordChecked.length < 5) {
    errors.password = "Password must be at least 6 characters";
  }

  // ############ Email uniqueness ###############
  if (email) {
    await db.connect();
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      errors.email = "Email is already used!";
    }

    // ############ Return all errors at once if any ###############
    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ errors });
    }
  }

  // ############ Proceed to create user ###############

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
