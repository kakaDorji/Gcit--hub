const User = require('./../models/userModels')
const jwt = require('jsonwebtoken')
const AppError = require('./../utils/appError')
const { promisify, isNullOrUndefined } = require('util')

const crypto = require('crypto'); // Required for generating a reset token

const nodemailer = require('nodemailer'); //
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
    }
    res.cookie('jwt', token, cookieOptions)

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user
        }
    })
}
exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create(req.body)
        createSendToken(newUser, 201, res)
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return next(new AppError('Please provide and email and password!', 400))
        }

        const user = await User.findOne({ email }).select('+password')
        const correct = user !== null && await user.correctPassword(password, user.password)
        if (!user || !correct) {
            return next(new AppError('Incorrect email or password', 401))
        }

        createSendToken(user, 200, res)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.logout = (req, res) => {
    // res.cookie('token', '', {
    //     expires: new Date(Date.now() + 10 * 1000),
    //     httpOnly: true
    // })
    // res.cookie('jwt', '', {
    //     expires: new Date(Date.now() + 10 * 1000),
    //     httpOnly: true
    // })
    // document.cookie = "token = '';path=/";
    res.clearCookie('token') 
    res.clearCookie('jwt') 
    res.status(200).json({ status: "success" })
}


exports.protect = async (req, res, next) => {
    try {
        //1) Getting token and check of it's there

        let token
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1]
        }
        else if (req.cookies.jwt) {
            token = req.cookies.jwt
        }

        if (!token) {
            return next(
                new AppError('You are not logged in! Please log in to get access', 401)
            )
        }

        //2) Verification token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

        //3) Check if user still exists
        const freshUser = await User.findById(decoded.id)
        if (!freshUser) {
            return next(
                new AppError('The user belonging to this token no longer exist', 401)
            )
        }

        //pass user
        req.user = freshUser

        //grant access to protected route
        next()
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.adminProtect = async (req, res, next) => {
    try {
        //1) Getting token and check of it's there

        let token
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1]
        }
        else if (req.cookies.jwt) {
            token = req.cookies.jwt
        }

        if (!token) {
            return next(
                new AppError('You are not logged in! Please log in to get access', 401)
            )
        }

        //2) Verification token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

        //3) Check if user still exists
        const freshUser = await User.findById(decoded.id)
        if (!freshUser) {
            return next(
                new AppError('The user belonging to this token no longer exist', 401)
            )
        }
        else if (freshUser.type != 'admin') {
            return next(
                new AppError('The user must be an admin', 403)
            )
        }

        //pass user
        req.user = freshUser

        //grant access to protected route
        next()
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.updatePassword = async (req, res, next) => {
    try {
        //1) Get user from collection
        const user = await User.findById(req.user.id).select('+password')
        console.log(user)
        //2)Check if posted current password is correct
        if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
            return next(new AppError('Your current password is wrong', 401))
        }

        //3) If so, update password
        console.log("updating password")
        user.password = req.body.password
        user.passwordConfirm = req.body.passwordConfirm
        await user.save()
        console.log("password updated")

        //4)Log user in, send JWT
        createSendToken(user, 200, res)
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        // Generate a reset token (e.g., using crypto)
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Save the token to the user's document (make sure to create a resetToken field)
        user.resetToken = resetToken;
        user.resetTokenExpires = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes
        await user.save();

        // Create a reset link (this should point to your frontend route)
        const resetLink = `http://yourfrontend.com/reset-password/${resetToken}`;

        // Set up Nodemailer transporter (make sure to replace with your email service credentials)
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-email-password',
            },
        });

        // Define email options
        const mailOptions = {
            from: 'no-reply@yourdomain.com',
            to: email,
            subject: 'Password Reset Link',
            text: `You requested a password reset. Please click the link below to reset your password:\n\n${resetLink}`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            status: 'success',
            message: 'Reset link sent to your email!',
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
      // 1) Decode the token
      const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
  
      // 2) Get the user by the token's id
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(400).json({ message: 'Token is invalid or has expired.' });
      }
  
      // 3) Set the new password
      user.password = req.body.password;
      user.passwordConfirm = req.body.passwordConfirm;
      await user.save();
  
      // 4) Send a success response
      res.status(200).json({
        status: 'success',
        message: 'Password updated successfully!',
      });
    } catch (err) {
      return res.status(500).json({
        message: 'There was an error processing your request!',
      });
    }
  };