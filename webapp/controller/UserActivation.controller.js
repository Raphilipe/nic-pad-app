sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("sap.ui.demo.todo.controller.UserActivation", {

		onInit: function () {
			this.getRouter().getRoute("userActivation").attachMatched(this._onRouteMatched, this);
		},

		onLinkPressed: function () {
			this.getRouter().navTo("login");
		},

		_onRouteMatched: function (oEvent) {
			var activated = oEvent.getParameter("arguments").objectId,
				message = null,
				icon = null;
			if (activated == "true") {
				message = this.getResourceBundle().getText("msgUserActivated");
				icon = "sap-icon://unlocked";
			} else {
				message = this.getResourceBundle().getText("msgUserActivationInvalid");
				icon = "sap-icon://locked";
			}
			var oViewModel = new JSONModel({
				message: message,
				icon: icon
			});
			this.setModel(oViewModel, "userActivationView");
		}
	});
});