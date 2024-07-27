sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment"
],
function (Controller, Filter, FilterOperator, Fragment) {
    "use strict";

    return Controller.extend("b24c302.controller.MasterEmployee", {

        onInit: function () {
            this.oEventBus = sap.ui.getCore().getEventBus();
        },

        onValidate: function () {
            let oInput = this.getView().byId("inputEmployee"),
                sValue = oInput.getValue();

            if (sValue.length === 6) {
                oInput.setDescription("OK");
            } else {
                oInput.setDescription("Not OK");
            }
        },

        onFilter: function () {

            let oModelCountries = this.getView().getModel("jsonCountries"),
                sEmployee = oModelCountries.getProperty("/EmployeeId"),
                sCode = oModelCountries.getProperty("/CountryCode");

            let aFilters = [];

            if (sEmployee) {
                aFilters.push(new Filter("EmployeeID", FilterOperator.Contains, sEmployee));
            }

            if (sCode) {
                aFilters.push(new Filter("Country", FilterOperator.EQ, sCode));
            }

            let oTable = this.getView().byId("table"),
                oBinding = oTable.getBinding("items");
                oBinding.filter(aFilters);
        },

        onClearFilter: function () {
            this._loadCountries();
            let oTable = this.getView().byId("table"),
            oBinding = oTable.getBinding("items");
            oBinding.filter([]);
        },

        onOpenOrders: function (oEvent) {

            let oItem = oEvent.getSource(),
                oBindingContext = oItem.getBindingContext("jsonEmployees"),
                sPath = oBindingContext.getPath(),
                oView = this.getView();

                if (!this._pDialog) {
                    this._pDialog = Fragment.load({
                        id: this.getView().getId(),
                        name: "b24c302.fragment.Orders",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    }); 
                }

                this._pDialog.then(function (oDialog) {
                    oDialog.bindElement({
                        path: sPath,
                        model: 'jsonEmployees'
                    });
                    oDialog.open();
                });

            // if (!this._pDialog) {
            //     this._pDialog = sap.ui.xmlfragment("b24c302.fragment.Orders", this);
            //     this.getView().addDependent(this._pDialog);
            // }

            // this._pDialog.bindElement({
            //     path: sPath,
            //     model: 'jsonEmployees'
            // });

            // this._pDialog.open();
        },

        onCloseDialog: function () {
            this._pDialog.then(function (oDialog) {
                oDialog.close();
            });
        },

        onNavToDetails: function (oEvent) {
            let oItem = oEvent.getSource(),
                oBindingContext = oItem.getBindingContext("jsonEmployees");
            this.oEventBus.publish("flexible","showEmployeeDetails", oBindingContext);
        }
    });
});
