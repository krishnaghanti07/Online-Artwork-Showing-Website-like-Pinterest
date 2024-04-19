const multer = require('multer') ;
const {v4: uuidv4} = require('uuid') ;
const path = require('path') ; // To get the "Unique-id-name" extention

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null , './public/images/uploads')
    },
    filename: function (req, file, cb) {
        // To Create the "Unique-id-name" of the file "that'll be uploaded" every time
        const unique = uuidv4() ; // we'll get an "Unique-name"
        cb(null , unique + path.extname(file.originalname)) ; // getting the "extention-name" of the "original-file-name" that is uploaded
    }
}) ;
  
const upload = multer({ storage: storage }) ;

module.exports = upload ;