sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("sap.ui.demo.todo.controller.NotFound", {

        onLinkPressed: function () {
            this.getRouter().navTo("home");
        }
    });
});