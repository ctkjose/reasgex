<?php
namespace reasg\core;

define('REASG_ENGINE_PATH', dirname(dirname(__FILE__)) . '/');
define('REASG_ENGINE_JS_PATH', REASG_ENGINE_PATH . 'js/');
define('REASG_ENGINE_PHP_PATH', REASG_ENGINE_PATH . 'server/');

define('REASG_ROOT_PATH', dirname(REASG_ENGINE_PATH) . '/');


define('REASG_DOC_ROOT', $_SERVER['DOCUMENT_ROOT']);
define('REASG_RUNMODE_CLI', (isset($_SERVER['SHELL'])) ? 1: 0);
define('REASG_RUNMODE_WEB', (isset($_SERVER['SHELL'])) ? 0: 1);

ini_set(' memory_limit', '-1');
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log','');
error_reporting(E_ALL);



define('REASG_ROOT_URL', paths_rel2dr(REASG_ROOT_PATH));

require_once( REASG_ENGINE_PHP_PATH . "reasg.core.controller.php" );
require_once( REASG_ENGINE_PHP_PATH . "reasg.helper.dev.php" );

trait ObjectExtendable {
    public function __call($name, $args) {
        if (is_callable($this->$name)) {
			return call_user_func_array($this->$name, $args);
        }else {
            return null;
        }
    }
    public function __set($name, $value) {
        $this->$name = is_callable($value) ? $value->bindTo($this, $this) : $value;
    }
	public function delegate($name, $fn) {
		if(!is_callable($fn)) return;
        $this->$name = $fn;
    }
	public function delegateFor($name){
		if( !method_exists($this,$name) ) return function(){};
		
		$obj = $this;
		$method = $name;
		
		$fnc = function() use($obj, $method) {
			$args = func_get_args();
			reasg_dev_dump($args[0]);
			call_user_func_array([$obj,$method], $args);
		};
		
		$fnc->bindTo($this, $this);
		return $fnc;
	}
}
trait ObjectBase {
	public function getOwnPropertyNames(){
		return get_object_vars($this);
	}
	public function keys(){
		$a = get_object_vars($this);
		return array_keys($a);
	}
	public function hasOwnProperty($a){
		if(isset($this->$a)) return true;
		if(method_exists($this, $a)) return true;
		return false;
	}
}

class base {
	public function getOwnPropertyNames(){
		return get_object_vars($this);
	}
	public function keys(){
		$a = get_object_vars($this);
		return array_keys($a);
	}
	public function hasOwnProperty($a){
		if(isset($this->$a)) return true;
		if(method_exists($this, $a)) return true;
		return false;
	}
}


function paths_rel2p($f, $p){
	///N:Converts an absolute path to relative assuming is under $p
	if( strpos($f,$p) !== 0 ) return $f;
	$s =str_replace($p, '', $f);
	if(substr($s,0,1)!= '/') $s = '/' . $s;
	return $s;
}
function paths_rel2dr($f){
	///N:Converts an absolute path to relative assuming is under document root
	return paths_rel2p($f, $_SERVER['DOCUMENT_ROOT']);
}
function paths_rel2r($f){
	///N:Converts an absolute path to relative assuming is under root
	return paths_rel2p($f, REASG_ROOT_PATH);
}
?>