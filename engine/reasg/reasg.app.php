<?php
namespace reasg\app;


class app extends \reasg\core\base {	
	public static function run(){
		$route = \reasg\app\router::loadFromRequest();

		print "<pre>";
		print_r($_REQUEST);
		error_log("Employee is alive ----------------------");
		print_r($route);
		
		print "ROOT=" . REASG_ROOT_PATH . "\n";
		print "ENGINE=" . REASG_ENGINE_PATH . "\n";
		print "ENGINE_JS=" . REASG_ENGINE_JS_PATH . "\n";
		
		//return;
	
		if( isset($route['controller']) && isset($route['scope']) ){
			
			$p =  REASG_ROOT_PATH . $route['scope'] . '/' . $route['controller'] . '.controller.php';
			if(!file_exists($p)){
				///TODO: error handler
				print "not found...";
				return;
			}
			
			
			include_once($p);
			
			$frs = '\\' .  $route['scope'] . '\\'. $route['controller'];
			print "loading {$frs}\n";
			$a = new $frs;
			print "--- GOT OBJECT ---\n";
			var_dump($a);
			
			if( method_exists($a, 'init') ){
				call_user_func([$a, 'init'], $route['values']);
			}
			
			if( method_exists($a, $route['action']) ){
				call_user_func([$a, $route['action']], $route['values']);
			}elseif( method_exists($a, 'main') ){
				call_user_func([$a, 'main'], $route['values']);
			}
			
			print "--- GOT OBJECT ---\n";
			
		}
		
		print "</pre>";
	}
}
?>	