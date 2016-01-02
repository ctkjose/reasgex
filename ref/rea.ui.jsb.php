<?php
///N:Implements the Javascript Bridge

//header('Content-type: text/javascript');

$rea_ui_datasources = [];

class rea_ui_dataset {
	var $items = array();
	var $status = 200;
	function append($k, $v){
		$this->items[$k] = $v;
	}

	function send(){
		ajax::sendJSON($this);
	}
}

class rea_ui_datasource extends rea_object_base {
	var $js='';
	var $def = array('source'=> 'ajax', 'source_pull'=>'static', 'url'=>'', 'url_find'=>'', 'bind'=> array(), 'items'=> array() );
	var $items = array();
	
	function __construct(){
		$this->uid = strtoupper(uniqid('DS'));
	}
	static function dataset(){
		$a = new rea_ui_dataset;
		return $a;
	}
	static function cachableDataset($n){
		
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
		
		error_log("============ Called cachableDataset {$n} {$gmdate_mod} ==========================================" );
		
		if($flg_exit) exit;
	
		error_log("============ Creating cachableDataset {$n} {$gmdate_mod} ==========================================" );
		
		$a = new rea_ui_dataset;
		
		return $a;
	}
	static function createWithAppEvent($name, $n, $t = 'static'){
		
		$u = REA_SELF_URL . '?ajax=' . $n;		
		$a = rea_ui_datasource::ajax($u, $t);
		$a->uid = $name;
		
		return $a;
	}
	static function create($x){
		global $rea_ui_datasources;
		///N:Construct a data source from a rest web service
		///N:Pass an absolute URL to a rest service. EX: rea_ui_datasource::create( "http://example.com/ajax.php?list=towns")
		///N:Pass a relative URL to a rest service. EX:  rea_ui_datasource::create( "./rest/ajax.php?list=towns")
		///N:Pass the name of an event that returns rest data. EX: rea_ui_datasource::create( "app_event_towns")
		///N:By default a data source from a web service is "static". Which means is populated only once. If you want to make sure data is fetched always set
		///N:the second optional argument to "dynamic", as in rea_ui_datasource::create( "./rest/ajax.php?list=towns", 'dynamic')

		///N:Construct a datasource from an array.  EX:  rea_ui_datasource::create( $anArray )
		
		$ar = func_get_args();
		if( (count($ar) < 1)){
			return null;
		}
		
		if( is_string($ar[0])  ){
			$s = $ar[0];
			$p = strtolower(substr($s, 0,4));
			$v1 = (count($ar) > 1) ? $ar[1] : 'static';
			
			if( ($p == 'https') || ($p == 'http') || (substr($p,0,1) == '/') || (substr($p,0,2) == './') || (strpos($s,'?') !== false) ){
				return rea_ui_datasource::ajax($s, $v1);
			}elseif( ($p == 'ajax') ){
				$n = parse_url($s);
				if(strlen($n['path']) > 0){
				}
				return rea_ui_datasource::ajax($s, $v1);
			}elseif((substr($s,0,10) == 'app_event_')){
				
				$s = substr($s,10);
				$s = REA_SELF_URL . '?ajax=' . $s;
				return rea_ui_datasource::ajax($s, $v1);
			}
			
			
		}elseif( is_array($ar[0]) ){
			$ds = new rea_ui_datasource;
			$ds->def['source'] = 'json';
			foreach($ar[0] as $k => $v){
				$ds->def['items'][] = [ $k => $v];
			}
			
			$rea_ui_datasources[] = $ds;
			return $ds;
		}
	}
	static function ajax($url, $source_pull = 'static'){
		global $rea_ui_datasources;
		$ds = new rea_ui_datasource;
		$ds->def['source'] = 'ajax';
		$ds->def['source_pull'] = $source_pull;
		$ds->def['url'] = $url;
		
		$rea_ui_datasources[] = $ds;
		return $ds;
	}
	static function commitPayload($view){
		///N:Commits datasources to the page
		global $rea_ui_datasources;
		
		foreach($rea_ui_datasources as $ds){
			$view->js->write($ds);	
		}
	}
	function bind($name, $key){
		//sets a binding tag to a particular key on the returned items array
		$this->def['bind'][$name] = $key;
	}
	function setParam($name, $value){
		///N:adds a parameter to the request
		$js = "{$this->uid}.params[\"{$name}\"] = \"{$value}\";\n";
		$this->js.= $js;
	}
	public function __toString(){
		return $this->getHTML();
	}
	function bindToSelector($sel){
		$js = "$(document).ready(function(){
			rea_controller.bindDatasourceToSelector({$this->uid}, '{$sel}');
		});";
		
		$this->js .= $js;
	}
	function getHTML(){
		$v = json_encode($this->def);
		
		$js = "\nvar {$this->uid} = new rea.datasource('{$this->uid}',{$v}, \n" . json_encode($this->items) . "\n);\n";
		//$js.= "{$this->uid}.items = " . json_encode($this->items) . ";\n";
		$js.= $this->js;
		$js.= "\n";
		
		return $js;
	}
	function appendItems(){
		$ar = func_get_args();
		if(count($ar) == 2){
			$this->items[] = array($ar[0], $ar[1]);
		}elseif((count($ar)==1) && is_array($ar[0])){
			foreach($ar[0] as $k => $v){
				$this->items[$k] = $v;
			}
		}
	}
	function appendOptions(){
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

class  rea_helper_jsb extends rea_object_base {
	
	
	
	
}


$rea_controller->on('default_view_commit', 'rea_ui_datasource::commitPayload');

?>