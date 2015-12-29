<?php

function reasg_dev_print_info(){
	global $config;
	
	$s ='<html><head><title>REA INFO</title>';
	$s.= "<style>\n";
	$s.= ".inf_tbl {\n";
	$s.= "border: 2px solid #cccccc;";
	$s.= "border-collapse: collapse; ";
	$s.= "border-spacing: 0; ";
	$s.= "}\n";
	$s.= ".inf_tbl td {\n";
	$s.= "border: 1px solid #cccccc; ";
	$s.= "word-wrap: break-word; ";
	$s.= "}\n";
	$s.= ".inf_tbl td.n {\n";
	$s.= "word-wrap: normal; ";
	$s.= "white-space: nowrap; ";
	$s.= "background-color: #ECF3FE; ";
	$s.= "font-weight: bold; ";
	$s.= "}\n";
	$s.= "</style>\n";
	$s.= '</head><body>';
	

	$s.= "<table border='0' cellspacing='0' cellpadding='4' class='inf_tbl' width='100%'>";
	$s.= "<tr><td colspan='2'><b>Contants</b></td></tr>";
	$s.= "<tr><td class='n'>REA_BASE_PATH</td><td>" . REA_BASE_PATH . "</td></tr>";
	$s.= "<tr><td class='n'>REA_SELF_DIRECTORY</td><td>" . REA_SELF_DIRECTORY . "</td></tr>";
	$s.= "<tr><td class='n'>REA_SELF_PATH</td><td>" . REA_SELF_PATH . "</td></tr>";
	$s.= "<tr><td class='n'>REA_BASE_URL</td><td>" . REA_BASE_URL . "</td></tr>";
	$s.= "<tr><td class='n'>REA_SELF_URL</td><td>" . REA_SELF_URL . "</td></tr>";
	$s.= "<tr><td class='n'>REA_ENGINE_URL</td><td>" . REA_ENGINE_URL . "</td></tr>";
	$s.= "<tr><td class='n'>REASG_ENGINE_PATH</td><td>" . REASG_ENGINE_PATH . "</td></tr>";
	$s.= "<tr><td class='n'>REA_DOC_ROOT</td><td>" . REA_DOC_ROOT . "</td></tr>";
	$s.= "<tr><td class='n'>REA_RUNMODE_WEB</td><td>" . REA_RUNMODE_WEB . "</td></tr>";
	$s.= "<tr><td class='n'>REA_RUNMODE_SERVICE</td><td>" . REA_RUNMODE_SERVICE . "</td></tr>";
	$s.= "<tr><td class='n'>REA_RUNMODE_PORTAL</td><td>" . REA_RUNMODE_PORTAL . "</td></tr>";
	
	if(defined('REA_PORTAL_VERSION')){
		$s.= "<tr><td class='n'>REA_PORTAL_VERSION</td><td>" . REA_PORTAL_VERSION . "</td></tr>";
	}
	if(defined('REA_LOCATIONID')){
		$s.= "<tr><td class='n'>REA_LOCATIONID</td><td>" . REA_LOCATIONID . "</td></tr>";
	}

	
	
	$s.= "</table>";
	
	$s.= "<br><br>";
	
	
	$s.= '<br><br>';
	$s.= "<table border='0' cellspacing='0' cellpadding='4' class='inf_tbl' width='100%'>";
	$s.= rea_dev_print_info_value('$config', $config);
	$s.= "</table>";
	$s.= '</body></html>';
	//$s.= rea_dev_print_info_value('config->application', $config->application);
	print $s;
	exit;
}

