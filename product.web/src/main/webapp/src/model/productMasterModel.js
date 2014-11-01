define(['model/_productMasterModel'], function() { 
    App.Model.ProductMasterModel = App.Model._ProductMasterModel.extend({

    });

    App.Model.ProductMasterList = App.Model._ProductMasterList.extend({
        model: App.Model.ProductMasterModel
    });

    return  App.Model.ProductMasterModel;

});