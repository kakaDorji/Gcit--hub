const App = require('./../models/AppModel')
const Comment = require('./../models/comment')
const multer = require('multer');
const AppError = require('./../utils/appError')
const fs = require('fs-extra');
const path = require('path')

// Configure the destination and file name for uploaded files
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        let path = `uploads/apps/${req.params.id}`
        if (file.fieldname === "screenshots") {
            path += '/screenshots'
        }
        //   await fs.mkdir(path, { recursive: true });
        fs.ensureDirSync(path);
        cb(null, path);
    },
    filename: (req, file, cb) => {
        if (file.fieldname === "icon") {
            var ext = path.extname(file.originalname);
            cb(null, `icon${ext}`);
        }
        else if (file.fieldname === "app") {
            cb(null, `app.apk`);
        }
        else if (file.fieldname === "screenshots") {
            cb(null, file.originalname);
        }
    },
});

exports.uploadAppFiles = multer({
    storage: storage,
    fileFilter: async function (req, file, callback) {
        try {
            var ext = path.extname(file.originalname);
            if (file.fieldname === "icon" || file.fieldname === "screenshots") {
                if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.webp') {
                    return callback(new AppError('Only images are allowed', 404))
                }
            } else {
                if (ext !== '.apk') {
                    return callback(new AppError('Only apks are allowed', 404))
                }
            }

            var body = {}
            if (file.fieldname === "icon") {
                body['app_icon'] = `/uploads/apps/${req.params.id}/icon${ext}`
            }
            else if (file.fieldname === "app") {
                body['app_path'] = `/uploads/apps/${req.params.id}/app.apk`
                body['app_size'] = req.params.size
            }

            try {
                if (file.fieldname === "icon") {
                    const result = await App.findByIdAndUpdate(req.params.id, body);
                    fs.rmSync(`uploads/apps/${req.params.id}/icon.${result.app_icon.split('.').pop()}`, { recursive: true, force: true });
                }
                else if (file.fieldname === "app") {
                    const result = await App.findByIdAndUpdate(req.params.id, body);
                    fs.rmSync(`uploads/apps/${req.params.id}/app.apk`, { recursive: true, force: true });
                }

                callback(null, true)
            }
            catch (err) {
                callback(new AppError(err, 404))
            };
        } catch (err) {
            callback(err, false)
        }
    }
});

exports.getAllApps = async (req, res, next) => {
    try {
        const apps = await App.find()
        res.status(200).json({ data: apps, status: 'success' })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getUserApps = async (req, res, next) => {
    try {
        const apps = await App.find({owner_id: req.params.userid})
        res.status(200).json({ data: apps, status: 'success' })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.createApp = async (req, res) => {
    try {
        const app = await App.create(req.body);
        // next()
        res.json({ data: app, status: 'success' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getApp = async (req, res) => {
    try {
        const app = await App.findById(req.params.id);
        res.json({ data: app, status: 'success' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.updateApp = async (req, res) => {
    try {
        console.log("req body", req.body)
        const app = await App.findByIdAndUpdate(req.params.id, req.body);
        res.json({ data: app, status: 'success' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteApp = async (req, res) => {
    try {
        const app = await App.findByIdAndDelete(req.params.id, req.body);
        res.json({ data: app, status: 'success' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteIcon = async (req, res) => {
    try {
        const app = await App.findByIdAndUpdate(req.params.id, {'app_icon': ''});
        fs.rmSync(`uploads/apps/${req.params.id}/icon.${app.app_icon.split('.').pop()}`, { recursive:true, force: true });
        res.json({ data: app, status: 'success' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteFile = async (req, res) => {
    try {
        const app = await App.findByIdAndUpdate(req.params.id, {'app_path': '', 'app_size': 0});
        fs.rmSync(`uploads/apps/${req.params.id}/app.apk`, { recursive:true, force: true });
        res.json({ data: app, status: 'success' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteScreenshots = async (req, res) => {
    try {
        const app = await App.findByIdAndUpdate(req.params.id, {'screenshots': []});
        fs.rmSync(`uploads/apps/${req.params.id}/screenshots`, { recursive:true, force: true });
        res.json({ data: app, status: 'success' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    
}

exports.postComment = async (req,res) => {
    console.log(req.body)
    const comment = await Comment.create(req.body);
    console.log(comment)
    res.status(200).json({ data: comment, status: 'success' });
}
exports.getComments = async (req, res) => {
    try {
        const { appId } = req.params;
        
        const comments = await Comment.find({ appId })
            .sort({ createdAt: -1 })  // Newest first
            .exec();
            
        res.status(200).json({
            success: true,
            data: comments
        });
    } catch (error) {
        console.error('Error in getComments:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching comments',
            error: error.message
        });
    }
};
