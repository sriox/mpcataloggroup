define(['controller/selectionController', 'model/cacheModel', 'model/productMasterModel', 'component/_CRUDComponent', 'controller/tabController', 'component/productComponent',
 'component/pictureComponent', 'component/featureComponent'],
 function(SelectionController, CacheModel, ProductMasterModel, CRUDComponent, TabController, ProductComponent,
 pictureComponent, featureComponent) {
    App.Component._ProductMasterComponent = App.Component.BasicComponent.extend({
        initialize: function() {
            var self = this;
            this.configuration = App.Utils.loadComponentConfiguration('productMaster');
            App.Model.ProductMasterModel.prototype.urlRoot = this.configuration.context;
            this.componentId = App.Utils.randomInteger();
            
            this.masterComponent = new ProductComponent();
            this.masterComponent.initialize();
            
            this.childComponents = [];
			
			this.initializeChildComponents();
            
            Backbone.on(this.masterComponent.componentId + '-post-product-create', function(params) {
                self.renderChilds(params);
            });
            Backbone.on(this.masterComponent.componentId + '-post-product-edit', function(params) {
                self.renderChilds(params);
            });
            Backbone.on(this.masterComponent.componentId + '-pre-product-list', function() {
                self.hideChilds();
            });
            Backbone.on('product-master-model-error', function(error) {
                Backbone.trigger(uComponent.componentId + '-' + 'error', {event: 'product-master-save', view: self, message: error});
            });
            Backbone.on(this.masterComponent.componentId + '-instead-product-save', function(params) {
                self.model.set('productEntity', params.model);
                if (params.model) {
                    self.model.set('id', params.model.id);
                } else {
                    self.model.unset('id');
                }

				App.Utils.fillCacheList(
					'picture',
					self.model,
					self.pictureComponent.getDeletedRecords(),
					self.pictureComponent.getUpdatedRecords(),
					self.pictureComponent.getCreatedRecords()
				);

				App.Utils.fillCacheList(
					'feature',
					self.model,
					self.featureComponent.getDeletedRecords(),
					self.featureComponent.getUpdatedRecords(),
					self.featureComponent.getCreatedRecords()
				);

                self.model.save({}, {
                    success: function() {
                        Backbone.trigger(self.masterComponent.componentId + '-' + 'post-product-save', {view: self, model : self.model});
                    },
                    error: function(error) {
                        Backbone.trigger(self.componentId + '-' + 'error', {event: 'product-master-save', view: self, error: error});
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
                {label: "Picture", name: "picture", enable: true},
                {label: "Feature", name: "feature", enable: true}
			]});
			this.tabs = new TabController({model: this.tabModel});

			this.pictureComponent = new pictureComponent();
            this.pictureComponent.initialize({cache: {data: [], mode: "memory"},pagination: false});
			this.childComponents.push(this.pictureComponent);

			this.featureComponent = new featureComponent();
            this.featureComponent.initialize({cache: {data: [], mode: "memory"},pagination: false});
			this.childComponents.push(this.featureComponent);

            var self = this;
            
            this.configToolbar(this.pictureComponent,true);
            Backbone.on(self.pictureComponent.componentId + '-post-picture-create', function(params) {
                params.view.currentModel.setCacheList(params.view.currentList);
            });
            
            this.configToolbar(this.featureComponent,true);
            Backbone.on(self.featureComponent.componentId + '-post-feature-create', function(params) {
                params.view.currentModel.setCacheList(params.view.currentList);
            });
            
		},
        renderChilds: function(params) {
            var self = this;
            
            var options = {
                success: function() {
                	self.tabs.render(self.tabsElement);

					self.pictureComponent.clearCache();
					self.pictureComponent.setRecords(self.model.get('listpicture'));
					self.pictureComponent.render(self.tabs.getTabHtmlId('picture'));

					self.featureComponent.clearCache();
					self.featureComponent.setRecords(self.model.get('listfeature'));
					self.featureComponent.render(self.tabs.getTabHtmlId('feature'));

                    $('#'+self.tabsElement).show();
                },
                error: function() {
                    Backbone.trigger(self.componentId + '-' + 'error', {event: 'product-edit', view: self, id: id, data: data, error: error});
                }
            };
            if (params.id) {
                self.model = new App.Model.ProductMasterModel({id: params.id});
                self.model.fetch(options);
            } else {
                self.model = new App.Model.ProductMasterModel();
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

    return App.Component._ProductMasterComponent;
});