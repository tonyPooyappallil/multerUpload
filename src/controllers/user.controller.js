const express = require("express");

fs = require("fs");

const upload = require("../middlewares/file-upload");

const router = express.Router();

const User = require("../models/user.model");
const Gallery = require("../models/gallery.model");

//creating user

router.post("/create", upload.single("profilePic"), async function (req, res) {
  const user = await User.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    profile_pic: req.file.path,
  });

  return res.status(201).send(user);
});

//updating user data

router.patch(
  "/update/:id",
  upload.single("profilePic"),
  async function (req, res) {
    var user = await User.findById(req.params.id);

    //console.log(String(user.profile_pic[0]));
    fs.unlink(user.profile_pic[0], function () {
      return;
    });
    //fs.unlinkSync(path);
    let out = await User.findByIdAndUpdate(req.params.id, {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      profile_pic: req.file.path,
    })
      .lean()
      .exec();

    return res.status(201).send(out);
  }
);

//deleting user

router.delete("/:id", upload.single("profilePic"), async function (req, res) {
  var user = await User.findById(req.params.id);

  //console.log(String(user.profile_pic[0]));
  fs.unlink(user.profile_pic[0], function () {
    return;
  });

  let out = await User.findByIdAndDelete(req.params.id).lean().exec();

  return res.status(201).send(out);
});

//adding photos to gallery

router.post(
  "/gallery",
  upload.fields([{ name: "images", maxCount: 5 }]),
  async function (req, res) {
    // console.log(req.files.images);

    const filePaths = req.files.images.map((file) => file.path);

    const user = await Gallery.create({
      user_id: req.body.user_id,
      pictures: filePaths,
    });

    return res.status(201).send(user);
  }
);

//Deleting photos from the gallery

router.delete("/gallery/:id", async function (req, res) {
  var gallery = await Gallery.findById(req.params.id);

  //console.log(String(user.profile_pic[0]));

  await gallery.pictures.forEach((element) => {
    fs.unlink(element, function () {
      return;
    });
  });
  // gallery.pictures = [];
  gallery = await Gallery.findByIdAndUpdate(req.params.id, { pictures: [] });

  return res.status(201).send(gallery);
});

module.exports = router;