function reasg_dev_dump($a, $n = 'value'){
	
	$o = reasg_dev_dump_array($a, $n);
	error_log('=------- ['  . $n . '] -------------=');
	foreach($o as $e){
		$s = $e['t'] . $e['n'] . ' = ' . $e['v'];
		error_log($s);
	}
	
}
function reasg_dev_dump_array($a, $n='$any', $ind=0){
	$t = 'array';
	$d1 = "['"; $d2="']";
	$s = '';
	
	$out = array();
		
	if( is_object($a) ){
		$t = 'class ' . get_class($a);
		$d1 = '->'; $d2='';
		$a = get_object_vars($a);
	}elseif( is_array($a) ){
	
		
	
	}else{
		
	}
	
	
	
	$tabs = '';
	for($i=1;$i< $ind; $i++){
		$tabs.= '  ';
	}
	
	if(is_string($a)){
		$out[] = array('n'=>"{$n} (string) (len " . strlen($a) . ')', 'v'=>$a, 't'=>$tabs);
		return $out;
	}elseif(is_numeric($a)){
		$out[] = array('n'=>"{$n} (numeric)", 'v'=>$a, 't'=>$tabs);
		return $out;
	}elseif(is_resource($a)){
		$out[] = array('n'=>"{$n} (resource)", 'v'=>'', 't'=>$tabs);
		return $out;
	}elseif(is_bool($a)){
		$out[] = array('n'=>"{$n} (bool) ", 'v'=> (($a) ? 'TRUE' : 'FALSE'), 't'=>$tabs);
		return $out;
	}
	
	if(count($a) <= 0){
		$out[] = array('n'=>"{$n} ({$t})", 'v'=>'', 't'=>$tabs);
		return $out;
		
	}
	
	$out[] = array('t'=>$tabs, 'n'=>"{$n} {$t}", 'v' => '');
	$tabs.= '  ';
	
	foreach($a as $k => $v){
		
		$name = "{$n}{$d1}{$k}{$d2}";
		if( is_array($v) || is_object($v)){
			
			$out = array_merge($out, reasg_dev_dump_array($v, $n . $d1 . $k . $d2, $ind+1) );
			continue;
		}elseif( is_bool($v) ){
			$t = 'BOOL';
			$v = ($v) ? 'true' : 'false';
			
		}elseif( is_string($v) ){
			$t = 'string, len: ' . strlen($v);
			$v = htmlentities($v);
			
		}elseif( is_numeric($v) ){
			$t = 'number';
		}elseif(is_resource($a)){
			$t = 'resource';
			$v = '';
		}elseif( is_null($v) ){
			$t = '';
			
		}
		
		$out[] = array('t'=>$tabs, 'n'=>"{$name} {$t}", 'v' => $v);
	}
	
	return $out;
}
function reasg_dev_print_info_value($n, $a, $ind=1){
	$t = 'array';
	$d1 = "['"; $d2="']";
	$s = '';
	
	$tabs = '';
	for($i=1;$i<$ind; $i++){
		$tabs.= '&nbsp &nbsp;';
	}
	
	if( is_object($a) ){
		$t = 'class ' . get_class($a);
		$d1 = '->'; $d2='';
		$a = get_object_vars($a);
	}elseif( is_array($a) ){
		
		
	}else{
		return '';
	}
	
	if(count($a) <= 0){
		$s.= "<tr><td class='n'>{$n} ({$t})</td><td> -- </td></tr>";
		return $s;
		
	}
	
	$s.= "<tr><td colspan='2'><b>{$n} </b>{$t}</td></tr>";
	
	
	$tabs = '';
	for($i=1;$i<=$ind; $i++){
		$tabs.= '&nbsp &nbsp;';
	}
	
	foreach($a as $k => $v){
		
		$name = "{$n}{$d1}{$k}{$d2}";
		if( is_array($v) || is_object($v)){
			
			$s.= rea_dev_print_info_value($n . $d1 . $k . $d2, $v, $ind+1);
			continue;
		}elseif( is_bool($v) ){
			$t = 'BOOL';
			$v = ($v) ? 'true' : 'false';
			
		}elseif( is_string($v) ){
			$t = 'string';
			$v = htmlentities($v);
			
		}elseif( is_numeric($v) ){
			$t = 'number';
			
		}elseif( is_null($v) ){
			$t = '';
			
		}
		
		$s.= "<tr><td class='n' style='min-width: 300px;'>{$name} ({$t})</td><td>" . $v . "</td></tr>";
	}
	
	return $s;
}
function reasg_dev_debuger_enabled(){
	set_error_handler('reasg_dev_error_handler');
	register_shutdown_function( 'reasg_dev_check_fatal' );
}
function reasg_dev_check_fatal(){
	$error = error_get_last();
    if ( $error["type"] == E_ERROR ){
        reasg_dev_error_handler( $error["type"], $error["message"], $error["file"], $error["line"], 'FATAL' );
    }
}
function reasg_dev_error_handler($errno , $errstr , $errfile , $errline , $errcontext ){
	
	
	
	//var_dump($_SERVER);
	$r = dirname(dirname(__FILE__));
	$f = str_replace($_SERVER['DOCUMENT_ROOT'], '', $errfile);
	$f = str_replace($r, '', $f);
	
	$n = 'ERROR';
	$n = ($errno == E_USER_WARNING ) ? 'WARNING' : $n;
	$n = ($errno == E_USER_NOTICE ) ? 'NOTICE' : $n;
	   
	error_log( "DEV {$n}::{$errno}::{$errstr}::{$f}::LINE {$errline}" );
	
	
	if( ($errno == E_USER_WARNING ) || ($errno == E_USER_NOTICE ) ){
        return false;
	}
	
	error_log( "DEV {$n} INFO::PHP " . PHP_VERSION . "::OS " . PHP_OS . "");
	if(isset($_SERVER['SERVER_ADDR'])){
		error_log( "DEV {$n} INFO::" . $_SERVER['SERVER_SOFTWARE']);
		error_log( "DEV {$n} INFO::" . $_SERVER['SERVER_ADDR']);
	}
	
	$d = debug_backtrace();
	$c = count($d);
	//var_dump($d);
	if ($errcontext == 'FATAL') return true;
	
	for($i = 1; $i< $d; $i++){
		if(!isset($d[$i])) break;
		
        $fn = $d[$i]['function'];
		$f = (isset($d[$i]['file'])) ? $d[$i]['file'] : '';
		$ln = (isset($d[$i]['line'])) ? $d[$i]['line'] : '--';
        if ((substr($fn, 0, 7) == 'include') || (substr($fn, 0, 7) == 'require')) {
            $fn = '';
        }else{
			$fn .= '( )';
		}
		
		$f = str_replace($_SERVER['DOCUMENT_ROOT'], '', $f);
		$f = str_replace($r, '', $f);
		error_log("DEV ERROR TRACE::{$f}::LINE {$ln}::{$fn}");
	}
	
	return true;
	
}


?>