<?php
require_once( '../engine/rea.framework.php');
require_once( $REA_USE_STORAGE );
require_once( $REA_USE_APPLICATION );

function app_event_show_src($page, $values){
	$s = "<pre>";
	$s.= htmlentities( file_get_contents(__FILE__) );
	$s.= "</pre>";
	
	$page->write($s);
}
function app_event_coteja_nombre($page, $values){
	error_log("here1");
	///codigo super complejo....
	
	if($values['email'] == "joe@uprm.edu"){
		$respuesta = array();
		$respuesta['resultado'] = true;
		$respuesta['nombre'] = "Joe";
		$respuesta['apellidos'] = "Cuevas";
	}else{
		$respuesta = array();
		$respuesta['resultado'] = false;
		$respuesta['error'] = "No lo encontre";
	}
	
	error_log("me enviaron :" . $_SERVER['REMOTE_ADDR'] . ':' . print_r($values, true) );
	ajax::sendJSON( $respuesta );
	
	
}
function app_event_dev_info($page, $values){
	global $config;
	
	rea_dev_print_info();
}
function app_event_info($page, $values){
	global $config;
	
	print "jose={$_SESSION['jose']}<br>";
	//rea_dev_print_info();
}

function app_event_default($page, $values){
	global $config;
	error_log("here2");
	//$_SESSION['jose'] = "1";
	//print $_SERVER['SERVER_NAME'];
	
	
}

