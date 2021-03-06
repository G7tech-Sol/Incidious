const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/database');

module.exports = (router) => {
  // router.post('/newBlog',(req,res)=>{
  //   if(!req.body.title){
  //     res.json({success:false,message: 'Blog Title is required' });
  //   } else if (!req.body.body) {
  //     res.json({success:false,message: 'Blog Body is required' });
  //   } else if (!req.body.createdBy) {
  //     res.json({success:false,message: 'Blog Creator is required' });
  //   } else {
  //     let blog = new Blog ({
  //       title: req.body.title,
  //       body: req.body.body,
  //       createdBy: req.body.createdBy
  //     });
  //     blog.save((err)=>{
  //       if(err){
  //         if(err.error.title){
  //           res.json({success:false,message: err.errors.title.message});
  //         } else if (err.error.body) {
  //           res.json({success:false,message: err.errors.body.message});
  //         } else if (err.error.createdBy) {
  //           res.json({success:false,message: err.errors.createdBy.message});
  //         } else{
  //           res.json({success:false, message: err});
  //         }
  //
  //       } else {
  //         res.json({success:true, message : 'Blog is successfully saved'});
  //       }
  //     });
  //   }
  // });
  router.post('/newBlog', (req, res) => {

  // Check if blog title was provided
  if (!req.body.title) {
    res.json({ success: false, message: 'Blog title is required.' }); // Return error message
  } else {
    // Check if blog body was provided
    if (!req.body.body) {
      res.json({ success: false, message: 'Blog body is required.' }); // Return error message
    } else {
      // Check if blog's creator was provided
      if (!req.body.createdBy) {
        res.json({ success: false, message: 'Blog creator is required.' }); // Return error
      } else {
        // console.log(req.body.body);
        // Create the blog object for insertion into database
        const blog = new Blog({
          title: req.body.title, // Title field
          body: req.body.body, // Body field
          createdBy: req.body.createdBy // CreatedBy field
        });
        // const blog = new Object();
        // blog.title = req.body.title;
        // blog.body = req.body.body;
        // blog.createdBy = req.body.createdBy;
          // Save blog into database
          console.log(blog);
        blog.save(function(err){
          // Check if error
          if (err) {
            // Check if error is a validation error
            if (err.errors) {
              // Check if validation error is in the title field
              if (err.errors.title) {
                res.json({ success: false, message: err.errors.title.message }); // Return error message
              } else {
                // Check if validation error is in the body field
                if (err.errors.body) {
                  res.json({ success: false, message: err.errors.body.message }); // Return error message
                } else {
                  res.json({ success: false, message: err }); // Return general error message
                }
              }
            } else {
              res.json({ success: false, message: err }); // Return general error message
            }
          } else {
            res.json({ success: true, message: 'Blog saved!' }); // Return success message
          }
        });
      }
    }
  }
});
router.get('/allBlogs',(req,res)=>{
  Blog.find({},(err,blog)=>{
    if(err){
      res.json({success:false , message : err});
    }else{
      if(!blog){
        res.json({success:false , message: "No Blogs Found"});
      }else{
      res.json({ success: true, blog : blog });
      }
    }
  }).sort({ '_id': -1 });
});

router.get('/singleBlog/:id', (req, res) => {
  // Check if id is present in parameters
  if (!req.params.id) {
    res.json({ success: false, message: 'No blog ID was provided.' }); // Return error message
  } else {
    // Check if the blog id is found in database
    Blog.findOne({ _id: req.params.id }, (err, blog) => {
      // Check if the id is a valid ID
      if (err) {
        res.json({ success: false, message: 'Not a valid blog id' }); // Return error message
      } else {
        // Check if blog was found by id
        if (!blog) {
          res.json({ success: false, message: 'Blog not found.' }); // Return error message
        } else {
          // Find the current user that is logged in
          User.findOne({ _id: req.decoded.userId }, (err, user) => {
            // Check if error was found
            if (err) {
              res.json({ success: false, message: err }); // Return error
            } else {
              // Check if username was found in database
              if (!user) {
                res.json({ success: false, message: 'Unable to authenticate user' }); // Return error message
              } else {
                // Check if the user who requested single blog is the one who created it
                if (user.username !== blog.createdBy) {
                  res.json({ success: false, message: 'You are not authorized to eidt this blog.' }); // Return authentication reror
                } else {
                  res.json({ success: true, blog: blog }); // Return success
                }
              }
            }
          });
        }
      }
    });
  }
});
router.put('/updateBlog', (req, res) => {
  console.log(req.body);
  // Check if id was provided
  if (!req.body._id) {
    res.json({ success: false, message: 'No blog id provided' }); // Return error message
  } else {
    // Check if id exists in database
    Blog.findOne({ _id: req.body._id }, (err, blog) => {
      // Check if id is a valid ID
      if (err) {
        res.json({ success: false, message: 'Not a valid blog id' }); // Return error message
      } else {
        // Check if id was found in the database
        if (!blog) {
          res.json({ success: false, message: 'Blog id was not found.' }); // Return error message
        } else {
          // Check who user is that is requesting blog update
          User.findOne({ _id: req.decoded.userId }, (err, user) => {
            // Check if error was found
            if (err) {
              res.json({ success: false, message: err }); // Return error message
            } else {
              // Check if user was found in the database
              if (!user) {
                res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
              } else {
                // Check if user logged in the the one requesting to update blog post
                if (user.username !== blog.createdBy) {
                  res.json({ success: false, message: 'You are not authorized to edit this blog post.' }); // Return error message
                } else {
                  blog.title = req.body.title; // Save latest blog title
                  blog.body = req.body.body; // Save latest body
                  blog.save((err) => {
                    if (err) {
                      if (err.errors) {
                        res.json({ success: false, message: 'Please ensure form is filled out properly' });
                      } else {
                        res.json({ success: false, message: err }); // Return error message
                      }
                    } else {
                      res.json({ success: true, message: 'Blog Updated!' }); // Return success message
                    }
                  });
                }
              }
            }
          });
        }
      }
    });
  }
});
  return router;
}
