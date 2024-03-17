const express = require('express');
const router = express.Router();
const varietiesController = require('../controllers/varieties');

const multer = require('multer');

//SETTING THE STORAGE LOCATION AND NAMING FOR IMAGE UPLOADS
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb (null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb (null, new Date().toISOString() + file.originalname);
    }
});

//FILTERING IMAGE UPLOADS TO ACCEPT ONLY JPEG AND PNG
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb (null, true);
    } else {
        cb (null, false);
    }
}


//LIMITS OF FILESIZE IS SET TO 5MB
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

//GET ROUTES
//Route for GET every variety
router.get('/find', varietiesController.getAll);

//Route for GET a variety with id specified in the request
router.get('/find/:id', varietiesController.getById);

router.get('/random', varietiesController.getRandomVariety);

//Route for GET top 3 varieties with the best match for criteria from the request
router.post('/match', varietiesController.findMatchingVarieties);


//POST ROUTES
//Route for POST a new variety
router.post('/', upload.single('photo'), varietiesController.createNew);


//DELETE ROUTES
//Route for DELETE a variety with id specified in the request
router.delete('/:id', varietiesController.deleteById);


//PATCH ROUTES
//Route for PATCH a variety with id specified in the request
router.patch('/:id', varietiesController.updateById);


module.exports = router;