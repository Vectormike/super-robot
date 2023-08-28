import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../config/database';
import User from '../user/user.model';
import Comment from '../comment/comment.model';

interface PostAttributes {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Some attributes are optional during creation, like id, createdAt, and updatedAt
interface PostCreationAttributes
  extends Optional<PostAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Post extends Model<PostAttributes, PostCreationAttributes> {
  public id!: string;
  public userId!: string;
  public title!: string;
  public content!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Post.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'posts',
    indexes: [
      {
        fields: ['userId'],
      },
    ],
  },
);

// Post.belongsTo(User, {
//   foreignKey: 'userId',
// });

Post.hasMany(Comment, {
  foreignKey: 'postId',
  as: 'postComments',
});

export default Post;
