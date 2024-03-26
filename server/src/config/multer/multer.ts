import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let customLocation = `./data/${file.fieldname}`;
    fs.mkdirSync(customLocation, { recursive: true });
    cb(null, customLocation);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname);
    cb(null, `${timestamp}${fileExtension}`);
  },
});
const upload = multer({ storage: storage });

export default upload;
