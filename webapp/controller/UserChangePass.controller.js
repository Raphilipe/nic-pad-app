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

	return BaseController.extend("sap.ui.demo.todo.controller.UserChangePass", {

		onInit: function () {
			var oViewModel = new JSONModel({
			});
			this.setModel(oViewModel, "userChangePassView");
			this.getRouter().getRoute("userChangePass").attachMatched(this._onRouteMatched, this);
		},

		onSave: function () {
			var that = this;
			var token = this.getUserToken();
			var aChangePass = this.getView().getModel("changePassModel").getData();
			jQuery.ajax({
				type: "PUT",
				headers: { "Authorization": token },
				url: "/user/changePass" + "?_id=" + aChangePass._id,
				dataType: "json",
				data: aChangePass,
				async: false,
				success: function (response, status) {
					if (response.msg) {
						MessageBox.success(response.msg, {
							onClose: function () {
								that.getRouter().navTo("user");
							}
						});
					}
				},
				error: function (error) {
					if (error.responseJSON.msg) {
						MessageToast.show(error.responseJSON.msg);
					}
					if (error.status === 401) {
						that.getRouter().navTo("login");
					}
				}
			});
		},

		onNavBack: function () {
			this.getRouter().navTo("user", {}, true);
		},

		_onRouteMatched: function (oEvent) {
			jQuery.sap.delayedCall(500, this, function () { this.getView().byId("inputCurrentPassword").focus(); });
			var sObjectId = oEvent.getParameter("arguments").objectId;
			var oChangePassModel = new sap.ui.model.json.JSONModel();
			oChangePassModel.setData({
				_id: sObjectId,
				currentPassword: "",
				newPassword: "",
				newPasswordCheck: ""
			});
			this.getView().setModel(oChangePassModel, "changePassModel");
		}
	});
});
