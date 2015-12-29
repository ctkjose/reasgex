<?php
namespace reasg;

global $reasg_path_mapper;

class app extends \reasg\core\base {
	private static $route= null;
	private static $path=REASG_ROOT_PATH;
	
	public static function run(){
		
		
		$route = \reasg\router::loadFromRequest();
		self::$route = $route;
		
		reasg_dev_dump($_REQUEST, '$_REQUEST');
		reasg_dev_dump($route, '$route');
		
		print "ROOT=" . REASG_ROOT_PATH . "\n";
		print "ENGINE=" . REASG_ENGINE_PATH . "\n";
		print "ENGINE_JS=" . REASG_ENGINE_JS_PATH . "\n";
		

	
		if( isset($route['controller']) && isset($route['scope']) ){
			
			$p =  REASG_ROOT_PATH . $route['scope'] . '/' . $route['controller'] . '.controller.php';
			if(!file_exists($p)){
				///TODO: error handler
				return;
			}
			
			self::$path = REASG_ROOT_PATH . $route['scope'] . '/';
			define('REASG_SELF_DIRECTORY', self::$path);
			define('REASG_SELF_PATH', $p);
			
			include_once($p);
			
			$frs = '\\' .  $route['scope'] . '\\'. $route['controller'];
			
			define('REASG_SELF_CONTROLLER', $frs);
			
			$a = new $frs;
			
			
			
			
			
			if( method_exists($a, 'init') ){
				call_user_func([$a, 'init'], $route['values']);
			}
			
			if( method_exists($a, $route['action']) ){
				call_user_func([$a, $route['action']], $route['values']);
			}elseif( method_exists($a, 'main') ){
				call_user_func([$a, 'main'], $route['values']);
			}
			
		}
	}
	public static function bundle(){
		static $bndl = null;
		if(!is_null($bndl)) return $bndl;
		
		$p = isset(app::$route['scope']) ? app::$path : REASG_ROOT_PATH;
		$bndl = new appBundle($p);
		
		return $bndl;
	}
}


function url_app_assets($f, $controller=null, $arguments=[]){
	
	$s = (is_null($controller)) ? REASG_SELF_CONTROLLER : $controller;
	if(substr($s,0,1) == '\\'){
		//$controller the name of a controller class including its namespace
		$parts = explode('\\', $s);
		$scope = $parts[1];
	}else{
		//$controller could be the name of a namespace/scope
		$scope = $controller;
	}
	
	if(substr($f, 0,2) == "./"){
		$r = substr($f, 2);
	}elseif(substr($f, 0,1) == "/"){
		$r = substr($f, 1);
	}else{
		$r = $f;
	}
	if(substr($r,0,7) != 'assets/') $r = 'assets/' . $r;
	
	global $reasg_path_mapper;
	return $reasg_path_mapper($scope, $r, '', $arguments);
}
function url_app_controller($controller, $event='main', $arguments=[]){
	
	$s = (is_null($controller)) ? REASG_SELF_CONTROLLER : $controller;
	//$controller the name of a controller class including its namespace
	
	$parts = explode('\\', $s);
	$scope = $parts[1];
	$f = $parts[2] . ".controller.php";
	
	global $reasg_path_mapper;
	return $reasg_path_mapper($scope, $f, $event, $arguments);
}


class appBundle extends \reasg\core\base {
	var $root = '';
	
	function __construct($path = null){
		if(is_null($path)){
			$this->root = REASG_ROOT_PATH;
		}else{
			$this->root = $path;
		}
		error_log("@appBundle.constructur");
	}
	
	
}

?>	