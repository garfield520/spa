/**
 *	spa.js
 * 	根命名空间模块
 */
var spa = (function (){
	var initModule = function ( $contaner ){
		spa.shell.initModule( $contaner );
	}

	return {
		initModule : initModule
	}
})();