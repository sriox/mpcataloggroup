define(['controller/selectionController', 'model/cacheModel', 'model/wishListMasterModel', 'component/_CRUDComponent', 'controller/tabController', 'component/wishListComponent',
 'component/wishListItemComponent'],
 function(SelectionController, CacheModel, WishListMasterModel, CRUDComponent, TabController, WishListComponent,
 whishListItemComponent) {
    App.Component._WishListMasterComponent = App.Component.BasicComponent.extend({
        initialize: function() {
            var self = this;
            this.configuration = App.Utils.loadComponentConfiguration('wishListMaster');
            App.Model.WishListMasterModel.prototype.urlRoot = this.configuration.context;
            this.componentId = App.Utils.randomInteger();
            
            this.masterComponent = new WishListComponent();
            this.masterComponent.initialize();
            
            this.childComponents = [];
			
			this.initializeChildComponents();
            
            Backbone.on(this.masterComponent.componentId + '-post-wishList-create', function(params) {
                self.renderChilds(params);
            });
            Backbone.on(this.masterComponent.componentId + '-post-wishList-edit', function(params) {
                self.renderChilds(params);
            });
            Backbone.on(this.masterComponent.componentId + '-pre-wishList-list', function() {
                self.hideChilds();
            });
            Backbone.on('wishList-master-model-error', function(error) {
                Backbone.trigger(uComponent.componentId + '-' + 'error', {event: 'wishList-master-save', view: self, message: error});
            });
            Backbone.on(this.masterComponent.componentId + '-instead-wishList-save', function(params) {
                self.model.set('wishListEntity', params.model);
                if (params.model) {
                    self.model.set('id', params.model.id);
                } else {
                    self.model.unset('id');
                }

				App.Utils.fillCacheList(
					'whishListItem',
					self.model,
					self.whishListItemComponent.getDeletedRecords(),
					self.whishListItemComponent.getUpdatedRecords(),
					self.whishListItemComponent.getCreatedRecords()
				);

                self.model.save({}, {
                    success: function() {
                        Backbone.trigger(self.masterComponent.componentId + '-' + 'post-wishList-save', {view: self, model : self.model});
                    },
                    error: function(error) {
                        Backbone.trigger(self.componentId + '-' + 'error', {event: 'wishList-master-save', view: self, error: error});
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
                {label: "Whish List Item", name: "whishListItem", enable: true}
			]});
			this.tabs = new TabController({model: this.tabModel});

			this.whishListItemComponent = new whishListItemComponent();
            this.whishListItemComponent.initialize({cache: {data: [], mode: "memory"},pagination: false});
			this.childComponents.push(this.whishListItemComponent);

            var self = this;
            
            this.configToolbar(this.whishListItemComponent,true);
            Backbone.on(self.whishListItemComponent.componentId + '-post-wishListItem-create', function(params) {
                params.view.currentModel.setCacheList(params.view.currentList);
            });
            
		},
        renderChilds: function(params) {
            var self = this;
            
            var options = {
                success: function() {
                	self.tabs.render(self.tabsElement);

					self.whishListItemComponent.clearCache();
					self.whishListItemComponent.setRecords(self.model.get('listwhishListItem'));
					self.whishListItemComponent.render(self.tabs.getTabHtmlId('whishListItem'));

                    $('#'+self.tabsElement).show();
                },
                error: function() {
                    Backbone.trigger(self.componentId + '-' + 'error', {event: 'wishList-edit', view: self, id: id, data: data, error: error});
                }
            };
            if (params.id) {
                self.model = new App.Model.WishListMasterModel({id: params.id});
                self.model.fetch(options);
            } else {
                self.model = new App.Model.WishListMasterModel();
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

    return App.Component._WishListMasterComponent;
});