const express = require('express');
const router = express.Router();
const gems = require('../controllers/gems');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateHiddengems } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Hiddengems = require('../models/gem');

router.route('/')
    .get(catchAsync(gems.index))
    .post(isLoggedIn, upload.array('image'), validateHiddengems, catchAsync(gems.createHiddengems))


router.get('/new', isLoggedIn, gems.renderNewForm)

router.route('/:id')
    .get(catchAsync(gems.showHiddengems))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateHiddengems, catchAsync(gems.updateHiddengems))
    .delete(isLoggedIn, isAuthor, catchAsync(gems.deleteHiddengems));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(gems.renderEditForm))



module.exports = router;