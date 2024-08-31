sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter"
],function (Controller, formatter) {
    "use strict";

    return Controller.extend("b24c302.controller.EmployeeDetails",{

        myFormatter: formatter,

        onInit: function () {
            this.oEventBus = sap.ui.getCore().getEventBus();
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

        },

        onSaveIncidence: function (oEvent) {

            let oSource = oEvent.getSource().getParent().getParent();
            let oBindingContext = oSource.getBindingContext("incidenceModel");
            this.oEventBus.publish("incidence","onSaveODataIncidence",oBindingContext);

            // console.log(oSource);
            // let oModelIncidence = this.getView().getModel("incidenceModel");
            // console.log(oModelIncidence.getData());
        },

        updateIncidenceCreationDate: function (oEvent) {
            let oSource = oEvent.getSource(),
                oBindingContext = oSource.getBindingContext("incidenceModel"),
                oObject = oBindingContext.getObject();
                oObject.CreationDateX = true;
        },

        updateIncidenceReason: function (oEvent) {
            let oSource = oEvent.getSource(),
                oBindingContext = oSource.getBindingContext("incidenceModel"),
                oObject = oBindingContext.getObject();
                oObject.ReasonX = true;
        },

        updateIncidenceType: function (oEvent) {
            let oSource = oEvent.getSource(),
                oBindingContext = oSource.getBindingContext("incidenceModel"),
                oObject = oBindingContext.getObject();
                oObject.TypeX = true;
        },

        onDeleteIncidence: function (oEvent) {
            let oSource = oEvent.getSource().getParent().getParent();
            let oBindingContext = oSource.getBindingContext("incidenceModel");
            this.oEventBus.publish("incidence","onDeleteIncidence",oBindingContext);
        }

    });
});