<?php
require_once( '../engine/rea.framework.php');
require_once( $REA_USE_STORAGE );

//require_once( REA_ENGINE_PATH . 'rea.ui.bootstrap.php' );
require_once( $REA_USE_APPLICATION );

function app_event_default($page, $values){
	global $config;
	error_log("here2");
	//$_SESSION['jose'] = "1";
	//print $_SERVER['SERVER_NAME'];
	
}
function app_event_test_form2($page, $values){
	global $config;
	
	$view = rea_ui_view::createFromFile('view_test2.html');
	
	//var_dump($view);
	
	$view->defaultDataModel();
	$page->write($view);
	
}
function app_event_test_ajax1($page, $values){
	global $config;
	error_log("@app_event_test_ajax1 ==================");
	error_log(print_r($values, true));
	$a = array(
		array("caption"=>"Test1", "value"=>90 ),
		array("caption"=>"Test2", "value"=>91 ),
		array("caption"=>"Test3", "value"=>92 ),
	);

	ajax::sendJSON( $a );
}
function app_event_test_form($page, $values){
	global $config;
	
	$view = rea_ui_view::createFromFile('view_test3.html');
	
	//var_dump($view);
	
	//lets populate some value in our form
	
	$view->setElementValue("salary", "5600");
	$view->setElementValue("email", "jose.cuevas@upr.edu");
	$view->setElementValue("hire_date",'5/24/2014');
	$view->setElementValue("score", 4);
	$view->setElementValue("option5", 1); //set "check" of "option5" with 1, or remove "check" with 0 
	$view->setElementValue("registered_yesno", 1); //set yesno to yes, use 0 for no
	$view->setElementValue("option7", 2); //we "check" option "2" of "option7"
	
	
	//The textbox "optional_name" has a checkbox, we can mark the checkbox also with this
	//$view->data->set("optional_name_checkbox", 1);
	
	
	
	$page->write($view);
	
}
function app_event_info($page, $values){
	global $config;
	error_log("here2");
	//$_SESSION['jose'] = "1";
	//print $_SERVER['SERVER_NAME'];
	
	rea_dev_print_info();
}
function app_start($page, $values){
	
	$page->setView('default');
	$page->view->append_part( 'rea_default_body', 'body' );
	
	
	
}

function rea_initialize_application(&$properties){
	//define('cgfVersion', '2.0');
	
	//$properties['application_uid'] = "rea_test1"; //modificame!
	$properties['application_use_view_helpers'] = false; //set to true to use view_helper_*.php files
    $properties['joe'] = "jose";
	$properties['name'] = 'Test REA';
	$properties['application_use_model'] = true;
    
	$properties['opt_use_auth'] = false;
	
    return true;
}
?>