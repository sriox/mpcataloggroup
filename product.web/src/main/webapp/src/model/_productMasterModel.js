define([], function() {
    App.Model._ProductMasterModel = Backbone.Model.extend({
     	initialize: function() {
            this.on('invalid', function(model,error) {
                Backbone.trigger('product-master-model-error', error);
            });
        },
        validate: function(attrs, options){
        	var modelMaster = new App.Model.ProductModel();
        	if(modelMaster.validate){
            	return modelMaster.validate(attrs.productEntity,options);
            }
        }
    });

    App.Model._ProductMasterList = Backbone.Collection.extend({
        model: App.Model._ProductMasterModel,
        initialize: function() {
        }

    });
    return App.Model._ProductMasterModel;
    
});