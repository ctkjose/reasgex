<?php
define('kapptype_app',0);
define('kapptype_service',1);
define('kapptype_folder',2);

define('REA_APP_CLI_RUN_MULTIPLE', 0); // default, allows to run multiple instance at the same time
define('REA_APP_CLI_RUN_QUEUE', 1);    // allows to run multiple instances, but they run in a queue
define('REA_APP_CLI_RUN_UNIQUE', 2);   // only one instance of the cli can run and all others quit

$rea_app_config_rewrite = array(
	'action',
	'icon',
	'directory_url',
	'base_url',
	'url',
	'full_base_url',
);

class rea_bundle {
	var $path= REA_SELF_DIRECTORY;
	public static function create($base = null){

		$f = new rea_bundle;

		if(is_null($base)){
			$f->path = REA_SELF_DIRECTORY;
		}elseif($base == '@engine'){
			$f->path = REA_ENGINE_PATH;
		}elseif($base == '@root'){
			$f->path = REA_DOC_ROOT;
		}elseif($base == '@base'){
			$f->path = REA_BASE_PATH;
		}else{
			$f->path = $base;
		}

		return $f;
	}
	public static function event_call($a, $params=null, $method='get'){
		global $config;

		$u = $this->url;

		$s = "<form action='{$u}' method='{$method}' name='frm' id='frmr'>";
		if(is_array($params) ){
			foreach ($params as $k => $v) {
				if($k == 'a') continue;
				$s.= "<input type='hidden' name='".htmlentities($k)."' value='".htmlentities($v)."'>";
			}
		}
		$s.= "<input type='hidden' name='a' value='" . htmlentities($a) . "'>";
		$s.= "</form>";
		$s.= "<script type='text/javascript'>";
		$s.= "$(document).ready(function (){ $('#frmr').submit(); } );";
		$s.= "</script>";

		$s.= "<div style='margin: 4px 4px 4px 4px; font-size: 11px; font-weight: bold; border-radius: 6px; border: 1px solid #cccccc; background-color: #F6F5D0; padding: 12px 12px 12px 12px;'>";
		$s.= "Redirecting, please wait!";
		$s.= "</div>";

		if(class_exists('rea_page')){
			$p = rea_page::instance();
			$p->write($s);
			return '';
		}

		return $s;
	}
	public function html($tag = null){

		$u = $this->url;

		if($tag == null){
			if(substr($u, -3,3) == '.js') $tag = 'script';
			if(substr($u, -4,4) == '.css') $tag = 'css';
			if(substr($u, -4,4) == '.png') $tag = 'img';
			if(substr($u, -4,4) == '.gif') $tag = 'img';
			if(substr($u, -4,4) == '.jpg') $tag = 'img';

		}


		if($tag == 'img'){
			$s = "<img src='{$u}'>";
		}elseif($tag == 'css'){
			$s = "<link rel='stylesheet' href='{$u}'>";
		}elseif($tag == 'a'){
			$s = "<a href='{$u}' title='{$u}'>{$u}</a>";
		}elseif($tag == 'script'){
			$s = "<script type='text/javascript' src='{$u}'></script>";
		}else{
			$s.= "<{$tag}></{$tag}>";
		}
		return $s;
	}
 	public function __get($name) {
		$config = rea_app::getConfig();
		if($name == 'url'){
			if( isset($config->application['location_id']) ){
				return rea_sp_rel2dr($this->path, $config->application['location_id']);
			}else{
				return rea_sp_rel2dr($this->path, null);
			}
		}elseif($name == 'is_directory'){
			return is_dir($this->path);
		}elseif($name == 'is_readable'){
			return is_readable($this->path);
		}

		$this->path.= ( (substr($this->path,-1,1) != '/') ? '/' : '') . $name . '/';

		//print $this->path . "<br>";
		return $this;
	}
	public function exists(){
		return file_exists($this->path);
	}
	public function size(){
		return filesize($this->path);
	}

