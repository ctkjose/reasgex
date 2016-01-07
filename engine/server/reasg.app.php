<?php
namespace reasg;

global $reasg_path_mapper;


class app {
	use \reasg\core\ObjectBase, \reasg\core\ObjectExtendable;
	
	private static $route= null;
	private static $path=REASG_ROOT_PATH;
	
	public static function run(){
		global $app_state;
		global $app_controller;
		
		
		$route = \reasg\router::loadFromRequest();
		self::$route = $route;
		
		
		reasg_dev_dump($_REQUEST, '$_REQUEST');
		reasg_dev_dump($route, '$route');
		
		
		$app_controller->dispatchEvent("app_init_with_route", [$route]);
		
		//print "ROOT=" . REASG_ROOT_PATH . "\n";
		//print "ENGINE=" . REASG_ENGINE_PATH . "\n";
		//print "ENGINE_JS=" . REASG_ENGINE_JS_PATH . "\n";
		
		if( isset($route['controller']) && isset($route['scope']) ){
			
			$p =  REASG_ROOT_PATH . $route['scope'] . '/' . $route['controller'] . '.controller.php';
			if(!file_exists($p)){
				///TODO: error handler
				return;
			}
			
			self::$path = REASG_ROOT_PATH . $route['scope'] . '/';
			define('REASG_SELF_DIRECTORY', self::$path);
			define('REASG_SELF_PATH', $p);
			
			include_once($p);
			
			$frs = '\\' .  $route['scope'] . '\\'. $route['controller'];
			
			define('REASG_SELF_LOCATION', $route['location']);
			define('REASG_SELF_SCOPE', $route['scope']);
			define('REASG_SELF_CONTROLLER', $route['controller']);
			define('REASG_SELF_CONTROLLER_ACTION', $route['action']);
			define('REASG_SELF_CONTROLLER_CLASS', $frs);
			
			define('REASG_SELF_URL', ''); ///TODO how to do this nice!
					
			$app_controller->dispatchEvent("app_init_controller", [$frs]);
		
			$a = new $frs;
			$a->scope = $route['scope'];
			$a->location = $route['location'];
			$a->controller = $app_controller;
			if( method_exists($a, 'initialize') ){
				call_user_func([$a, 'initialize'], $route['values']);
			}
			
			$app_controller->dispatchEvent("app_start", $route);
			
			if( method_exists($a, $route['action']) ){
				call_user_func([$a, $route['action']], $route['values']);
			}elseif( method_exists($a, 'main') ){
				call_user_func([$a, 'main'], $route['values']);
			}
			
			if(!$app_state['ended']){
				$app_controller->commit();
				$app_controller->end();
			}
			
		}
	}
	
	public static function bundle(){
		static $bndl = null;
		if(!is_null($bndl)) return $bndl;
		
		$p = isset(app::$route['scope']) ? app::$path : REASG_ROOT_PATH;
		$bndl = new appBundle($p);
		
		return $bndl;
	}
}


function url_app_assets($f, $controller=null, $arguments=[]){
	
	$s = (is_null($controller)) ? REASG_SELF_CONTROLLER_CLASS : $controller;
	if(substr($s,0,1) == '\\'){
		//$controller the name of a controller class including its namespace
		$parts = explode('\\', $s);
		$scope = $parts[1];
	}else{
		//$controller could be the name of a namespace/scope
		$scope = $controller;
	}
	
	if(substr($f, 0,2) == "./"){
		$r = substr($f, 2);
	}elseif(substr($f, 0,1) == "/"){
		$r = substr($f, 1);
	}else{
		$r = $f;
	}
	if(substr($r,0,7) != 'assets/') $r = 'assets/' . $r;
	
	global $reasg_path_mapper;
	return $reasg_path_mapper($scope, $r, '', $arguments);
}
function url_app_controller($controller, $event='main', $arguments=[]){
	
	$s = (is_null($controller)) ? REASG_SELF_CONTROLLER_CLASS : $controller;
	//$controller the name of a controller class including its namespace
	
	$parts = explode('\\', $s);
	$scope = $parts[1];
	$f = $parts[2] . ".controller.php";
	
	global $reasg_path_mapper;
	return $reasg_path_mapper($scope, $f, $event, $arguments);
}

