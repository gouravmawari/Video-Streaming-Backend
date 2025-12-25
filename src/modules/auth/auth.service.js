const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../database/models/main');
const subUser = require("../../database/models/SubUser");
// const User = require("../../database/models/main")

const registerUserService = async ({ Name, Email, Password, PhoneNumber }) => {
  const existingUser = await User.findOne({ Email });
  if (existingUser) {
    return { status: 403, data: { message: 'User already exists' } };
  }
  const hashedPassword = await bcrypt.hash(Password, 10);
  const user = new User({ Name, Email, Password: hashedPassword, PhoneNumber });
  await user.save();

  return { status: 200, data: { UserID: user._id } };
};


//subuse registration
const subUserRegistration = async ({ parentUserId, subUserName }) => {
  // 1. create sub user
  const subUserCreate = new subUser({
    Name: subUserName,
    ParentId: parentUserId
  });

  // 2. save sub user
  await subUserCreate.save();

  // 3. push only the subUser ID into parent user's list
  await User.findOneAndUpdate(
    { _id: parentUserId },
    { $push: { SubUser_Id: subUserCreate._id } }
  );

  return {
    status: 201,
    data: { message: `Subuser with Name ${subUserName} is created and here its data => ${subUserCreate}` }
  };
};


const loginUserService = async ({ Email, Password }) => {
  const user = await User.findOne({ Email });
  if (!user) {
    return { status: 404, data: { message: 'User not found' } };
  }
  const isValid = await bcrypt.compare(Password, user.Password);
  if (!isValid) {
    return { status: 401, data: { message: 'Invalid password' } };
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretKey', { expiresIn: '1d' });

  return { status: 200, data: { token, UserID: user._id } };
};

module.exports = { registerUserService, loginUserService, subUserRegistration};
