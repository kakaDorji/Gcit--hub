const express = require('express')
const appController = require('./../controllers/appController');
const multer = require('multer');
const router = express.Router()
const App = require('./../models/AppModel')


router
  .route('/')
  .get(appController.getAllApps)
  .post(appController.createApp)


router
  .route('/owner/:userid')
  .get(appController.getUserApps)

router
  .route('/:id')
  .get(appController.getApp)
  .patch(appController.updateApp)
  .delete(appController.deleteApp)

router
  .route('/:id/file/:size')
  .post(appController.uploadAppFiles.single('app'), (req, res) => {
    res.json({ status: 'success' });
  })
router
  .route('/:id/file')
  .delete(appController.deleteFile)


router
  .route('/:id/icon')
  .post(appController.uploadAppFiles.single('icon'), async (req, res) => {
    res.json({ status: 'success' });
  })
  .delete(appController.deleteIcon)

router
  .route('/:id/screenshots')
  .post(appController.uploadAppFiles.array('screenshots', 10), async (req, res) => {
    var screenshots = []
    req.files.forEach(file => {
      screenshots.push(`/uploads/apps/${req.params.id}/screenshots/` + file.originalname);
    });
    await App.findByIdAndUpdate(req.params.id, { 'screenshots': screenshots });
    res.json({ status: 'success' });
  })
  .delete(appController.deleteScreenshots)


  router.post("/postComment", appController.postComment)
  router.get('/getComments/:appId', appController.getComments);

module.exports = router;
