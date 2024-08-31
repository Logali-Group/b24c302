sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
     "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],function (Controller, JSONModel, MessageToast, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("b24c302.controller.Main",{

        onInit: function () {
            
            this._loadEmployees();
            this._loadLayouts();

            this.oEventBus = sap.ui.getCore().getEventBus();
            this.oEventBus.subscribe("flexible","showEmployeeDetails", this.showEmployeeDetails.bind(this));
            this.oEventBus.subscribe("incidence","onSaveODataIncidence", this.onSaveODataIncidence.bind(this));
            this.oEventBus.subscribe("incidence", "onDeleteIncidence", this.onDeleteIncidence.bind(this));
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

            //Llamar al método onRead
            // Obtener el ID del empleado desde el BindingContext
            let sEmployeeID = oBindingContext.getProperty("EmployeeID");
            this.onReadOdataIncidence(sEmployeeID);
        },

        onDeleteIncidence: function (sChannel, sEventId, oBindingContext) {

            let sIncidenceId = oBindingContext.getProperty("IncidenceId");
            let sSAPID = this.getOwnerComponent().getEmail();
            let sEmployeeId = oBindingContext.getProperty("EmployeeId");

            let sUrl = "/IncidentsSet(IncidenceId='"+sIncidenceId+"',SapId='"+sSAPID+"',EmployeeId='"+sEmployeeId+"')";
            let oModel = this.getOwnerComponent().getModel("erp13");

            oModel.remove(sUrl, {
                success: function () {
                    this.onReadOdataIncidence(sEmployeeId);
                    MessageToast.show("El registro fue eliminado correctametne");                
                }.bind(this),
                error: function () {
                    console.log(error);
                    MessageToast.show("Ocurrió un error durante la operación");
                }
            })

        },

        onSaveODataIncidence: function (sChannel, sEventId, oBindingContext) {

            let oDetails = this.getView().byId("details"),
                oBindingContextDetails = oDetails.getBindingContext("northwind");

            if (oBindingContext.getProperty("IncidenceId") === undefined) {
                console.log("Vamos a guardar");
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
                let sUrl = "/IncidentsSet",
                    $this = this,           // Variable tipo jQuery
                    oThis = this;           // Variable tipo JavaScript

                    oModel.create(sUrl, oData, {
                        success: function () {
                            this.onReadOdataIncidence(oBindingContextDetails.getProperty("EmployeeID"));
                            MessageToast.show("OK");
                        }.bind(this),
                        error: function () {
                            MessageToast.show("Failed");
                        }
                    });
            } else if (oBindingContext.getProperty("CreationDateX") || oBindingContext.getProperty("TypeX") || oBindingContext.getProperty("ReasonX")) {
                console.log("Vamos actualizar");
                let oData = {
                    CreationDate: oBindingContext.getProperty("CreationDate"),
                    CreationDateX: oBindingContext.getProperty("CreationDateX"),
                    Type: oBindingContext.getProperty("Type"),
                    TypeX: oBindingContext.getProperty("TypeX"),
                    Reason: oBindingContext.getProperty("Reason"),
                    ReasonX: oBindingContext.getProperty("ReasonX")
                };
                let oModel = this.getOwnerComponent().getModel("erp13");

                let sIncidenceId = oBindingContext.getProperty("IncidenceId");
                let sSAPID = this.getOwnerComponent().getEmail();
                let sEmployeeId = oBindingContext.getProperty("EmployeeId");

                let sUrl = "/IncidentsSet(IncidenceId='"+sIncidenceId+"',SapId='"+sSAPID+"',EmployeeId='"+sEmployeeId+"')";

                oModel.update(sUrl, oData, {
                    success: function (data) {
                        console.log(data);
                        this.onReadOdataIncidence(sEmployeeId);
                        MessageToast.show("La actualización fue realizada de forma correcta");
                    }.bind(this),
                    error: function (error) {
                        console.log(error);
                        MessageToast.show("Ocurrió un error durante la operación");
                    }
                })
            }

        },

        onReadOdataIncidence: function (iEmployeeID) {
            let oDetails = this.getView().byId("details");
            let oModel = this.getView().getModel("erp13");
            //let oModel1 = this.getOwnerComponent().getModel("erp13");
            let sUrl = "/IncidentsSet";

            //Método para acceder al Component.js desde cualquier controlador ---> this.getOwnerComponent()

            oModel.read(sUrl, {
                filters:[
                    new Filter("SapId", FilterOperator.EQ, this.getOwnerComponent().getEmail()),
                    new Filter("EmployeeId", FilterOperator.EQ, iEmployeeID)
                ],success: function (data) {
                    console.log(data);
                    //Seteo de datos
                    let oModelIncidenceModel = oDetails.getModel("incidenceModel");
                        oModelIncidenceModel.setData(data.results);
                    //Limpieza del formulario
                    let oTableIncidence = oDetails.byId("tableIncidence");
                        oTableIncidence.removeAllContent();

                    for (let incidence in data.results) {
                        let oNewFragment = sap.ui.xmlfragment("b24c302.fragment.NewIncidence", oDetails.getController());
                        oDetails.addDependent(oNewFragment);
                        //Binding Context --> Que se enlaza por medio del bindElement
                        oNewFragment.bindElement("incidenceModel>/"+incidence);
                        oTableIncidence.addContent(oNewFragment);
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            })
        }
    });

});