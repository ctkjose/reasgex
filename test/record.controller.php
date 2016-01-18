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
		
		//reasg_dev_dump($recordView);
		
	}
}