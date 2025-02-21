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
  const { id, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    if (id) {
      // Fetch specific form by ID
      const result = await Model.findById(id);
      if (result) {
        res.status(200).json({ status: 200, message: "Form fetched successfully", result });
      } else {
        res.status(404).json({ status: 404, message: "Form not found" });
      }
    } else {
      // Fetch all forms with pagination
      const total = await Model.countDocuments();
      const result = await Model.find().sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));

      const totalPages = Math.ceil(total / limit);

      res.status(200).json({
        status: 200,
        message: "Forms fetched successfully",
        result,
        meta: {
          total,
          per_page: parseInt(limit),
          current_page: parseInt(page),
          last_page: totalPages,
          first_page: 1,
          first_page_url: `/?page=1`,
          last_page_url: `/?page=${totalPages}`,
          next_page_url: page < totalPages ? `/?page=${parseInt(page) + 1}` : null,
          previous_page_url: page > 1 ? `/?page=${parseInt(page) - 1}` : null
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: 500, message: "Failed to fetch forms", error: err });
  }
});

router.put("/update/:id", (req, res) => {
  Model.findByIdAndUpdate(req.params.id, req.body)
    .then((result) => {
      res.status(200).json({ status: 200, message: "Form updated successfully" });
      console.log(result);
    }).catch((err) => {
      console.log(err);
      res.status(500).json({ status: 500, message: "Failed to update form", error: err });
    });
});

router.delete("/delete/:id", (req, res) => {
  Model.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(200).json({ status: 200, message: "Form deleted successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: 500, message: "Failed to delete form", error: err });
    });
});

module.exports = router;