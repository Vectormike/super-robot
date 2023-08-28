import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../../config/database';

// Enum for token types
export enum tokenTypes {
  REFRESH = 'REFRESH',
  RESET_PASSWORD = 'RESET_PASSWORD',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
}

interface TokenAttributes {
  id?: number;
  token: string;
  userId: number;
  type: tokenTypes;
  expires: Date;
  blacklisted?: boolean;
}

interface TokenCreationAttributes extends TokenAttributes {}

class Token extends Model<TokenAttributes, TokenCreationAttributes> {
  public id!: number;
  public token!: string;
  public userId!: number;
  public type!: tokenTypes;
  public expires!: Date;
  public blacklisted!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Token.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM,
      values: [
        tokenTypes.REFRESH,
        tokenTypes.RESET_PASSWORD,
        tokenTypes.VERIFY_EMAIL,
      ],
      allowNull: false,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    blacklisted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'tokens',
    timestamps: true,
  },
);

export default Token;
