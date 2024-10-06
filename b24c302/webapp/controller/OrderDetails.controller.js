sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
],function (Controller, History) {

    return Controller.extend("b24c302.controller.OrderDetails",{
        
        onInit: function () {
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteDetails").attachPatternMatched(this._oObjectMatched, this);
        },

        _oObjectMatched: function (oEvent) {
            let oView = this.getView();
            //let oParameters = oEvent.getParameters().arguments;
            let oParameter = oEvent.getParameter("arguments");
            let ID = oParameter.ID;

            oView.bindElement({
                path: "/Orders("+ID+")",
                model: 'northwind',
                events: {
                    dataReceived: function (oEvent) {
                        let oObject = oEvent.getParameter("data");
                        const sOrderID = oObject.OrderID.toString();
                        const sEmployeeID = oObject.EmployeeID.toString();
                        this._readSignature(sOrderID,sEmployeeID);
                    }.bind(this)
                }
            });
        },

        onNavToBack: function () {
            let oHistory = History.getInstance();
            let sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMain");
            }
        },

        onClearSignature: function () {
            let oSignature = this.byId("signature");
            console.log(oSignature);
                oSignature.clear();
        },

        onSaveSignature: function () {
            let oSignature = this.byId("signature");
            let sImage;

            if (!oSignature.isFill()) {
                sap.m.MessageBox.error("Por favor, coloque su firma");
            } else {
                sImage = oSignature.getSignature().replace("data:image/png;base64,", "");
                // this.getModel("erp13").getData();
                let oBindingContext = this.getView().getBindingContext("northwind");
                let oObject = {
                    OrderId: oBindingContext.getProperty("OrderID").toString(),
                    EmployeeId: oBindingContext.getProperty("EmployeeID").toString(),
                    SapId: this.getOwnerComponent().getEmail(),
                    MimeType: 'image/png',
                    MediaContent: sImage
                };

                const oModel = this.getView().getModel("erp13");
                const sUrl = "/SignatureSet";
                    oModel.create(sUrl, oObject, {
                        success: function () {
                            sap.m.MessageBox.information("Todo Ok!");
                        },
                        error: function () {
                            sap.m.MessageBox.error("Ocurrió un error durante el proceso");
                        }
                    });
                console.log(oObject);
            }
        },

        _readSignature: function (sOrderID, sEmployeeID) {
            const oModel = this.getView().getModel("erp13");
            const sEmail = this.getOwnerComponent().getEmail();
            //SignatureSet(OrderId='010258',SapId='logali@gmail.com',EmployeeId='0001')
            const sUrl = "/SignatureSet(OrderId='"+sOrderID+"',SapId='"+sEmail+"',EmployeeId='"+sEmployeeID+"')";

            oModel.read(sUrl, {
                success: function (data) {
                    console.log(data);
                    let oSignature = this.byId("signature");
                    if (data.MediaContent !== '') {
                        oSignature.setSignature("data:image/png;base64,"+data.MediaContent);
                    }
                }.bind(this),
                error: function (error) {
                    console.log(error);
                    sap.m.MessageBox.error("Ocurrió un error durante el proceso");
                }
            }); 
        }

    });
});