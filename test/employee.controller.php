<?php
namespace test;



class employee extends \reasg\controller {
	public $n = "hello jose";
	public function init($values){
		print "--- @employee->init() ---\n";
		print "ENGINE=" . REASG_SELF_DIRECTORY . "<br>\n";
		
		$s = \reasg\url_app_assets("/js/controller.js", "\\registrar\\records");
		print $s . "<br>";
		$s = \reasg\url_app_controller('\\registrar\\records', 'create', ['do'=>'jose']);
		print $s . "<br>";
	}
	public function main($values){
		print "--- @employee->main() ---\n";
	}
	public function create($values){
		print "--- @employee->create() ---\n";
	}
	
	
}


?>