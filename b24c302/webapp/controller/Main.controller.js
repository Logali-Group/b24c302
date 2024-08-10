sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
],function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("b24c302.controller.Main",{

        onInit: function () {
            
            this._loadEmployees();
            this._loadLayouts();

            this.oEventBus = sap.ui.getCore().getEventBus();
            this.oEventBus.subscribe("flexible","showEmployeeDetails", this.showEmployeeDetails.bind(this));
            this.oEventBus.subscribe("incidence","onSaveODataIncidence", this.onSaveODataIncidence.bind(this))
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
                oDetails.bindElement("northwind>"+oBindingContext.getPath());
            this.getView().getModel("jsonLayout").setProperty("/ActiveCode", "TwoColumnsMidExpanded");

            let oIncidenceModel = new JSONModel([]);
                oDetails.setModel(oIncidenceModel, "incidenceModel");
                oDetails.byId("tableIncidence").removeAllContent();
        },

        onSaveODataIncidence: function (sChannel, sEventId, oBindingContext) {

            let oDetails = this.getView().byId("details"),
                oBindingContextDetails = oDetails.getBindingContext("northwind");

            // 1. Crear el objecto que contendra los datos a enviar
            let oData = {
                SapId: this.getOwnerComponent().getEmail(),
                EmployeeId: (oBindingContextDetails.getProperty("EmployeeID")).toString(),
                CreationDate: oBindingContext.getProperty("CreationDate"),
                Type: oBindingContext.getProperty("Type"),
                Reason: oBindingContext.getProperty("Reason")
            };

            console.log(oData);

            //let oModel = this.getView().getModel("erp13");
            let oModel = this.getOwnerComponent().getModel("erp13");
            let sUrl = "/IncidentsSet";

                oModel.create(sUrl, oData, {
                    success: function () {
                        MessageToast.show("OK");
                    },
                    error: function () {
                        MessageToast.show("Failed");
                    }
                });
        }
    });

});