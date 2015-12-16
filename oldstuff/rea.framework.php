<?php

define('cfgEngineFolder', dirname(__FILE__) . '/');

ini_set(' memory_limit', '-1');
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log','');
error_reporting(E_ALL);

$rea_capabilities = array();
//error_log("============================================================= [START] ================================================================");
if( file_exists( dirname(cfgEngineFolder) . '/rea.defaults.php') ){
	require_once(dirname(cfgEngineFolder) . '/rea.defaults.php');
}else{
	require_once(cfgEngineFolder . 'rea.defaults.php');
}

//print "cfg_session_use_db=" . cfg_session_use_db . "\n";
require_once(cfgEngineFolder . 'rea.helper.dev.php');
//rea_dev_debuger_enabled();

require_once(cfgEngineFolder .'rea.helper.strings.php');
require_once(cfgEngineFolder .'rea.helper.types.php');
require_once(cfgEngineFolder .'rea.helper.os.php');
require_once(cfgEngineFolder .'rea.helper.email.php');
require_once(cfgEngineFolder .'rea.useragent.php');

//define a default config


$rea_config_properties = array();
$rea_config_properties['template_view'] = 'default';
$rea_config_properties['application_name'] = array('REA', 'REA');
$rea_config_properties['application_uid'] = 'reagen';
$rea_config_properties['application_main_path'] = '/';
$rea_config_properties['authorization']['acl'] = '';

//$rea_config_properties['lng'] = 0;

$rea_config_properties['op_use_view'] = 1;
$rea_config_properties['op_run_as_service'] = 0;
$rea_config_properties['op_allow_subject_alias'] = null;
$rea_config_properties['op_run_without_session'] = 0;


if(isset($_GET) && isset($_GET['l'])){
	$rea_config_properties['lng'] = intval($_GET['l']);
}elseif(isset($_POST) && isset($_POST['l'])){
	$rea_config_properties['lng'] = intval($_POST['l']);
}

$u = dirname($_SERVER['SCRIPT_FILENAME']);
if(substr($u, -1,1) != '/') $u .= '/';

$rea_config_properties['path'] = $u;
$u = dirname($_SERVER['SCRIPT_NAME']);
if(substr($u, -1,1) != '/') $u .= '/';
$rea_config_properties['base_url'] = $u;
$rea_config_properties['url'] = $_SERVER['SCRIPT_NAME'];

$p___1 = explode('/', $_SERVER['PHP_SELF']);
unset( $p___1[ count($p___1)-1 ] );
$opt_full_baseurl = implode( '/', $p___1) . '/';
if(substr($opt_full_baseurl, -1,1) != '/') $opt_full_baseurl .= '/';
$rea_config_properties['full_base_url'] = $opt_full_baseurl;


$rea_config_properties['engine'] = dirname(__FILE__) . '/';
$rea_config_properties['timezone'] = 'America/Puerto_Rico';
$rea_config_properties['icon'] = $rea_config_properties['base_url'] . 'media/app_icon.gif';

$config = new stdClass;

$config->lng = ( isset($rea_config_properties['lng']) ? $rea_config_properties['lng'] : 0 );
$config->applications = array();
$config->external_dependencies = array();


define('REA_DOC_ROOT', $_SERVER['DOCUMENT_ROOT']);
define('REA_BASE_PATH', dirname(cfgEngineFolder) . '/');
define('REA_ENGINE_PATH', cfgEngineFolder);
define('REA_IN_CLI', (isset($_SERVER['SHELL'])) ? 1: 0);

require_once(cfgEngineFolder . 'rea.includes.php');
require_once(cfgEngineFolder . 'rea.delegate.php');
require_once(cfgEngineFolder . 'rea.router.sg.php');
require_once(cfgEngineFolder . 'rea.auth.sg.php');
require_once(cfgEngineFolder . 'rea.app.sg.php');
require_once(cfgEngineFolder . 'rea.template.php');
require_once(cfgEngineFolder . 'rea.storage.php');


$rea_controller = new rea_object_base();


$config->browser = rea_sploaduseragent();
$config->application = rea_app::buildAppConfigEntry();

define('REA_SELF_PATH', $config->application['attributes']['path'] );
define('REA_SELF_DIRECTORY', $config->application['attributes']['directory']);


$properties = array();
$properties = rea_readConfiguration( $config->application['attributes']['path'] );

if(count($properties) > 0){
	foreach($properties as $k => $v ){
		$rea_config_properties[$k] = $v;
    }
}
unset($properties);

