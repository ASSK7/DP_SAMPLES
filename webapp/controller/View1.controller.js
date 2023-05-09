sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV",
    "sap/m/Table",
    "sap/ui/unified/FileUploader",
    "sap/m/App",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
  ],
  function (
    Controller,
    JSONModel,
    Export,
    ExportTypeCSV,
    Table,
    FileUploader,
    App,
    Filter,
    FilterOperator,
    MessageBox
  ) {
    "use strict";

    return Controller.extend("com.dp.sample1.controller.View1", {
      onInit: function () {
        var jsonModel = new JSONModel();
        jsonModel.loadData('./model/data.json');
        this.getView().setModel(jsonModel, 'jsonModel');
      },
      onMasterSelect: function (oEvent) {
        debugger;
        var selRow = oEvent.getSource().getBindingContext('jsonModel').getObject();
        var selPath = oEvent.getSource().getBindingContextPath();
        this.getView().byId('objectheader').bindElement("jsonModel>" + selPath);
        this.byId('splitApp').to(this.createId('detaildetail'));
      },
      onBuy: function (oEvent) {

        var aPath = oEvent.getSource().getParent().getRowBindingContext().getPath().split('/');
        var modelData = this.getView().getModel('jsonModel').getData().results;
        var company, section;

        for (var i = 2; i < aPath.length - 2; i++) {
          if (isNaN(parseInt(aPath[i]))) {
            modelData = modelData[aPath[i]];
          }
          else {
            var path = parseInt(aPath[i]);
            modelData = modelData[path];
            if (company == undefined) {
              company = modelData.name;
            }

          }


        }
        var section = modelData.name;

        var obj = {
          company: company,
          type: section,
          model: oEvent.getSource().getParent().getBindingContext('jsonModel').getObject().name,
          price: oEvent.getSource().getParent().getBindingContext('jsonModel').getObject().amount,
          currency: oEvent.getSource().getParent().getBindingContext('jsonModel').getObject().currency,
          quantity: 0
        };


        this.getView().getModel('jsonModel').setProperty('/buy', obj);




        // alert("Testing the application");
      },
      onCheckOut: function (oEvent) {
        var orderProduct = this.getView().getModel('jsonModel').getData().buy;

        if (orderProduct.quantity > 0) {

          if (this.getView().getModel('jsonModel').getData().orders == undefined) {
            this.getView().getModel('jsonModel').setProperty('/orders', [orderProduct]);
          }
          else {
            this.getView().getModel('jsonModel').getData().orders.push(orderProduct);
          }
          
          this.getView().getModel('jsonModel').refresh(true);
          MessageBox.success('Order Successfully placed!!!');

          debugger;
        }  else {
          MessageBox.warning('Please select quantity');
        }

      }


      });
  }
);
