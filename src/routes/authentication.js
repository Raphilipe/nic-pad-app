const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post('/register', async (req, res) => {
    userController.createUser(req, res);
});

router.get('/activate', async (req, res) => {
    var activated = await userController.activateUser(req, res);
    res.redirect("/activationStatus?" + activated);
});

router.post('/login', async (req, res) => {
    userController.authenticateUser(req, res);
});

router.get('/logout', async (req, res) => {
    userController.disconnectUser(req, res);
});

module.exports = router;