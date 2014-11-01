define(['controller/selectionController', 'model/cacheModel', 'model/purchaseMasterModel', 'component/_CRUDComponent', 'controller/tabController', 'component/purchaseComponent',
 'component/purchaseItemComponent', 'component/paymentComponent'],
 function(SelectionController, CacheModel, PurchaseMasterModel, CRUDComponent, TabController, PurchaseComponent,
 purchaseItemComponent, paymentComponent) {
    App.Component._PurchaseMasterComponent = App.Component.BasicComponent.extend({
        initialize: function() {
            var self = this;
            this.configuration = App.Utils.loadComponentConfiguration('purchaseMaster');
            App.Model.PurchaseMasterModel.prototype.urlRoot = this.configuration.context;
            this.componentId = App.Utils.randomInteger();
            
            this.masterComponent = new PurchaseComponent();
            this.masterComponent.initialize();
            
            this.childComponents = [];
			
			this.initializeChildComponents();
            
            Backbone.on(this.masterComponent.componentId + '-post-purchase-create', function(params) {
                self.renderChilds(params);
            });
            Backbone.on(this.masterComponent.componentId + '-post-purchase-edit', function(params) {
                self.renderChilds(params);
            });
            Backbone.on(this.masterComponent.componentId + '-pre-purchase-list', function() {
                self.hideChilds();
            });
            Backbone.on('purchase-master-model-error', function(error) {
                Backbone.trigger(uComponent.componentId + '-' + 'error', {event: 'purchase-master-save', view: self, message: error});
            });
            Backbone.on(this.masterComponent.componentId + '-instead-purchase-save', function(params) {
                self.model.set('purchaseEntity', params.model);
                if (params.model) {
                    self.model.set('id', params.model.id);
                } else {
                    self.model.unset('id');
                }

				App.Utils.fillCacheList(
					'purchaseItem',
					self.model,
					self.purchaseItemComponent.getDeletedRecords(),
					self.purchaseItemComponent.getUpdatedRecords(),
					self.purchaseItemComponent.getCreatedRecords()
				);

				App.Utils.fillCacheList(
					'payment',
					self.model,
					self.paymentComponent.getDeletedRecords(),
					self.paymentComponent.getUpdatedRecords(),
					self.paymentComponent.getCreatedRecords()
				);

                self.model.save({}, {
                    success: function() {
                        Backbone.trigger(self.masterComponent.componentId + '-' + 'post-purchase-save', {view: self, model : self.model});
                    },
                    error: function(error) {
                        Backbone.trigger(self.componentId + '-' + 'error', {event: 'purchase-master-save', view: self, error: error});
                    }
                });
			    if (this.postInit) {
					this.postInit();
				}
            });
        },
        render: function(domElementId){
			if (domElementId) {
				var rootElementId = $("#"+domElementId);
				this.masterElement = this.componentId + "-master";
				this.tabsElement = this.componentId + "-tabs";

				rootElementId.append("<div id='" + this.masterElement + "'></div>");
				rootElementId.append("<div id='" + this.tabsElement + "'></div>");
			}
			this.masterComponent.render(this.masterElement);
		},
		initializeChildComponents: function () {
			this.tabModel = new App.Model.TabModel({tabs: [
                {label: "Purchase Item", name: "purchaseItem", enable: true},
                {label: "Payment", name: "payment", enable: true}
			]});
			this.tabs = new TabController({model: this.tabModel});

			this.purchaseItemComponent = new purchaseItemComponent();
            this.purchaseItemComponent.initialize({cache: {data: [], mode: "memory"},pagination: false});
			this.childComponents.push(this.purchaseItemComponent);

			this.paymentComponent = new paymentComponent();
            this.paymentComponent.initialize({cache: {data: [], mode: "memory"},pagination: false});
			this.childComponents.push(this.paymentComponent);

            var self = this;
            
            this.configToolbar(this.purchaseItemComponent,true);
            Backbone.on(self.purchaseItemComponent.componentId + '-post-purchaseItem-create', function(params) {
                params.view.currentModel.setCacheList(params.view.currentList);
            });
            
            this.configToolbar(this.paymentComponent,true);
            Backbone.on(self.paymentComponent.componentId + '-post-payment-create', function(params) {
                params.view.currentModel.setCacheList(params.view.currentList);
            });
            
		},
        renderChilds: function(params) {
            var self = this;
            
            var options = {
                success: function() {
                	self.tabs.render(self.tabsElement);

					self.purchaseItemComponent.clearCache();
					self.purchaseItemComponent.setRecords(self.model.get('listpurchaseItem'));
					self.purchaseItemComponent.render(self.tabs.getTabHtmlId('purchaseItem'));

					self.paymentComponent.clearCache();
					self.paymentComponent.setRecords(self.model.get('listpayment'));
					self.paymentComponent.render(self.tabs.getTabHtmlId('payment'));

                    $('#'+self.tabsElement).show();
                },
                error: function() {
                    Backbone.trigger(self.componentId + '-' + 'error', {event: 'purchase-edit', view: self, id: id, data: data, error: error});
                }
            };
            if (params.id) {
                self.model = new App.Model.PurchaseMasterModel({id: params.id});
                self.model.fetch(options);
            } else {
                self.model = new App.Model.PurchaseMasterModel();
                options.success();
            }


        },
        showMaster: function (flag) {
			if (typeof (flag) === "boolean") {
				if (flag) {
					$("#"+this.masterElement).show();
				} else {
					$("#"+this.masterElement).hide();
				}
			}
		},
        hideChilds: function() {
            $("#"+this.tabsElement).hide();
        },
		configToolbar: function(component, composite) {
		    component.removeGlobalAction('refresh');
			component.removeGlobalAction('print');
			component.removeGlobalAction('search');
			if (!composite) {
				component.removeGlobalAction('create');
				component.removeGlobalAction('save');
				component.removeGlobalAction('cancel');
				component.addGlobalAction({
					name: 'add',
					icon: 'glyphicon-send',
					displayName: 'Add',
					show: true
				}, function () {
					Backbone.trigger(component.componentId + '-toolbar-add');
				});
			}
        },
        getChilds: function(name){
			for (var idx in this.childComponents) {
				if (this.childComponents[idx].name === name) {
					return this.childComponents[idx].getRecords();
				}
			}
		},
		setChilds: function(childName,childData){
			for (var idx in this.childComponents) {
				if (this.childComponents[idx].name === childName) {
					this.childComponents[idx].setRecords(childData);
				}
			}
		},
		renderMaster: function(domElementId){
			this.masterComponent.render(domElementId);
		},
		renderChild: function(childName, domElementId){
			for (var idx in this.childComponents) {
				if (this.childComponents[idx].name === childName) {
					this.childComponents[idx].render(domElementId);
				}
			}
		}
    });

    return App.Component._PurchaseMasterComponent;
});