class appBundle extends \reasg\core\base {
	var $scope = '';
	var $path = '';
	public static function create($scope=null, $p = null){
		$f = new \reasg\appBundle($scope);

		if(is_null($p)) return $f;
		
		
		if($p == '@engine'){
			$f->scope = 'engine';	
		}elseif($p == '@assets'){
			$f->path = '/assets/';
		}elseif($p == '@base'){
			$f->path = '';
		}else{
			$f->path = $p;
		}
		
		return $f;
	}
	function __construct($scope=null){
		if(is_null($scope)){
			$this->scope = REASG_SELF_SCOPE;
		}else{
			$this->scope = $scope;
		}
		
		error_log("@appFileRef.constructur");
	}
	public function realPath(){
		$p = REASG_ROOT_PATH . $this->scope . $this->path;
		error_log("REALPATH=" . $p);
		return $p;
	}
	public function __get($name) {
		//$config = rea_app::getConfig();
		if($name == 'url'){
			$p = explode('/', $this->path);
			if(isset($p[1]) && ($p[1] == 'assets') ){
				unset($p[0]);unset($p[1]);
				$f = implode('/', $p);
				error_log("f=" . $f);
				
				$url = url_app_assets($f, $this->scope);
				error_log("url=" . $url);
				return $url;
			}elseif(($this->scope=='engine') && isset($p[1]) ){
				unset($p[0]);
				
				$k = [0=>'',1=>'engine'];
				if($p[1] == 'js'){
					$k[0] = 'js'; unset($p[1]);
				}elseif($p[1] == 'css'){
					$k[0] = 'css'; unset($p[1]);
				}elseif($p[1] == 'vendor'){
					$k[0] = 'vendor'; unset($p[1]);
				}
				$k = array_merge($k, $p);
				
				$f = REASG_ROOT_URL . implode('/', $k);
				
				error_log("f=" . $f);
				return $f;
			}
			return $this->path;
		}elseif($name == 'is_directory'){
			return is_dir($this->realPath());
		}elseif($name == 'is_readable'){
			return is_readable($this->realPath());
		}

		$this->path.= ( (substr($this->path,-1,1) != '/') ? '/' : '') . $name . '/';

		error_log("path=[" . $this->path . "]");
		return $this;
	}
	public function file_extension($u){
		$l = strlen($u);
		if( substr($u, $l-1,1) == '/' ) return 'dir';
		
		$e = '';
		$n = basename($u);
		$p = explode('.', $u);
		if( count($p) > 0) $e = strtolower($p[count($p)-1]);
		return $e;
	}
	public function file_type($u){
		$l = strlen($u);
		if( substr($u, $l-1,1) == '/' ) return 'dir';
		
		$e = $this->file_extension($u);
		$n = basename($u);
		$p = explode('.', $u);
		if( count($p) > 0) $e = strtolower($p[count($p)-1]);
		
		if( in_array( $e, ['gif','jpg', 'jpeg', 'svg', 'png']) ){
			$e = 'img';
		}
		if( in_array( $e, ['htm','html']) ){
			$e = 'html';
		}
		if( in_array( $e, ['rb', 'js', 'php']) ){
			$e = 'code';
		}
		
		return $e;	
	}
	public function contents(){
		return file_get_contents($this->realPath());	
	}
	public function each($m='*', $callback){
		$p = $this->realPath();
		if(!is_dir($p)) return;
		
		$p = $p . ( (substr($p,-1,1) != '/') ? '/' : '');
		$o = (substr($this->path,-1,1) == '/') ? substr($this->path,0,strlen($this->path)-1) : $this->path;
		
		$items = glob($p . '*' , GLOB_MARK);
		foreach($items as $a){
			$a = \reasg\core\paths_rel2p($a, $p);
			$this->path =  $o . $a;
			call_user_func_array($callback, [$this]);
		}
		
		$this->path =  $o;
	}
	public function child($name){
		$f = new \reasg\appBundle($this->scope);
		$f->path = $this->path . ( (substr($this->path,-1,1) != '/') ? '/' : '') . $name;
		return $f;
	}
	public function all($m='*'){
		$s = '';
		$fn = function($f) use(&$s) {
			$s.= $f->html() . "\n";
		};
		
		$this->each($m, $fn);
		return $s;
	}
	public function html($tag = null){
		$u = $this->url;

		if($tag == null){
			if(substr($u, -3,3) == '.js') $tag = 'js';
			if(substr($u, -4,4) == '.css') $tag = 'css';
			if(substr($u, -4,4) == '.png') $tag = 'img';
			if(substr($u, -4,4) == '.gif') $tag = 'img';
			if(substr($u, -4,4) == '.jpg') $tag = 'img';
			if(substr($u, -5,5) == '.html') $tag = 'a';
			if(substr($u, -4,4) == '.php') $tag = 'a';
		}

		if($tag == 'img'){
			$s = "<img src='{$u}'>";
		}elseif($tag == 'css'){
			$s = "<link rel='stylesheet' href='{$u}'>";
		}elseif($tag == 'a'){
			$s = "<a href='{$u}' title='{$u}'>{$u}</a>";
		}elseif($tag == 'js'){
			$s = "<script type='text/javascript' src='{$u}'></script>";
		}else{
			$s = "<{$tag}></{$tag}>";
		}
		
		return $s;
	}
}