	public function child($name){
		$f = new rea_bundle;
		$f->path = $this->path . ( (substr($this->path,-1,1) != '/') ? '/' : '') . $name;
		//var_dump($f);
		return $f;

	}

}
function rea_app_process_itemsview($controller, $param){
	///N:Deprecated
	//callback to implement automatic folder views
	global $items_view;
	if(!isset($items_view)) return;

	$page = &$param[0];

	$s = $items_view->getHTML($page);
	$page->write($s);
}

class rea_app {
	public static $authentication = null;
	public static $lockname = null;
	public static $lockfp = null;
	public static function log($msg) {
		global $config;
		if(is_null(self::$runid)) {
			self::$runid = uniqid("AP");
			ini_set("log_errors_max_len", 0);
		}
		error_log("{$config->real_user->username}::{$config->alias_user->username}::{$config->application['uid']}::" . self::$runid . "::{$msg}");
	}
	public static function getConfig(){
		global $config;
		return $config;
	}
	public static function helper_values(&$values){
		$v = new rea_values($values);
		return $v;
	}
	public static function bundle($base = null) {
		if(!class_exists('rea_bundle')) return null;
		return rea_bundle::create($base);
	}
	public static function get_route(){
		global $rea_app_route;
		return $rea_app_route;
	}
	public static function change_route($a, $params=null){
		global $rea_app_route;

		$rea_app_route['action'] = $a;
		if(!empty($params)) $rea_app_route['values'] = $params;
	}
	public static function event_call($a, $params=null, $method='get'){
		global $config;
		$s = "<form action='{$config->application['url']}' method='{$method}' name='frm' id='frmr'>";
		if(is_array($params) ){
			foreach ($params as $k => $v) {
				if($k == 'a') continue;
				$s.= "<input type='hidden' name='".htmlentities($k)."' value='".htmlentities($v)."'>";
			}
		}
		$s.= "<input type='hidden' name='a' value='" . htmlentities($a) . "'>";
		$s.= "</form>";
		$s.= "<script type='text/javascript'>";
		//$s.= "$(document).ready(function (){ $('#frmr').submit(); } );";
		$s.= "</script>";

		$s.= "<div style='margin: 4px 4px 4px 4px; font-size: 11px; font-weight: bold; border-radius: 6px; border: 1px solid #cccccc; background-color: #F6F5D0; padding: 12px 12px 12px 12px;'>";
		$s.= "Redirecting, please wait!";
		$s.= "</div>";

		$p = rea_page::instance();
		$p->write($s);
		return;
	}
	public static function basedir($name = null){
		$baseDir = dirname(dirname(__FILE__)) . '/';
		if(!empty($name)) $baseDir .= $name;
		return $baseDir;
	}
	public static function basereadir(){
		$baseDir = dirname( this::basedir() ) . '/rea/';
		return $baseDir;
	}
	public static function enginedir(){
		$u = dirname(__FILE__);
		if(substr($u, -1,1) != '/') $u .= '/';
		return $u;
	}
	public static function registerForEvent($evt_name, $callback){
		global $rea_controller;
		$rea_controller->registerForEvent($evt_name, $callback);
	}
	public static function getControllerInstance(){
		global $rea_controller;
		return $rea_controller;
	}
	public static function getConfigurationInstance(){
		global $config;
		return $config;
	}
	public static function buildAppConfigEntry(){
		global $rea_config_properties;

		$path = $_SERVER['SCRIPT_FILENAME'];
		if( REA_IN_CLI ){
			if(isset($_SERVER['PWD']) ){
				$path = realpath($path);
			}
		}
		$app = array();
		$app['enabled'] = 0;
		$app['uid'] = 'reagen';
		$app['name'] = 'Untitled Application';

		$app['attributes'] = array();
		$app['attributes']['action'] = rea_sp_rel2dr($_SERVER['SCRIPT_FILENAME']);
		$app['attributes']['icon'] = '/media/app_icon.gif';
		$app['attributes']['file'] = basename($_SERVER['SCRIPT_FILENAME']);
		$app['attributes']['path'] = $path;
		$app['attributes']['directory'] = dirname($path) . '/';
		$app['attributes']['directory_url'] = rea_sp_rel2dr($app['attributes']['directory']);

		//$app['attributes']['opt_use_auth'] = 0;
		$app['attributes']['op_run_without_session'] = 0;
		$app['attributes']['op_run_without_auth'] = 0;
		$app['attributes']['op_run_as_service'] = 0;
		$app['attributes']['op_run_cli_threads'] = REA_APP_CLI_RUN_MULTIPLE;
		$app['attributes']['authorization'] = array('roles'=>array(), 'list' => false, 'event_roles'=>array() );

		
		return $app;
	}

