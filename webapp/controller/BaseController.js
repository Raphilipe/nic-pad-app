sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/UIComponent",
		"sap/m/library",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageItem",
		"sap/m/MessageView",
		"sap/m/Button",
		"sap/m/Bar",
		"sap/m/Dialog",
		"sap/ui/core/IconPool",
		"sap/m/Text",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/core/routing/History",
		"sap/m/MessageToast",
	],
	function (
		Controller,
		UIComponent,
		mobileLibrary,
		JSONModel,
		MessageItem,
		MessageView,
		Button,
		Bar,
		Dialog,
		IconPool,
		Text,
		Filter,
		FilterOperator,
		History,
		MessageToast
	) {
		"use strict";

		// var URLHelper = mobileLibrary.URLHelper;

		return Controller.extend("sap.ui.demo.todo.controller.BaseController", {
			getRouter: function () {
				return UIComponent.getRouterFor(this);
			},

			getModel: function (sName) {
				return this.getView().getModel(sName);
			},

			setModel: function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
			},

			getResourceBundle: function () {
				return this.getOwnerComponent()
					.getModel("i18n")
					.getResourceBundle();
			},

			setUserData: function (userData) {
				sap.ui.getCore().userData = userData;
			},

			getUserData: function () {
				return sap.ui.getCore().userData;
			},

			setUserToken: function (userToken) {
				sap.ui.getCore().userToken = "Bearer " + userToken;
			},

			getUserToken: function () {
				return sap.ui.getCore().userToken;
			},

			setUserTheme: function (bInit) {
				var userData = this.getUserData(),
					dbUserData = this._getUser(userData._id),
					currentTheme = "",
					newTheme = "";
				if ("theme" in dbUserData) {
					currentTheme = dbUserData.theme;
				}
				if (currentTheme === "") {
					currentTheme = "sap_fiori_3"; //Default
				}
				if (!bInit) {
					if (currentTheme === "sap_fiori_3") {
						newTheme = "sap_fiori_3_dark";
					} else {
						newTheme = "sap_fiori_3";
					}
				} else {
					newTheme = currentTheme;
				}
				this._setTheme(bInit, userData._id, newTheme);
			},

			_getUser: function (id) {
				// var that = this;
				var token = this.getUserToken();
				var userData = null;
				$.ajax({
					type: "GET",
					headers: { Authorization: token },
					url: "/user" + "?_id=" + id,
					async: false,
					success: function (data, status) {
						if (data.length > 0) {
							userData = data[0];
						}
					},
					error: function (error) {
						if (error.responseJSON.msg) {
							MessageToast.show(error.responseJSON.msg);
						}
					},
				});
				return userData;
			},

			_setTheme: function (bInit, userId, newTheme) {
				var dialogBusy = new sap.m.BusyDialog(),
					busyText = this.getResourceBundle().getText(
						"busyTextChangeTheme"
					);
				dialogBusy.setTitle(busyText);
				if (bInit === false) {
					dialogBusy.open();
				}
				sap.ui.getCore().applyTheme(newTheme);
				// var that = this;
				var token = this.getUserToken();
				$.ajax({
					type: "PUT",
					dataType: "json",
					data: { theme: newTheme },
					headers: { Authorization: token },
					url: "/user" + "?_id=" + userId,
					async: false,
					success: function (data, status) {
						dialogBusy.close();
					},
					error: function (error) {
						if (error.responseJSON.msg) {
							MessageToast.show(error.responseJSON.msg);
						}
						dialogBusy.close();
					},
				});
			},
		});
	}
);
