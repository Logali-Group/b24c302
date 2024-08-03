sap.ui.define([

],function () {

    let oFormatter = {

        dateFormat: function (oDate) {
            
            let iTimeDay = 24 * 60 * 60 * 1000;

            if (oDate) {

                let oDateNow = new Date();
                let oDateFormatOnlyDate = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: 'yyyy/MM/dd'
                });
                let oDateNowFormt = new Date(oDateFormatOnlyDate.format(oDateNow));
                let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
    
                switch (true) {
                    case oDate.getTime() === oDateNowFormt.getTime():
                        return oResourceBundle.getText("today");
                    
                    case oDate.getTime() === oDateNowFormt.getTime() + iTimeDay:
                        return oResourceBundle.getText("tomorrow");
    
                    case oDate.getTime() === oDateNowFormt.getTime() - iTimeDay:
                        return oResourceBundle.getText("yesterday");
                    
                    default:
                        return 'Another Day';
                }
            }

        }

    };

    return oFormatter;
});