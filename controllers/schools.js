const School = require('../models/school');
const User = require('../models/users');
const ErrorResponse = require('../utils/ErrorResponse');
const randomize = require('randomatic');
const sendEmail = require('../utils/sendEmail');

/**
 * @desc Register School
 * @route POST /api/school
 * @access Public
 */
exports.registerSchool = async (req, res, next) => {
  try {
    // get school data
    const { name, email, ...input } = req.body;
    // create new School
    const newSchool = await School.create({ name });

    // check if created
    if (!newSchool) return next(new ErrorResponse('School not created', 500));

    // add user data of admin

    // generate random user data
    const username = randomize('?', 6, email.split('@')[0]);
    const password = randomize('Aa0', 8);

    const user = await User.create({
      email,
      password,
      name: username,
      role: 'admin',
    });

    if (!user) return next(new ErrorResponse('User not created', 500));

    // generate password confirmation token
    // grab token and send to email
    const confirmEmailToken = user.generateEmailConfirmToken();

    // save token
    user.save({ validateBeforeSave: false });

    // send email to user with token and stuff
    const URL = `${process.env.CLIENT_URL}/confirmemail?token=${confirmEmailToken}`;
    const options = {
      from: `${process.env.NOREPLY_NAME}<${process.env.NOREPLY_EMAIL}>`,
      to: user.email,
      subject: 'Email Confirmation',
      html: `
      <div style="width: 100%;">
        <table style="width: 100%;">
          <tr>
            <td>Please click or copy the link below to confirm your email address</td>
          </tr>
          <tr>
            <a href="${URL}">${URL}</a>
          </tr>
        </table>
        <table style="width: 100%;margin-top: 15px;">
          <thead>
            <tr>
              <th>User Info: </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><b>School Name:</b></td>
              <td>${name}</td>
            </tr>
            <tr>
              <td><b>Name:</b></td>
              <td>${username}</td>
            </tr>
            <tr>
              <td><b>Email:</b></td>
              <td>${email}</td>
            </tr>
            <tr>
              <td><b>Password:</b></td>
              <td>${password}</td>
            </tr>
          </tbody>
        </table>
      </div>`,
    };

    // send email
    const sendResult = await sendEmail(options);

    if (!sendResult) {
      console.log('Confirmation email not sent');
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
