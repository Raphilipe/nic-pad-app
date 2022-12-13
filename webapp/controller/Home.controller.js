sap.ui.define(
	[
		"./BaseController",
		"sap/ui/Device",
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast",
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
		MessageBox
	) {
		"use strict";

		return BaseController.extend("sap.ui.demo.todo.controller.Home", {
			onInit: function () {
				var oViewModel = new JSONModel({
					enableMenu: true,
				});
				this.setModel(oViewModel, "homeView");
				this.getRouter()
					.getRoute("home")
					.attachMatched(this._onRouteMatched, this);
			},

			onTeamsCalendar: function () {
				window.open("https://calendar-niclabs.azurewebsites.net");
			},

			onShoppingCart: function () {
				window.open("https://shopping-cart-nicpad.azurewebsites.net");
			},

			onBrowseOrders: function () {
				window.open("https://browse-orders-nicpad.azurewebsites.net");
			},

			onManageProducts: function () {
				window.open("https://manage-products-nicpad.azurewebsites.net");
			},

			onShopAdmTool: function () {
				window.open("https://shop-adm-tool-nicpad.azurewebsites.net");
			},

			onDashboard: function () {
				window.open("https://dashboard-nicpad.azurewebsites.net/");
			},

			onNavBack: function () {
				this.getRouter().navTo("login", {}, true);
			},

			_onRouteMatched: function (oEvent) {
				var oViewModel = this.getView().getModel("appView");
				oViewModel.setProperty("/enableMenu", true);
			},
		});
	}
);