function app_event_tool_conv_table_commit($page, $values){
	global $config;
	
	
	$s = $values['s'];
	$n = $values['n'];
	preg_match_all("/\${$n}\-\>cellHeader(s?[0-1, /", $m);
	

}
function app_event_tool_conv_table($page, $values){
	global $config;
	//error_log(print_r($config, true));
	$panel = this::form('degree');
	
	$panel->addTitleRow('Record');
	
	$item = new ctrl_textbox('n', '$table');
	$panel->addFieldRow($item, 'Var Name');
	$item = new ctrl_textarea('s', '', 40, 40);
	$panel->addFieldRow($item, 'Source');
	
	$item = new ctrl_button('cmd2','Convert');
	$item->setActionSubmit('conv_table_commit');
	$panel->addActionButton($item);
	
}
function app_event_test_form_save($page, $values){
	global $config;
	
	$page->write("<pre>" . print_r($_POST, true) . "</pre>");
	$page->write("<pre>" . print_r($values, true) . "</pre>");	
}
function app_event_test_panel1($page, $values){
	
	//we are not using this::form() helper to be able to 
	//test the individual classes
	
	//$panel = this::form('panel1'); 
	
	global $app_forms;
	$app_forms['panel1'] = new ui_base_panel();
	$panel = $app_forms['panel1'];
	
	
	
	$panel->addTitleRow('Test Panel Base');
	
	$item = new ctrl_textbox('n', 'Hello');
	$panel->addFieldRow($item, 'Var Name');
	
	$item = new ctrl_button('cmd2','Save');
	$item->setActionSubmit('test_form_save');
	$panel->addActionButton($item);
	
	
}
function app_event_test_grid($page, $values){
	global $config;
	
$s = "
<div class='row with-padding'>
	<div class='col-12'>1</div>
</div>	
<div class='row with-padding'>
	<div class='col-6'>1</div><div class='col-6'>2</div>
</div>
<div class='row with-padding'>
	<div class='col-4'>1</div><div class='col-4'>2</div><div class='col-4'>3</div>
</div>
<div class='row with-padding'>
	<div class='col-8'>8</div><div class='col-4'>4</div>
</div>

";

$page->write($s);
}
function app_event_ajax_job_list($page, $values){
		//This method implements an ajax data source provider 
		$dataset = rea_ui_datasource::dataset();
		
		if( isset($values['category']) ){
			$v = array(
				'001' => array( array('001', 'programmer'),  array('002', 'analyst'), array('003', 'database manager') ),
				'002' => array( array('004', 'illustrator'),  array('005', '3D designer'), array('006', 'artists') ),
				'003' => array( array('007', 'human resources'),  array('008', 'manager'), array('009', 'accounting') ),
			);
			if(array_key_exists( $values['category'], $v )){
				foreach( $v[$values['category']] as $e){
					$dataset->append($e);
				}
			}
			
		}else{
			$dataset->append( array('001', 'programmer') );
			$dataset->append( array('002', 'graphic artists') );
			$dataset->append( array('003', 'hello') );	
		}
		
		
		
		$dataset->send();
}
function app_event_ajax_job_list_static($page, $values){
		//This method implements an ajax data source provider 
		$dataset = rea_ui_datasource::dataset();
		
		$dataset->append( array('001', 'Development') );
		$dataset->append( array('002', 'Graphic') );
		$dataset->append( array('003', 'Management') );
		
		$dataset->send();
}
function app_event_test_lookup($page, $values){
	global $config;
	//error_log(print_r($config, true));
	
	
	$panel = this::form('degree');
	
	$panel->addTitleRow('Record');
	
	$item = new ctrl_textbox('name', 'Jose');
	$panel->addFieldRow($item, 'Name', 'Enter a name');
	
	
	
	//lets build a lookup control...
	$item1 = new ctrl_lookup("prog2", '002');
	$item1->setProperty('showcode', 1); //if the bind value is shown on list and textbox
	
	//define an AJAX datasource for our list
	$url = this::eventURL('ajax_job_list');
	$ds = rea_ui_datasource::create($url, 'dynamic');
	$ds->bind('caption', 1); //bind the list's caption to the column/key 0 in the dataset
	$ds->bind('value', 0); //bind the list's value to the column/key 1 in the dataset, this is the value returned
	
	$item1->setDataSource($ds);
	$panel->addFieldRow($item1, "Job Type", 'This is a dynamic ds, data is loaded on request');
	
	
		$item = new ctrl_lookup("prog4", '005');
	$item->setProperty('showcode', 0);
	$a = array(
		array('code'=>'004', 'name'=>'programmer'),
		array('code'=>'005', 'name'=>'graphic artists'),
		array('code'=>'006', 'name'=>'hello'),
	);
	
	$ds = rea_ui_datasource::create($a);
	$ds->bind('caption', 'name'); //bind the list's caption to the column/key 0 in the dataset
	$ds->bind('value', 'code'); //bind the list's value to the column/key 1 in the dataset, this is the value returned
	
	$item->setDataSource($ds);
	$panel->addFieldRow($item, "With Array");
	
	
	$panel->addTitleRow("Binded Lookup",null, "A lookup with a datasource bounded to the value of the first.");
	
	//lets build a lookup control...
	$item2 = new ctrl_lookup("prog1", '002');
	$item2->setProperty('showcode', 1); //if the bind value is shown on list and textbox
	

	//define an AJAX datasource for our list
	$url = this::eventURL('ajax_job_list_static');
	$ds = rea_ui_datasource::create($url);
	$ds->bind('caption', 1); //bind the list's caption to the column/key 0 in the dataset
	$ds->bind('value', 0); //bind the list's value to the column/key 1 in the dataset, this is the value returned
	
	$item2->setDataSource($ds);
	$panel->addFieldRow($item2, "Job Category", 'This is a static ds, data is pulled only once');
	
	//This second lookup is bounded with the value of the prog1 lookup
	//lets build a lookup control...
	$item3 = new ctrl_lookup("prog3", '002');
	$item3->setProperty('showcode', 1); //if the bind value is shown on list and textbox
	
	//define an AJAX datasource for our list
	$url = this::eventURL('ajax_job_list');
	$ds = rea_ui_datasource::create($url, 'dynamic');
	$ds->bind('caption', 1); //bind the list's caption to the column/key 0 in the dataset
	$ds->bind('value', 0); //bind the list's value to the column/key 1 in the dataset, this is the value returned
	
	$ds->bindUpdateOnChange( $item2, "category" );
	
	$item3->setDataSource($ds);
	$panel->addFieldRow($item3, "Job Position", 'This is a dynamic ds, data is refreshed on request binded with the category');
	
	
	
	

	
	
	
	$item = new ctrl_button('cmd','Add', 'blue');
	//$item->setAction("alert(typeof arguments[1]); return false;");
	$item->setActionSubmit('test_form_save');
	$panel->addActionButton($item);
	
	
	
}
function app_event_test_form($page, $values){
	global $config;
	//error_log(print_r($config, true));
	$panel = this::form('degree');
	//$js =	"<script type='text/javascript'>
	//			alert('Daniel');
	//		</script>";
	//
	//$js = "<script type='text/javascript'>";
	//$js.= "alert('efrain 123');";
	//$js.= "</script>";
	//
	//$page->write($js);
	//
	
	//$panel->addTitleRow('Record', '', '', 'blue');
	
	$item = new ctrl_textbox('name', 'Jose');
	$panel->addFieldRow($item, 'Name', 'Enter a name\njose');
	$panel->validation->addEmptyValue($item, "No dejes la caja vacia");
	$panel->validation->addEmptyValue($item, "No puede estar vacia");
	
	
	$item = new ctrl_textbox('lname', 'Cuevas');
	$panel->addFieldRow($item, 'Last Name', 'Enter a name');
	
	$item = new ctrl_textbox('lname', 'Cuevas');
	$item->setProperty('disabled');
	$panel->addFieldRow($item, 'Something');
	
	$item = new ctrl_textbox('salary', '100.00');
	$panel->addFieldRow($item, 'Salary');
	$panel->validation->addRegExFilter($item, "Enter valid salary", "/^\-?[0-9]+\.[0-9]{2}/");
	
	$panel->addTitleRow('Another Record',null, 'This is a brief description');
	
	$items = array();
	$items[0] = new ctrl_textbox('name1', 'Jose');
	$items[1] = new ctrl_textbox('lname1', 'Cuevas');
	$panel->addFieldRow($items, 'Name', 'Enter a name');
	
	//let test a container, allows to put controls in a sub panel
	$container = new ui_container("tes1");
	
	$items = array();
	$items[0] = new ctrl_textbox('sub_name', 'Jose');
	$items[1] = new ctrl_textbox('sub_lname', 'Cuevas');
	$container->addFieldRow($items, 'Name', 'Enter a name');
	
	$item = new ctrl_textbox('sub_salary', '100.00');
	$container->addFieldRow($item, 'Salary');
	
	$panel->addFieldRow($container, 'A Container');
	
	$items = array();
	$items[0] = new ctrl_label('Hello Jose');
	$items[1] = new ui_linkbutton('View record...', 'test_ui.php?a=test_form&j=1');
	$items[1]->setData('confirm', 'Do you want to view this record?');  //lets put a confirmation message
	$panel->addFieldRow($items, 'Something');
	
	
	//link button with items inside....
	$bttn = new ui_linkbutton('Options');
	
	$bttn->appendItem('This is a link...', 'test_ui.php?a=test_form');
	$item = new ctrl_checkbox('op2', '2');
	$bttn->appendItem($item);
	
	$panel->addFieldRow($bttn, "Select");
	
	
	
	
	$item = new ctrl_label('Sample control in a row without caption');
	$panel->addFieldRow($item, null);
	
	
	$item = new ctrl_checkbox('t1', '1');
	$panel->addFieldRow($item, 'Is it true?');
	
	$items = array();
	
	$items[0] = new ctrl_radio('t2', '1', false, 'Test1');
	$items[1] = new ctrl_radio('t2', '2', false, 'Test2');
	$panel->addFieldRow($items, 'Is one or the other?', 'Notice we can now set the label');
	
	$item = new ctrl_yesno('enabled', false);
	$panel->addFieldRow($item, 'Enabled');
	
	$panel->addDivision();
	
	$item = new ctrl_textbox('t3', 'Jose');
	$panel->addFieldRow($item, 'Code', 'Enter a code');
	
	$panel->addTitleRow('More Controls');
	
	$item = new ctrl_optiongroup('cities','ag', 1);
	$item->appendOptions( array('ag'=>'Aguadilla', 'mc'=>'Moca', 'mg'=>'Mayaguez'));
	$panel->addFieldRow($item, "Cities");
	
	$item = new ctrl_listbox('graduation_requested', '' );
	$item->appendOptions( array('0' => 'No Request', '1'=> 'Student Request', '2'=> 'Administrative Request'));
	$panel->addFieldRow($item, 'Graduation Request', 'test');
	
	
	$d = time();
	$item = new ctrl_datepicker("date1", 0, $d);
	$panel->addFieldRow($item, 'Request Date', 'Date when the request for graduation was recieved.' );
	

	$item = new ctrl_datepicker("date2", 1, null);  //send null for empty date
	$panel->addFieldRow($item, 'Other Date', 'Date when the request for graduation was recieved.' );
	
	$ops = new ctrl_listoptions('job_type');
	$ops->appendOptions("001", "Programmer");
	$ops->appendOptions("002", "Database Administrator");
	$ops->appendOptions("003", "System Administrator");
	$panel->addPayload($ops);
	
	$cmb = new ctrl_combobox("prog1", '003');
	//$cmb->setProperty('showcode', 1); //if the bind value is shown on list and textbox
	$cmb->use_optionList($ops); //associate a list
	$panel->addFieldRow($cmb, "Select Type1");
	

	$cmb = new ctrl_combobox("prog2");
//	$cmb->setProperty('showcode', 1); //if the bind value is shown on list and textbox
	$cmb->appendOptions(array("001"=>"Programmer","002"=>"Database Administrator","003"=>"System Administrator"));
	
	$panel->addFieldRow($cmb, "Select Lookup");
	
		$item = new ctrl_textarea('prueba');
	$panel->addFieldRow($item, 'Llevar', false);
	$panel->validation->addEmptyValue($item, "Textarea vacio");
	

	
	$item = new ctrl_button('cmd','Add', 'blue');
	//$item->setAction("alert(typeof arguments[1]); return false;");
	$item->setActionSubmit('test_form_save');
	$panel->addActionButton($item);
	
	$item = new ctrl_button('cmd1','Continue', 'green');
	$item->setActionSubmit('test_form_save');
	$panel->addActionButton($item);
	
	$item = new ctrl_button('cmd2','Cancel', 'red');
	$item->setActionSubmit('test_form_save');
	$panel->addActionButton($item);
	
	$item = new ctrl_button('cmd2','View');
	$item->setActionSubmit('test_form_save');
	$panel->addActionButton($item);
	
	
	//$item = new ctrl_button('cmd1','BEEP', 'green');
	//$item->setAction('alert("beep"); return false;');
	//$panel->addActionButton($item);
	
}
function app_event_test_formwithtabs($page, $values){
	global $config;
	
	
	$panel = this::form('emp_record');
	$panel->addTab('Record');
	
	$panel->addTitleRow('Record');
	
	$item = new ctrl_textbox('name', 'Jose');
	$panel->addFieldRow($item, 'Name', 'Enter a name');
	
	$item = new ctrl_textbox('lname', 'Cuevas');
	$panel->addFieldRow($item, 'Last Name', 'Enter a name');
	
	$item = new ctrl_textbox('lname', 'Cuevas');
	$item->setProperty('disabled');
	$panel->addFieldRow($item, 'Something');
	
	$item = new ctrl_textbox('salary', '100.00');
	$panel->addFieldRow($item, 'Salary');
	$panel->validation->addRegExFilter($item, "Enter valid salary", "/^\-?[0-9]+\.[0-9]{2}/");
	
	
	$panel->addTab('Job');
	
	$item = new ctrl_textbox('job_title', 'Programmer');
	$panel->addFieldRow($item, 'Job Title');
	
	
	$item = new ctrl_button('cmd','Save', 'blue');
	//$item->setAction("alert(typeof arguments[1]); return false;");
	$item->setActionSubmit('test_form_save');
	$panel->addActionButton($item);
	
	if(isset($values['alot']) && ($values['alot'] == 1)){
		
		for($i=1;$i<=10;$i++){
			$panel->addTab('Tab ' . $i);
			$panel->addTitleRow('Contents for Tab ' . $i);
		}
	}
	//$page->write();
	
}
function app_event_test_tables($page, $values){
	global $config;
	
	$fake_data = array(
		array('type'=> 'K', 'uid'=> '0001', 'email'=>'jcuevas@mac.com', 'name_display'=> 'Jose Cuevas', 'enabled'=> 1),
		array('type'=> 'C', 'uid'=> '0002', 'email'=>'jose.cuevas@upr.edu', 'name_display'=> 'Jose Cuevas', 'enabled'=> 1),
		array('type'=> 'K', 'uid'=> '0003', 'email'=>'jose.cuevas@uprm.edu', 'name_display'=> 'Joe Cuevas', 'enabled'=> 1),
		array('type'=> 'K', 'uid'=> '0004', 'email'=>'ctk@uprm.edu', 'name_display'=> 'Jose L Cuevas', 'enabled'=> 1),
	);
	
	$table = new ctrl_table("example1");

	$table->createColumn( "UID", "uid");   //ctrl_table->createColumn($caption, [$bind_value])
	$table->createColumn( "Email", "email");
	$table->createColumn( "Name", "name_display");
	$table->createColumn( "Status", "enabled")->setCellWidth('100px');
	$table->createColumn( "type", "type")->setCellHidden(true); //lets add a hidden value
	
	
	$table->appendAction('View...', this::actionLink("test_tables", "uid=%uid") );
	//$table->appendAction('View items...', this::actionLink("list_items", "uid=%batchnum") , '%fc > 0');
	$table->setAddAction('Add new user', this::actionLink("test_tables", array('uid' => "n")));
	
	foreach($fake_data as $fields){
		
		
		$table->insertRow($fields);
	}
	
	$page->write( $table );
	
	
	
	
	$table = new ctrl_table("example2");

	$table->createColumn( "UID", "uid");
	$table->createColumn( "Email", "email");
	$table->createColumn( "Name", "name_display");
	$table->createColumn( "Status A", "enabled1")->setCellWidth('60px')->setCellType(1)->setCellAction( this::actionLink("test_tables", "&toggle_something&uid=%uid") );
	$table->createColumn( "Status B", "enabled2")->setCellWidth('60px')->setCellType(3);
	$table->createColumn( "Status C", "enabled3")->setCellWidth('60px')->setCellType(4)->setCellAction( this::actionLink("test_tables", "&toggle_something&uid=%uid") );
    $table->createColumn( "Status D", "active1")->setCellWidth('60px')->setCellType(5,'Inactive','Active' )->setCellAction( this::actionLink("test_tables", "&toggle_something&uid=%uid") );

	$table->createColumn( "Amount", "amount")->setCellFormat('$#,#00.00')->setCellTally(true);
	$table->createColumn( "type", "type");
	
	//you can use column($idx) to access a column, column() may also be used to create a column
	$table->column(7)->setCellHidden(true); //lets add a hidden value
	
	
	$table->appendAction('View...', this::actionLink("test_tables", "uid=%uid") );
	//$table->appendAction('View items...', this::actionLink("list_items", "uid=%batchnum") , '%fc > 0');
	$table->setAddAction('Add new user', this::actionLink("test_tables", array('uid' => "n")));
	
	foreach($fake_data as $fields){
		$fields['amount'] = 100 + rand(1,100);
		$fields['enabled1'] = rand(0,1);
		$fields['enabled2'] = rand(0,1);
		$fields['enabled3'] = rand(0,1);
		$fields['active1'] = rand(0,1);
				
		$table->insertRow($fields);
	}
	
	$page->write( $table );
	
	
	
	
	$table = new ctrl_table("example3");

	$table->createColumn( "UID", "uid");
	$table->createColumn( "Email", "email");
	$table->createColumn( "Name", "name_display");
	$table->createColumn( "Status", "code")->setCellWidth('60px')->setCellType(10, array(50,51, 56), array(20, 30) );
	
	$table->createColumn( "Amount", "amount")->setCellFormat('$#,#00.00')->setCellTally(true);
	$table->createColumn( "type", "type");
	
	//you can use column($idx) to access a column, column() may also be used to create a column
	$table->column(5)->setCellHidden(true); //lets add a hidden value
	
	$table->appendAction('View...', this::actionLink("test_tables", "uid=%uid") );
	//$table->appendAction('View items...', this::actionLink("list_items", "uid=%batchnum") , '%fc > 0');
	$table->setAddAction('Add new user', this::actionLink("test_tables", array('uid' => "n")));
	
	$fake_statuses = array(20, 30, 40, 50, 51, 56);
	
	foreach($fake_data as $fields){
		$fields['amount'] = 100 + rand(1,100);
		$fields['code'] = $fake_statuses[rand(0,count($fake_statuses)-1)];
		
		$table->insertRow($fields);
	}
	
	$page->write( $table );
	
	
}
function app_event_test_exrepeater($page, $values){
	global $config;
	//error_log(print_r($config, true));
	$panel = this::form('degree');
	
	$panel->addTitleRow('Record');
	
	// We need to create a container that we use to edit a record
	// The container must have all the fields required to edit a record.
	// The name of each control you add to the container must correspond
	// to a respective field of a record. 
	
	$container = new ui_container("tes1");
	

	//lets put some controls on the container...
	$items = array();
	$items[0] = new ctrl_textbox('name', '');
	$items[1] = new ctrl_textbox('lname', '');
	
	$items[0]->setJSEvent("change", "if(control.getValue() == 'Joe') control.parent.salary.setValue('1500.25');");
	
	$container->addFieldRow($items, 'Name', 'Enter a name');
	
	
	
	$item = new ctrl_textbox('salary', '');
	
	$container->addFieldRow($item, 'Salary');
	
	$item = new ctrl_datepicker("hire_date", 0, null);  //send null for empty date
	$container->addFieldRow($item, 'Hire date Date', 'Date when employee was hired.' );
	
	
	$table = new ctrl_exrepeater("emp_list");
	
	$table->appendColumn("Name", "name");
	$table->appendColumn("Last Name", "lname");
	$table->appendColumn("Salary", "salary");
	
	$table->container = $container;
	
	
	$new_record = array("name"=>"Jose", "lname"=> "Cuevas", "salary"=> "100.00","hire_date"=>"12/20/2013" );
	$table->insertRow($new_record);
	
	$new_record = array("name"=>"Joe", "lname"=> "Garcia", "salary"=> "200.00", "hire_date"=>"12/22/2013" );
	$table->insertRow($new_record);
	
	
	$panel->addFieldRow($table, "Advance options");
	
	
	
	$item = new ctrl_button('cmd','Add', 'blue');
	//$item->setAction("alert(typeof arguments[1]); return false;");
	$item->setActionSubmit('test_form_save');
	$panel->addActionButton($item);
	
}
function app_event_test_tabforms($page, $values){
	global $config;
	
	$u  = new ctrl_panel_tabs();
	//$u->addTab('Tab 1', 'test_ui.php?a=test_tab&e=1', true);
	//$u->addTab('Tab 2', 'test_ui.php?a=test_tab&e=1', false);
	//$page->write($u);
	
	
	$panel1 = this::form('emp_record');
	$panel1->addTitleRow('Record');
	
	$item = new ctrl_textbox('name', 'Jose');
	$panel1->addFieldRow($item, 'Name', 'Enter a name');
	
	$item = new ctrl_textbox('lname', 'Cuevas');
	$panel1->addFieldRow($item, 'Last Name', 'Enter a name');
	
	$item = new ctrl_textbox('lname', 'Cuevas');
	$item->setProperty('disabled');
	$panel1->addFieldRow($item, 'Something');
	
	$item = new ctrl_textbox('salary', '100.00');
	$panel1->addFieldRow($item, 'Salary');
	$panel1->validation->addRegExFilter($item, "Enter valid salary", "/^\-?[0-9]+\.[0-9]{2}/");
	
	$item = new ctrl_button('cmd','Save', 'blue');
	//$item->setAction("alert(typeof arguments[1]); return false;");
	$item->setActionSubmit('test_form_save');
	$panel1->addActionButton($item);
	
	
	$panel2 = this::form('emp_transactions');
	$panel2->addTitleRow('Jobs');
	
	$item = new ctrl_textbox('job_title', 'Programmer');
	$panel2->addFieldRow($item, 'Job Title');
	
	$item = new ctrl_button('cmd','Save', 'blue');
	//$item->setAction("alert(typeof arguments[1]); return false;");
	$item->setActionSubmit('test_form_save');
	$panel2->addActionButton($item);
	
	$u  = new ctrl_panel_tabs();
	$u->addTab('Employee', null, true);
	$u->addTab('Job Details', null, false);
	
	$u->tab(0)->write($panel1);
	$u->tab(1)->write($panel2);
	$page->write($u);
	
}
function app_event_test_tab($page, $values){
	global $config;
	
	$u  = new ctrl_panel_tabs();
	$u->addTab('BA Information Systems', 'test_ui.php?a=test_tab&e=1', true);
	$u->addTab('Study Plan', 'test_ui.php?a=test_tab&e=1', false);
	$u->addTab('Study Plan2', 'test_ui.php?a=test_tab&e=1', false);
	//$page->write($u);
	
	
	$u  = new ctrl_panel_tabs();
	$u->addTab('BA Information Systems', null, false);
	$u->addTab('Study Plan', null, true);
	$u->addTab('Academic Advising', null, false);
	
	$u->tab(0)->write('Hello tab 1');
	$u->tab(1)->write('Hello tab 2');
	$page->write($u);
	
}
function app_event_test_uimasked($page, $values){
	global $config;
	//error_log(print_r($config, true));
	$panel = this::form('degree');
	
	$panel->addTitleRow('Record');
	
	$item = new ctrl_masked('name', '000-00-0000', '');
	//$item->setJSEvent('click', "console.log('click happy=' + control.getValue() );");
	$panel->addFieldRow($item, 'SSN', 'Enter a name');
	
	$item = new ctrl_masked('salary', '#0.00', '');
	$panel->addFieldRow($item, 'Salary');
	
	
	$item = new ctrl_button('cmd2','View');
	$item->setActionSubmit('test_form_save2');
	$panel->addActionButton($item);
	
}
function app_event_test_container1($page, $values){
	global $config;
	//error_log(print_r($config, true));
	$panel = this::form('degree');
	
	$panel->addTitleRow('Record');
	
	//let create a container
	$container = new ui_container("tes1");
	
	//lets put some controls on the container...
	$items = array();
	$items[0] = new ctrl_textbox('sub_name', 'Jose');
	$items[1] = new ctrl_textbox('sub_lname', 'Cuevas');
	$container->addFieldRow($items, 'Name', 'Enter a name');
	
	$item = new ctrl_textbox('sub_salary', '100.00');
	$container->addFieldRow($item, 'Salary');
	
	
	//$panel->addFieldRow($container, 'A Container');
	
	
	 //Let do some more tricks, lets put the container in a linkbutton
	
	$item = new ui_linkbutton('Options');
	$item->appendItem($container);
	
	$panel->addFieldRow($item, "Advance options");
	
	
	
	$item = new ctrl_button('cmd','Add', 'blue');
	//$item->setAction("alert(typeof arguments[1]); return false;");
	$item->setActionSubmit('test_form_save');
	$panel->addActionButton($item);
	
}
function app_event_test_container2($page, $values){
	global $config;
	//error_log(print_r($config, true));
	$panel = this::form('degree');
	
	$panel->addTitleRow('Record');
	
	//let create a container
	$container = new ui_container("tes1");
	
	//lets put some controls on the container...
	$items = array();
	$items[0] = new ctrl_textbox('sub_name', 'Jose');
	$items[1] = new ctrl_textbox('sub_lname', 'Cuevas');
	$container->addFieldRow($items, 'Name', 'Enter a name');
	
	$item = new ctrl_textbox('sub_salary', '100.00');
	$container->addFieldRow($item, 'Salary');
	
	
	$panel->addFieldRow($container, 'A Container');
	
	/*
	 //Let do some more tricks, lets put the container in a linkbutton
	
	$item = new ui_linkbutton('Options');
	$item->appendItem($container);
	
	$panel->addFieldRow($item, "Advance options");
	*/
	
	
	$item = new ctrl_button('cmd','Add', 'blue');
	//$item->setAction("alert(typeof arguments[1]); return false;");
	$item->setActionSubmit('test_form_save');
	$panel->addActionButton($item);
	
}
function app_event_test_repeater($page, $values){
	global $config;
	//error_log(print_r($config, true));
	$panel = this::form('degree');
	
	$panel->addTitleRow('Record');
	
	// We need to create a container that we use to edit a record
	// The container must have all the fields required to edit a record.
	// The name of each control you add to the container must correspond
	// to a respective field of a record. 
	
	
	
	$table = new ctrl_repeater("emp_list");
	
	//$items[0]->setJSEvent("change", "console.log(control); if(control.getValue() == 'Joe') control.parent.salary.setValue('1500.25');");
	
	$table->appendHidden('id');
	 
	$item = new ctrl_textbox('name', '', 18);
	$table->appendItem($item, 'Name');
	
	$item = new ctrl_textbox('lname', '');
	$table->appendItem($item, 'Last Name');
	
	$item = new ctrl_textbox('salary', '', 10);
	$table->appendItem($item, 'Salary');
	
	$item = new ctrl_label('aLabel', 'test');
	$table->appendItem($item, 'Test');
	
	$item = new ctrl_datepicker("hire_date", 0, null);  //send null for empty date
	$table->appendItem($item, 'Hire date Date' );
	
	$item = new ctrl_listbox('request', '' );
	$item->appendOptions($cfg_sis_courses_academic_activities_main_types);
	$table->appendItem($item, 'Request');
	
	$new_record = array('id'=>500, "name"=>"Jose", "lname"=> "Cuevas", "salary"=> "100.00","hire_date"=>"12/20/2013", 'request'=> 1, 'test'=>'test ok 1' );
	$table->insertRow($new_record);
	
	$new_record = array('id'=>601, "name"=>"Joe", "lname"=> "Garcia", "salary"=> "200.00", "hire_date"=>"12/22/2013", 'request'=> 2, 'test'=>'test ok 2' );
	$table->insertRow($new_record);
	
	$panel->addFieldRow($table, "Advance options");
	
	
	
	$item = new ctrl_button('cmd','Add', 'blue');
	//$item->setAction("alert(typeof arguments[1]); return false;");
	$item->setActionSubmit('test_form_save');
	$panel->addActionButton($item);
	
}
function app_event_test_alerts($page, $values){
	
	$m = "<strong>You message is on schedule.</strong><br>";
	$m.= "Message ID: " . $id . "<br>";
	$m.= "Subject: " . "jose" . "</br>";
	$m.= "";
	$item = new ctrl_alert($m, 'red');
	$page->write($item);
	
	$item = new ctrl_alert($m, 'blue');
	$page->write($item);
	
	$item = new ctrl_alert($m, 'yellow');
	$page->write($item);

	$item = new ctrl_alert($m);
	$page->write($item);

}
function app_evento_test_error($page, $values){
		$m= "Mensaje que sale en el popup";
		this::setAlertMessage($m);
}
function app_event_test_items_list($page, $values){
	global $config;
	
	
	
	$files = array(
		array('filename'=>'Generic.pdf', 'uuid'=>uniqid()),
		array('filename'=>'Trancript.pdf', 'uuid'=>uniqid()),
		array('filename'=>'Long Name with Long Letter.pdf', 'uuid'=>uniqid()),
		array('filename'=>'Presentation.ppt', 'uuid'=>uniqid()),
		array('filename'=>'Generic Document.doc', 'uuid'=>uniqid()),
		array('filename'=>'File.tiff', 'uuid'=>uniqid()),
		array('filename'=>'test.css', 'uuid'=>uniqid()),
	);

	$list = new ctrl_items_list();
	$list->setProperty('width', '900px');
	$list->setProperty('height', '400px');
	
	$actions = array(
		'view'=> array(
			'caption'=> 'View...',
			'icon'=>'edit',
			'url'=> this::actionLink('test_items_list', array('id'=>'%id%','uid'=>'%uid%'))
		),
		'download'=> array(
			'caption'=> 'Download...',
			'icon'=>'cloud-download',
			'url'=> this::actionLink('test_items_list', array('id'=>'%id%','uid'=>'%uid%'))
		),
	);
	
	$test_template = "";
	$test_template.= '<a href="#" class="list-group-item" data-owner="%owner_uid%" data-uid="%uid%">';
	$test_template.= "<span class='badge'>%img%</span><h4 class='list-group-item-heading' title='%caption%'>%caption%</h4>";
	$test_template.= "<p class='list-group-item-text'>%details%</p>";
	$test_template.= "</a>";
	
	$list->setItemTemplate($test_template);
	
	$list->setItemDefaultAction( $actions['view'] );
	$list->setItemActions($actions);
	
	$actions['view']['caption']='Test Add';
	$list->setItemPlusActions($actions);
	$list->setItemPlusAction($actions['view']);
	
	$add = array('caption'=>'Add new...', 'uid'=>uniqid(), 'icon'=>'plus', 'details'=>'');
	$list->addItem($add);
	
	$cfg_ext_icons = array('png'=> 'picture-o', 'jpg'=> 'picture-o', 'jpeg'=> 'picture-o', 'bmp'=> 'picture-o', 'tiff'=> 'picture-o', 'css'=>'css3', 'mov'=>'youtube-play', 'wma'=>'youtube-play', 'mp4'=>'youtube-play', 'mp3'=>'music', 'ogg'=>'music','pdf'=>'file-o','txt'=>'file-text-o', 'doc'=>'file-text-o','docx'=>'file-text-o', 'xls'=>'table', 'xlsx'=>'table', 'ppt'=>'list-alt', 'pptx'=>'list-alt', 'key'=>'list-alt', 'pages'=>'file');
	foreach($files as $file) {
		
		$view_lnk = '';
		$down_lnk = '';
		
		$p = explode('.', $file['filename']);
		$ext = array_pop($p);
		$icon = 'pencil';
		if(array_key_exists($ext, $cfg_ext_icons)){
			$icon = $cfg_ext_icons[$ext];
		}
		
		$e = array('caption'=> $file['filename']);
		$e['uid'] = $file['uuid'];
		$e['uid'] = $file['uuid'];
		$e['icon'] = $icon;
		$e['details'] = '';
		$e['view_action'] = $view_lnk;
		$e['download_action'] = $down_lnk;
		//$e['']
		
		$list->addItem($e);
	}

	$body->main->write($list);
	$page->write($body);
	
}
function app_event_test_part($page, $values){
	global $config;
	
	$login = rea_template::part('login_box');
	$login->login_brand->write('<span class="fa fa-tablet fa-2x" style="color: #484848; font-weight: 600; text-shadow: none;"></span> id.pr.gov');
	$login->footer->write('Use of this service implies agreement with the institutional policy for the use of technology resources. For more information read our terms of service.');
	
	
	$login->username->write('jose');
	
	$page->view->body->write( $login );
}