	public static function rebuildAppConfigEntry() {
		global $rea_app_config_rewrite;
		$config = self::getConfig();

		foreach($rea_app_config_rewrite as $field) {
			$config->application['attributes'][$field] = rea_sp_rel2dr($config->application['attributes'][$field], $config->application['location_id']);
		}
	}

	public static function loadStorageConnections() {
		$config = self::getConfig();

		$db = storage::int_get_storage("rea");
		if(isset($config->application['attributes']['storage'])) {
			foreach($config->application['attributes']['storage'] as $vals) {
				$tag = $vals['tag'];
				$required = isset($vals['required']) ? $vals['required'] : false;
				$cs = null;

				$rs = $db->where("tag", $tag, 'location_id', '*')->get("db_storage");
				if($rs->read()) {
					$cs = $rs->fields['cs'];
				}

				$rs = $db->where("tag", $tag, 'location_id', $config->application['location_id'])->get("db_storage");
				if($rs->read()) {
					$cs = $rs->fields['cs'];
				}

				storage::dao_AddDefinition($tag, $cs, $required);
				storage::dao_MakeDefinitionAvailable($tag);
			}
		}
	}

	public static function syslog($msg, $actiontype='INFO') {
		$config = self::getConfig();

		$r = array(
			'username' => 'none',
			'appid' => 'reagen',
			'ip' => $config->browser['ip'],
			'user_agent' => $config->browser['user_agent'],
			'actiontype' => $actiontype,
			'action' => $msg,
		);

		if(isset($config->application) and isset($config->application['uid'])) {
			$r['appid'] = $config->application['uid'];
		}

		if(isset($config->real_user)) {
			$r['user'] = $config->real_user->username;
		}

		storage::int_get_storage("rea_log")->insert('system', $r);
	}

	public static function lock() {
		$config = self::getConfig();

		if(REA_RUNMODE_SERVICE) {
			if($config->application['attributes']['op_run_cli_threads'] != REA_APP_CLI_RUN_MULTIPLE) {
				$flock_ops = LOCK_EX;
				if($config->application['attributes']['op_run_cli_threads'] == REA_APP_CLI_RUN_UNIQUE) {
					// For web non-blocking, a random parameter must be given to PHP. The name or value of this parameter is not
					// important but it should be random. This allows the interpreter to run the commands in a different thread and
					// work as expected.
					$flock_ops |= LOCK_NB;
				}

				$location = REA_LOCATIONID == '*' ? 'all' : strtolower(REA_LOCATIONID);
				$base = "{$location}_" . basename($_SERVER['SCRIPT_FILENAME'], '.php') . '.lock';
				self::$lockname = dirname(REA_BASE_PATH) . "/flocks/{$base}";
				if(strtolower(PHP_OS) == 'darwin') {
					//self::$lockname = "/private/tmp/{$location}_{$base}";
					self::$lockname = "/private" . cfg_rea_portal_paths_scratch . "{$location}_{$base}";
				}
				self::$lockfp = fopen(self::$lockname, "w");
				if(self::$lockfp === false) {
					error_log("File " . self::$lockname . " could not be opened for lock.");
					self::endapp();
				}

				if(!flock(self::$lockfp, $flock_ops)){
					// Non-blocking will fail here.
					error_log("Lock " . self::$lockname . " already on use.");
					self::endapp();
				}
				self::registerForEvent("rea_end", array("rea_app", "unlock"));
			}
		}
	}

	public static function unlock() {
		if(REA_RUNMODE_SERVICE) {
			flock(self::$lockfp, LOCK_UN);
			//@unlink(self::$lockname);
		}
	}

