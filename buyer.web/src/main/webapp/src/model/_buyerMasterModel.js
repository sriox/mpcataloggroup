define([], function() {
    App.Model._BuyerMasterModel = Backbone.Model.extend({
     	initialize: function() {
            this.on('invalid', function(model,error) {
                Backbone.trigger('buyer-master-model-error', error);
            });
        },
        validate: function(attrs, options){
        	var modelMaster = new App.Model.BuyerModel();
        	if(modelMaster.validate){
            	return modelMaster.validate(attrs.buyerEntity,options);
            }
        }
    });

    App.Model._BuyerMasterList = Backbone.Collection.extend({
        model: App.Model._BuyerMasterModel,
        initialize: function() {
        }

    });
    return App.Model._BuyerMasterModel;
    
});