<?php

require_once( $REA_USE_VIEW );
require_once( $REA_USE_AJAX );
require_once($REA_USE_VIEW_UI);

$app_forms = array();
$app_extended_view_helpers = array();

class rea_app_controller extends rea_object_base {
	var $properties = array();
}

class rea_view_controller  extends rea_object_base {
	var $properties = array();
}
class form extends ui_panel {
	var $eventAction = 'default';
	var $clean = true;

	public static function getInstance($name='default_form'){
		global $app_forms, $config;

		if( !isset($app_forms[$name]) ){
			$app_forms[$name] = new ui_panel();
			$f = $app_forms[$name];
			return $f;
		}else{
			return $app_forms[$name];
		}

	}
	function setName($value){
		$this->actionName = $value;
		$this->persistant_form['name'] = $value;
	}

	function setAction($value){
		///N:Sets the event action
		//TODO: Find all uses of form::setEvent and replace with setAction. form::setEvent is already defined and used by the pane widget.
		//$f = form::getInstance();
		$this->eventAction = $value;
		$this->addHidden('a', $value);
	}




	function getHTML($owner= null) {
		$this->clean = false;

		return parent::getHTML($owner);
	}
}

class this extends rea_object_base {
	var $properties = array();
	var $manifest = array();
	static public $output_done = false;
	
	static public $runid = null;

	public static function bundle($base = null) {
		if(!class_exists('rea_bundle')) return null;
		return rea_bundle::create($base);
	}
	public static function isOutputDone(){
		return self::$output_done;
	}
	public static function redirectPage($url){
		
		self::$output_done = true;
		header("Location: " . $url);
		flush();
	}
	public static function enable_debug(){
		error_reporting(E_ALL);
		ini_set("display_errors", "On");
	}
	public static function getConfig(){
		global $config;
		return $config;
	}
	public static function user(){
		global $config;
		return $config->alias_user;
	}
	public static function realUser(){
		global $config;
		return $config->real_user;
	}
	public static function page(){
		return rea_page::instance();
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
	public static function event_redirect($a, $params=null){
		global $config;
		
		$u = self::eventURL($a, $params);
		self::redirectPage($u);
		
	}
	public static function event_call($a, $params=null, $method='get'){
		global $config;
		$s = "<form action='{$config->application['attributes']['url']}' method='{$method}' name='frm' id='frmr'>";
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

		$p = rea_page::instance();
		$p->write($s);
		return;
	}
	public static function form($name=null){
		global $app_forms;

		if(empty($name)) $name = uniqid('FRM');
		$f = form::getInstance($name);
		return $f;
	}

	public static function setTitle($value){
		global $page;
		$page->title = $value;
	}
	public static function write($value){
		global $page;
		$page->write($value);
	}
	public static function menuWrite($value){
		global $page;
		$page->menuWrite($value);
	}
	public static function finish(){
		rea_app_model_show();
	}
	public static function helper_values(&$values){
		$v = new rea_values($values);
		return $v;
	}
	public static function writeAlertSuccess($title, $msg, $style='green') {
		self::writeAlert($title, $msg, $style);
	}
	public static function writeAlertWarning($title, $msg, $style='yellow') {
		self::writeAlert($title, $msg, $style);
	}
	public static function writeAlert($title, $msg, $style='red') {
		$s = "<div class='alert {$style}'>\n";
		$s.= "<strong>" . $title . "</strong><br>\n";
		$s.= $msg . "\n";
		$s.= "</div>";

		global $page;
		$page->view->body_top->write($s);
	}
	public static function setAlertMessage($msg) {
		$_SESSION['app_msg'] = $msg;
	}
	public static function eventURL($event, $params = false) {
		$lnk = "a={$event}";
		if($params !== false) {
			if(is_array($params)) {
				foreach($params as $key => $value) {
					$lnk.= "&{$key}=" . urlencode($value);
				}
			} elseif(is_string($params)) {
				$lnk.="&{$params}";
			} else {

			}
		}
		return REA_SELF_URL . '?' . $lnk;
	}
	public static function actionLink($action, $params = false) {
		$lnk = "a={$action}";
		if($params !== false) {
			if(is_array($params)) {
				foreach($params as $key => $value) {
					$lnk.= "&{$key}=" . urlencode($value);
				}
			} elseif(is_string($params)) {
				$lnk.="&{$params}";
			} else {
			}
		}
		return REA_SELF_URL . '?' . $lnk;
	}

	public static function log($msg) {
		global $config;
		if(is_null(self::$runid)) {
			self::$runid = uniqid("AP");
			ini_set("log_errors_max_len", 0);
		}
		error_log("{$config->real_user->username}::{$config->alias_user->username}::{$config->application['uid']}::" . self::$runid . "::{$msg}");
	}
}
class rea_values {
	var $values = array();
	var $items = null;
	function __construct(&$values = null){
		$this->values = &$values;
	}
	function load_jsonlist( $value){

		$payload = json_decode($value, true);

		if(count($payload) <= 0){
			return array();
		}

		$out = array();
		foreach($payload as $row){
			$new_row = array();
			foreach($row as $e ){
				$new_row[$e['name']] = $this->value_from_class($e['value'], $e['class']);
			}
			$out[] = $new_row;
		}
		return $out;
	}
	function value_from_class($v, $class='ctrl_textbox'){

		if(method_exists($class, 'getValue')){
			return call_user_func(array($class, 'getValue'), $v);
		}

		return $v;
	}

