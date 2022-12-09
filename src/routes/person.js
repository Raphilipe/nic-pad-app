const express = require("express");
const router = express.Router();
const personController = require("../controllers/personController");
const auth = require("../middleware/auth");

router.get('/', auth, async (req, res, next) => {
    personController.getPerson(req, res);
});

router.post('/', auth, async (req, res, next) => {
    personController.createPerson(req, res);
});

router.delete('/', auth, async (req, res, next) => {
    personController.removePerson(req, res);
});

router.put('/', auth, async (req, res, next) => {
    personController.updatePerson(req, res);
});

module.exports = router;


