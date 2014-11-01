define(['model/_wishListMasterModel'], function() { 
    App.Model.WishListMasterModel = App.Model._WishListMasterModel.extend({

    });

    App.Model.WishListMasterList = App.Model._WishListMasterList.extend({
        model: App.Model.WishListMasterModel
    });

    return  App.Model.WishListMasterModel;

});