//Load the session...
require_once(cfgEngineFolder . 'rea.session.sg.php');
if(!isset($rea_config_properties['lng'])){
	if(isset($_SESSION['rea_user_lng'])) {
		$rea_config_properties['lng'] = intval($_SESSION['rea_user_lng']);
	} else {
		$rea_config_properties['lng'] = 0;
	}
}
$config->lng = $rea_config_properties['lng'];
$_SESSION['rea_user_lng'] = $rea_config_properties['lng'];

//setup minimum auth entry
$auth_user = array('user'=> 'rea', 'name'=> 'REA SG', 'email'=>'');
$_SESSION['rea_user'] = $auth_user;

rea_raiseLoadEvents();

date_default_timezone_set($rea_config_properties['timezone']);

foreach($rea_config_properties as $fn => $fv){
	if($fn == 'application_uid'){
		$config->application['uid'] = $fv;
	}elseif($fn == 'name'){
		$config->application['name'] = $fv;
	} elseif(($fn == 'op_allow_subject_alias') and !is_null($fv)) {
		$config->application['attributes']['authorization']['allow_subject_alias'] = $fv;
	}else{
		$config->application['attributes'][$fn] = $fv;
	}
}

define('REA_APP_UID', $config->application['uid']);

if( isset($config->application['attributes']['op_run_as_service']) && $config->application['attributes']['op_run_as_service']){
	define('REA_RUNMODE_WEB', false);
	define('REA_RUNMODE_SERVICE', true);
}elseif(isset($_SERVER['SERVER_ADDR'])){
	define('REA_RUNMODE_WEB', true);
	define('REA_RUNMODE_SERVICE', false);
}else{
	define('REA_RUNMODE_WEB', false);
	define('REA_RUNMODE_SERVICE', true);
}

global $cfg_rea_portal;
$f = cfgEngineFolder . 'rea.portal.config.php';

if( (!defined('REA_OPTION_DISABLE_PORTAL') || (defined('REA_OPTION_DISABLE_PORTAL') && (!REA_OPTION_DISABLE_PORTAL) )) && file_exists($f)){
	require_once($f);

	if($cfg_rea_portal['enabled'] && file_exists(cfgEngineFolder . 'rea.portal.php') ){
		define('REA_RUNMODE_PORTAL', true);
		require_once(cfgEngineFolder . 'rea.portal.php');

		rea_portal::initializeWithConfig($cfg_rea_portal);
		rea_app::rebuildAppConfigEntry();
	}
}else{
	define('REA_RUNMODE_PORTAL', false);
}



$location = isset($config->application['location_id']) ? $config->application['location_id'] : '*';

$u = rea_sp_rel2dr(REA_BASE_PATH, $location);
if(substr($u, -1,1) != '/') $u .= '/';
define('REA_BASE_URL', $u );

define('REA_ENGINE_URL',  rea_sp_rel2dr(cfgEngineFolder, $location) );
define('REA_SELF_URL', $config->application['attributes']['action']);


rea_app::loadStorageConnections();

$rea_controller->raiseEvent("rea_storage_configure");
$rea_controller->raiseEvent('rea_app_config_ready', array($config));

storage::dao_initializeEntries();

if(REA_RUNMODE_SERVICE) {
	rea_app::lock();
}

//print "<b>DONE</b><br>";
function rea_sp_rel2dr($f, $location='*'){
	///N:Converts an absolute path to relative assuming is under document root
	$s =str_replace($_SERVER['DOCUMENT_ROOT'], '', $f);
	if(substr($s,0,1)!= '/') $s = '/' . $s;
	if(!is_null($location) and ($location != '*') and (strlen($location) > 0)) $s = '/' . strtolower($location) . $s;
	return $s;
}
function rea_sp_register_capability($name){
	global $rea_capabilities;
	if (in_array($name, $rea_capabilities)) return false;
	$rea_capabilities[] = $name;
	return true;
}
function rea_sp_has_capability($name){
	global $rea_capabilities;

	return in_array($name, $rea_capabilities);

}
function rea_fata_error($msg){
	global $rea_fatal_error;
	$rea_fatal_error = $msg;
	include_once('rea.error.fatal.php');
	exit;
}
function rea_raiseLoadEvents(){
    ///FRAMEWORK:Calls application's events
    global $rea_config_properties, $config;

    $p = array();
    if( function_exists('rea_initialize_application') ){
		$m = 'rea_initialize_application';
		if (!$m($p) ){

			//print "hello jose";
			//$vfspage->showerror("Can not access this application.","Unable to initialize application. [ERR:REA001].");
			exit;
		}
		if(count($p) > 0){
			foreach($p as $k => $v ){
				$rea_config_properties[$k] = $v;
			}
		}
    }
}
?>