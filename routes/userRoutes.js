const express = require('express');
const { fetchAll, createContact, updateContact, deleteContact } = require('../controllers/UserController');
const router = express.Router();

router.get("/", fetchAll);
router.post("/", createContact);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

module.exports = router;