const express = require('express');
const router = express.Router();
const UserRoutes = require("./userRoutes.js");

router.use("/api/v1/contacts", UserRoutes);

module.exports=router;