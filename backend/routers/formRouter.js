const express = require("express");
const Model = require("../models/formModel");
const router = express.Router();

router.post("/create", (req, res) => {
  console.log(req.body);
  new Model(req.body)
    .save()
    .then((result) => {
      res.status(200).json({ status: 200, message: "Form created successfully", result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: 500, message: "Failed to create form", error: err });
    });
});

router.get("/get", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const total = await Model.countDocuments();
    const result = await Model.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: 200,
      message: "Forms fetched successfully",
      result,
      meta: {
        total,
        per_page: limit,
        current_page: page,
        last_page: totalPages,
        first_page: 1,
        first_page_url: `/?page=1`,
        last_page_url: `/?page=${totalPages}`,
        next_page_url: page < totalPages ? `/?page=${page + 1}` : null,
        previous_page_url: page > 1 ? `/?page=${page - 1}` : null
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: 500, message: "Failed to fetch forms", error: err });
  }
});

router.put("/update/:id", (req, res) => {
  Model.findByIdAndUpdate(req.params.id, req.body)
    .then((result) => {
      res.status(200).json({ status: 200, message: "Form updated successfully", result });
      console.log(result);
    }).catch((err) => {
      console.log(err);
      res.status(500).json({ status: 500, message: "Failed to update form", error: err });
    });
});

router.delete("/delete/:id", (req, res) => {
  Model.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(200).json({ status: 200, message: "Form deleted successfully", result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: 500, message: "Failed to delete form", error: err });
    });
});

module.exports = router;