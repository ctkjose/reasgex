<?php
namespace reasg;

class ui_datasource extends \reasg\core\base {
	use \reasg\core\ObjectExtendable;

	var $js='';
	var $name = '';
	var $def = ['source'=> 'ajax', 'source_pull'=>'static', 'url'=>'', 'url_find'=>'', 'bind'=> [] ];
	var $items = [];
	var $attr = [];
	var $_private = ['js'=>'', 'cf'=>null];
	public static function createDataset($n){
		$a = new ui_datasource;
		$a->name = $n;
		return $a;
	}
	public static function createCachableDataset($n){
		
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
		$a->name = $n;
		return $a;
	}
	public function __construct(){
		$this->uid = strtoupper(uniqid('DS'));
	}
	public function getHTML(){
		$ob = ['uid' => $this->uid, 'name'=> $this->name, 'attr'=> &$this->attr, 'items'=> &$this->items];
		$js = json_encode($ob);
		unset($ob);
		
		return $js;
	}
	public function __toString(){
		return $this->getHTML();
	}
	function field($n, $v=null){
		$this->_private['cf'] = $n;
		if(!is_null($v)){
			$this->items[$n] = $v;
		}
		if(!isset($this->items[$n])) $this->items[$n] = '';
		
		return $this;
	}
	function attr($an, $av){
		if( is_null($this->_private['cf']) ) return $this;
		$n = $this->_private['cf'];
		if( !isset($this->attr[$n]) ) $this->attr[$n] = [];
		
		$this->attr[$n][$an] = $av;
		return $this;
	}
	function readonly($v = true){
		return $this->attr('ro', ($v?1:0) );
	}
	function decoration($v){
		return $this->attr('dc', $v);
	}
	function placeholder($v){
		return $this->attr('ph', $v);
	}
	function bindToView($sel='.view'){
		$s = $sel . "[name='" . $this->name . "']";
		$this->bindToSelector($s);
	}
	function bindToSelector($sel){
		global $app_controller;
		
		$uid = $this->uid;
		$name = $this->name;
		$view = \reasg\ui_views::getDefaultView();
		//$view->js_ready->write($js);
		
		$js = "var ds = ui_datasource_controller.createDataSourceWithObject('" . $this->name . "', " . $this->getHTML() . ");\n";
		error_log("@bindToSelector {$sel}::default_view_commit =========");
		$m = function($view) use($uid, $name, $sel, $js) {
			error_log("@closure default_view_commit =========");
			$s = "ui_datasource_controller.populateSelectorWithDataset(\"{$sel}\", ui_datasource_controller.getDatsourceWithName(\"{$name}\") );\n";
			
			$view->js_ready->write($s);
			
			$view->js_payload->write($js);
		};
	
		$app_controller->on('default_view_commit', $m);
	}
	public function send(){
		global $app_controller;
		
		$app_controller->sendJSON($this);
	}
	public function setItems($items){
		$this->items = $items;	
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