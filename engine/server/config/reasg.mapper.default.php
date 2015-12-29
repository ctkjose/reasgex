<?php
//Implements a default url/resource mapper

$reasg_path_mapper = function($scope, $f, $event, $params){
	//build a valid URL according to the default rewrite rules used by REASG

	$lnk = [];
	if($params !== false) {
		if(is_array($params)) {
			foreach($params as $key => $value) {
				$lnk[] = "{$key}=" . urlencode($value);
			}
		} elseif(is_string($params)) {
			$lnk[] ="{$params}";
		} else {

		}
	}
	$args = implode('&', $lnk);
	
	$r = $f;
	$url = REASG_ROOT_URL;
	
	if(substr($r,0,7) == 'assets/'){
		$r = str_replace('assets/', '', $r);
		$url.= "assets/{$scope}/" . $r;
		if(strlen($args) > 0) $url.= '?' . $args;
	}elseif( strpos($r, ".controller." ) !== false){
		//is a controller
		$n = str_replace(".controller.php",'', $r);
		$url.= "app/{$scope}/" . $n . '/' . $event .'/';
		if(strlen($args) > 0) $url.= '?' . $args;
	}
	
	error_log("url=[{$url}]");
	return $url;
};


?>