<?php
namespace reasg;
//require_once($REA_USE_VIEW_UI);

$app_extended_view_helpers = array();
$rea_app_controller_page = null;

class controller extends \reasg\core\controller {
	
	public static function run(){
		print "@\\reasg\\app\\controller::run()\n";
	}
	public function test1(){
		if(function_exists('\reasg\app\app_start')){
			print "TEST 01: app_start found\n";
			//app_start($rea_route->details['values']);
			app_start();
		}else{
			print "TEST 01: app_start NOT found\n";
		}
	}
	
	
}

trait ObjectDataSource {
	
	
}

function app_start(){
	print "@app_start inside\n";
}

class rea_app_controller {
	///N: A proxy controller for $rea_controller
	var $properties = array();
	var $delegate = null;
	
	public static function on($evt_name, $callback){
		global $rea_controller;
		$rea_controller->on($evt_name, $callback);
	}
	function call($m, $params=null){
		if($this->delegate == null) return;
		call_user_func_array(array($this->delegate, $m), $params );
	}
	public static function urlForMessage($a, $params=null){
		///N:Returns a URL for a message to this controller
		if( is_array($params) ){
			$p = [];
			foreach ($params as $k => $v) {
				if($k == 'a') continue;
				$p[] = $k .'='. urlencode($v);
			}
			$s = implode('&', $p);
		}elseif(is_null($params)){
			$s = $params;
		}
		
		$url = REA_SELF_URL . '?a=' . $a;
		if(strlen($s) > 0) $url.= '&' . $s;
		
		return $url;
	}
	public static function commit(){
		global $rea_route, $config, $rea_controller;
		
		if( REA_RUNMODE_WEB ){
			global $ajax_instance;
			if(isset($ajax_instance) && !$ajax_instance->empty ){
				$ajax_instance->sendResponse();
				exit;
			}
			$rea_controller->dispatchEvent('app_commit_web');
		}else{
			$rea_controller->dispatchEvent('app_commit_cli');
		}
		
		$rea_controller->dispatchEvent('app_commit');
	}
	public static function run(){
		global $rea_route, $config, $rea_controller;
		
		//rea_app::on("rea_end", array("rea_app_controller", "commit"));
		
		if(function_exists('app_start')){
			app_start($rea_route->details['values']);
		}
		$rea_controller->dispatchEvent('app_start', array($rea_route->details['values']) );
		

		global $app_extended_view_helpers;
		if( count($app_extended_view_helpers) > 0 ){
			foreach($app_extended_view_helpers as $a){
				$a = '' . $a . '_extended_view_start';
				if( function_exists($a) ){
					$a($rea_route->details['values']);
				}
			}
		}
		$fn = 'app_event_' . $rea_route->details['action'];
		if(function_exists($fn)) {
			$data = $fn($rea_route->details['values']);	
		}
		$rea_controller->dispatchEvent($fn, array($rea_route->details['values']) );
		
		if(function_exists('app_end')){
			app_end($rea_route->details['values']);
		}
		$rea_controller->dispatchEvent('app_end', array($rea_route->details['values']) );
		

		self::commit();
	}

}

//find a better way to do this
if(isset($rea_config['application_use_model']) && $rea_config['application_use_model']){
	rea_app_controller::run();
}





?>