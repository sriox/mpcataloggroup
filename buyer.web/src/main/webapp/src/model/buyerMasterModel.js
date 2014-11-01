define(['model/_buyerMasterModel'], function() { 
    App.Model.BuyerMasterModel = App.Model._BuyerMasterModel.extend({

    });

    App.Model.BuyerMasterList = App.Model._BuyerMasterList.extend({
        model: App.Model.BuyerMasterModel
    });

    return  App.Model.BuyerMasterModel;

});