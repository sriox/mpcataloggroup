define(['controller/selectionController', 'model/cacheModel', 'model/shoppingCartMasterModel', 'component/_CRUDComponent', 'controller/tabController', 'component/shoppingCartComponent',
 'component/shoppingCartItemComponent'],
 function(SelectionController, CacheModel, ShoppingCartMasterModel, CRUDComponent, TabController, ShoppingCartComponent,
 shoppingCartItemComponent) {
    App.Component._ShoppingCartMasterComponent = App.Component.BasicComponent.extend({
        initialize: function() {
            var self = this;
            this.configuration = App.Utils.loadComponentConfiguration('shoppingCartMaster');
            App.Model.ShoppingCartMasterModel.prototype.urlRoot = this.configuration.context;
            this.componentId = App.Utils.randomInteger();
            
            this.masterComponent = new ShoppingCartComponent();
            this.masterComponent.initialize();
            
            this.childComponents = [];
			
			this.initializeChildComponents();
            
            Backbone.on(this.masterComponent.componentId + '-post-shoppingCart-create', function(params) {
                self.renderChilds(params);
            });
            Backbone.on(this.masterComponent.componentId + '-post-shoppingCart-edit', function(params) {
                self.renderChilds(params);
            });
            Backbone.on(this.masterComponent.componentId + '-pre-shoppingCart-list', function() {
                self.hideChilds();
            });
            Backbone.on('shoppingCart-master-model-error', function(error) {
                Backbone.trigger(uComponent.componentId + '-' + 'error', {event: 'shoppingCart-master-save', view: self, message: error});
            });
            Backbone.on(this.masterComponent.componentId + '-instead-shoppingCart-save', function(params) {
                self.model.set('shoppingCartEntity', params.model);
                if (params.model) {
                    self.model.set('id', params.model.id);
                } else {
                    self.model.unset('id');
                }

				App.Utils.fillCacheList(
					'shoppingCartItem',
					self.model,
					self.shoppingCartItemComponent.getDeletedRecords(),
					self.shoppingCartItemComponent.getUpdatedRecords(),
					self.shoppingCartItemComponent.getCreatedRecords()
				);

                self.model.save({}, {
                    success: function() {
                        Backbone.trigger(self.masterComponent.componentId + '-' + 'post-shoppingCart-save', {view: self, model : self.model});
                    },
                    error: function(error) {
                        Backbone.trigger(self.componentId + '-' + 'error', {event: 'shoppingCart-master-save', view: self, error: error});
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
                {label: "Shopping Cart Item", name: "shoppingCartItem", enable: true}
			]});
			this.tabs = new TabController({model: this.tabModel});

			this.shoppingCartItemComponent = new shoppingCartItemComponent();
            this.shoppingCartItemComponent.initialize({cache: {data: [], mode: "memory"},pagination: false});
			this.childComponents.push(this.shoppingCartItemComponent);

            var self = this;
            
            this.configToolbar(this.shoppingCartItemComponent,true);
            Backbone.on(self.shoppingCartItemComponent.componentId + '-post-shoppingCartItem-create', function(params) {
                params.view.currentModel.setCacheList(params.view.currentList);
            });
            
		},
        renderChilds: function(params) {
            var self = this;
            
            var options = {
                success: function() {
                	self.tabs.render(self.tabsElement);

					self.shoppingCartItemComponent.clearCache();
					self.shoppingCartItemComponent.setRecords(self.model.get('listshoppingCartItem'));
					self.shoppingCartItemComponent.render(self.tabs.getTabHtmlId('shoppingCartItem'));

                    $('#'+self.tabsElement).show();
                },
                error: function() {
                    Backbone.trigger(self.componentId + '-' + 'error', {event: 'shoppingCart-edit', view: self, id: id, data: data, error: error});
                }
            };
            if (params.id) {
                self.model = new App.Model.ShoppingCartMasterModel({id: params.id});
                self.model.fetch(options);
            } else {
                self.model = new App.Model.ShoppingCartMasterModel();
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

    return App.Component._ShoppingCartMasterComponent;
});