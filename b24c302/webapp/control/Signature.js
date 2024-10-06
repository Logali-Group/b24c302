sap.ui.define([
    "sap/ui/core/Control"
],function (Control) {


    return Control.extend("b24c302.control.Signature",{

        metadata: {
            properties: {
                "width":{
                    type: "sap.ui.core.CSSSize",
                    defaultValue: "400px"
                },
                "height":{
                    type: "sap.ui.core.CSSSize",
                    defaultValue: "100px"
                },
                "bg":{
                    type: "sap.ui.core.CSSColor",
                    defaultValue: "white"
                }
            }
        },

        init: function () {

        },

        renderer: function (oRM, oCOntrol) {
            oRM.write("<div");
                oRM.addStyle("width", oCOntrol.getProperty("width"));
                oRM.addStyle("height", oCOntrol.getProperty("height"));
                oRM.addStyle("background-color", oCOntrol.getProperty("bg"));
                oRM.addStyle("border", "1px solid black");
                oRM.writeStyles();
                oRM.write(">");
                oRM.write("<canvas width="+oCOntrol.getProperty("width")+" height="+oCOntrol.getProperty("height")+"></canvas>");
            oRM.write("</div>");
        },

        onAfterRendering: function () {
            let oCanvas = document.querySelector("canvas");
            console.log(oCanvas);
            console.log(new SignaturePad(oCanvas));

            try {
                this.signature = new SignaturePad(oCanvas);
                this.signature.fill = false;
                let $this = this;
                oCanvas.addEventListener("pointerdown", function () {
                    console.log("Usted acaba de dibujar su firma");
                    $this.signature.fill = true;
                });
            } catch (err) {
                console.log(err);
            }
        },

        clear: function () {
            this.signature.clear();
            this.signature.fill = false;
        },

        isFill: function () {
            return this.signature.fill;
        },

        getSignature: function () {
            return this.signature.toDataURL();
        },

        setSignature: function (oSignature) {
            this.signature.fromDataURL(oSignature);
        }

    });
});