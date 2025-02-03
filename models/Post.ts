import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  id: String,
  title: String,
  content: String,
  author: String,
  createdAt: Date,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  image: String
});

const Post = mongoose.model('Post', PostSchema);

export default Post;
