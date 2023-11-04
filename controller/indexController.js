const userController = require("./userController");
const dingerController = require("./dingerController");
var controllers = {};
controllers.user = userController;
controllers.dingerPayment = dingerController;
module.exports = controllers;