const express = require("express");

const upload = require("../middlewares/file-upload");

const router = express.Router();

const Gallery = require("../models/gallery.model");

router.post("/single", upload.single("profilePic"), async function (req, res) {
  const user = await User.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    profile_pic: req.file.path,
  });

  return res.status(201).send(user);
});

router.post("/gallery", upload.any("productImages"), async function (req, res) {
  const filePaths = req.files.map((file) => file.path);

  const user = await Product.create({
    title: req.body.title,
    price: req.body.price,
    image_urls: filePaths,
  });

  return res.status(201).send(user);
});

module.exports = router;
