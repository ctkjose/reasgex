<?php
namespace reasg;
//require_once($REA_USE_VIEW_UI);

$app_extended_view_helpers = array();
$rea_app_controller_page = null;
$app_controller = null;
$client_controller = null;

$app_state = [
	'ended' => false,
	'commited' => false,
	'headers'=>['Content-Type'=> 'text/html; charset=UTF-8'],
	'buffer'=>''
];
class client_controller extends \reasg\core\controller {
	public $data = ['cmd'=>[]];
	public function messagebox($m){
		$this->data['cmd'][] = ['cmd'=>'display_msg', 'msg'=>$m];
	}
	public function alert_success($m){
		$this->data['cmd'][] = ['cmd'=>'display_alert','type'=>'success', 'msg'=>$m];
	}
	public function alert_info($m){
		$this->data['cmd'][] = ['cmd'=>'display_alert','type'=>'info', 'msg'=>$m];
	}
	public function alert_warning($m){
		$this->data['cmd'][] = ['cmd'=>'display_alert','type'=>'warning', 'msg'=>$m];
	}
	public function alert_error($m){
		$this->data['cmd'][] = ['cmd'=>'display_alert','type'=>'danger', 'msg'=>$m];
	}
	public function redirect($url, $m = 'Redirecting...'){
		$this->data['cmd'][] = ['cmd'=>'redirect', 'msg'=>$m, 'url'=>$url];
	}
	public function executeJS($js){
		$this->data['cmd'][] = ['cmd' => 'js', 'code'=>$js];
	}
	
}
class app_controller extends \reasg\core\controller {
	public static function init(){
		global $app_controller, $client_controller, $app; 
		$app_controller = new app_controller();
		$app = $app_controller;
		
		$client_controller = new client_controller();
	}
	public static function instance(){
		global $app_controller;
		return $app_controller;
	}
	public function header($n, $v){
		global $app_state;
		$k = strtolower($n);
		$app_state['headers'][$n] = $v;
	}
	public function sendHeaders(){
		global $app_state, $app_controller;
		if($app_state['commited']) return;
		$this->dispatchEvent("app_send_headers", [$this]);
		
		foreach($app_state['headers'] as $k=>$v){
			header($k . ': ' . $v, true);
		}
		
	}
	
	public function write($a){
		global $app_state;
		if( is_string($a) ){
			$app_state['buffer'] .= $a;
		}elseif( is_object($a) && method_exists($a, "getHTML") ){
			$app_state['buffer'] .= $a->getHTML();
		}
	}
	public function sendJSON($a){
		$this->header('Content-Type','text/json');
		
		$s = json_encode($a);
		$this->write($s);
		
		$this->end();
	}
	public function sendView($a){
		$this->sendHeaders();
		$app_state['commited'] = true;
		
		if( is_string($a) ){
			print $a;
		}elseif( is_object($a) && method_exists($a, "getHTML") ){
			print $a->getHTML();
		}
		
		$this->end();
	}
	public function sendDownloadWithFile($mime, $file){
		global $app_state;
		
		if($app_state['commited']) return;
		
		$this->header('content-type', $mime);
		
		$basename = basename($filename);
		$this->header('content-disposition', 'attachment; filename="' . urlencode($basename) . '');
		
		$this->sendHeaders();
		$app_state['commited'] = true;
		
		$size = filesize($filename);
		$fp = fopen($filename, "r");
		while( !feof($fp) ){
			print fread($fp, 65536);
			flush(); // this is essential for large downloads
		}
		fclose($fp);

		$this->end();
	}
	public function sendDownloadWithData($mime, $filename, $data){
		global $app_state;
		
		if($app_state['commited']) return;
		
		$this->header('content-type', $mime);
		
		if(!is_null($filename)){
			$this->header('content-disposition', 'attachment; filename="' . urlencode($basename) . '');
		}else{
			$this->header('content-disposition', 'attachment;');
		}
		
		$size = strlen($data);
		$this->header('content-length', $size);

		$this->sendHeaders();
		$app_state['commited'] = true;
		
		print $data;
		$this->end();
	}
	public function commit(){
		global $app_state, $app_controller;
		error_log("at_commit");
		if($app_state['commited']) return;
		
		$this->sendHeaders();
		$this->dispatchEvent("app_send_output", [$this]);

		$app_state['commited'] = true;
		print $app_state['buffer'];
	}
	public function end(){
		global $app_state, $app_controller;
		$app_state['ended'] = true;
		
		if(!$app_state['commited']){
			self::commit();
		}
		error_log("at_end");
		$app_controller->dispatchEvent("app_end",[]);
	
		flush();
		exit;
	}
	public function abort(){
		global $app_state, $app_controller;
		$app_state['ended'] = true;
		
		$app_controller->dispatchEvent("app_abort", []);
		$app_controller->dispatchEvent("app_end", []);
		flush();
		exit;
	}
}

class view_controller extends \reasg\core\controller {
	public $location = '';
	public $scope = '';
	
	public static function run(){
		
	}
	public function appController(){
		global $app_controller;
		return $app_controller;
	}
}
class process_controller extends \reasg\core\controller {
	public $location = '';
	public $scope = '';
	
	public function appController(){
		global $app_controller;
		return $app_controller;
	}
}


trait ObjectDataSource {
	
	
}


class rea_app_controller1 {
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