<?php
namespace reasg;

class ui_datasource extends \reasg\core\base {
	use \reasg\core\ObjectExtendable;

	var $js='';
	var $def = ['source'=> 'ajax', 'source_pull'=>'static', 'url'=>'', 'url_find'=>'', 'bind'=> [] ];
	var $items = [];
	var $attr = [];
	
	public static function dataset(){
		$a = new ui_datasource;
		return $a;
	}
	public static function datasetCachable(){
		
		$flg_exit = false;
		/*
		if(isset($_SESSION['cache_' . $n ])){
			$gmdate_mod = $_SESSION['cache_' . $n ];
			$flg_exit = true;
		}else{
			$gmdate_mod = gmdate('D, d M Y H:i:s') . ' GMT';
			$_SESSION['cache_' . $n ] = $gmdate_mod;
		}
		*/
		
		$gmdate_mod = gmdate('D, d M Y H:i:s') . ' GMT';
		header("HTTP/1.1 304 Not Modified");
		header("Date: $gmdate_mod");
		header("Last-Modified: $gmdate_mod");
		header("Cache-Control: public, max-age=86400, must-revalidate");
		header("Pragma: cache"); 
		header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 86400) . ' GMT');
		
		if($flg_exit) exit;
	
		
		$a = new ui_datasource;
		
		return $a;
	}
	public function __construct(){
		$this->uid = strtoupper(uniqid('DS'));
	}
	public function getHTML(){
		
	}
	public function send(){
		global $app_controller;
		
		$app_controller->sendJSON($this);
	}
	public function append(){
		$ar = func_get_args();
		if(count($ar) == 2){
			$this->items[$ar[0]] = $ar[1];
		}elseif((count($ar)==1) && is_array($ar[0])){
			foreach($ar[0] as $k => $v){
				$this->items[$k] = $v;
			}
		}
	}
	public function appendOptions(){
		$ar = func_get_args();
		if(count($ar) == 2){
			$this->items[] = array($ar[0], $ar[1]);
		}elseif((count($ar)==1) && is_array($ar[0])){
			foreach($ar[0] as $k => $v){
				$this->items[] = array($k, $v);
			}
		}
	}
	
	
}
?>