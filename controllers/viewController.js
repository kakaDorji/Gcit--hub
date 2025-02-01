const path = require ('path')


exports.getForgotPassword = (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'forgotPassword.html'))
}


exports.getTermsOfService = (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'termsOfService.html'))
}


exports.getHome = (req,res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'dashboard.html'))
}


exports.getUploadApp = (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'uploadApp.html'))
}

exports.getAppPreview = (req,res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'appPreview.html'))
}

exports.getEditApp = (req,res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'editApp.html'))
}

exports.getUsersPage = (req,res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'users.html'))
}

exports.getUserPreview = (req,res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'userPreview.html'))
}


