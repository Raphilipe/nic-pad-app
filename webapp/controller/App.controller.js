sap.ui.define(
	[
		"./BaseController",
		"sap/ui/Device",
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/Fragment",
		"sap/ui/core/Popup",
		"sap/m/Dialog",
		"sap/m/Button",
		"sap/m/FormattedText",
		"sap/m/MessageToast",
	],
	function (
		BaseController,
		Device,
		Controller,
		Filter,
		FilterOperator,
		JSONModel,
		Fragment,
		Popup,
		Dialog,
		Button,
		FormattedText,
		MessageToast
	) {
		"use strict";

		return BaseController.extend("sap.ui.demo.todo.controller.App", {
			onInit: function () {
				sap.ui.getCore().userData = null;
				sap.ui.getCore().userToken = null;
				var oViewModel = new JSONModel({
					enableMenu: false,
				});
				this.setModel(oViewModel, "appView");
				//var currentlocale = Intl.DateTimeFormat().resolvedOptions().locale;
				//sap.ui.getCore().getConfiguration().setLanguage(currentlocale);
			},

			handlePressUserMenu: function (oEvent) {
				var oButton = oEvent.getSource();
				var oView = this.getView();
				var menuItemText;
				var currentTheme = sap.ui
					.getCore()
					.getConfiguration()
					.getTheme();
				var userData = this.getUserData();
				var userName = userData.firstName + userData.lastName;
				if (currentTheme === "sap_horizon") {
					menuItemText =
						this.getResourceBundle().getText("turnLightsOff");
				} else {
					menuItemText =
						this.getResourceBundle().getText("turnLightsOn");
				}
				if (!this._userMenu) {
					Fragment.load({
						id: oView.getId(),
						name: "sap.ui.demo.todo.view.MenuItemUser",
						controller: this,
					}).then(
						function (oMenu) {
							this._userMenu = oMenu;
							this.getView().addDependent(this._userMenu);
							this.getView()
								.byId("menuItemChangeTheme")
								.setText(menuItemText);
							this.getView()
								.byId("menuItemUserName")
								.setText(userName);
							this._userMenu.open(
								this._bKeyboard,
								oButton,
								Popup.Dock.BeginTop,
								Popup.Dock.BeginBottom,
								oButton
							);
						}.bind(this)
					);
				} else {
					this.getView()
						.byId("menuItemChangeTheme")
						.setText(menuItemText);
					this._userMenu.open(
						this._bKeyboard,
						oButton,
						Popup.Dock.BeginTop,
						Popup.Dock.BeginBottom,
						oButton
					);
				}
			},

			onHelpPress: function () {
				window.open("documents/UserGuide.pdf", "_blank");
			},

			onVersionPress: function (oEvent) {
				var that = this;
				$.get(
					"documents/changelog.html",
					function (data) {
						that._showChangeLog(data);
					},
					"text"
				);
			},

			onHandleThemePress: function (oEvent) {
				this.setUserTheme(false);
			},

			onLogoutPress: function () {
				var that = this;
				this.setUserToken("");
				$.ajax({
					type: "GET",
					url: "/authentication/logout",
					async: false,
					success: function (data, status) {
						MessageToast.show(data.msg, { duration: 6000 });
						that.getRouter().navTo("login");
					},
					error: function (error) {},
				});
			},

			onUserPress: function () {
				this.getRouter().navTo("user");
			},

			_showChangeLog: function (content) {
				var title = this.getResourceBundle().getText("changeLogTitle");
				var text = this.getResourceBundle().getText("changeLogBtnOk");
				var dialog = new Dialog({
					title: title,
					type: "Message",
					content: new FormattedText({
						htmlText: content,
					}),
					beginButton: new Button({
						text: text,
						press: function () {
							dialog.close();
						},
					}),
					afterClose: function () {
						dialog.destroy();
					},
				});
				dialog.open();
			},
		});
	}
);
