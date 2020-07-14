const School = require('../models/school');
const User = require('../models/users');
const ErrorResponse = require('../utils/ErrorResponse');
const randomize = require('randomatic');
const sendEmail = require('../utils/sendEmail');
const emailTemplate = require('../utils/emailTemplate');

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
      html: emailTemplate({
        name: user.email,
        url: URL,
        situation: 'email_confirmation',
      }),
    };

    const schoolDetails = {
      from: `${process.env.NOREPLY_NAME}<${process.env.NOREPLY_EMAIL}>`,
      to: user.email,
      subject: 'School Registration Details',
      html: emailTemplate({
        name: user.email,
        situation: 'school_registration',
        school: {
          name,
          username,
          password,
          email: user.email,
        },
      }),
    };

    // send email
    const sendResult = await sendEmail(options);
    const sendSchoolDetails = await sendEmail(schoolDetails);

    if (!sendResult) {
      console.log('Confirmation email not sent');
    }

    if (!sendSchoolDetails) {
      console.log('School details not sent to email');
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
