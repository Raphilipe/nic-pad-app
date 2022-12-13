sap.ui.define(
	[
		"./BaseController",
		"sap/ui/Device",
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast",
		"sap/ui/core/UIComponent",
		"sap/ui/core/routing/History",
	],
	function (
		BaseController,
		Device,
		Controller,
		Filter,
		FilterOperator,
		JSONModel,
		MessageToast,
		UIComponent,
		History
	) {
		"use strict";

		return BaseController.extend("sap.ui.demo.todo.controller.Login", {
			onInit: function () {
				this.getRouter()
					.getRoute("login")
					.attachMatched(this._onRouteMatched, this);
			},

			_onRouteMatched: function (oEvent) {
				jQuery.sap.delayedCall(500, this, function () {
					this.getView().byId("inputUser").focus();
				});
				this.getView().setModel(
					new JSONModel({
						User: "",
						Password: "",
					}),
					"loginView"
				);
				var oViewModel = this.getView().getModel("appView");
				oViewModel.setProperty("/enableMenu", false);
			},

			onLogin: function () {
				var oModel = this.getView().getModel("loginView");
				var aCredentials = oModel.getData();
				var that = this;
				// var aData = jQuery.ajax({
				jQuery.ajax({
					type: "POST",
					url: "/authentication/login",
					dataType: "json",
					data: aCredentials,
					async: false,
					success: function (response, status) {
						that.setUserData(response.userData);
						that.setUserToken(response.token);
						that.setUserTheme(true);
						that.getRouter().navTo("home");
					},
					error: function (error) {
						if (error.responseJSON.msg) {
							MessageToast.show(error.responseJSON.msg);
						}
					},
				});
			},

			onRegister: function () {
				this.getRouter().navTo("register");
			},

			onForgotPassword: function () {
				this.getRouter().navTo("userForgotPass");
			},
		});
	}
);
