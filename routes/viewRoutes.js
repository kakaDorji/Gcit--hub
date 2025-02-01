const express = require('express')
const router = express.Router()
const viewsController = require('./../controllers/viewController')
const authController = require('./../controllers/authController')

router.get('/', viewsController.getHome)
router.get('/user', authController.adminProtect, viewsController.getUsersPage)
router.get('/user/:id', viewsController.getUserPreview)
router.get('/app/:id', viewsController.getAppPreview)
router.get('/app/edit/:id', authController.protect, viewsController.getEditApp)
router.get('/upload-app', authController.protect, viewsController.getUploadApp)
router.get('/forgot-password', viewsController.getForgotPassword)
router.get('/terms-of-service', viewsController.getTermsOfService)

module.exports = router