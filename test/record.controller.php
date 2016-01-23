<?php
namespace test;



class record extends \reasg\view_controller {
	public $app_options = [
		'views'=>['views_path'=> REASG_SELF_DIRECTORY ],
		'op_commit_explicit'=>false, //user must commit outputs (not used as 1/JAN/16)
	];
	public $n = "hello jose";
	public function initialize($values){
		
	}
	public function main($values){
		error_log("--- @employee->main() ---");
	}
	public function create($values){
		$page = \reasg\ui_views::createDefaultView();
		
		$recordView = \reasg\ui_template::create("record.view");
		$recordView->set("record_title", "New Employee Record");
		
		$page->body->write($recordView);
		
		
		
		$ds = \reasg\ui_datasource::createDataset('student_record');
		
		//Settings items individually
		$ds->items['std_sn'] = '812150001';
		$ds->items['std_name'] = 'Joe Cuevas Garcia';
		$ds->items['std_ssn'] = ['123','45','6789'];
		$ds->items['std_dob'] = '09/22/1998';
		$ds->items['std_sex'] = 'm';
		$ds->items['languages'] = ['sp','en'];
		
		//bind this ds to fields in a view with 
		//the same name as this ds
		$ds->bindToView();
		//reasg_dev_dump($recordView);
		
	}
}