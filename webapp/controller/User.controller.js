sap.ui.define([
	"./BaseController",
	"sap/ui/Device",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (BaseController, Device, Controller, Filter, FilterOperator, JSONModel, MessageToast, MessageBox) {
	"use strict";

	return BaseController.extend("sap.ui.demo.todo.controller.User", {

		onInit: function () {
			var oViewModel = new JSONModel({
			});
			this.setModel(oViewModel, "userView");
			this.getRouter().getRoute("user").attachMatched(this._onRouteMatched, this);
		},

		onChangePassword: function () {
			var userData = this.getView().getModel("userModel").getData();
			this.getRouter().navTo("userChangePass", {
				objectId: userData._id
			});
		},

		onNavBack: function () {
			this.getRouter().navTo("home", {}, true);
		},

		_onRouteMatched: function (oEvent) {
			var userData = this.getUserData();
			var oUserModel = new sap.ui.model.json.JSONModel();
			oUserModel.setData({
				_id: userData._id,
				user: userData.user,
				firstName: userData.firstName,
				lastName: userData.lastName
			});
			this.getView().setModel(oUserModel, "userModel");
		}
	});
});
