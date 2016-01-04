<?php
namespace reasg;
$rea_views_path = '';
$ui_default_view = null;

class ui_views extends \reasg\core\base {
		
	public static function getViewFileWithName($n){
		///N:Helper method to get a path to a view from the default locations
		global $rea_config;
		if( isset( $rea_config['views'] ) && isset( $rea_config['views']['views_path'] ) ){
			$s = $rea_config['views']['views_path'];
		}elseif( file_exists( REASG_SELF_DIRECTORY . "views/") ){
			$s = REASG_SELF_DIRECTORY . "views/";
		}elseif( file_exists( REASG_ROOT_PATH . "views/") ){
			$s = REASG_ROOT_PATH . "views/";
		}else{
			$s = REASG_ENGINE_PATH . "views/";
		}
		
		$rea_config['rea_views']['views_path'] = $s;
		return $s . $n . '.html';
	}
	public static function setViewsPath($p){
		///N:changes the default path for views
		global $rea_config;
		
		$rea_config['rea_views']['views_path'] = $p;
	}
	public static function getDefaultView(){
		global $app_controller, $ui_default_view, $rea_views_path;
		return $ui_default_view;
	}
	public static function createDefaultView($view = null){
		///N:create a default template and prints its content on commit
		///P:$view:An optional string with a view's name or an instance of rea_view or rea_template, if non is given the 'default_page' will be loaded.

		global $app_controller, $ui_default_view, $rea_views_path;
		if( $ui_default_view == null){
			
			
			if($view == null){
				$ui_default_view = ui_view::createWithSource( 'default_page', file_get_contents(REASG_ENGINE_PATH . 'views/default.view.html'));
			}elseif(is_object($view) && is_a($view, 'rea_template') ){
				$ui_default_view = $view;
			}else{
				$ui_default_view = ui_view::create( $view );
			}
			
			$m = function(){
				global $ui_default_view;
				global $app_controller;
				
				$app_controller->dispatchEvent("default_view_commit", [ $ui_default_view ] );
				$app_controller->write($ui_default_view);

			};
			
			$app_controller->on('app_send_output', $m);

			//rea_app_controller::on('default_view_commit', 'rea_views::attachJSBToView');
		}
		
		return $ui_default_view;
	}
}
class ui_template extends \reasg\core\base {
	public $elements_def = array();
	public $fields = array();
	private $current_field = null;
	public static function setViewsPath($p){
		global $rea_views_path;
		$rea_views_path = $p;
	}
	public function value($k){
		if(isset($this->fields[$k])) return $this->fields[$k]['value'];
		return '';
	}
	public function set(){
		$c = func_num_args();
		if($c < 1) return;

		if($c == 1){
			$x = func_get_arg(0);

			if(is_array($x)){
				foreach($x as $k => $v){
					$this->fields[$k] = [ 'name'=> $k, 'value'=> $v  ];
				}
			}elseif(is_string($x)){
				$this->fields[$x] = $x;
			}else{
				
			}
		}else if($c == 2){
			$k = func_get_arg(0);
			$v = func_get_arg(1);
			
			$this->fields[$k] = [ 'name'=> $k, 'value'=> $v ];
		}
		
		return $this;
	}
	public function __toString() {
		return $this->getHTML();
	}
	public function getHTML(){
		$s = $this->src;
		
		//print "<pre> src=" . htmlentities($s, true) . "</pre><br>";
		//print "<pre> fields=" . var_export($this->fields, true) . "</pre><br>";
		foreach($this->elements_def as $ridx => $e){
			$v ='';
			if(substr($e['n'], 0,1) == '@'){
				$const = get_defined_constants(true);
				$e['n'] = substr($e['n'], 1);
				if(isset($const['user'][$e['n']])){
					$v= $const['user'][$e['n']];
					$e['n']=$v;
				}
			}
			
			if( isset($e['idx']) ){
				//print "{$e['t']}::{$e['n']}::array::{$e['idx']}<br>";
				if(isset($this->fields[$e['n']]) && is_array($this->fields[$e['n']]['value']) && isset($this->fields[$e['n']]['value'][$e['idx']]) ){
					$v = $this->fields[$e['n']]['value'][$e['idx']];
					$e['n'] = $e['idx'];
				}else{
					$v = '';
				}
			}else if( isset($this->fields[$e['n']]) ){
				//print "{$e['t']}::{$e['n']}::regular value<br>";
				$v = $this->fields[$e['n']]['value'];
			}
			//print "<pre> element[{$ridx}]::{$e['t']}::{$e['n']}::{$e['idx']}<blockquote>\n";
			if($e['t'] == 'repeat'){
				//print "{$e['t']}::{$e['n']}::repeat<br>";
				$v = $this->process_repeat($ridx, $e, $v);
			}else if($e['t'] == 'if'){
				$v = $this->process_if($ridx, $e, $v);
			}else if($e['t'] == 'unless'){
				$v = $this->process_unless($ridx, $e, $v);
			}else if($e['t'] == 'ignore'){
				$v = $e['value'];
			}
			
			if(is_object($v) && !method_exists($v, '__toString') ) $v = '';
			
			if($e['t'] == 'url'){
				$v = urlencode($v);
			}else if($e['t'] == 'html'){
				$v = htmlentities($v);
			}
			//print "v[$ridx]=" . var_export($v, true) . "<br>";
			//print "</blockquote></pre><br>";
			$s = str_replace('<<' . $ridx . '>>', $v, $s);
		}
		
		return $s;
	}
	public function addFile($value, $attr = null){
		///N:includes a css or js, etc
		if(is_null($this->current_field)) return $this;
		
		if($this->current_field == 'js'){
			$this->fields['js']['value']['includes'][]= ['url'=>$value, 'attr'=> ''];
		}elseif($this->current_field == 'css'){
			$m = '';
			if(empty($attr)){
				$m = "media='all'";
			}else{
				foreach($attr as $k => $v){
					$m.= $k . '="' . $v . '" ';
				}
			}
			$this->fields['css']['value']['includes'][]= ['url'=>$value, 'attr'=> $m];
		}else{
			$this->fields[$this->current_field]['value'] .= file_get_contents($value);
		}
		return $this;
	}
	public function write($value){
		if(is_null($this->current_field)) return $this;
		if(is_object($value) && !method_exists($value, '__toString') ){
			$value = '';
		}
		
		$s = $value;
		
		if(( $this->current_field == 'js') || ( $this->current_field == 'css') ){
			$this->fields[$this->current_field]['value']['inline'].= $s;
		}else{
			$this->fields[$this->current_field]['value'].= $s;
		}
	
		return $this;
	}
	public function insert($value){
		///N: inserts an existing file (css, js, txt, etc) into the current part...
		static $inserted; 
		if(is_null($this->current_field)) return $this;
		
		if(!isset($inserted)){
			$inserted = array();
		}
		
		$p = '' . $value;
		if(isset($inserted[$this->current_field])){
			if(in_array($p, $inserted[$this->current_field]) ) return $this;
		}else{
			$inserted[$this->current_field] = array();
		}
		
		$inserted[$this->current_field][] = $p;
		$s = file_get_contents($p);
			
		if($this->current_field == 'js'){
			$this->fields[$this->current_field]['value']['inline'] .= $s;
		}elseif($this->current_field == 'css'){
			$this->fields[$this->current_field]['value']['inline'] .= $s;
		}else{
			$this->fields[$this->current_field]['value'].= $s;
		}
		return $this;
	}
	public function __get($name){
		if(isset($this->fields[$name]) && is_object($this->fields[$name]['value']) ){
			return $this->fields[$name]['value'];
		}
		
		if($name == 'js'){
			$this->current_field = 'js';
			if(!isset($this->fields['js'])){
				$this->fields['js'] = array( 'name'=> 'js', 'value'=> ['includes'=> [], 'inline'=>'' ] );
			}
			return $this;
		}elseif($name == 'css'){
			$this->current_field = 'css';
			if(!isset($this->fields['css'])){
				$this->fields['css'] = array( 'name'=> 'css', 'value'=> ['includes'=> [], 'inline'=>'' ] );
			}
			return $this;
		}
		
		if(!isset($this->fields[$name])){
			$this->fields[$name] = array( 'name'=> $name, 'value'=> '' , 'attr'=> array() );
		}
		
		$this->current_field = $name;
		
		return $this;
	}
	public static function create($n){
		$f = ui_views::getViewFileWithName($n);
		return self::createWithSource($n, file_get_contents($f), dirname($f) );
	}
	public static function getSourceWithIncludes($src, $basePath = REASG_SELF_DIRECTORY){
		//print REASG_SELF_DIRECTORY . "=" . $basePath . "\n";
		chdir($basePath);
		
		$out = $src;
		$r = "/\{\{include\(([a-z|A-Z|0-9|_|\[|\]|\.|\/|\-]*)\)\}\}/";
		preg_match($r, $out, $m, PREG_OFFSET_CAPTURE);
		while($m != null){
			//print "<pre>m1=" . var_export($m, true) . "</pre>";
			$x1 = $m[0][1];
			$x2 = $x1 + strlen($m[0][0]);
			$n = $m[1][0];
			
			//$f = rea_views::getViewFileWithName($n);
			$f = realpath($n);
			$s = ( file_exists($f) ) ? self::getSourceWithIncludes( file_get_contents($f), dirname($f) ) : '';
			$out = substr($out, 0, $x1) . $s . substr($out, $x2);
			
			preg_match($r, $out, $m, PREG_OFFSET_CAPTURE);
		}
		//print "<pre>" . htmlentities($out) . "</pre>";
		return $out;
	}
	public static function createWithSource($name, $src, $basePath = REASG_SELF_DIRECTORY){
		
		$a = new ui_template;
		$a->name = $name;
		$a->initializeSource( self::getSourceWithIncludes($src, $basePath) );
		return $a;
	}
	public function initializeSource($src){
		$this->src = $src;
		$rv = "([a-z|A-Z|0-9|_|\[|\]|\.|\-]*)";
		$parts = array(
			['t'=> 'ignore', 'r'=> "(\#ignore)"],
			['t'=> 'repeat', 'r'=> "\#repeat {$rv}"],
			['t'=> 'if', 'r'=> "\#if {$rv}"],
			['t'=> 'unless', 'r'=> "\#unless {$rv}"],
			['t'=> 'url', 'r'=> "url\({$rv}\)"],
			['t'=> 'html', 'r'=> "html\({$rv}\)"],
			['t'=> 'value', 'r'=> "([a-z|A-Z|0-9|_|\[|\]|\.|\@]*)"],
		);
		
		
		
		//print "k<pre>" . htmlentities($this->src) . "</pre>";
		$ridx = 0;
		foreach($parts as $p){
			$r = "/\{\{" . $p['r'] . "\}\}/";
			unset($m);
			preg_match($r, $this->src, $m, PREG_OFFSET_CAPTURE);
			
			while($m != null){
				$ridx++;
				//print "<pre>m1[{$p['t']}]=" . var_export($m, true) . "</pre>";
				$x1 = $m[0][1];
				$x2 = $x1 + strlen($m[0][0]);
				
				$e = ['t'=>$p['t'] , 'n'=> $m[1][0] ];
				
				if (preg_match("/([a-z|A-Z|0-9|_]*)\[([a-z|A-Z|0-9|_|\.]*)\]/", $e['n'], $n1)){
					$e['n'] = $n1[1];
					$e['idx'] = $n1[2];
				}
				
				
				if($e['t'] == 'repeat'){
					$n = str_replace(']', '\]', str_replace('[', '\[', $m[1][0]));
					$r1 = "/\{\{end {$n}\}\}/";
					//print "repeat looking for $r at $x1<br>";
					if (preg_match($r1, $this->src, $n1,PREG_OFFSET_CAPTURE, $x2 )){
						$x3 = $n1[0][1];
						$e['src'] = ui_template::createWithSource( $e['n'], substr($this->src, $x2, $x3-$x2-1) );
					
						$x2 = $x3 + strlen($n1[0][0]);
					}
				}
				if($e['t'] == 'if'){
					$n = str_replace(']', '\]', str_replace('[', '\[', $m[1][0]));
					$r1 = "/\{\{end if {$n}\}\}/";
					if (preg_match($r1, $this->src, $n1,PREG_OFFSET_CAPTURE, $x2 )){
						$x3 = $n1[0][1];
						$e['src'] = ui_template::createWithSource( $e['n'], substr($this->src, $x2, $x3-$x2-1) );
						$x2 = $x3 + strlen($n1[0][0]);
					}
				}
				if($e['t'] == 'unless'){
					$n = str_replace(']', '\]', str_replace('[', '\[', $m[1][0]));
					$r1 = "/\{\{end unless {$n}\}\}/";
					if (preg_match($r1, $this->src, $n1,PREG_OFFSET_CAPTURE, $x2 )){
						$x3 = $n1[0][1];
						$e['src'] = ui_template::createWithSource( $e['n'], substr($this->src, $x2, $x3-$x2-1) );
						$x2 = $x3 + strlen($n1[0][0]);
					}
				}
				if($e['t'] == 'ignore'){
					$r = "/\{\{end ignore\}\}/";
					if (preg_match($r, $this->src, $n1,PREG_OFFSET_CAPTURE, $x2 )){
						$x3 = $n1[0][1];
						$e['value'] =  substr($this->src, $x2, $x3-$x2-1);
					
						$x2 = $x3 + strlen($n1[0][0]);
					}
				}
				
				$this->src = substr($this->src, 0, $x1) . '<<' . $ridx . '>>' . substr($this->src, $x2);
				$this->elements_def[$ridx] = $e;
				preg_match($r, $this->src, $m, PREG_OFFSET_CAPTURE);
			}
		}	
	}
	public function process_repeat($ridx, $e, $a){
		$e['src']->fields = $this->fields;
		
		if(!is_array($a) ) return '';
	
		$rows = "";
		foreach( $a as $a1){
			foreach( $a1 as $k => $v){
				//print "@process_repeat::{$e['n']}::[{$k}]<blockquote><pre>" . var_export($v, true) . "</pre>";
				$e['src']->fields[$k] = array('name'=>$k, 'value'=>$v);
				//print "</pre></blockquote>";
			}
			$rows = $rows . $e['src']->getHTML();
		}
		
		return $rows;
		
	}
	public function process_if($ridx, $e, $v){
		$e['src']->fields = $this->fields;
		
		if(!isset($this->fields[$e['n']]) || !($v) ){
			return '';
		}
		
		return $e['src']->getHTML();
	}
	public function process_unless($ridx, $e, $v){
		$e['src']->fields = $this->fields;
		
		if(!isset($this->fields[$e['n']]) || ($v) ){
			return '';
		}
		
		return $e['src']->getHTML();
	}
	
}
class ui_view extends ui_template {
	var $data = [];
	var $backend_url = REASG_SELF_URL;
	var $file_includes = [];
	var $manifest = null;
	var $manifest_path = null;
	var $sub_views = [];
	public static function create($n){
		$f = ui_views::getViewFileWithName($n);
		return self::createWithSource($n, file_get_contents($f), dirname($f));
	}
	public static function createWithSource($name, $src, $basePath = REASG_SELF_DIRECTORY){
		$a = new ui_view;
		$a->name = str_replace('.','_', $name);
		
		
		$a->initializeSource( self::getSourceWithIncludes($src, $basePath) );
		return $a;
	}
	public function includeFile($p){
		if(is_object($p) && !method_exists($p, '__toString') ){ return false; }
		
		//$u = rea_router::path_relative($p, null);
		
		if(in_array($p, $this->file_includes)) return;
		array_push($this->file_includes, $p);
		$s = '';
		switch(rea_files::file_extension($p)){
			case 'js':
				$s= "<script type='text/javascript' src='{$p}'></script>";
				break;
			case 'css':
				$s= "<link rel='stylesheet' href='{$p}' media='all'>";
				break;
		}
		$this->header->write($s . "\n");
	}
	public function loadManifest($mp){
		
		$data = json_decode( file_get_contents($mp), true);
		if($this->manifest != null){
			$this->manifest = array_merge($this->manifest, $data);
		}else{
			$this->manifest = $data;
		}
		
		if(isset($this->manifest['include'])){
			foreach($this->manifest['include'] as $p){
				$p = rea_files::expandPath($p);
				$this->includeFile($p);
			}
		}
		
	}
	public function setField(){
		$c = func_num_args();
		//xdebug_break();
		if($c < 1) return;

		if($c == 1){
			$x = func_get_arg(0);

			if(is_array($x)){
				foreach($x as $k => $v){
					$this->data[] = [ 'name'=> $k, 'value'=> $v  ];
					$this->fields[$k] = [ 'name'=> $k, 'value'=> $v ];
				}
			}elseif(is_string($x)){
				$this->data[] = [ 'name'=> $x, 'value'=> $x  ];
				$this->fields[$x] = [ 'name'=> $x, 'value'=> $x  ];
			}else{
				
			}
		}else if($c == 2){
			$k = func_get_arg(0);
			$v = func_get_arg(1);
			
			$this->data[] = [ 'name'=> $k, 'value'=> $v ];
			$this->fields[$k] = [ 'name'=> $k, 'value'=> $v ];
		}
		
		
		return $this;
	}
	public function getHTML(){
		
		$mp = ($this->manifest_path != null) ? $this->manifest_path : REASG_SELF_DIRECTORY . 'manifest.js';
		if( file_exists($mp) ) $this->loadManifest($mp);
		
		$payload = [
			'view_name'=> $this->name,
			'location'=> REASG_SELF_LOCATION,
			'scope'=>REASG_SELF_SCOPE,
			'controller'=>REASG_SELF_CONTROLLER_CLASS,
			'url'=> 'app/' . REASG_SELF_LOCATION . '/' . REASG_SELF_SCOPE . '/' . REASG_SELF_CONTROLLER . '/',
			'action'=> REASG_SELF_CONTROLLER_ACTION,
		];
		
		$s = "<script type='text/javascript'>\n";
		$s.= "var view_options = " . json_encode($payload) . ";\n";
		
		if(!empty($this->data)){
			//$s.= "rea_views.setViewDataFromJSON(\"{$this->name}\", " . json_encode($this->data ) . ");\n";
		}
		$s.= "</script>";
		
		$this->body->write($s);
		$html = parent::getHTML();
		return $html;
	}
}
?>