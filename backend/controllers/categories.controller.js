const asyncHandler = require("express-async-handler");
const { Category, validateCreateCategory } = require("../models/Category");

module.exports.createCategoryController = asyncHandler(async (req, res) => {
  const { error } = validateCreateCategory(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  }

  const category = await Category.create({ title: req.body.title, user: req.user.id });
  res.status(201).json(category);
})

module.exports.getAllCategoriesController = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(categories);
})

module.exports.deleteCategoryController = asyncHandler(async (req, res) => {
  const category = Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({message: "Category Not Found"});
  }
  await Category.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Category Deleted Successfully", categoryId: req.params.id });
})