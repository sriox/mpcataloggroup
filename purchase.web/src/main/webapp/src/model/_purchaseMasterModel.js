define([], function() {
    App.Model._PurchaseMasterModel = Backbone.Model.extend({
     	initialize: function() {
            this.on('invalid', function(model,error) {
                Backbone.trigger('purchase-master-model-error', error);
            });
        },
        validate: function(attrs, options){
        	var modelMaster = new App.Model.PurchaseModel();
        	if(modelMaster.validate){
            	return modelMaster.validate(attrs.purchaseEntity,options);
            }
        }
    });

    App.Model._PurchaseMasterList = Backbone.Collection.extend({
        model: App.Model._PurchaseMasterModel,
        initialize: function() {
        }

    });
    return App.Model._PurchaseMasterModel;
    
});