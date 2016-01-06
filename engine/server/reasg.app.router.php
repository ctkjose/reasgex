<?php
namespace reasg;

$rea_route = null;

class router {
	public static function getRoute(){
		global $reasg_route;
		return $rea_route;
	}
	public static function loadFromRequest(){
		global $reasg_route;
		$reasg_route =  ['scope'=>'reasg','location'=>'default', 'controller'=>'main', 'action'=> 'main', 'values'=> array(), 'return_type'=>'any', 'method' => 'get', 'view' => 'default'];
		
		if(isset($_SERVER['REQUEST_METHOD'])){
			$method = strtolower($_SERVER['REQUEST_METHOD']);
		}else{
			$method = 'cli';
		}
		
		if($method != 'cli'){
			$reasg_route['values'] = $_REQUEST;
			$reasg_route['method'] = $method;
		}elseif($method == 'cli'){
			global $argv;
			$reasg_route['method']= 'cli';
			$reasg_route['values'] = $argv;
		}

		if( isset($reasg_route['values']['api-return']) ){
			$reasg_route['return_type'] = $reasg_route['values']['api-return'];
		}
		
		if( isset($reasg_route['values']['api-json-data']) ){
			$v = json_decode($reasg_route['values']['api-json-data'], true);
			unset($reasg_route['values']['api-json-data']);
			$reasg_route['values'] = array_merge($reasg_route['values'], $v);
		}
		
		//'jsonrpc' ///TODO: Should we support jsonrpc?
		//$reasg_route['values'] = json_decode(file_get_contents('php://input'));
		
		
		if(isset($reasg_route['values']['api-action'])) {
			$reasg_route['action'] = strtolower($reasg_route['values']['api-action']);
		}elseif(isset($reasg_route['values']['a'])) {
			$reasg_route['action'] = strtolower($reasg_route['values']['a']);
		}
		if(isset($reasg_route['values']['api-loc'])) {
			$reasg_route['location'] = strtoupper($reasg_route['values']['api-loc']);
			unset($reasg_route['values']['api-loc']);
		}
		if(isset($reasg_route['values']['api-obj'])) {
			$reasg_route['controller'] = strtolower($reasg_route['values']['api-obj']);
			unset($reasg_route['values']['api-obj']);
		}
		if(isset($reasg_route['values']['api-scope'])) {
			$reasg_route['scope'] = strtolower($reasg_route['values']['api-scope']);
			unset($reasg_route['values']['api-scope']);
		}
		
		return $reasg_route;
	}
}
?>