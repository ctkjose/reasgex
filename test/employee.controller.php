<?php
namespace test;



class employee extends \reasg\view_controller {
	public $app_options = [
		'views'=>['views_path'=> REASG_SELF_DIRECTORY ],
		'op_commit_explicit'=>false, //user must commit outputs (not used as 1/JAN/16)
	];
	public $n = "hello jose";
	public function initialize($values){
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
		
		$recordView = \reasg\ui_template::create("record.view");
		$recordView->set("record_title", "New Employee Record");
		
		$page->body->write($recordView);
		
		//reasg_dev_dump($recordView);
		
	}
	public function save($values){
		error_log("@employee->save =============================================================================");
		
		global $app_controller;
		$ui = $app_controller->client();
		
		$ui->showAlertSuccess("Record saved...");
		
		$a = ['start_date'=> '09/23/2015', 'fld_town01'=>'mc'];
		$ui->populateSelectorWithDataset("employee", $a);
		
		
		sleep( 5 );
		
		error_log("@employee->save DONE =============================================================================");
	}
	public function edit($values){
		$page = \reasg\ui_views::createDefaultView();
		
		$ds = \reasg\ui_datasource::createDataset('employee');
		
		//Settings items individually
		$ds->items['email'] = 'jose.cuevas';
		$ds->items['emp_name'] = 'Jose';
		$ds->items['emp_mname'] = 'L';
		$ds->items['emp_lname'] = 'Cuevas Garcia';
		$ds->items['fld_town01'] = 'ri';
		$ds->items['field_yesno'] = '0';
		$ds->items['start_date'] = '09/20/2015';
		$ds->items['field_checkbox01'] = ['1','2'];
		$ds->items['field_radio01'] = '2';
		//populate a repeater table
		$ds->items['records2'] = [
				['id' => '001', 'school_name' => 'Vilmari Sanchez', 'town'=> 'ri', 'date_created' => '09/20/2015', 'amount'=> '18,000'],
				['id' => '002', 'school_name' => 'Jose Cuevas', 'town'=> 'ag', 'date_created' => '09/21/2015','amount'=> '18,000'],
				['id' => '003', 'school_name' => 'Joe Cuevas', 'town'=> 'mc', 'date_created' => '09/22/2015','amount'=> '18,000']
		];
		
		//setting an attribute to a binded field
		$ds->field('emp_tax_rate')->readonly()->placeholder('FICA NOT REQUIRED');
		$ds->field('email')->decoration("@uprm.edu");
		
		//bind this ds to fields in a view with 
		//the same name as this ds
		$ds->bindToView();
		
		
		$f = \reasg\appBundle::create("test", "@assets");
		\reasg\client_controller::importController('employee_controller', $f->js->child('employee.controller.js')->url);
		
		global $app_controller;
		$ui = $this->controller->client();
		//$ui->showAlertError("This is big alert 2!");
		
		$a = ['start_date'=> '09/27/2015'];
		$ui->populateSelectorWithDataset("employee", $a);
		
		//$page->js->write("//hello jose");
		//$o = \reasg\client_controller::when("employee.email")->changed()->val('jose.cuevas')->done();
		//reasg_dev_dump($o,'$o');
		
		//global $app_state;
		//reasg_dev_dump($app_state['current_interaction'], '$app_state');
		
		
		$recordView = \reasg\ui_template::create("record.view");
		$recordView->set("record_title", "Employee Record");
		$page->body->write($recordView);
		
		
		
		//reasg_dev_dump($recordView);
		
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