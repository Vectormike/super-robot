import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../config/database';
import User from '../user/user.model';
import Post from '../post/post.model';

interface CommentAttributes {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CommentCreationAttributes
  extends Optional<CommentAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Comment extends Model<CommentAttributes, CommentCreationAttributes> {
  public id!: string;
  public postId!: string;
  public userId!: string;
  public content!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Comment.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'comments',
    indexes: [
      {
        fields: ['postId'],
      },
      {
        fields: ['userId'],
      },
      {
        // Composite index if I anticipate fetching based on both post and user frequently
        fields: ['postId', 'userId'],
      },
    ],
  },
);

// Comment.belongsTo(User, {
//   foreignKey: 'userId',
// });

// Comment.belongsToMany(Post);

export default Comment;
