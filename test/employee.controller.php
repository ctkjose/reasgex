<?php
namespace test;



class employee extends \reasg\app\controller {
	public function init($values){
		print "--- @employee->init() ---\n";
	}
	public function main($values){
		print "--- @employee->default() ---\n";
	}
	public function create($values){
		print "--- @employee->create() ---\n";
	}
}


?>