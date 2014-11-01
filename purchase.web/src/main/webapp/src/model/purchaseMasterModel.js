define(['model/_purchaseMasterModel'], function() { 
    App.Model.PurchaseMasterModel = App.Model._PurchaseMasterModel.extend({

    });

    App.Model.PurchaseMasterList = App.Model._PurchaseMasterList.extend({
        model: App.Model.PurchaseMasterModel
    });

    return  App.Model.PurchaseMasterModel;

});