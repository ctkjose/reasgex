<?php
namespace reasg\core;

define('REASG_ENGINE_PATH', dirname(dirname(__FILE__)) . '/');
define('REASG_ENGINE_JS_PATH', REASG_ENGINE_PATH . 'js/');
define('REASG_ENGINE_PHP_PATH', REASG_ENGINE_PATH . 'reasg/');

define('REASG_ROOT_PATH', dirname(REASG_ENGINE_PATH) . '/');


define('REASG_DOC_ROOT', $_SERVER['DOCUMENT_ROOT']);
define('REASG_RUNMODE_CLI', (isset($_SERVER['SHELL'])) ? 1: 0);
define('REASG_RUNMODE_WEB', (isset($_SERVER['SHELL'])) ? 0: 1);

ini_set(' memory_limit', '-1');
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log','');
error_reporting(E_ALL);

require_once( REASG_ENGINE_PHP_PATH . "reasg.core.controller.php" );

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

?>