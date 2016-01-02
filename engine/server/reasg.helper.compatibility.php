<?php
/** REA Compatibility
 *
 */

class rea_compatibility {
	public static function initWithRoute($route){
		
		define('REA_LOCATIONID', $route['location']);
		
		
		define('REA_BASE_PATH', REASG_ROOT_PATH );
		define('REA_ENGINE_PATH', REASG_ENGINE_PATH );
		define('REA_IN_CLI', (isset($_SERVER['SHELL'])) ? 1: 0);
		
		if(!REA_IN_CLI){
			define('REA_DOC_ROOT', $_SERVER['DOCUMENT_ROOT']);
		}

	}
}

$app_controller->on("app_init_with_route", "rea_compatibility::initWithRoute");
 
 
?>