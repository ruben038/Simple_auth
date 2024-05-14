import db from "../models/index.js";

const User = db.users;

const saveUser = async (req, res, next) => {
  try {
    const username = await User.findOne({
      where: {
        userName: req.body.userName,
      },
    });
    if (username) {
      return res.json(409).send("Le nom d'utilisateur existe déja");
    }
    const emailCheck = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (emailCheck) {
      return res.json(409).send("Ce mail est déja utilisé ");
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

export default saveUser