function app_event_test_cli($page, $values){

    $s = "<script type='text/javascript'>
			$(document).ready( function(){
						var dat = {'a':'get_info','name':'Daniel','last_name':'Velez','email':'test@upr.edu'};
						$.get( './web_service.php',dat).done(function( data ) {
							alert(data['name'] + ' ' + data['last_name'] + ' ' + data['email']);
						});
			});
					
			</script>
			<form name='test'>
				Nombre: <input type='text' name='name' id='employee_name'><br>
				Apellidos: <input type='text' name='last_name'>
				Email: <input type='text' name='email'>
		
				<br><hr>
				<input type='submit' name='buton1' value='Guardar'>
			</form>";
	$page->write($s);
}
function app_start($page, $values){
	
	$page->setView('emr');
	$page->view->append_part( 'rea_default_body', 'body' );
	

	$page->menu->addHeader('Tests');
	$page->menu->addMenu('Alerts', 'test_alerts' );
	$page->menu->addMenu('Forms', 'test_form' );
	$page->menu->addMenu('Tabs', 'test_tab' );
	$page->menu->addMenu('Tabs with forms...', 'test_tabforms' );
	$page->menu->addMenu('Form with tabs...', 'test_formwithtabs' );
	$page->menu->addMenu('Container 1...', 'test_container1' );
	$page->menu->addMenu('Container 2...', 'test_container2' );
	
	$page->menu->addHeader('More Tests');
	$page->menu->addMenu('Detail Repeater', 'test_exrepeater' );
	$page->menu->addMenu('Masked Textbox', 'test_uimasked' );
	$page->menu->addMenu('Repeater', 'test_repeater' );
	$page->menu->addMenu('Lookup', 'test_lookup' );
	$page->menu->addSeparator();
	$page->menu->addMenu('Tables', 'test_tables' );
	
	
	//Menu con un url fijo, y otro pasando un array de parametros
	$page->menu->addMenu('View Source 1', REA_BASE_URL . 'examples/test_ui.php?a=show_src&id=9' );
	$page->menu->addMenu('View Source 2', REA_BASE_URL . 'examples/test_ui.php', array('a'=>'show_src', 'id'=>9) );
	$page->menu->addMenu('Web Service CLI', 'test_cli' );
	
	
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