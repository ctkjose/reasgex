<?php
class rea_app_route {
	public static function getOption($k, $default=''){
		global $rea_app_route;
	
		$l =strlen($k);
		foreach($rea_app_route['values'] as $o){
			if(substr($o,0,1 + $l) == '-' . $k){
				$v = substr($o,1 + $l);
				//print "[{$k}]=[{$o}]=[{$v}]\n";
				if(substr($v,0,1) == '='){
					$v = substr($v,1);
					return $v;
				}
				return true;
			}elseif(substr($o,0,2 + $l) == '--' . $k){
				$v = substr($o,2 + $l);
				//print "[{$k}]=[{$o}]=[{$v}]\n";
				if(substr($v,0,1) == '='){
					$v = substr($v,1);
					return $v;
				}
				return true;
			}
		}
		
		return false;
	}
	public static function loadRoute(){
		$r =  array('action'=> 'default', 'values'=> array(), 'method' => 'get', 'ajax'=> false, 'view' => 'default');
		
		if(isset($_SERVER['REQUEST_METHOD'])){
			$method = strtoupper($_SERVER['REQUEST_METHOD']);
		}else{
			$method = 'CLI';
		}
		
		
		if($method == 'GET'){
			$r['values'] = $_GET;
			if(isset($_GET['_view'])) {
				$r['view'] = $_GET['_view'];
			}
		}elseif($method == 'POST'){
			$r['values'] = $_POST;
			$r['method']= 'post';
			if(isset($_POST['_view'])) {
				$r['view'] = $_POST['_view'];
			}
		}elseif($method == 'CLI'){
			global $argv;
			$r['method']= 'cli';
			$r['values'] = $argv;
		}

		$cfg_ajax_test = array(
			array(
				'field' => 'ajax',
				'data_type' => 'http',
				'return_type' => 'any',
				'action' => 'ajax',
			),
			array(
				'field' => 'json',
				'data_type' => 'http',
				'return_type' => 'json',
				'action' => 'json',
			),
			array(
				'field' => 'jsonrpc',
				'data_type' => 'jsonrpc',
				'return_type' => 'json',
				'action' => 'method',

			),
			array(
				'field' => 'callback',
				'data_type' => 'http',
				'return_type' => 'jsonp',
				'action' => 'method',
			),
			array(
				'field' => 'jsonpCallback',
				'data_type' => 'http',
				'return_type' => 'jsonp',
				'action' => 'method',
			),
		);

		
		$ajax_type = null;
		if(isset($_REQUEST)){
			foreach($cfg_ajax_test as $test){
				if(isset($_REQUEST[$test['field']])) {
					$ajax_type = $test;
					break;
				}
			}
		}
		
		if(!is_null($ajax_type)){
			$r['ajax'] = true;
			$r['method'] = strtolower($method);

			$r['action'] = strtolower($_REQUEST[$ajax_type['action']]);
			$r['view'] = 'default';

			if(	$ajax_type['data_type'] == 'http'){
				$r['values'] = ($r['method'] == 'get') ? $_GET : $_POST;
			}elseif( $ajax_type['data_type'] == 'jsonrpc' ){
				$r['values'] = json_decode(file_get_contents('php://input'));
				$r['action'] = $r['values']['method'];
			}

			if(	($ajax_type['return_type'] == 'json') || ($ajax_type['return_type'] == 'jsonp') ){
				ajax::loadAJAX($r['values']);
				ajax::setType($ajax_type['return_type']);
			}

			//error_log(print_r($ajax_type, true));
		}


		if(isset($r['values']['a'])) {
			$r['action'] = strtolower($r['values']['a']);
		}

		return $r;
	}
}
?>