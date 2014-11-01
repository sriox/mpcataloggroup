define(['model/_shoppingCartMasterModel'], function() { 
    App.Model.ShoppingCartMasterModel = App.Model._ShoppingCartMasterModel.extend({

    });

    App.Model.ShoppingCartMasterList = App.Model._ShoppingCartMasterList.extend({
        model: App.Model.ShoppingCartMasterModel
    });

    return  App.Model.ShoppingCartMasterModel;

});