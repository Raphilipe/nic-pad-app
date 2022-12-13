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
		"sap/m/MessageBox",
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
		History,
		MessageBox
	) {
		"use strict";

		return BaseController.extend("sap.ui.demo.todo.controller.Register", {
			onInit: function () {
				this.getRouter()
					.getRoute("register")
					.attachMatched(this._onRouteMatched, this);
				this.getView().setModel(
					new JSONModel({
						User: "",
						Password: "",
					}),
					"registerView"
				);
			},

			_onRouteMatched: function (oEvent) {
				jQuery.sap.delayedCall(500, this, function () {
					this.getView().byId("inputUser").focus();
				});
			},

			onRegister: function () {
				var oModel = this.getView().getModel("registerView");
				var aCredentials = oModel.getData();
				var that = this;
				// var aData = jQuery.ajax({
				jQuery.ajax({
					type: "POST",
					url: "/authentication/register",
					dataType: "json",
					data: aCredentials,
					async: false,
					success: function (response, status) {
						if (response.msg) {
							MessageBox.success(response.msg, {
								onClose: function () {
									that.getRouter().navTo("login");
								},
							});
						}
					},
					error: function (error) {
						if (error.responseJSON.msg) {
							MessageToast.show(error.responseJSON.msg);
						}
					},
				});
			},

			onNavBack: function () {
				this.getRouter().navTo("login", {}, true);
			},
		});
	}
);
