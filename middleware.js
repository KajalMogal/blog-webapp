 const { postSchema, commentSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Post = require('./models/post');
const Comment = require('./models/comment');
  module.exports.isLoggedIn = (req, res, next) => {  //middleware function
          if(!req.isAuthenticated()) {
              req.flash('error', ' signed in first !');
             return res.redirect('/login')
          }
          next();
      }


module.exports.validatePost = (req, res, next) => {
    
    const { error } = postSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if(!post.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that !');
        return res.redirect(`/posts/${id}`);
    }
    next();
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/posts/${id}`);
    }
    next();
}

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}