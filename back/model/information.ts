import { sequelize } from "model";
import { DataTypes, Model } from "sequelize";

interface InfoType {
  id: number;
  userId: string;
  userPassword: string;
  hint: string;
  host: string;
  user_row_id: number;
}

export class information extends Model<InfoType> implements InfoType {
  public id!: number;
  public userId!: string;
  public userPassword!: string;
  public hint!: string;
  public host!: string;
  public updatedAt!: Date;
  public user_row_id!: number;
}

information.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    userPassword: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    hint: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    host: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    user_row_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    modelName: "information",
    tableName: "information",
    paranoid: true,
    charset: "utf8",
    collate: "utf8_general_ci", // 한글 저장
    sequelize,
  }
);
