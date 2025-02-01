
const User = require('./../models/userModels')
const AppError = require('../utils/appError');
const multer = require('multer');
const App = require('../models/AppModel');
const nodemailer = require("nodemailer");


async function sendEmail(to, subject, text) {
  let transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    secure: true,
    port: 465,
    auth: {
      user: "quickcardsproject@zohomail.com",
      pass: "quickcards123",
    },
  });


  await transporter.sendMail({
    from: "quickcardsproject@zohomail.com",
    to: to,
    subject: subject,
    text: text
  });
}


const multerStorage = multer.diskStorage({
    destionation: (req, file, cb) => {
        cb(null, 'uploads/users')
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1]
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
    },
})

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Not an image! Please upload only images', 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find()
        res.status(200).json({ data: users, status: 'success' })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        console.log(req.body.name)
        res.json({ data: user, status: 'success' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json({ data: user, status: 'success' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body);
        res.json({ data: user, status: 'success' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id, req.body);
        await App.deleteMany({ owner_id: user._id });
        res.json({ data: user, status: 'success' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const filterObj = (obj, ...allowedFields) => {
    const newObj = {}
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el]
    })

    return newObj
}


exports.updateMe = async (req, res, next) => {
    try {

        //create error if user POSTS password data
        if (req.body.password || req.body.passwordConfirm) {
            return next(
                new AppError(
                    'This route is not for password updates. Please use /updateMyPassword',
                    400
                )
            )
        }

        //filtered out unwanted field names that are not allowed to be updated
        const filteredBody = filterObj(req.body, 'name', 'email')

        const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: 'success',
            data: { user: updatedUser }
        })
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.resetPassword = async (req, res) => {
    const password = Math.floor(10000000 + Math.random() * 90000000);

    try {
        const app = await User.findOneAndUpdate({"email" : req.body.email}, {"password": password.toString(), "passwordConfirm": password.toString()});
        console.log(app);
        await sendEmail(req.body.email, "New password", password.toString());
        res.status(200).json({'status':'sucess'})
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("error", err)
    }
}