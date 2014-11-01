define(['component/_productMasterComponent'],function(_ProductMasterComponent) {
    App.Component.ProductMasterComponent = _ProductMasterComponent.extend({
		postInit: function(){
			//Escribir en este servicio las instrucciones que desea ejecutar al inicializar el componente
		}
    });

    return App.Component.ProductMasterComponent;
});