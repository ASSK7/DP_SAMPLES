sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'sap/ui/core/util/Export',
	"sap/ui/core/util/ExportTypeCSV",
	'sap/m/Table',
	'sap/ui/unified/FileUploader',
	'sap/m/App',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator'
], function(Controller, JSONModel, Export, ExportTypeCSV, Table, FileUploader, App, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("com.dpSalesRepo.controller.display", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.dpSalesRepo.view.display
		 */
		onInit: function() {

			// var app = new App({
			// 	"pages": [
			// 		new sap.m.Page({
			// 			"title": 'CSV Table data',
			// 			"id": "idPage",
			// 			"content": [
			// 				new FileUploader({
			// 					"id": "fileUploader",
			// 					"name": "myFileUpload",
			// 					"change": [this.onhandleUpload, this],
			// 					"fileType": "xlsx,csv"
			// 				})
			// 			]
			// 		})
			// 	]
			// });

			this.aFilters = [];

			this.getOwnerComponent().byId('view1').getContent()[0].addPage(new sap.m.Page({
				"title": 'CSV Table data',
				"id": "idPage",
				"content": [
					new sap.m.OverflowToolbar({
						"content": [
							new sap.m.ToolbarSpacer(),
							new FileUploader({
								"id": "fileUploader",
								"name": "myFileUpload",
								"change": [this.onhandleUpload, this],
								"uploadComplete": [this.uploadComplete, this],
								"fileType": "xlsx,csv"
							})
						]
					})

					// new FileUploader({
					// 	"id": "fileUploader",
					// 	"name": "myFileUpload",
					// 	"change": [this.onhandleUpload, this],
					// 	"fileType": "xlsx,csv"
					// })
				]
			}));

			//var view = this.getOwnerComponent()._oViews._oViews["com.dpSalesRepo.view.display"].getId();
			//sap.ui.getCore().byId('__component0---view1').addContent(App);
			// this.getOwnerComponent().byId('view1').addContent(app);

		},
		onhandleUpload: function(oEvent) {
			// var oTable = new Table();
			/*
			var oTable = new Table({
				"columns" : [
					new sap.m.Column({
						"header" : [new sap.m.Label({
							"text" : 'Sales Order'
						})]
					}),
					new sap.m.Column({
						"header" : [new sap.m.Label({
							"text" : 'Customer Name'
						})]
					}),
					new sap.m.Column({
						"header" : [new sap.m.Label({
							"text" : 'Invoice'
						})]
					}),
					new sap.m.Column({
						"header" : [new sap.m.Label({
							"text" : 'Inquiry'
						})]
					}),
					new sap.m.Column({
						"header" : [new sap.m.Label({
							"text" : 'Billing/Delivery'
						})]
					})
					]
			});
			
			var items = new sap.m.ColumnListItem({
			   "cells" : [
			   	new sap.m.Text({
			   		'text' : '{vbak>vbap}'
			   	}),
			   		new sap.m.Text({
			   		'text' : '{vbak>vbap}'
			   	}),
			   		new sap.m.Text({
			   		'text' : '{vbak>vbap}'
			   	}),
			   		new sap.m.Text({
			   		'text' : '{vbak>vbap}'
			   	}),
			   		new sap.m.Text({
			   		'text' : '{vbak>vbap}'
			   	})
			   	]	
			});
			
			
			this.getView().byId('idPage').addContent(oTable);
			
			*/

			var that = this;
			var fileUploader = oEvent.getSource();
			var file = oEvent.getSource().getFocusDomRef().files[0];
			if (file.type.includes('spreadsheet')) {

			} else {

				var reader = new FileReader();
				reader.onload = function(e) {
					var strCSV = e.target.result;
					// strCSV.replaceAll(',,',"temp"+","+"temp" +",");
					var arrCSV = strCSV.match(/[\w .]+(?=,?)/g);
					var noOfCols = strCSV.split('\n')[0].split(',').length;

					// To ignore the first row which is header
					var hdrRow2 = arrCSV.splice(0, noOfCols);
					that.columnHeaders = hdrRow2;
					// var hdrRow = ['vbap', 'kunnr', 'inv', 'inq', 'vbrp'];
					var hdrRow = [];
					for (var x = 0; x < hdrRow2.length; x++) {
						// hdrRow[x] = hdrRow[x].replace(/\s/g, "");
						hdrRow.push(hdrRow2[x].replace(/\s/g, ""));
					}
					that.cells = hdrRow;

					var data = [];
					var aData = strCSV.split('\n');
					for (var i = 1; i < aData.length; i++) {
						if (aData[i] !== '') {
							var obj = {};
							var aData2 = aData[i].split(',');
							for (var j = 0; j < aData2.length; j++) {

								obj[hdrRow[j]] = aData2[j].trim();
							}
							data.push(obj);
						}
					}

					// while (arrCSV.length > 0) {
					// 	var obj = {};
					// 	// extract remaining rows one by one
					// 	var row = arrCSV.splice(0, noOfCols);
					// 	for (var i = 0; i < row.length; i++) {
					// 		obj[hdrRow[i]] = row[i].trim();
					// 	}
					// 	// push row to an array
					// 	data.push(obj);
					// }
					var oModel = new JSONModel();
					oModel.setProperty('/Header', data);

					// oModel.attachEventOnce('requestCompleted',function(){
					// 	var table = sap.ui.getCore().byId('idTable');
					// });
					var tempModel = new JSONModel();
					tempModel.loadData('./model/temp.json');
					tempModel.attachRequestCompleted(function() {
						var table = sap.ui.getCore().byId('idTable');
						var items = table.getItems();
						var flag = 1;
						for (var i = 0; i < items.length; i++) {
							if (flag == 1) {
								items[i].addStyleClass("orange");
								items[i].getCells()[Math.round((hdrRow2.length / 2) - 1)].setVisible(false);
								flag = 2;
							} else if (flag == 2) {
								items[i].addStyleClass("white");

								flag = 3;
							} else {
								items[i].addStyleClass("green");
								items[i].getCells()[Math.round((hdrRow2.length / 2) - 1)].setVisible(false);
								flag = 1;
							}

						}
					});

					that.getView().setModel(oModel, 'vbak');

					/// Start Table Creation Logic
					var hLayout = new sap.ui.layout.HorizontalLayout({
						"class": 'sapUiContentPadding'
					});
					var title = sap.ui.getCore().byId('idPage').getContent()[0].getContent()[1].getValue();

					// if (sap.ui.getCore().byId('idTable') !== undefined) {
					// 		sap.ui.getCore().byId('idTable').destroy();
					// 	}
					var colorButton = new sap.m.Button({
						"icon": 'https://pics.freeicons.io/premium/palette-dashboard-theme-custom-paint-color-gradient-blue-icon-124726-256.png',
						"press": [that.addColor, that]
					});
					colorButton.addStyleClass("button");
					var oTable = new Table({
						"mode": "SingleSelectLeft",
						"id": "idTable",
						"headerText": 'Text',
						class: "mystyle",
						"headerToolbar": [

							new sap.m.Toolbar({
								"content": [
									new sap.m.Title({
										"text": title
									}),
									new sap.m.ToolbarSpacer(),
									// colorButton,
									new sap.m.Button({
										"text": 'Video',
										"icon": 'sap-icon://media-play',
										"press": [that.onVideo, that]
									}),
									new sap.m.Button({
										"icon": 'sap-icon://delete',
										"press": [that.onDelete, that]
									}),
									new sap.m.Button({
										"icon": 'sap-icon://edit',
										"press": [that.onEdit, that]
									}),
									new sap.m.Button({
										"icon": 'sap-icon://sys-add',
										"press": [that.onAddRow2, that]
									}),
									new sap.m.Button({
										"icon": 'sap-icon://excel-attachment',
										"press": [that.onDownload, that]
									}),
									new sap.m.Button({
										"icon": "sap-icon://pdf-attachment",
										"tooltip": 'PDF Download',
										"press": [that.pdfDownload, that]
									}),
									new sap.m.Button({
										"icon": "sap-icon://pdf-reader",
										"tooltip": 'PDF View',
										"press": [that.pdfViewer, that]
									}),
									new sap.m.Button({
										"icon": "sap-icon://refresh",
										"tooltip": 'Refresh',
										"press": [that.refresh, that]
									}),
									new sap.m.Button({
										"icon": "sap-icon://action-settings",
										"tooltip": 'Settings',
										"press": [that.settings, that]
									})

								]
							})
						]
					});
					var items = new sap.m.ColumnListItem({
						class: "mystyle"
					});
					var flag = 1;
					for (x = 0; x < hdrRow2.length; x++) {

						if (Math.round((hdrRow2.length / 2) - 1) == x) {
							oTable.addColumn(
								new sap.m.Column({
									"header": [new sap.m.Label({
										"text": ''
									})]
								})
							);

							items.addCell(
								new sap.m.Button({
									"icon": "https://upload.wikimedia.org/wikipedia/commons/e/e4/Spinning_Ashoka_Chakra.gif",
									press: [that.onWheel, that]
								})
							);

						} else {

							oTable.addColumn(
								new sap.m.Column({
									"header": [new sap.m.Label({
										"text": hdrRow2[x]
									})]
								})
							);
							if (x == 1) {
								items.addCell(
									new sap.m.Link({
										"text": "{" + "vbak>" + hdrRow[x] + "}",
										class: "mystyle",
										"press": [that.onLinkClick, that]
									})
								);
							} else {
								items.addCell(
									new sap.m.Text({
										"text": "{" + "vbak>" + hdrRow[x] + "}",
										class: "mystyle"
									})
								);
							}
						}

						//Adding input fields as filters
						if (x < 3) {
							//removing elements from Core 
							if (sap.ui.getCore().byId(hdrRow[x]) !== undefined) {
								sap.ui.getCore().byId(hdrRow[x]).destroy();
							}

							var VBox = new sap.m.VBox({
								"items": [
									new sap.m.Label({
										"text": hdrRow2[x]
									}),
									new sap.m.Input({
										"showValueHelp": true,
										"id": hdrRow[x],
										"valueHelpRequest": [that.onValueHelp, that]
									})
								]
							});
							hLayout.addContent(VBox);
						}

					}
					// items.addStyleClass("mystyle");
					oTable.bindItems('vbak>/Header', items);
					// oTable.addStyleClass("mystyle");
					var panel = new sap.m.Panel();
					panel.addContent(hLayout);

					// that.getView().byId('idPage').addContent(oTable);
					// if (that.getView().byId('idPage').getContent().length == 1) {
					hLayout.addStyleClass('sapUiContentPadding');

					if (sap.ui.getCore().byId('idPage').getContent().length == 1) {
						// that.getView().byId('idPage').addContent(oTable);
						sap.ui.getCore().byId('idPage').addContent(panel);
						sap.ui.getCore().byId('idPage').addContent(oTable);

					} else {
						// that.getView().byId('idPage').removeContent(1); //removing previous table
						// that.getView().byId('idPage').addContent(oTable);

						sap.ui.getCore().byId('idPage').getContent()[1].destroy();
						sap.ui.getCore().byId('idPage').getContent()[1].destroy();

						sap.ui.getCore().byId('idPage').addContent(panel);
						sap.ui.getCore().byId('idPage').addContent(oTable);
						this.onAfterRendering();
					}

					/// End Table Creation Logic

				};
				reader.readAsBinaryString(file);
			}

		},
		onDownload: function(oEvent) {
			var aColumns = [];
			for (var i = 0; i < this.columnHeaders.length; i++) {
				var obj = {
					name: this.columnHeaders[i],
					template: {
						content: "{" + this.cells[i] + "}"
					}
				};
				aColumns.push(obj);
			}

			var oExport = new Export({

				exportType: new ExportTypeCSV({

					fileExtension: "csv",
					separatorChar: ",",
					mimeType: "application/csv"

				}),

				models: this.getView().getModel('vbak'),
				rows: {
					path: "/Header"
				},

				columns: aColumns
					// columns: [{
					// 	name: "Sales Order",
					// 	template: {
					// 		content: "{vbap}"
					// 	}
					// }, {
					// 	name: "Customer Nam",
					// 	template: {
					// 		content: "{kunnr}"
					// 	}

				// }, {
				// 	name: "Invoice",
				// 	template: {
				// 		content: "{inv}"
				// 	}
				// }, {
				// 	name: "Inquiry",
				// 	template: {
				// 		content: "{inq}"
				// 	}
				// }, {
				// 	name: "Billing/Delivery",
				// 	template: {
				// 		content: "{vbrp}"
				// 	}
				// }]
			});
			oExport.saveFile().always(function() {

				this.destroy();

			});

		},
		onAddRow: function(oEvent) {
			var row = {
				vbap: '',
				kunnr: '',
				inv: '',
				inq: '',
				vbrp: ''
			};
			this.getView().getModel('vbak').getData().Header.push(row);
			this.getView().getModel('vbak').refresh(true);

			//making input fields in table
			var len = this.getView().byId('idTable').getItems().length - 1;
			this.getView().byId('idTable').getItems()[len].destroyCells();
			this.getView().byId('idTable').getItems()[len].addCell(
				new sap.m.Input({
					value: '{vbak>vbap}'
				}));
			this.getView().byId('idTable').getItems()[len].addCell(
				new sap.m.Input({
					value: '{vbak>kunnr}'
				}));

			this.getView().byId('idTable').getItems()[len].addCell(
				new sap.m.Input({
					value: '{vbak>inv}'
				}));
			this.getView().byId('idTable').getItems()[len].addCell(
				new sap.m.Input({
					value: '{vbak>inq}'
				}));
			this.getView().byId('idTable').getItems()[len].addCell(
				new sap.m.Input({
					value: '{vbak>vbrp}'
				}));

		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.dpSalesRepo.view.display
		 */
		onBeforeRendering: function() {
			// 		var App = new sap.m.App({
			// 	"pages" : [
			// 		new sap.m.Page({
			// 			"title" : 'CSV Table data',
			// 			"content" : [
			// 				new FileUploader({
			// 				"id" : "fileUploader" ,
			// 				"name" : "myFileUpload", 
			// 				"change" : "onhandleUpload", 
			// 				"fileType" : "xlsx,csv"	
			// 				})
			// 				]
			// 		})
			// 		]
			// });
			//    //var view = this.getOwnerComponent()._oViews._oViews["com.dpSalesRepo.view.display"].getId();
			//    sap.ui.getCore().byId('__component0---view1').addContent(App);
		},
		pdfDownload: function(oEvent) {
			//fetching the name of uploaded file from file uploader
			var fileName = this.getView().getContent()[0].getPages()[0].getContent()[0].getValue().split('.')[0];
			var colms = [];
			var cLen = oEvent.getSource().getParent().getParent().getColumns().length;
			for (var i = 0; i < cLen; i++) {
				colms.push(oEvent.getSource().getParent().getParent().getColumns()[i].getAggregation('header').getText());
			}

			// var colms = ["Product Id", "Product Name", "Product Desc", "Product Price", "CurrencyCode", "Product Status"];
			var aRows2 = this.getView().getModel('vbak').getData().Header;

			var aRows = [];

			for (i = 0; i < aRows2.length; i++) {
				// aRows[i] = [
				// 	aRows[i].vbap,
				// 	aRows[i].kunnr,
				// 	aRows[i].inv,
				// 	aRows[i].vbrp,
				// 	aRows[i].inq
				// ];
				aRows.push(Object.values(this.getView().getModel('vbak').getData().Header[i]));
			}
			var pdf = new jsPDF('p', 'pt'); // Add libraries to lib folder and define in manifest.json
			pdf.text(40, 30, fileName);
			pdf.autoTable(colms, aRows);
			pdf.save(fileName + ".pdf");
		},
		pdfViewer: function(oEvent) {
			//fetching the name of uploaded file from file uploader
			var fileName = this.getView().getContent()[0].getPages()[0].getContent()[0].getValue().split('.')[0];
			var colms = [];
			var cLen = oEvent.getSource().getParent().getParent().getColumns().length;
			for (var i = 0; i < cLen; i++) {
				colms.push(oEvent.getSource().getParent().getParent().getColumns()[i].getAggregation('header').getText());
			}

			// var colms = ["Product Id", "Product Name", "Product Desc", "Product Price", "CurrencyCode", "Product Status"];
			var aRows2 = this.getView().getModel('vbak').getData().Header;

			var aRows = [];

			for (i = 0; i < aRows2.length; i++) {
				// aRows[i] = [
				// 	aRows[i].vbap,
				// 	aRows[i].kunnr,
				// 	aRows[i].inv,
				// 	aRows[i].vbrp,
				// 	aRows[i].inq
				// ];
				aRows.push(Object.values(this.getView().getModel('vbak').getData().Header[i]));
			}
			var pdf = new jsPDF('p', 'pt'); // Add libraries to lib folder and define in manifest.json
			pdf.text(40, 30, fileName);
			pdf.autoTable(colms, aRows);
			// pdf.save(fileName+".pdf");
			window.open(pdf.output('bloburl'));
			aRows = [];
		},
		onValueHelp: function(oEvent) {
			debugger;
			var filter = oEvent.getSource().getId();
			var filterVal = oEvent.getSource().getValue();

			var len = this.getView().getModel('vbak').getData().Header.length;
			var data = [];
			for (var i = 0; i < len; i++) {
				var obj = {};
				obj[filter] = this.getView().getModel('vbak').getData().Header[i][filter];
				data.push(obj);
			}
			this.getView().getModel('vbak').setProperty('/ValueHelp', data);
			// this.dialog(this, filter);

			//dialog
			var oList = new sap.m.List();
			var oListItem = new sap.m.StandardListItem({
				"type": 'Active',
				"title": "{vbak>" + filter + "}",
				"press": [this.onSelect, this]
			});

			oList.bindItems("vbak>/ValueHelp", oListItem);

			this.oDialog = new sap.m.Dialog({
				"draggable": true
			});
			this.oDialog.addContent(oList);
			// sap.ui.getCore().byId('idPage').addContent(this.oDialog);
			this.getView().addDependent(this.oDialog);
			this.oDialog.open();

			// this.getView().getModel('vbak').attachRequestCompleted(function() {

			// });

		},

		onSelect: function(oEvent) {
			var selValue = oEvent.getSource().getTitle();
			var inputId = oEvent.getSource().getBindingInfo('title').binding.getPath();
			this.aFilters.push(inputId);
			sap.ui.getCore().byId(inputId).setValue(selValue);

			//Filter
			var aFilter = [];
			aFilter.push(new Filter(inputId, FilterOperator.Contains, selValue));
			//--finding table id
			var pageCtnt = oEvent.getSource().getParent().getParent().getParent().getContent()[0].getPages()[0].getContent();
			var tableId;
			for (var i = 0; i < pageCtnt.length; i++) {
				if (pageCtnt[i].getId().includes('table')) {
					tableId = pageCtnt[i].getId();
					break;
				}
			}

			sap.ui.getCore().byId(tableId).getBinding('items').filter(aFilter);

			this.oDialog.close();
		},
		refresh: function(oEvent) {
			// debugger;
			//removing filters
			for (var i = 0; i < this.aFilters.length; i++) {
				sap.ui.getCore().byId(this.aFilters[i]).setValue('');
			}

			oEvent.getSource().getParent().getParent().getBinding('items').filter([]);

		},
		onAddRow2: function(oEvent) {
			this.oDialog2 = new sap.m.Dialog({
				"draggable": true,
				"endButton": [
					new sap.m.Button({
						"text": "Close",
						"press": [this.close, this]
					})
				],
				"beginButton": [
					new sap.m.Button({
						"text": "Add",
						"press": [this.addFromDialog, this]
					})
				]
			});
			var content = [];
			for (var i = 0; i < this.columnHeaders.length; i++) {
				content.push(new sap.m.Label({
					"text": this.columnHeaders[i]
				}));
				content.push(new sap.m.Input());
			}

			var simpleForm = new sap.ui.layout.form.SimpleForm({
				"content": content
			});
			this.oDialog2.addContent(simpleForm);
			this.oDialog2.open();
		},
		close: function(oEvent) {
			oEvent.getSource().getParent().close();
		},
		addFromDialog: function(oEvent) {
			var simpleFormContent = oEvent.getSource().getParent().getContent()[0].getContent();
			var obj = {};
			var flag = 0;

			for (var i = 1; i < simpleFormContent.length; i++) {
				obj[this.cells[flag]] = simpleFormContent[i].getValue();
				++flag;
				++i;
			}
			this.getView().getModel('vbak').getData().Header.push(obj);
			this.getView().getModel('vbak').refresh(true);

			oEvent.getSource().getParent().close();
		},
		onEdit: function(oEvent) {
			var selItem = oEvent.getSource().getParent().getParent().getSelectedItem();
			selItem.destroyCells();

			if (oEvent.getSource().getIcon().includes('edit')) {
				for (var i = 0; i < this.cells.length; i++) {
					selItem.addCell(new sap.m.Input({
						value: "{vbak>" + this.cells[i] + "}"
					}));
				}
				oEvent.getSource().setIcon('sap-icon://accept');
			} else {
				// var data = selItem.getBindingContext('vbak').getObject();

				for (i = 0; i < this.cells.length; i++) {
					selItem.addCell(new sap.m.Text({
						text: "{vbak>" + this.cells[i] + "}"
					}));
				}

				oEvent.getSource().setIcon('sap-icon://edit');
			}

		},
		onDelete: function(oEvent) {
			var selItem = oEvent.getSource().getParent().getParent().getSelectedItem().getBindingContext('vbak').getObject();
			var keys = Object.keys(selItem);
			var oModelData = this.getView().getModel('vbak').getData().Header;
			for (var i = 0; i < oModelData.length; i++) {
				if (selItem[keys[0]] == oModelData[i][keys[0]]) {
					this.getView().getModel('vbak').getData().Header.splice(i, 1);
					this.getView().getModel('vbak').refresh(true);
				}
			}
		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.dpSalesRepo.view.display
		 */
		onAfterRendering: function() {
			// var items = this.getView().byId('idTable').getItems();
			// 	var flag = 1;
			// for(var i=0;i<items.length;i++){
			// 	if(flag == 1){
			// 		items[i].addStyleClass("orange");
			// 		flag = 2;
			// 	}
			// 	else if(flag == 2){
			// 	items[i].addStyleClass("white");	
			// 	flag = 3;
			// 	}
			// 	else {
			// 	items[i].addStyleClass("green");	
			// 	flag = 1;
			// 	}

			// }
			debugger;

		},
		addColor: function(oEvent) {
			debugger;
			var tableIndex = sap.ui.getCore().byId('idPage').getContent().length - 1;
			var table = sap.ui.getCore().byId('idPage').getContent()[tableIndex];

			var items = table.getItems();
			var flag = 1;
			for (var i = 0; i < items.length; i++) {
				if (flag == 1) {
					items[i].addStyleClass("orange");
					flag = 2;
				} else if (flag == 2) {
					items[i].addStyleClass("white");
					flag = 3;
				} else {
					items[i].addStyleClass("green");
					flag = 1;
				}

			}
		},
		onWheel: function(oEvent) {
			var orange = new sap.m.GenericTile();
			orange.addStyleClass("top");
			var white = new sap.m.GenericTile();
			white.addStyleClass("wheel");
			var green = new sap.m.GenericTile();
			green.addStyleClass("bottom");

			var oDialog = new sap.m.Dialog({
				"verticalScrolling": false,
				'titleAlignment': 'None',
				"content": [
					orange,
					white,
					green

				],
				"endButton" : [
					new sap.m.Button({
						"text" : "Close",
						"press" : [this.onSettingsClose,this]
					})
					]
			});
			oDialog.setShowHeader(false);

			this.getView().addDependent(oDialog);
			oDialog.open();

		},
		onVideo: function(oEvent) {

			if (!this.oVidDialog) {

				var oHtml = new sap.ui.core.HTML({
					"content": "<iframe width='470' height='345' " +
						"src='https://www.youtube.com/embed/jDn2bn7_YSM?autoplay=1' allow='autoplay'>" +
						"</iframe>"
				});

				this.oVidDialog = new sap.m.Dialog({
					"showHeader": false,
					"endButton": [new sap.m.Button({
						'text': 'Close',
						"press": [this.onVideoClose, this]
					})]
				});
				// oDialog.destroyCustomHeader();
				this.oVidDialog.addContent(oHtml);
			} else {
				this.oVidDialog.getContent()[0].setContent("<iframe width='470' height='345' " +
					"src='https://www.youtube.com/embed/jDn2bn7_YSM?autoplay=1' allow='autoplay'>" +
					"</iframe>");

			}
			this.oVidDialog.open();
		},
		onVideoClose: function(oEvent) {
			oEvent.getSource().getParent().getContent()[0].setContent('');
			oEvent.getSource().getParent().close();
		},
		settings: function(oEvent) {
			var data = [];
			for (var i = 0; i < this.cells.length; i++) {
				data.push({
					columns: this.cells[i]
				});
			}

			this.getView().getModel('vbak').setProperty('/columns', data);
			var oTable = new sap.m.Table({
				"mode": 'MultiSelect',
				"multiSelectMode": 'SelectAll',
				"headerToolbar": [
					new sap.m.Toolbar({
						"content": [
							new sap.m.SearchField({
								width: '30%',
								search: [this.onColumnSearch, this]
							})
						]
					})
				],
				"columns": [
					new sap.m.Column({
						"header": [
							new sap.m.Label({
								"text": `Columns(/${this.cells.length})`
							})
						]
					})
				],

			});
			oTable.selectAll();

			var items = new sap.m.ColumnListItem({
				"cells": [
					new sap.m.Text({
						"text": '{vbak>columns}'
					})
				]
			});
			oTable.bindItems('vbak>/columns', items);

			var IconTabFilterColumns = new sap.m.IconTabFilter({
				"text": 'Columns',
				"content": [
					oTable
				]
			});

			var oSortSelect = new sap.m.Select({
				"forceSelection": false,
				"change": [this.sortSelect, this]
			});
			var oSortItems = new sap.ui.core.Item({
				"key": '{vbak>columns}',
				"text": '{vbak>columns}'
			});
			oSortSelect.bindItems('vbak>/columns', oSortItems);

			var IconTabFilterSort = new sap.m.IconTabFilter({
				"text": 'Sort',
				"content": [
					new sap.m.HBox({
						"items": [
							oSortSelect,
							new sap.m.SegmentedButton({
								buttons: [
									new sap.m.Button({
										"icon": 'sap-icon://sort-ascending',
										"press": [this.sortAscDsc, this]
									}),
									new sap.m.Button({
										"icon": 'sap-icon://sort-descending',
										"press": [this.sortAscDsc, this]
									})
								]
							}),

							new sap.m.Text({
								text: 'Ascending'
							}),
							new sap.m.Button({
								"icon": 'sap-icon://decline',
								"type": 'Transparent',
								"visible": false,
								"press": [this.decline, this]
							})
						]
					})

				]
			});

			var oFilterSelect = new sap.m.Select({
				"forceSelection": false,
				"change": [this.onFilterSelect, this]
			});
			var oFilterItems = new sap.ui.core.Item({
				"key": '{vbak>columns}',
				"text": '{vbak>columns}'
			});
			oFilterSelect.bindItems('vbak>/columns', oFilterItems);

			var IconTabFilterFilter = new sap.m.IconTabFilter({
				"text": 'Filter',
				"content": [
					oFilterSelect
				]
			});

			var oIconTabBar = new sap.m.IconTabBar({
				"items": [
					IconTabFilterColumns,
					IconTabFilterSort,
					IconTabFilterFilter
				]
			});

			var oDialog = new sap.m.Dialog({
				"height": '100%',
				"width": '100%',
				"contentHeight": '100%',
				"contentWidth": '50%',
				"beginButton": [
					new sap.m.Button({
						"text": 'Submit',
						"press": [this.onSettingsSubmit, this]
					})
				],
				"endButton": [
					new sap.m.Button({
						"text": 'Close',
						"press": [this.onSettingsClose, this]
					})
				],
				"content": [
					oIconTabBar
				]
			});

			this.getView().addDependent(oDialog);
			oDialog.open();

		},

		onFilterSelect: function(oEvent) {
			var selKey = oEvent.getSource().getSelectedKey();
			var hLayout = new sap.ui.layout.HorizontalLayout({
				"content": [
					new sap.m.Label({
						// class : 'sapUiSmallMarginTop'
						"text": selKey
					}),
					new sap.m.Input({
						"showValueHelp": true,
						"width": '60%',
						"valueHelpRequest": [this.onFilterValueHelpRequest, this]
							// class : 'sapUiLargeMarginBottom'
					}),
					new sap.m.Button({
						"icon": 'sap-icon://decline',
						"type": 'Transparent',
						"press": [this.filterCancel, this]
					})
				]
			});
			hLayout.getContent()[1].addStyleClass('right2');
			hLayout.getContent()[2].addStyleClass('right sapUiSmallMarginBegin');
			var panel = new sap.m.Panel({
				"content": [
					hLayout
				]
			});
			oEvent.getSource().getParent().addContent(panel);
		},
		filterCancel: function(oEvent) {
			debugger;
			oEvent.getSource().getParent().getParent().destroy();
		},
		sortSelect: function(oEvent) {
			debugger;
			var oSortSelect = new sap.m.Select({
				"forceSelection": false,
				"change": [this.sortSelect, this]
			});
			var oSortItems = new sap.ui.core.Item({
				"key": '{vbak>columns}',
				"text": '{vbak>columns}'
			});
			oSortSelect.bindItems('vbak>/columns', oSortItems);

			var HBox = new sap.m.HBox({
				"items": [
					oSortSelect,
					new sap.m.SegmentedButton({
						buttons: [
							new sap.m.Button({
								"icon": 'sap-icon://sort-ascending',
								"press": [this.sortAscDsc, this]
							}),
							new sap.m.Button({
								"icon": 'sap-icon://sort-descending',
								"press": [this.sortAscDsc, this]
							})
						]
					}),
					new sap.m.Text({
						text: 'Ascending'
					}),
					new sap.m.Button({
						"icon": 'sap-icon://decline',
						"type": 'Transparent',
						"visible": false,
						"press": [this.decline, this]
					})
				]
			})
			debugger;
			var len = oEvent.getSource().getParent().getParent().getContent().length;
			if (len == 1) {
				oEvent.getSource().getParent().getParent().getContent()[len - 1].getItems()[3].setVisible(true);
			} else {
				oEvent.getSource().getParent().getParent().getContent()[len - 2].getItems()[3].setVisible(true);
			}

			oEvent.getSource().getParent().getParent().insertContent(HBox, 0);
		},
		sortAscDsc: function(oEvent) {
			debugger;
			if (oEvent.getSource().getIcon().includes('descending')) {
				oEvent.getSource().getParent().getParent().getItems()[2].setText('Descending');
			} else {
				oEvent.getSource().getParent().getParent().getItems()[2].setText('Ascending');
			}
		},
		onLinkClick: function(oEvent) {
			// alert('Under Construction');
			debugger;
			var selItem = oEvent.getSource().getParent().getBindingContext('vbak').getObject();
			var keys = Object.keys(selItem);
			var values = Object.values(selItem);
			
			var selData = [];
			var oSimpleForm = new sap.ui.layout.form.SimpleForm({
			   "labelSpanL" : 3,
			   "labelSpanM" : 3,
			   "emptySpanL" : 4,
			   "emptySpanM" : 4,
			   "columnsL" : 3,
			   "columnsM" : 3
			   
			});
			
			for(var i=0;i<keys.length;i++){
				// var data = {
				//   "keys" : keys[i],
				//   "values" : values[i]
				// };
				// selData.push(data);
				
				oSimpleForm.addContent(
					new sap.m.Label({
						"text" :  keys[i]
					})
				);
				
				oSimpleForm.addContent(
					new sap.m.Text({
						"text" :  values[i]
					})
				);
			}
			
			var oDialog = new sap.m.Dialog({
				"title" : "Preview",
				"content" : [oSimpleForm],
				"endButton" : [
					new sap.m.Button({
						"text" : "Close",
						"press" : [this.onSettingsClose,this]
					})
					]
			});
			
			this.getView().addDependent(oDialog);
			oDialog.open();
			
			
			
			
			
		},
		onSettingsClose: function(oEvent) {
			oEvent.getSource().getParent().close();
		},
		onSettingsSubmit: function(oEvent) {
			debugger;
			//Columns in Settings button Dialog
			var cols = [];
			var colLen = oEvent.getSource().getParent().getContent()[0].getItems()[0].getContent()[0].getSelectedItems().length;
			for (var i = 0; i < colLen; i++) {
				var selCol = oEvent.getSource().getParent().getContent()[0].getItems()[0].getContent()[0].getSelectedItems()[i].getBindingContext(
					'vbak').getObject().columns
				cols.push(selCol);
			}

			//Sort in Settings button Dialog
			var sort = [];
			var sortLen = oEvent.getSource().getParent().getContent()[0].getItems()[1].getContent().length;
			for (i = 1; i < sortLen; i++) {
				var data = {
					"selKey": oEvent.getSource().getParent().getContent()[0].getItems()[1].getContent()[i].getItems()[0].getSelectedKey(),
					"sort": oEvent.getSource().getParent().getContent()[0].getItems()[1].getContent()[i].getItems()[2].getText()
				};
				sort.push(data);

			}

			var last = sort[sort.length - 1];
			if(last !== undefined) {
			var mData = this.getView().getModel('vbak').getData().Header;
			if (last.sort == "Ascending") {
				// mData.sort((a,b) => a['selKey'] - b['selKey']);
				mData.sort((a, b) => a[last.selKey] > b[last.selKey] ? 1 : -1);
			} else {
				// mData.sort((a,b) => b['selKey'] - a['selKey']);
				mData.sort((a, b) => a[last.selKey] > b[last.selKey] ? -1 : 1);

			}

			this.getView().getModel('vbak').refresh(true);
			
		}

			//Filter in Settings button Dialog
			var filter = [];
			// var panelContent = oEvent.getSource().getParent().getContent()[0].getItems()[2].getContent()[1].getContent();
			var panelContent = oEvent.getSource().getParent().getContent()[0].getItems()[2].getContent();

			for (i = 1; i < panelContent.length; i++) {
				var ofilter = {
					"label": oEvent.getSource().getParent().getContent()[0].getItems()[2].getContent()[i].getContent()[0].getContent()[0].getText(),
					"input": oEvent.getSource().getParent().getContent()[0].getItems()[2].getContent()[i].getContent()[0].getContent()[1].getValue()
				}
				filter.push(ofilter);
			}

			var filters = [];
			for (i = 0; i < filter.length; i++) {
				filters.push(
					new Filter({
						"path": filter[i]["label"],
						"operator": FilterOperator.Contains,
						"value1": filter[i]["input"]
					})
				);
			};
			
			var oFilter = new Filter({
				"filters" : filters
			});
			
			sap.ui.getCore().byId('idTable').getBinding('items').filter(oFilter);

			oEvent.getSource().getParent().close();
		},
		onFilterValueHelpRequest: function(oEvent) {
			this.selInput = oEvent.getSource();
			debugger;
			var label = oEvent.getSource().getParent().getContent()[0].getText();
			var data = this.getView().getModel('vbak').getData().Header;
			var vH = [];
			for (var i = 0; i < data.length; i++) {
				vH.push({
					'value': data[i][label]
				});
			}

			this.getView().getModel('vbak').setProperty('/valueHelps', vH);

			var oListItems = new sap.m.StandardListItem({
				"title": '{vbak>value}',
				'type': 'Active',
				"press": [this.onFilterVH, this]
			});
			var oList = new sap.m.List({
				"title": label
			});

			oList.bindItems('vbak>/valueHelps', oListItems);

			var oDialog = new sap.m.Dialog({
				"content": [oList],
				"endButton": [
					new sap.m.Button({
						"text": 'Close',
						"press": [this.onSettingsClose, this]
					})
				]
			});
			this.getView().addDependent(oDialog);
			oDialog.open();

		},
		onFilterVH: function(oEvent) {
			var selValue = oEvent.getSource().getBindingContext('vbak').getObject().value;
			this.selInput.setValue(selValue);
			oEvent.getSource().getParent().getParent().close();
			debugger;
		},
		decline: function(oEvent) {
			oEvent.getSource().getParent().destroy();
		}

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.dpSalesRepo.view.display
		 */
		//	onExit: function() {
		//
		//	}

	});

});