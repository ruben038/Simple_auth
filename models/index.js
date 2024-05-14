import { Sequelize, DataTypes } from "sequelize";
import userModel from "./userModel.js";
import token from "./token.js";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  `postgres://ruben:${process.env.Password}@localhost:5432/node_auth`
);
sequelize
  .authenticate()
  .then(() => {
    console.log("connected");
  })
  .catch((err) => console.log(err));

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = userModel(sequelize, DataTypes);
db.token = token(sequelize, DataTypes);

db.users.hasOne(db.token, {
  as: "token",
  foreignKey: "userId",
});

db.token.belongsTo(db.users, {
  as: "user",
  foreignKey: "userId",
});

export default db;
