define(['component/_buyerMasterComponent'],function(_BuyerMasterComponent) {
    App.Component.BuyerMasterComponent = _BuyerMasterComponent.extend({
		postInit: function(){
			//Escribir en este servicio las instrucciones que desea ejecutar al inicializar el componente
		}
    });

    return App.Component.BuyerMasterComponent;
});