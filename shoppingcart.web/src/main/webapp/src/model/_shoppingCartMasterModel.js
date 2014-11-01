define([], function() {
    App.Model._ShoppingCartMasterModel = Backbone.Model.extend({
     	initialize: function() {
            this.on('invalid', function(model,error) {
                Backbone.trigger('shoppingCart-master-model-error', error);
            });
        },
        validate: function(attrs, options){
        	var modelMaster = new App.Model.ShoppingCartModel();
        	if(modelMaster.validate){
            	return modelMaster.validate(attrs.shoppingCartEntity,options);
            }
        }
    });

    App.Model._ShoppingCartMasterList = Backbone.Collection.extend({
        model: App.Model._ShoppingCartMasterModel,
        initialize: function() {
        }

    });
    return App.Model._ShoppingCartMasterModel;
    
});