	function load_persistant(){

		//rea_dev_dump($_POST);
		//error_log('post=' . print_r($_POST, true));
		//print('<pre>values=' . print_r($this->values, true) . '</pre>');
		$ps = $this->values['ui_form_persistant'];
		unset($this->values['ui_form_persistant']);

		$ps = unserialize(hex2bin($ps));
		//error_log(print_r($ps, true));


		$values = array();
		foreach($ps['controls'] as $e){
			$n = $e['name'];

			if(!isset($this->values[$n])){
				$value = '';
			}else{
				$value = $this->values[$n];
			}


			$idx_start = strpos($n, '[');
			$internal_values = &$this->values;

			if($idx_start !== false) {
				$current_idx = substr($n, 0, $idx_start);
				$matches = null;
				// This should always match.
				preg_match_all('/\\[(.*?)\\]/', $n, $matches, PREG_PATTERN_ORDER, 5);
				foreach($matches[1] as $idx) {
					if(!isset($internal_values[$current_idx])) {
						$internal_values[$current_idx] = array();
					}

					$internal_values = &$internal_values[$current_idx];

					$current_idx = $idx;
				}
				$n = $current_idx;
				$value = $internal_values[$current_idx];
			}

			//error_log(print_r($e, true));
			if($e['class'] == 'ctrl_label'){
				continue;
			}elseif($e['class'] == 'ctrl_repeater'){
				$internal_values[$n] = $this->fromRepeater($n);
			}else{
				if(method_exists($e['class'], 'getValue')){
					//$v = call_user_func(array($e['class'], 'getValue'), $value);
					//print "{$n}::{$e['class']}::getValue={$v}={$value}<br>";
					$internal_values[$n] = call_user_func(array($e['class'], 'getValue'), $value);
				} else {
					$internal_values[$n] = $value;
				}
			}
		}

		foreach($this->values as $n=> $value){
			if(!isset($values[$n]) ){
				if(substr($n, 0,8) == 'jsonlov_'){
					$n = substr($n,8);
					$value = $this->load_jsonlist($value);
				}
				$values[$n] = $value;
			}
		}

		if(isset($ps['post_process'])) {
			foreach($ps['post_process'] as $fn) {
				$postproc_values = $fn($values);
				$values = array_merge($values, $postproc_values);
			}
		}

		return $values;
	}
	function has($name){
		return isset($this->values[$name]);
	}
	function safe($name, $v=0){
		if(!$this->has($name)) return $v;
		return $this->values[$name];
	}
	function asUnixTime($name){
		//error_log( "asUnixTime[$name]");
		if(!$this->has($name)) return 0;
		$v = $this->values[$name];
		if(is_array($v)) return $v[0];
		$v = trim($v);
		$d = 0; $m = 0; $y = 0; $h = 0; $mn = 0; $s = 0;
		//error_log( "asUnixTime[$v]");
		if((substr($v, 4,1) == '-') && ( (substr($v, 7,1) == '-') || (substr($v, 6,1) == '-') ) ){
			$y = substr($v, 0,4);
			if(substr($v, 7,1) == '-'){
				$m = substr($v, 5,2);
				$d = trim(substr($v, 8,2));
			}else{
				$m = substr($v, 5,1);
				$d = trim(substr($v, 7,2));
			}

			$v = substr($v, 6 + strlen($m) + strlen($d));
		}
		if( strpos($v, '/') != false ){
			$p = strpos($v, '/');
			$m = intval(trim(substr($v,0,$p))); $v = substr($v,$p+1);
			$p = strpos($v, '/');
			$d = intval(trim(substr($v,0,$p))); $v = substr($v,$p+1);
			$y = substr($v,0,4);

			if($m > 12){
				$d1 = $m;
				$m = $d;
				$d = $d1;
			}
			$v = substr($v, 4);

		}
		if(strpos($v, ':') !== false){
			//time portion
			$p = strpos($v, ':');
			$h = trim(substr($v,0,$p)); $v = substr($v,$p+1);
			$p = strpos($v, ':');
			if($p !== false){
				$mn = substr($v,0,$p);
			}else{
				$p = strpos($v, ' ');
				if($p !== false){
					$mn = substr($v,0,$p);
				}else{
					$mn = $v;
				}
			}
			if($p !== false){
				$v = strtoupper(trim(substr($v,$p+1)));
				if(strpos($v, 'PM') !== false){
					$h = $h + 12;
					if($h > 24) $h-= 24;
					$v = trim(str_replace('PM', '', $v));
				}elseif(strpos($v, 'AM') !== false){
					$v = trim(str_replace('AM', '', $v));
				}
				if(strlen($v) > 0){
					$s = intval($v);
				}
			}
		}

		//print "[$y][$m][$d][$h][$mn][$s]<br>";
		//date('Y-m-d H:i:s', $v);
		return mktime($h, $mn, $s, $m, $d, $y);
	}
	function asDelimitedString($name, $delimiter=','){
		$s = $this->safe($name);
		$p = strpos($s, $delimiter);
		$v= explode($delimiter, $s);
		if(count($v) == 0) return array();
		$v = array_map('trim', $v);
		return $v;
	}
	function asDateTime($name){
		$t = $this->asUnixTime($name);
		return date('Y-m-d H:i:s', $t);
	}
	function asDate($name){
		$t = $this->asUnixTime($name);
		return getDate($t);
	}
	function asBool($name){
		$v = $this->safe($name);
		if(intval($v) >= 1) return true;
		return false;
	}
	function value($name, $default = ''){
		if(!$this->has($name)) return $default;
		return $this->values[$name];
	}
	function fromRepeater($name){
		if(!isset($this->values[$name . '_manifest'])){
			if(isset($this->values[$name]) && is_array($this->values[$name])) return $this->values[$name];
			return null;
		}
		$m = explode('|',$this->values[$name . '_manifest']);
		if(count($m) == 0) return null;

		$fd = array();
		foreach($m as $f){
			$f = substr($f,0, strpos($f,':'));
			$fd[] = $f;
		}
		//print_r($fd);
		$i = 0;
		$out = array();
		do{
			$i++;
			if(!isset($this->values[$name . '_row_deleted_' . $i])){
				break;
			}
			$row = array('_added' => 0, '_deleted'=>0, '_row'=> $i, 'lov_removed' => 0);
			if(isset($this->values[$name . '_row_deleted_' . $i])) $row['_deleted'] = $this->values[$name . '_row_deleted_' . $i];
			if(isset($this->values[$name . '_row_added_' . $i])) $row['_added'] = $this->values[$name . '_row_added_' . $i];
			$row['lov_removed'] = $row['_deleted'];
			foreach($fd as $f){
				if(!isset($this->values[$f . '_' . $i])){
					$row[$f] = '';
				}else{
					$row[$f] = $this->values[$f . '_' . $i];
				}
			}

			$out[$i] = $row;
		}while(true);
		//print_r($out);

		//$a = new rea_values();
		//$a->items = $out;
		//$a->ptr = 0;
		return $out;
	}
	function fromLOV($name){
		if(!isset($this->values[$name . '_lov_m'])){
			if(is_array($this->values[$name])) return $this->values[$name];
			return null;
		}
		$m = explode('|',$this->values[$name . '_lov_m']);
		if(count($m) == 0) return null;

		$fd = array();
		foreach($m as $f){
			$f = substr($f,0, strpos($f,':'));
			$fd[] = $f;
		}
		//print "<pre>" . print_r($fd, true) . "</pre>";
		$i = 0;
		$out = array();
		do{
			$i++;
			if(!isset($this->values['lov_' . $name . '_row_' . $i . '_r'])){
				break;
			}
			//print "$i<br>";
			$row = array('_added' => 0, '_deleted'=>0, '_row'=> $i);
			if(isset($this->values['lov_' . $name . '_row_' . $i . '_r'])) $row['_deleted'] = $this->values['lov_' . $name . '_row_' . $i . '_r'];

			foreach($fd as $f){
				if(!isset($this->values['lov_' . $name . '_' . $f . '_' . $i])){
					$row[$f] = '';
				}else{
					$row[$f] = $this->values['lov_' . $name . '_' . $f . '_' . $i];
				}
			}

			$out[$i] = $row;
		}while(true);
		//print_r($out);

		$a = new rea_values();
		$a->items = $out;
		$a->ptr = 0;
		return $a;
	}
	function asArray(){
		if(!is_null($this->items)) return $this->items;
		return $this->values;
	}
	function moveNext(){
		$this->ptr++;
		if(!isset($this->items[$this->ptr])) return false;
		$this->values = $this->items[$this->ptr];
		return true;

	}
}

function rea_app_model_show($flg_send_to_bg = false){
	global $app_forms, $config, $page, $rea_app_route;
	global $rea_controller;

	if( this::isOutputDone() ){
		return;
	}
	if( REA_RUNMODE_WEB ){
		global $ajax_instance;
		if(!$ajax_instance->empty ){
			http_response_code(200); //to fix some 500 raised by evals and others in ajax calls
			$ajax_instance->sendResponse();
			exit;
		}

		if( !empty($app_forms) && (count($app_forms) > 0)){
			foreach($app_forms as $f){
				if($f->clean) {
					$page->write($f->getHTML());
				}
			}
		}

		$fn = 'app_page_readyForDisplay';
		if( function_exists($fn) ) $fn($page);
		$rea_controller->raiseEvent('rea_app_model_app_show_webapp', array($config, $rea_app_route));

		if(isset($_SESSION['app_msg'])){
			$page->msg = $_SESSION['app_msg'];
			unset($_SESSION['app_msg']);
		}
		$page->show( $config->application['attributes']['template_view']);

		$fn = 'app_page_afterDisplay';
		if( function_exists($fn) ) $fn();
	}else{
		$rea_controller->raiseEvent('rea_app_model_app_show', array($config, $rea_app_route));
	}
	
	if($flg_send_to_bg){
		flush();
		return;
	}
	exit;
}

function app_write($o) {
	///N:Deprecated
	global $page;
	return $page->write($o);
}
function app_menu_write($o) {
	///N:Deprecated
	global $page;
	return $page->menu_write($o);
}
function rea_app_model_page_before_display($param){
	$fn = 'app_beforeDisplay';
	if( function_exists($fn) ) $fn($param[0]);
}

function rea_app_model_run(){
	global $page, $config;
	global $rea_app_route;
	global $auth_user, $rea_controller;

	$method = null;
	$page->name = $config->application['name'];
	$page->title = $config->application['name'];
	$page->uid = 'nkdfg';
	$values = array();
	
	if(function_exists('rea_ui_event_view_show')){
		rea_app::registerForEvent('rea_view_show', 'rea_ui_event_view_show');
	}

	rea_app::registerForEvent('rea_view_show', 'rea_app_model_page_before_display');

	$rea_app_route = rea_app_route::loadRoute();

	$cfg_auth_actions = array('rea_login','rea_logout', 'rea_login_do', 'rea_login_ingest', 'ras_psr_start', 'ras_psr_show', 'ras_psr_do');
	$flg_is_auth_action = ( in_array($rea_app_route['action'], $cfg_auth_actions) );

	if(	($config->application['attributes']['opt_use_auth'] == 1) && !$config->application['attributes']['op_run_without_auth'] ){
		//var_dump($config);


		if(($rea_app_route['action'] == 'rea_login_do') && !function_exists('app_event_rea_login_do')){
			//handle it ourselves...

			rea_authorization::login_authorize($rea_app_route['values']);

			if(isset($_SESSION['REA_REENTRY_URL'])){
				$url = $_SESSION['REA_REENTRY_URL'];
				unset($_SESSION['REA_REENTRY_URL']);
				rea_response::location($url);
				exit;
			}
		}

		if(!$flg_is_auth_action) {
			if(isset($config->application['attributes']['REA_REENTRY_URL'])){
				$_SESSION['REA_REENTRY_URL'] = $config->application['attributes']['REA_REENTRY_URL'];
			}else{
				$_SESSION['REA_REENTRY_URL'] = REA_SELF_URL; //$config->application['attributes']['url'];
			}
		}

		if(($rea_app_route['action'] == 'rea_logout') && !function_exists('app_event_rea_logout')){
			//handle it ourselves...
			rea_authorization::user_logout();
		}

		if(!$flg_is_auth_action ){
			/// REquire an authenticated session, reload session user
			$rea_controller->raiseEvent("auth_validate", array());

			if(! rea_authorization::user_validate() ){
				$url = rea_authorization::login_redirect();
				rea_response::location($url);
				exit;
			}
			
			if( isset($config->real_user) ) {
				$config->alias_user=$config->real_user;
				if(isset($config->application['attributes']['authorization']['allow_subject_alias']) and ($config->application['attributes']['authorization']['allow_subject_alias'] == 1) and isset($_SESSION['ras_alias'])){
		
					$alias_attributes = $config->real_user->getRoleAttribute('rea_sis_alias');
				
					if(is_string($alias_attributes['appuid_allowed'])) {
						$apps_allowed = array($alias_attributes['appuid_allowed']);
					} else {
						$apps_allowed = $alias_attributes['appuid_allowed']->getArray(); 
					}
		
					if(($apps_allowed[0] == '*') or (in_array($config->application['uid'], $apps_allowed))) {
						$u = ras::loadFromUID($_SESSION['ras_alias']);
						$item = new ctrl_alert("Using alias for user: {$u->name_display} [{$u->email}] <a href='/" . strtolower(REA_LOCATIONID) . "/profile/scr_alias.php?a=remove'>Remove</a>", 'alert-success', false);
						$page->write($item);
			
						$config->alias_user = $u;
						$config->alias_user->roles['rea_sis_alias']=$config->real_user->roles['rea_sis_alias'];
					}
				}
			}
			
			$rea_controller->raiseEvent('rea_app_model_user_available', array($config, $rea_app_route));
		}
		//rea_authorization::login_validate();
	}

	if(isset($config->application['attributes']['model_access'])){
		$roles = '';
		if( isset( $config->application['authorization']['roles']) && (strlen($config->application['authorization']['roles']) > 0) ){
			$roles = $config->application['authorization']['roles'];
		}elseif( isset( $config->application['acl']) && (strlen($config->application['acl']) > 0) ){
			$roles = $config->application['acl'];
		}

		$ma = $config->application['attributes']['model_access'];
		$me = '';
		if(array_key_exists($rea_app_route['action'], $ma) ){
			$me = $ma[$rea_app_route['action']];
			if(!$config->alias_user->canAccess($me)){
				$page->showError("Unable to continue", "You are not allowed to perform this operation. [ERR:APPMODELSEC01][" . htmlentities($rea_app_route['action']) . "]");
			}
		}
	}

	$rea_controller->raiseEvent('rea_app_model_app_start', array($config, $rea_app_route));

	//print "here1<br>";

	
	
	if(isset($_GET['a']) and ($_GET['a'] == 'rea_logout')){
		unset($alias_check);
	}else{
		$alias_check=true;
	}
	
	

	if(function_exists('app_start')){
		app_start($page, $rea_app_route['values']);
	}

	global $app_extended_view_helpers;
	if( count($app_extended_view_helpers) > 0 ){
		foreach($app_extended_view_helpers as $a){
			$a = '' . $a . '_extended_view_start';
			if( function_exists($a) ){
				$a($page, $rea_app_route['values']);
			}
		}
	}
	
	$panel = '__';

	if(isset($_GET['rea_spawn_status'])) {
		$rea_app_route['method'] = 'get';
		$rea_app_route['action'] = 'spawn_' . $rea_app_route['values']['rea_spawn_status'];
	}

	if(isset($rea_app_route['values']['ui_form_persistant'])) {
		$panel = $rea_app_route['values']['ui_form_persistant'];

		$frm = new rea_values($rea_app_route['values']);
		$rea_app_route['values'] = $frm->load_persistant();

	}

	$fn = 'app_' . $rea_app_route['method'] . '_start';
	if(function_exists($fn)) $data = $fn($page, $rea_app_route['values']);

	$fn = 'app_event_' . $rea_app_route['action'];
	$pn = "process_{$panel}";

	if(function_exists($pn)) {
		$data = $pn($page, $rea_app_route['values']);
	} elseif(function_exists($fn)) {
		$data = $fn($page, $rea_app_route['values']);
	} elseif(strpos($rea_app_route['action'], 'spawn_') === 0) {
		$fn = 'app_event_' . $rea_app_route['action'];
		if(function_exists($fn)) {
			$fn($page, $rea_app_route['values']);
		} else {
			$fn = "rea_spawn_default_" . str_replace('spawn_', '', $rea_app_route['action']);
			if(function_exists($fn)) {
				$fn($page, $rea_app_route['values']);
			} else {
				$page->showError("Unable to continue", "Invalid request to application model. [2]");
			}
		}
	} else {
		$fn = "app_event_unhandled";
		if(function_exists($fn) ){
			$fn($page, $rea_app_route['values']);
		}else{
			$page->showError("Unable to continue", "Invalid request to application model." . $rea_app_route['action']);
			
		}
	}

	$fn = 'app_' . $rea_app_route['method'] . '_end';
	if(function_exists($fn)) $data = $fn($page, $rea_app_route['values']);


	if(function_exists('app_end')){
		app_end($page, $rea_app_route['values']);
	}

	rea_app_model_show();
}



if( isset($config->application['attributes']['op_run_as_webservice']) && $config->application['attributes']['op_run_as_webservice'] ){
	require_once(dirname(__FILE__) . '/rea.ws.model.php');
	rea_ws_model_run();

}elseif( isset($config->application['attributes']['application_use_model']) && $config->application['attributes']['application_use_model']){

	rea_page::instance();
	$app_extended_view_helpers;
	//Include view helpers
	if( isset($config->application['attributes']['application_use_view_helpers']) && ($config->application['attributes']['application_use_view_helpers']) ){
		$basename = is_string($config->application['attributes']['application_use_view_helpers']) ? $config->application['attributes']['application_use_view_helpers'] : "view_helper_*.php";
		if(strpos($basename, '*')) {
			$basename .= "*";
		}
		$items = glob(REA_SELF_DIRECTORY . $basename, GLOB_MARK);
		//print '<pre>' . print_r($items, true) . '</pre>';
		foreach($items as $a){
			
			if( strpos($a, 'view_helper_extended_')){
				$n = str_replace('.php', '', str_replace('view_helper_extended_', '', basename($a) ));
				$app_extended_view_helpers[] = $n;
			}
			
			require_once( $a);
		}
	}

	if( isset($config->application['attributes']['required_paths']) ){
		$req_paths = $config->application['attributes']['required_paths'];
		if(!is_array($req_paths)) $req_paths = array($req_paths);

		foreach($req_paths as $p) {
			if( substr($p,-1,1) != '/') $p = REA_SELF_DIRECTORY . $p;
			$items = glob($p, GLOB_MARK);
			foreach($items as $a){
				require_once($a);
			}
		}
	}

	rea_app_model_run();
}
?>