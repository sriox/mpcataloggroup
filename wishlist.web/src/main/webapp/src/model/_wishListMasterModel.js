define([], function() {
    App.Model._WishListMasterModel = Backbone.Model.extend({
     	initialize: function() {
            this.on('invalid', function(model,error) {
                Backbone.trigger('wishList-master-model-error', error);
            });
        },
        validate: function(attrs, options){
        	var modelMaster = new App.Model.WishListModel();
        	if(modelMaster.validate){
            	return modelMaster.validate(attrs.wishListEntity,options);
            }
        }
    });

    App.Model._WishListMasterList = Backbone.Collection.extend({
        model: App.Model._WishListMasterModel,
        initialize: function() {
        }

    });
    return App.Model._WishListMasterModel;
    
});