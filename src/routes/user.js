const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.get('/', auth, async (req, res) => {
    userController.getUser(req, res);
});

router.put('/', auth, async (req, res) => {
    userController.updateUser(req, res);
});

router.put('/changePass', auth, async (req, res) => {
    userController.changePassword(req, res);
});

router.post('/forgotPass', async (req, res) => {
    userController.sendPasswordReset(req, res);
});

router.get('/resetPass', async (req, res) => {
    var validToken = await userController.checkResetPassTokenValid(req, res);
    if (validToken !== null && validToken !== "") {
        res.redirect("/resetPassword?" + validToken);
    } else {
        res.redirect("/");
    }
});

router.put('/resetPass', async (req, res) => {
    userController.resetPassword(req, res);
});

module.exports = router;