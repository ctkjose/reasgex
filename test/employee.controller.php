<?php
namespace test;



class employee extends \reasg\view_controller {
	public $app_options = [
		'views'=>['views_path'=> REASG_SELF_DIRECTORY ],
		'op_commit_explicit'=>false, //user must commit outputs (not used as 1/JAN/16)
	];
	public $n = "hello jose";
	public function init($values){
		error_log("--- @employee->init() ---");
		//print "ENGINE=" . REASG_SELF_DIRECTORY . "<br>\n";
		
		//$s = \reasg\url_app_assets("/js/controller.js", "\\registrar\\records");
		//print $s . "<br>";
		//$s = \reasg\url_app_controller('\\registrar\\records', 'create', ['do'=>'jose']);
		//print $s . "<br>";
	}
	public function main($values){
		print "--- @employee->main() ---\n";
	}
	public function create($values){
		$page = \reasg\ui_views::createDefaultView();
		reasg_dev_dump($page);
		
	}
	public function ds_schools($values){
		$dataset = \reasg\ui_datasource::dataset();
	
		// we use the special entry 'row_attr' to set a row's attributes
		// the 'css' elements sets a rows class attribute
	
	
		$dataset->append('1', ['id'=>'1', 'school_name'=> 'Jose de Diego', 'town'=>'ag', 'type'=>'sc', 'date_created' => '5/14/2015']);
		$dataset->append('2', ['id'=>'2', 'school_name'=> 'Betances', 'town'=>'ag', 'type'=>'sc', 'date_created' => '6/15/2015']);
		$dataset->append('3', ['id'=>'3', 'school_name'=> 'John B Waston', 'town'=>'mc', 'type'=>'sc', 'date_created' => '7/16/2015']);
	

		$dataset->send();
		
		
	}
}


?>