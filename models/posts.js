const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: [255, 'You have exceeded the max title length[255]'],
      required: [true, 'Title field is required'],
      unique: true,
    },
    content: {
      type: String,
      required: [true, 'Body field is required'],
    },
    slug: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: [true, 'User field is required'],
    },
  },
  {
    timestamps: true,
  },
);

// Pre Save Middleware
postSchema.pre('save', async function (next) {
  try {
    let title = this.title;
    title = title.replace(/[;\/:*?""<>|&.,']/g, '');

    this.slug = slugify(title, { lower: true });
    next();
  } catch (error) {
    next(error);
  }
});

const Post = mongoose.model('Posts', postSchema);

module.exports = Post;
