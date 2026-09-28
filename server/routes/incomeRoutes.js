const express = require("express");
const { getIncome, updateIncome } = require("../controllers/incomeController");

const router = express.Router();

router.get("/", getIncome);
router.put("/", updateIncome);

module.exports = router;
