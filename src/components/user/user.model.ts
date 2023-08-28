import { Model, Optional, DataTypes } from 'sequelize';
import sequelize from '../../config/database';
import bcrypt from 'bcryptjs';
import Post from '../post/post.model';
import Comment from '../comment/comment.model';
import Token from '../tokens/token.model';

interface UserAttributes {
  id: string;
  email: string;
  password: string;
}

// Some attributes are optional during creation, so we use Optional utility type
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: string; // Note that the `null assertion` `!` is required in strict mode.
  public email!: string;
  public password!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public comparePassword!: (password: string) => Promise<boolean>;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    tableName: 'users',
    indexes: [
      {
        fields: ['email'],
      },
    ],
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
  },
);

User.beforeCreate(async (user, options) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

User.beforeUpdate(async (user, options) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

User.prototype.comparePassword = async function (password) {
  const user = await User.unscoped().findByPk(this.id);
  return await bcrypt.compare(password, user!.password);
};

User.hasMany(Post, {
  foreignKey: 'userId',
  as: 'posts',
});

User.hasMany(Comment, {
  foreignKey: 'userId',
  as: 'comments',
});

User.hasOne(Token, {
  foreignKey: 'userId',
  as: 'tokens',
});

export default User;
