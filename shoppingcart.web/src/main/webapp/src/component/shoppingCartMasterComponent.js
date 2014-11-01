define(['component/_shoppingCartMasterComponent'],function(_ShoppingCartMasterComponent) {
    App.Component.ShoppingCartMasterComponent = _ShoppingCartMasterComponent.extend({
		postInit: function(){
			//Escribir en este servicio las instrucciones que desea ejecutar al inicializar el componente
		}
    });

    return App.Component.ShoppingCartMasterComponent;
});