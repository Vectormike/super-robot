import Comment from '../components/comment/comment.model';
import User from '../components/user/user.model';
import Post from '../components/post/post.model';

Comment.belongsTo(Post, {
  foreignKey: 'postId',
});

Comment.belongsTo(User, {
  foreignKey: 'userId',
});

Post.belongsTo(User, {
  foreignKey: 'userId',
});

export { Comment, Post, User };
