import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import User from '../models/user_model';

// config init
dotenv.config({ silent: true });

export const signin = (user) => {
  return tokenForUser(user);
};

// note the lovely destructuring here indicating that we are passing in an object with these 4 keys
export const signup = async ({
  email, password, displayname, username,
}) => {
  // No email and pw
  if (!email || !password || !displayname || !username) {
    throw new Error('Please fill out all fields.');
  }

  // Check if a user with the given email address exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // If does exist, return error
    throw new Error('Email is in use');
  }

  // create new user -- edited to reflect user model changes yuh
  const picURL = 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png';
  const user = new User();
  user.email = email;
  user.username = username;
  user.password = password;
  user.displayname = displayname;
  user.profilePic = picURL;
  user.followingList = [];
  user.followerList = [];
  user.badges = [];
  await user.save();
  return tokenForUser(user);
};

export const getUser = async (id) => {
  try {
    return await User.findById(id);
  } catch (error) {
    console.log(`get user error: ${error}`);
    throw new Error(`get user error: ${error}`);
  }
};

// helper for encoding a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}
