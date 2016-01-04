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
	'buffer'=>'',
	'cc' => [],
	'interactions'=>[],
	'current_interaction'=> null,
];

/** client_interaction is half baked idea
 * moved to implement client interactions on the js side
 * there still scenarios for php interactions, but i'll
 * wait to see how push-views, templates and js interactions
 * pan out
 */
class client_interaction {
	public $verb = null;
	public $owner = null;
	public $sel = '';
	public $name = '';
	
	public function __construct($name, $verb='when', $scope='default' ){
		
		$this->name = $name;
		$this->sel = $this->item($name);
	}
	private function verbNew($action, $open='{',$close='{' ){
		$this->verb = ['event'=> $action, 'open'=>$open, 'close'=> $close, 'actions'=>[]];
	}
	public function onChange($n=''){
		$a = new \reasg\client_interaction($this->name);
		$a->owner = $this;
		
		$js = "client_interactions.ciOnEvent(" . $this->sel . ",\"change\", function(\$o,value,n,e)";
		$a->verbNew($js, '{', '});');
		
		return $a;
	}
	public function done(){
		if(is_null($this->verb)) return;
		if(!is_object($this->owner)) return;
		
		$js = $this->verb['event'] . "{\n";
		$js.= implode("\n", $this->verb['actions']);
		
		if(isset($this->verb['close'])){
			$js.= $this->verb['close'];
		}else{
			$js.= "}\n";	
		}
		
		$this->owner->execute($js);
		return $this->owner;
	}
	public function execute($js){
		if(is_null($this->verb)) return $this;
		$this->verb['actions'][] = $js;
	}
	public function val($v = null){
		$js = "client_interactions.ciSetValue(" . $this->sel . "," . \js::encode($v) . ");";
		$this->verb['actions'][] = $js;
		return $this;
	}
	public function clear(){
		return $this->val('');
	}
	public function item( $n ){
		$scope = 'default';
		$name = $n;
		$attr = null;
		if( strpos($n,'.')!== false){
			list($scope, $name) = explode('.', $n);
		}
		
		$p1 = strpos($name,'[');
		$p2 = strpos($name,']');
		if( ($p !== false) && ($p2!== false)){
			$attr = substr($name, $p1+1, $p2-($p1+1) );
			$name = substr($name,0, $p1);
		}
		
		$sel = "\".uiw[name='" . $name . "']";
		if(!is_null($attr)) $sel.= "[" . $attr . "]";
		return $sel;
	}
	public function __get($name) {
		
	}
}
class client_controller extends \reasg\core\controller {
	public $data = ['cmd'=>[]];
	public static function addCMD($e){
		global $app_state;
		$app_state['cc'][] = $e;
	}
	
	
	public static function when($n){
		global $app_state;
		$scope = 'default';
		$name = $n;
		if( strpos($n,'.')!== false){
			list($scope,$name) = explode('.', $n);
		}
		
		$o = new client_interaction($name, 'when', $scope);
		$o->verb = ['event'=> '', 'actions'=>[]];
		
		$app_state['current_interaction'] = $o;
		return $o;
	}

	public static function showMessage($m){
		self::addCMD(['cmd'=>'displayMsg', 'msg'=>$m]);
	}
	public static function showAlertSuccess($m){
		self::addCMD(['cmd'=>'displayAlert','type'=>'success', 'msg'=>$m]);
	}
	public static function showAlertInfo($m){
		self::addCMD(['cmd'=>'displayAlert','type'=>'info', 'msg'=>$m]);
	}
	public static function showAlertWarning($m){
		self::addCMD(['cmd'=>'displayAlert','type'=>'warning', 'msg'=>$m]);
	}
	public static function showAlertError($m){
		self::addCMD(['cmd'=>'displayAlert','type'=>'danger', 'msg'=>$m]);
	}
	public static function redirect($url, $m = 'Redirecting...'){
		self::addCMD(['cmd'=>'redirect', 'msg'=>$m, 'url'=>$url]);
	}
	public static function replaceContentWithURL($url, $m = 'Please wait...'){
		self::addCMD(['cmd'=>'pushReplace', 'msg'=>$m, 'url'=>$url]);
	}
	public static function replaceContentWithHTML($html, $m = 'Please wait...'){
		self::addCMD(['cmd'=>'pushReplace', 'msg'=>$m, 'html'=>$html]);
	}
	public static function pushContentWithURL($url, $m = 'Please wait...'){
		self::addCMD(['cmd'=>'push', 'msg'=>$m, 'url'=>$url]);
	}
	public static function pushContentWithHTML($html, $m = 'Please wait...'){
		self::addCMD(['cmd'=>'push', 'msg'=>$m, 'html'=>$html]);
	}
	public static function executeJS($js){
		self::addCMD(['cmd' => 'js', 'code'=>$js]);
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