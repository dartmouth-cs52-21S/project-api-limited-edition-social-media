import { Router } from 'express';
import * as Posts from './controllers/post_controller';
import * as UserController from './controllers/user_controller';
import { requireAuth, requireSignin } from './services/passport';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Limited Edition Social Media API!' });
});

// In this syntax, req and res are provided as parameters for the functions.

// Learned about routing from https://www.youtube.com/watch?v=JlgKybraoy4 and Tim
// POST /posts: Posts.createPost
// GET /posts: Posts.getPosts
router.route('/posts')
  .post(requireAuth, async (req, res) => {
    try {
      // body will have all the json fields. This is what the bodyparser is for.
      await Posts.createPost(req.user, req.body).then((value) => {
        res.json(value);
      });
    } catch (error) {
      // or catch the error and send back an error
      res.status(500).json({ error });
    }
  })
  .get(async (req, res) => {
    try {
      // No parameters for this one
      await Posts.getPosts().then((value) => {
        res.json(value);
      });
    } catch (error) {
      // or catch the error and send back an error
      res.status(500).json({ error });
    }
  });

// GET /posts/:id: Posts.getPost
// PUT /posts/:id: Posts.updatePost
// DELETE /posts/:id: Posts.deletePost
router.route('/posts/:id')
  .get(async (req, res) => {
    try {
      // Based on parameters above^ :id
      await Posts.getPost(req.params.id).then((value) => {
        res.json(value);
      });
    } catch (error) {
      // or catch the error and send back an error
      res.status(500).json({ error });
    }
  })
  .put(requireAuth, async (req, res) => {
    try {
      await Posts.updatePost(req.params.id, req.body).then((value) => {
        res.json(value);
      });
    } catch (error) {
      // or catch the error and send back an error
      res.status(500).json({ error });
    }
  })
  .delete(requireAuth, async (req, res) => {
    try {
      await Posts.deletePost(req.params.id).then((value) => {
        res.json({ deleted: value });
      });
    } catch (error) {
      // or catch the error and send back an error
      res.status(500).json({ error });
    }
  });

// signin route
router.post('/signin', requireSignin, async (req, res) => {
  try {
    const token = UserController.signin(req.user);
    console.log('token created');
    res.json({ token, email: req.user.email });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

// signup route
router.post('/signup', async (req, res) => {
  try {
    const token = await UserController.signup(req.body);
    res.json({ token, email: req.body.email });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

// search route
router.post('/search', async (req, res) => {
  try {
    const token = await UserController.signup(req.body);
    res.json({ token, email: req.body.email });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

export default router;
