sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter"
],function (Controller, formatter) {
    "use strict";

    return Controller.extend("b24c302.controller.EmployeeDetails",{

        myFormatter: formatter,

        onInit: function () {
            
        },

        onCreateIncidence: function () {
            console.log("Estoy creando la incidencia");
            let oTableIncidence = this.getView().byId("tableIncidence");
            let oNewIncidence = sap.ui.xmlfragment("b24c302.fragment.NewIncidence", this);
            let oIncidenceModel = this.getView().getModel("incidenceModel");
            let aData = oIncidenceModel.getData();
            let iIndex = aData.length;
                aData.push({
                    number: iIndex + 1
                });
                oIncidenceModel.refresh();
                oNewIncidence.bindElement("incidenceModel>/"+iIndex);
                oTableIncidence.addContent(oNewIncidence);

        }

    });
});