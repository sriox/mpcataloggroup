define(['controller/selectionController', 'model/cacheModel', 'model/buyerMasterModel', 'component/_CRUDComponent', 'controller/tabController', 'component/buyerComponent',
 'component/creditCardComponent', 'component/addressComponent'],
 function(SelectionController, CacheModel, BuyerMasterModel, CRUDComponent, TabController, BuyerComponent,
 creditCardComponent, addressComponent) {
    App.Component._BuyerMasterComponent = App.Component.BasicComponent.extend({
        initialize: function() {
            var self = this;
            this.configuration = App.Utils.loadComponentConfiguration('buyerMaster');
            App.Model.BuyerMasterModel.prototype.urlRoot = this.configuration.context;
            this.componentId = App.Utils.randomInteger();
            
            this.masterComponent = new BuyerComponent();
            this.masterComponent.initialize();
            
            this.childComponents = [];
			
			this.initializeChildComponents();
            
            Backbone.on(this.masterComponent.componentId + '-post-buyer-create', function(params) {
                self.renderChilds(params);
            });
            Backbone.on(this.masterComponent.componentId + '-post-buyer-edit', function(params) {
                self.renderChilds(params);
            });
            Backbone.on(this.masterComponent.componentId + '-pre-buyer-list', function() {
                self.hideChilds();
            });
            Backbone.on('buyer-master-model-error', function(error) {
                Backbone.trigger(uComponent.componentId + '-' + 'error', {event: 'buyer-master-save', view: self, message: error});
            });
            Backbone.on(this.masterComponent.componentId + '-instead-buyer-save', function(params) {
                self.model.set('buyerEntity', params.model);
                if (params.model) {
                    self.model.set('id', params.model.id);
                } else {
                    self.model.unset('id');
                }

				App.Utils.fillCacheList(
					'creditCard',
					self.model,
					self.creditCardComponent.getDeletedRecords(),
					self.creditCardComponent.getUpdatedRecords(),
					self.creditCardComponent.getCreatedRecords()
				);

				App.Utils.fillCacheList(
					'address',
					self.model,
					self.addressComponent.getDeletedRecords(),
					self.addressComponent.getUpdatedRecords(),
					self.addressComponent.getCreatedRecords()
				);

                self.model.save({}, {
                    success: function() {
                        Backbone.trigger(self.masterComponent.componentId + '-' + 'post-buyer-save', {view: self, model : self.model});
                    },
                    error: function(error) {
                        Backbone.trigger(self.componentId + '-' + 'error', {event: 'buyer-master-save', view: self, error: error});
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
                {label: "Credit Card", name: "creditCard", enable: true},
                {label: "Address", name: "address", enable: true}
			]});
			this.tabs = new TabController({model: this.tabModel});

			this.creditCardComponent = new creditCardComponent();
            this.creditCardComponent.initialize({cache: {data: [], mode: "memory"},pagination: false});
			this.childComponents.push(this.creditCardComponent);

			this.addressComponent = new addressComponent();
            this.addressComponent.initialize({cache: {data: [], mode: "memory"},pagination: false});
			this.childComponents.push(this.addressComponent);

            var self = this;
            
            this.configToolbar(this.creditCardComponent,true);
            Backbone.on(self.creditCardComponent.componentId + '-post-creditCard-create', function(params) {
                params.view.currentModel.setCacheList(params.view.currentList);
            });
            
            this.configToolbar(this.addressComponent,true);
            Backbone.on(self.addressComponent.componentId + '-post-address-create', function(params) {
                params.view.currentModel.setCacheList(params.view.currentList);
            });
            
		},
        renderChilds: function(params) {
            var self = this;
            
            var options = {
                success: function() {
                	self.tabs.render(self.tabsElement);

					self.creditCardComponent.clearCache();
					self.creditCardComponent.setRecords(self.model.get('listcreditCard'));
					self.creditCardComponent.render(self.tabs.getTabHtmlId('creditCard'));

					self.addressComponent.clearCache();
					self.addressComponent.setRecords(self.model.get('listaddress'));
					self.addressComponent.render(self.tabs.getTabHtmlId('address'));

                    $('#'+self.tabsElement).show();
                },
                error: function() {
                    Backbone.trigger(self.componentId + '-' + 'error', {event: 'buyer-edit', view: self, id: id, data: data, error: error});
                }
            };
            if (params.id) {
                self.model = new App.Model.BuyerMasterModel({id: params.id});
                self.model.fetch(options);
            } else {
                self.model = new App.Model.BuyerMasterModel();
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

    return App.Component._BuyerMasterComponent;
});