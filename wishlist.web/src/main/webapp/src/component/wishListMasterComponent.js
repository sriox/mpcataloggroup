define(['component/_wishListMasterComponent'],function(_WishListMasterComponent) {
    App.Component.WishListMasterComponent = _WishListMasterComponent.extend({
		postInit: function(){
			//Escribir en este servicio las instrucciones que desea ejecutar al inicializar el componente
		}
    });

    return App.Component.WishListMasterComponent;
});