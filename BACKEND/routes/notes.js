const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");


let success = true;
//Route 1: for fetching the notes
router.get("/fetchnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});

//Route 2: for adding the notes

router.post(
  "/addnotes",
  fetchuser,
  [
    // this is to set validation for specific inputs
    body("title", "Enter a valid Title").isLength({ min: 1 }),
    body(
      "description",
      "Discription must have atleast five characters"
    ).isLength({
      min: 1,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // If there is any error then console that
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const notes = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNotes = await notes.save();
      success = true;
      res.send({success,savedNotes});
    } catch (err) {
      console.log(err);
      success = false;
      res.status(500).send({success,error:"Internal Server Error"});
    }
  }
);

//Route 3: for updating the notes

router.put("/updatenotes/:id", fetchuser, async (req, res) => {
  try {
  //creating notes objects
  const { title, description, tag } = req.body;
  const newNote = {};
  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }
  //find the notes to update
  let note =await Notes.findById(req.params.id);
  if (!note) {
    return res.status(404).send("Item not found");
  }
  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Not allowed");
  }
  note = await Notes.findByIdAndUpdate(req.params.id, newNote, {
    new: true,
  });
  success = true;
  res.json({success,note });
} catch (error) {
  success = false;
  res.status(500).send({success,error:"Internal Server Error"});
}
});

//Route 4: for deleting the notes

router.delete("/deletenotes/:id", fetchuser, async (req, res) => {
 try {
  
  //find the notes to delete
  let note =await Notes.findById(req.params.id);
  if (!note) {
    return res.status(404).send("Item not found");
  }
  //to check the authorized user
  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Not allowed");
  }
  note = await Notes.findByIdAndDelete(req.params.id);
  success = true;
  res.json({success,"Success": "The note has been deleted", note: note});
}catch (error) {
  console.log(error);
  success = false
  res.status(500).send({success,error:"Internal Server Error"})
}
});
module.exports = router;