	public static function endapp() {
		global $rea_controller;
		$rea_controller->raiseEvent("rea_end");
		exit;
	}
}
function rea_view_showError($title, $msg){
	///N:Deprecated
	global $vfspage;
	if(!empty($vfspage)){
		$vfspage->showError($title, $msg);
	}else{
		error_log($title . "::" . $msg);
	}
	exit;
}

class rea_response {
	public static function noCache(){
		header("Cache-Control: private, must_revalidate, max-age=0, pre-check=0" );
		header("Expires: Mon, 1 Apr 1974 05:00:00 GMT" );
		header("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
	}
	public static function location($url) {
		header("Location: $url");
		rea_app::endapp();
	}
	public static function setCookie($name, $value, $expire = 0, $path = "", $domain = "", $secure = false, $httponly = true) {
		setcookie($name, $value, time()+$expire, $path, $domain, $secure, $httponly);
	}
	public static function removeCookie($name, $path = "", $domain = "", $secure = false, $httponly = true) {
		setcookie($name, session_id(), time() - 3600, $path, $domain, $secure, $httponly);
	}
	public static function send_download($data, $filename=null, $mime = null ){
		///P:$data:string with raw data to send
		///P:$filename:String with file name to send file.
		///P:$mime:Mime of content type, when null the function will attempt to find mime from filename.

		///N:Send a download to the browser.
		///N:To send a file set $data to null and make sure $filename points to a valid file in the filesystem.

		if(is_null($mime)){
			//TODO:This file is missing
			require_once(dirname(__FILE__) . '/rea.helper.mime.php');
			$mime = rea_mime_get($filename);
		}

		header('Content-Type: ' . $mime);

		if(is_null($data) && !is_null($filename)){
			$basename = basename($filename);
			header('Content-Disposition: attachment; filename="' . urlencode($basename) . '');
			$size = filesize($filename);
			$fp = fopen($filename, "r");
			while( !feof($fp) ){
				echo fread($fp, 65536);
				flush(); // this is essential for large downloads
			}
			fclose($fp);

			$filename = basename($filename);
		}else{
			$size = strlen($data);
			if(is_null($filename)){
				header("Content-Disposition: attachment;");
			}else{
				header('Content-Disposition: attachment; filename="' . urlencode($filename) . '"');
			}
			header("Content-Length: " . $size);

			print $data;
		}
		exit;
	}
}



function rea_readConfiguration($path){
	///FRAMEWORK:Reads an application configuration
	global $rea_config_properties, $config;

	$properties = array();

	$sp = dirname($path) . '/';
	//error_log("@rea_readConfiguration::PATH::{$path}::SP={$sp}::" . REA_BASE_PATH . "");
	
	if( strpos($sp, REA_BASE_PATH) === false) return;
	$sp = substr($sp, strlen(REA_BASE_PATH));

	$_v1 = explode('/', $sp);

	if( count($_v1) <= 0) return;

	$_vp = '';
	foreach($_v1 as $_v){
		$_vp = $_vp . $_v;
		if(strlen($_v) > 0) $_vp.= '/';

		$_fp = REA_BASE_PATH . $_vp . 'app.config.php';
		//print "@rea_readConfiguration={$_fp}\n";
		if( file_exists($_fp ) ) include($_fp);
	}

	return $properties;

}
function rea_sp_bundle_file_to_url($f){
	global $config;


	$f = rea_sp_rel2dr($f);
	return $f;
}

function rea_sp_bundle_find($find){
	global $config;

	$dr = $_SERVER['DOCUMENT_ROOT'] . '/';
	$sp = substr(dirname($config->application['url']),1);
	$_v1 = explode('/', $sp);

	$c = count($_v1);
	if( $c <= 0) return;

	$paths = array();

	for($i=0;$i<$c;$i++){
		$p = implode('/', $_v1);
		//print "$i=$p<br>";
		$paths[] = $dr . $p;
		array_pop($_v1);
	}

	//print_r($paths);
	$_vp = '';
	foreach($paths as $p){
		$_fp = $p . '/' . $find;
		//print $_fp . "<br>";
		if( file_exists($_fp ) ) return $_fp;
	}
}
?>