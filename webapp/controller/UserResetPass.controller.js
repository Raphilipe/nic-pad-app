sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, JSONModel, MessageToast, MessageBox) {
    "use strict";

    return BaseController.extend("sap.ui.demo.todo.controller.UserResetPass", {

        onInit: function () {
            this.getRouter().getRoute("userResetPass").attachMatched(this._onRouteMatched, this);
        },

        onSave: function () {
            var that = this;
            var aChangePass = this.getView().getModel("userResetPassModel").getData();
            jQuery.ajax({
                type: "PUT",
                url: "/user/resetPass",
                dataType: "json",
                data: aChangePass,
                async: false,
                success: function (response, status) {
                    if (response.msg) {
                        MessageBox.success(response.msg, {
                            onClose: function () {
                                that.getRouter().navTo("login");
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

        _onRouteMatched: function (oEvent) {
            jQuery.sap.delayedCall(500, this, function () { this.getView().byId("inputNewPassword").focus(); });
            var token = oEvent.getParameter("arguments").objectId;
            var oResetPassModel = new JSONModel({
                resetPassToken: token,
                newPassword: "",
                newPasswordCheck: ""
            });
            this.setModel(oResetPassModel, "userResetPassModel");
        }
    });
});