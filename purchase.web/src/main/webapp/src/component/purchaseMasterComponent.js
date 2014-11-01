define(['component/_purchaseMasterComponent'],function(_PurchaseMasterComponent) {
    App.Component.PurchaseMasterComponent = _PurchaseMasterComponent.extend({
		postInit: function(){
			//Escribir en este servicio las instrucciones que desea ejecutar al inicializar el componente
		}
    });

    return App.Component.PurchaseMasterComponent;
});