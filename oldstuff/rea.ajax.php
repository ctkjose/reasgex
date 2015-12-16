<?php

$ajax_instance = new ajax;

class ajax {
	var $type = 'text';
	var $empty = true;
	var $buffer = '';
	var $callback = '';
	var $data = array();
	var $ui_instances = array();
	
	function constructor(){
		//jose is here
	}
	public static function addWidget($obj){
		global $ajax_instance;
		$ajax_instance->empty = false;
		$ajax_instance->ui_instances[] = $obj;
	}
	public static function setType($type){
		global $ajax_instance;
		$ajax_instance->empty = false;
		$ajax_instance->type = $type;
	}
	public static function write($s){
		global $ajax_instance;
		$ajax_instance->empty = false;
		$ajax_instance->buffer.= $s;
	}
	public static function sendPlain($s){
		global $ajax_instance;
		$ajax_instance->empty = false;
		$ajax_instance->buffer.= $s;
	}
	public static function sendJSON($v){
		global $ajax_instance;
		$ajax_instance->empty = false;
		if(($ajax_instance->type != 'json') && ($ajax_instance->type != 'jsonp')){
			$ajax_instance->type = 'json';
		}
		
		$ajax_instance->buffer.= json_encode($v);
		
	}
	
	public static function sendJS($v){
		global $ajax_instance;
		$ajax_instance->empty = false;
		if($ajax_instance->type != 'js'){
			$ajax_instance->type = 'js';
		}
		
		$ajax_instance->buffer.= $v;
	}
	public static function sendPHP($v){
		global $ajax_instance;
		$ajax_instance->empty = false;
		if($ajax_instance->type != 'php'){
			$ajax_instance->type = 'php';
		}
		
		$ajax_instance->buffer.= serialize($v);
	}
	public static function loadAJAX($v){
		global $ajax_instance;
		
		if(isset($v['callback'])){
			$ajax_instance->type = 'jsonp';
			$ajax_instance->callback = $v['callback'];
		}
		$ajax_instance->data = $v;
		$ajax_instance->buffer = '';
	}
	public static function sendResponse(){
		global $ajax_instance;
		
		if(count($ajax_instance->ui_instances) > 0){
			$ajax_instance->type = 'js';
			foreach($ajax_instance->ui_instances as $w){
				$w->sendJS();
			}
		}
		
		//error_log('Response: ' . print_r($ajax_instance, true) );
		
		if($ajax_instance->type == 'text'){
			header('Content-type: text/plain');
			print $ajax_instance->buffer;
		}elseif($ajax_instance->type == 'json'){
			header('content-type: text/json');
			//header('content-length: ' . strlen($ajax_instance->buffer) + 1);
			//header('content-length: ' . '80');
			print $ajax_instance->buffer . "\n";
			
		}elseif($ajax_instance->type == 'php'){
			header('Content-type: text/plain');
			print $ajax_instance->buffer;
		}elseif($ajax_instance->type == 'js'){
			header('Content-Type: text/javascript; charset=UTF-8');
			print $ajax_instance->buffer;
		}elseif($ajax_instance->type == 'jsonp'){
			header('Content-type: text/json');
			header("content-type: Access-Control-Allow-Origin: *");
			header("content-type: Access-Control-Allow-Methods: GET");
			print 	$ajax_instance->callback . '(' . $ajax_instance->buffer . ')';
			
			//error_log('Response: ' . $ajax_instance->callback . '(' . $ajax_instance->buffer . ')' );
		}
		
	}
}
?>