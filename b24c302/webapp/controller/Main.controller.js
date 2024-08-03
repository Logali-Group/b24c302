sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("b24c302.controller.Main",{

        onInit: function () {
            
            this._loadCountries();
            this._loadEmployees();
            this._loadLayouts();

            this.oEventBus = sap.ui.getCore().getEventBus();
            this.oEventBus.subscribe("flexible","showEmployeeDetails", this.showEmployeeDetails.bind(this));
        },

        _loadCountries: function () {
            let oModelCountries = new JSONModel();
                oModelCountries.loadData("../model/Countries.json");
            this.getView().setModel(oModelCountries, "jsonCountries");
        },

        _loadEmployees: function () {
            let oModelCountries = new JSONModel();
                oModelCountries.loadData("../model/Employees.json");
            this.getView().setModel(oModelCountries, "jsonEmployees");
        },

        _loadLayouts: function () {
            let oModelCountries = new JSONModel();
                oModelCountries.loadData("../model/Layouts.json");
                this.getView().setModel(oModelCountries, "jsonLayout");
        },
        //Este método lo quiero compartir con culquier otro controlador
        showEmployeeDetails: function (sChannelId, sEventId, oBindingContext) {
            let oDetails = this.getView().byId("details");
                oDetails.bindElement("jsonEmployees>"+oBindingContext.getPath());
            this.getView().getModel("jsonLayout").setProperty("/ActiveCode", "TwoColumnsMidExpanded");

            let oIncidenceModel = new JSONModel([]);
                oDetails.setModel(oIncidenceModel, "incidenceModel");
                oDetails.byId("tableIncidence").removeAllContent();
        }
    });

});