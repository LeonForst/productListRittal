sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/thirdparty/jquery",
    "sap/ui/table/RowAction",
    "sap/ui/table/RowActionItem",
    "sap/m/MessageToast"
], function (Log, Controller, JSONModel, Filter, FilterOperator, jQuery, RowAction, RowActionItem, MessageToast) {
    "use strict";

    return Controller.extend("productListRittal.controller.ProductList", {

        onInit: function () {

            const oView = this.getView();

            let oViewModel = this.initDataModel();
            oView.setModel(oViewModel);

            var fnPress = this.handleActionPress.bind(this);

            this.mode = [
                {
                    key: "Navigation",
                    text: "Navigation",
                    handler: function(){
                        var oTemplate = new RowAction({items: [
                                new RowActionItem({
                                    type: "Navigation",
                                    press: fnPress,
                                    visible: "{Available}"
                                })
                            ]});
                        return [1, oTemplate];
                    }
                }
            ];

            this.getView().setModel(new JSONModel({items: this.mode}), "modes");
            this.setState("Navigation");

        },

        initDataModel: function () {

            let oModel = new JSONModel();

            const url = "https://api.rittal.com/v2/productcategories/de";
            let oProducts = {items: []};

            jQuery.ajax({
                method: "GET",
                url: "https://api.rittal.com/v2/productcategories/de",
                dataType: "json",
                success: function (oData) {

                    if (oData.categoryType === "PRODUCT") {
                        oProducts.items.push(oData);
                    } else {
                        oData.allSubcategories.forEach((obj) => {
                            if (obj.categoryType === "PRODUCT") {
                                oProducts.items.push(obj);
                            } else {
                                obj.allSubcategories.forEach((obj) => {
                                    if (obj.categoryType === "PRODUCT") {
                                        oProducts.items.push(obj);
                                    } else {
                                        obj.allSubcategories.forEach((obj) => {
                                            if (obj.categoryType === "PRODUCT") {
                                                oProducts.items.push(obj);
                                            } else {
                                                obj.allSubcategories.forEach((obj) => {
                                                    if (obj.categoryType === "PRODUCT") {
                                                        oProducts.items.push(obj);
                                                    } else {
                                                        obj.allSubcategories.forEach((obj) => {
                                                            if (obj.categoryType === "PRODUCT") {
                                                                oProducts.items.push(obj);
                                                            } else {
                                                                obj.allSubcategories.forEach((obj) => {
                                                                    if (obj.categoryType === "PRODUCT") {
                                                                        oProducts.items.push(obj);
                                                                    } else {
                                                                        obj.allSubcategories.forEach((obj) => {
                                                                            if (obj.categoryType === "PRODUCT") {
                                                                                oProducts.items.push(obj);
                                                                            } else {
                                                                                obj.allSubcategories.forEach((obj) => {
                                                                                    if (obj.categoryType === "PRODUCT") {
                                                                                        oProducts.items.push(obj);
                                                                                    }
                                                                                });
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                    oModel.setData(oProducts);
                },
                error: function () {
                    Log.error("failed to load json from: " + url);
                }
            })

            return oModel;
        },

        _filter : function() {
            var oFilter = null;

            if (this._oGlobalFilter && this._oPriceFilter) {
                oFilter = new Filter([this._oGlobalFilter, this._oPriceFilter], true);
            } else if (this._oGlobalFilter) {
                oFilter = this._oGlobalFilter;
            } else if (this._oPriceFilter) {
                oFilter = this._oPriceFilter;
            }

            this.byId("table").getBinding().filter(oFilter, "Application");
        },

        filterGlobally : function(oEvent) {
            var sQuery = oEvent.getParameter("query");
            this._oGlobalFilter = null;

            if (sQuery) {
                this._oGlobalFilter = new Filter([
                    new Filter("code", FilterOperator.Contains, sQuery),
                    new Filter("labels/de", FilterOperator.Contains, sQuery),
                ], false);
            }

            this._filter();
        },

        setState : function(sKey) {
            var oTable = this.byId("table");
            var iCount = 0;
            var oTemplate = oTable.getRowActionTemplate();
            if (oTemplate) {
                oTemplate.destroy();
                oTemplate = null;
            }

            for (var i = 0; i < this.mode.length; i++) {
                if (sKey === this.mode[i].key) {
                    var aRes = this.mode[i].handler();
                    iCount = aRes[0];
                    oTemplate = aRes[1];
                    break;
                }
            }

            oTable.setRowActionTemplate(oTemplate);
            oTable.setRowActionCount(iCount);
        },

        handleActionPress : function(oEvent) {
            const oRow = oEvent.getParameter("row");
            const oProductCode = oRow.mAggregations.cells[0].getProperty("text");
            const oViewModelData = this.getView().getModel().getData();
            const oProducts = oViewModelData.items;

           const oSelectedProduct = oProducts.find(product => product.code === oProductCode);

           const oRouter = this.getOwnerComponent().getRouter();
           oRouter.navTo("productDetail", oSelectedProduct);





            /*var oItem = oEvent.getParameter("item");
            MessageToast.show("Item " + (oItem.getText() || oItem.getType()) + " pressed for product with id " +
                this.getView().getModel().getProperty("ProductId", oRow.getBindingContext()));*/
        }

    });

});

/*
sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/library'
], function(Controller, JSONModel, mobileLibrary) {
    "use strict";

    var PopinLayout = mobileLibrary.PopinLayout;

    return Controller.extend("productListRittal.controller.ProductList", {

        onInit: function () {

            const oView = this.getView();

            let oViewModel = this.initDataModel();
            oView.setModel(oViewModel);
        },

        onPopinLayoutChanged: function () {
            var oTable = this.byId("idProductsTable");
            var oComboBox = this.byId("idPopinLayout");
            var sPopinLayout = oComboBox.getSelectedKey();
            switch (sPopinLayout) {
                case "Block":
                    oTable.setPopinLayout(PopinLayout.Block);
                    break;
                case "GridLarge":
                    oTable.setPopinLayout(PopinLayout.GridLarge);
                    break;
                case "GridSmall":
                    oTable.setPopinLayout(PopinLayout.GridSmall);
                    break;
                default:
                    oTable.setPopinLayout(PopinLayout.Block);
                    break;
            }
        },

        onSelect: function (oEvent) {
            var bSelected = oEvent.getParameter("selected"),
                sText = oEvent.getSource().getText(),
                oTable = this.byId("idProductsTable"),
                aSticky = oTable.getSticky() || [];

            if (bSelected) {
                aSticky.push(sText);
            } else if (aSticky.length) {
                var iElementIndex = aSticky.indexOf(sText);
                aSticky.splice(iElementIndex, 1);
            }

            oTable.setSticky(aSticky);
        },

        onToggleInfoToolbar: function (oEvent) {
            var oTable = this.byId("idProductsTable");
            oTable.getInfoToolbar().setVisible(!oEvent.getParameter("pressed"));
        },





        initDataModel: function () {

            let oModel = new JSONModel();

            const url = "https://api.rittal.com/v2/productcategories/de";
            let oProducts = {items: []};

            jQuery.ajax({
                method: "GET",
                url: "https://api.rittal.com/v2/productcategories/de",
                dataType: "json",
                success: function (oData) {

                    if (oData.categoryType === "PRODUCT") {
                        oProducts.items.push(oData);
                    } else {
                        oData.allSubcategories.forEach((obj) => {
                            if (obj.categoryType === "PRODUCT") {
                                oProducts.items.push(obj);
                            } else {
                                obj.allSubcategories.forEach((obj) => {
                                    if (obj.categoryType === "PRODUCT") {
                                        oProducts.items.push(obj);
                                    } else {
                                        obj.allSubcategories.forEach((obj) => {
                                            if (obj.categoryType === "PRODUCT") {
                                                oProducts.items.push(obj);
                                            } else {
                                                obj.allSubcategories.forEach((obj) => {
                                                    if (obj.categoryType === "PRODUCT") {
                                                        oProducts.items.push(obj);
                                                    } else {
                                                        obj.allSubcategories.forEach((obj) => {
                                                            if (obj.categoryType === "PRODUCT") {
                                                                oProducts.items.push(obj);
                                                            } else {
                                                                obj.allSubcategories.forEach((obj) => {
                                                                    if (obj.categoryType === "PRODUCT") {
                                                                        oProducts.items.push(obj);
                                                                    } else {
                                                                        obj.allSubcategories.forEach((obj) => {
                                                                            if (obj.categoryType === "PRODUCT") {
                                                                                oProducts.items.push(obj);
                                                                            } else {
                                                                                obj.allSubcategories.forEach((obj) => {
                                                                                    if (obj.categoryType === "PRODUCT") {
                                                                                        oProducts.items.push(obj);
                                                                                    }
                                                                                });
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                    oModel.setData(oProducts);
                },
                error: function () {
                    Log.error("failed to load json from: " + url);
                }
            })

            return oModel;
        }
    });

});*/
