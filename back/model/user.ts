import { Association, DataTypes, Model } from "sequelize";
import { sequelize } from "./index";
import { information } from "./information";

interface UserAttributes {
  email: string;
  password: string;
  nickname: string;
}

export class Users extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public nickname!: string;
  public email!: string;
  public password!: string;

  public static association: {
    userHasManyInformation: Association<Users, information>;
  };
}

Users.init(
  {
    email: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
  },
  {
    modelName: "User",
    tableName: "users",
    paranoid: true,
    charset: "utf8",
    collate: "utf8_general_ci", // 한글 저장
    sequelize,
  }
);

Users.hasMany(information, {
  sourceKey: "id",
  foreignKey: "user_row_id",
  as: "userHasManyInformation",
});
