<?php
require_once( '../engine/rea.framework.php');

require_once(REA_ENGINE_PATH . 'rea.ui.views.php');
require_once(REA_ENGINE_PATH . 'rea.ui.jsb.php');
require_once( $REA_USE_APPLICATION );

function rea_initialize_application(&$properties){
	
	$properties['application_use_view_helpers'] = false; //set to true to use view_helper_*.php files
    $properties['name'] = 'Test REA';
	$properties['application_use_model'] = true;
	$properties['opt_use_auth'] = false;
	
    return true;
}

function app_event_test_page($values){
	global $config;
	

	
	$m = function($page){
		$page->body->write("here2");
	};
	rea_app_controller::on("default_page_commit", $m);
	
	$files = rea_app::bundle(); //lets create a bundle helper
	
	$page = rea_views::default_page();
	
	$page->set("title", "Testing Views");
	$page->body->write("this is the body<br>");
	
	$page->css->addfile( $files->css->child("test_view1.css")->url ); //add one file
	
	$page->header->write( $files->css->all() ); //use all to add all the files in a folder
	
	$page->js->addfile( $files->child("test_view1.js")->url );
	$page->js->write("console.log('hello');"); //inline js
	
	//we could insert files like this
	//$page->body->insert($files->child("test_view1.html")->path);
	
	//rea_view::setViewsPath( REA_SELF_DIRECTORY );
	//$part = rea_template::create("nav_bar.part");
	
	$page->set("part_test", $part);
}
function app_event_ds_schools_get($values){
	// Provides a dataset to populate a table
	
	$dataset = rea_ui_datasource::dataset();
	
	// we use the special entry 'row_attributes' to set a row's attributes
	// the 'css' elements sets a rows class attribute
	
	
	$dataset->append('1', ['id'=>'1', 'school_name'=> 'Jose de Diego', 'town'=>'ag', 'type'=>'sc', 'date_created' => '5/14/2015']);
	$dataset->append('2', ['id'=>'2', 'school_name'=> 'Betances', 'town'=>'ag', 'type'=>'sc', 'date_created' => '6/15/2015']);
	$dataset->append('3', ['id'=>'3', 'school_name'=> 'John B Waston', 'town'=>'mc', 'type'=>'sc', 'date_created' => '7/16/2015']);
	

	$dataset->send();
}
function app_event_ds_records_get($values){
	// Provides a dataset to populate a table
	
	$dataset = rea_ui_datasource::dataset();
	
	// we use the special entry 'row_attributes' to set a row's attributes
	// the 'css' elements sets a rows class attribute
	
	
	$dataset->append('1', ['id'=>'1', 'name'=> 'Jose Cuevas', 'amount'=>'3400.00', 'type'=>'001']);
	$dataset->append('2', ['id'=>'2', 'name'=> 'Joe Cuevas', 'amount'=>'3450.00', 'type'=>'002', 'row_attributes'=> ['css'=>'disabled'] ]);
	$dataset->append('3', ['id'=>'3', 'name'=> 'Vilmari Sanchez', 'amount'=>'3400.00', 'type'=>'001', 'amount_class'=> 'positive']);
	$dataset->append('4', ['id'=>'4', 'name'=> 'Joe Dude', 'amount'=>'3700.00', 'type'=>'001', 'amount_class'=> 'negative']);
	
	
	$dataset->send();
}
function app_event_ds_jobs_list($values){
		//This method implements an ajax data source provider 
		//$dataset = rea_ui_datasource::cachableDataset('ds_jobs');
		$dataset = rea_ui_datasource::dataset('ds_jobs');
		
		$dataset->append('001', 'Programmer');
		$dataset->append('002', 'Graphic Artists');
		$dataset->append('003', 'Analist');
		$dataset->append('004', 'DBA');
		$dataset->append('005', 'System Administrator');
		$dataset->append('006', 'Scrum Master');
		$dataset->append('007', 'Help Desk');
		
		error_log("@ds_jobs_list 1=====================");
		error_log(print_r($values, true));
		$dataset->send();
		error_log("@ds_jobs_list 2=====================");
}
function app_event_ds_job_list($values){
		//This method implements an ajax data source provider 
		$dataset = rea_ui_datasource::dataset();
		
		$ops = [
			['001', 'Programmer'],
			['002', 'Graphic Artists'],
			['003', 'Analist'],
			['004', 'DBA'],
			['005', 'System Administrator'],
			['006', 'Scrum Master'],
			['007', 'Help Desk']
		];
		
		foreach( $ops as $e){
			if( isset($values['q']) ){
				if (strpos(strtolower($e[1]), strtolower($values['q'])) !== false ) $dataset->append($e[0], $e[1]);
			}else{
				$dataset->append($e[0], $e[1]);
			}
		}
		
		
		error_log("@ds_job_list=====================");
		error_log(print_r($values, true));
		error_log(print_r($dataset, true));
		
		//sleep(3); //test slow response
		
		$dataset->send();
}
function app_event_save($values){
	global $config;
	
	error_log("@save==============");
	error_log( print_r($values, true));
	
	foreach($values as $k => $v){
		error_log("values[{$k}]=");
		error_log( print_r($v, true));
	}
	$c = new rea_client_controller();
	//$c->messagebox("Hello");
	//$c->redirect( rea_app_controller::urlForMessage('test_tpl', ['email'=> 'joe12upr.edu']), 'Updating records...' ) ;
	
	$c->alert_success("<h2>Record saved</h2>What a day");
	
	$c->send();
}
function app_event_test_tpl($values){
	global $config;
	
	error_log("@app_event_test_tpl ---------------------------------------------------");
	error_log(print_r($values, true));
	
	rea_views::setViewsPath( REA_SELF_DIRECTORY );
	//$p = rea_template::create('test.view');
	//rea_views::default_view( $p );
	
	$p = rea_views::default_view( 'reaui_test.view' );
	//$p = rea_views::default_view( 'page_with_sidebar.view' );
	
	$p->sidebar->write("hello");
	//$page = rea_views::default_page("test.view");
	
	$p->title->write("Jose");
	
	
	//lets populate our view data
	$data = [];
	$data['email'] = 'jose.cuevas@upr.edu';
	$data['payment_amount'] = '125.50';
	
	//$data['start_date'] = '5/14/2015'; //date can have a basic 'M/D/YYYY'
	//$data['start_date'] = date('c'); //date as ISO 8601 date
	$data['start_date'] = date('Y-m-d H:i:s'); //date in MySQL datetime format
	
	$data['field01'] = [2]; //checkbox are arrays
	$data['field02'] = [2]; //radios are arrays
	$data['field04'] = false; //boolean checkbox or radios
	$data['field03'] = true; //boolean checkbox or radios
	
	$data['field05'] = false; //boolean checkbox or radios
	$data['field06'] = "Programmer";
	
	$data['fld_town02'] = 'mc';
	
	//lets create a datasource from our data
	$ds = rea_ui_datasource::create($data);
	
	//we bind our datasource to our form using a name selector and the form's name
	$ds->bindToSelector('[name=emp_record]');
	
	//now we add our 
	//$p->js->write($ds);
	
	/*
	$towns = [
		'hm' =>'Hormigueros',
		'an' => 'Añasco'
	];
	
	$ds = rea_ui_datasource::create($towns);
	*/
}
function app_event_test_view01($values){
	global $config;
	
	$page = rea_views::default_view();
	$page->set("title", "Testing Views");
	$page->body->write("<p>Welcome to REASG</p>");

}
function app_event_test_view02($values){
	global $config;
	
	$page = rea_views::default_view();
	$page->set("title", "Testing Views");
	
	$header = rea_view::create('header.part');
	$header->welcome->set("Welcome to REASG");
	
	$page->body->write($header);
}

function app_event_test_view($values){
	global $config;
	
	//
	//rea_views::setViewsPath( REA_SELF_DIRECTORY );
	
	
	$page = rea_views::default_view("bootstrap.view");
	$page->set("title", "Testin Views");
	$page->body->write("<p>Welcome to REASG</p>");
	
	
	//For this example lets override where we look for views and templates
	//in a regular setup we do not need to do this if our files are in the views folder
	rea_views::setViewsPath( REA_SELF_DIRECTORY ); 
	
	$view_name = (isset($values['view'])) ? $values['view'] : 'view_test3';
	$view = rea_view::create($view_name);
	//$view->body->write("this is the body<br>");
	
	//$out = $view->getHTML();
	//print htmlentities($out);
	
	$page->body->write($view);
}

function app_event_info($values){
	global $config;
	
	print "jose={$_SESSION['jose']}<br>";
	rea_dev_print_info();
}
function app_event_test_bundle($values){
	global $config;
	
	$page = rea_views::default_page();
	
	// Use bundle to help you access files in your app folder
	
	//Creating a bundle
	//$f = rea_app::bundle();  //is the same as $f = rea_bundle::create();
	//$f = rea_app::bundle('/some/absolute/path');
	//$f = rea_app::bundle('@engine'); //may also use @root for the document root
	
	
	
	//$bs = rea_files::create(REA_BASE_PATH . 'views/bootstrap/');
	//$page->header->write( $bs->includeAll() );
	

	//Using iterator with a callback
	$f = rea_files::create('@engine');
	$m = function($item) use ($page){
		$page->body->write("got file " .  $item->url . " of type " . $item->type . ' (' . $item->extension . ')<br>' );
	};
	$f->js->each($m); //call the function m for each of the items in the folder js
	
	
	//We can walk folders in the bundle path
	$item = $f->js->child('rea.helper.views.js');
	
	//we can get some basic info
	$page->body->write("item path is=" . $item->path . '<br>');
	$page->body->write("item url is=" . $item->url . '<br>');
	$page->body->write("item is_directory=" . $item->is_directory . '<br>');
	$page->body->write("item is_readable=" . $item->is_readable . '<br>');
	$page->body->write("item extension=" . $item->extension . '<br>');
	$page->body->write("item type=" . $item->type . '<br>');
	
	if(!$item->exists()){
		$page->body->write('item does not exists<br>');
	}else{
		$page->body->write('item does exists<br>');
	}
	
	//We can convert an instance of a bundle item to an html tag using
	$s = $item->html('js');
	
	//We can put a file represented in a bundle directly in the template using write
	$page->header->write($item->html());
	//$page->header->write($f->js->child('rea.helper.views.js')->html()); //the same as above
	//$page->header->write(rea_files::create('@engine')->js->child('rea.helper.views.js')->html()); //the same as above
	
	
	//also works like $s = $img_file->html();
	//when no tag is provided the extension is used to figure out a default html tag for that file type eg: js, img, or css tag.
	
	
	//We can do all of these operation in one like
	$f = rea_files::create();
	$s = $f->views->media->child('login_banner.png')->html();
	$page->body->write( htmlentities($s) );
	
	
	
	
}
function app_event_default($values){
	global $config;
	
	
	$page->view->append_part( 'rea_default_body', 'body' );
	$page->title ='Jose';
	
	
	$cards = rea_template::part('body_cards_view');
	$cards->header->write('<span class="fa fa-tablet fa-2x" style="color: #484848; font-weight: 600; text-shadow: none;"></span> id.pr.gov');
	
	
	$cards->body->write('jose');
	
	$page->view->body->write( $cards );
	
	
	//$_SESSION['jose'] = "1";
	//print $_SERVER['SERVER_NAME'];
}

function app_event_test_part($values){
	global $config;
	
	$login = rea_template::part('login_box');
	$login->login_brand->write('<span class="fa fa-tablet fa-2x" style="color: #484848; font-weight: 600; text-shadow: none;"></span> id.pr.gov');
	$login->footer->write('Use of this service implies agreement with the institutional policy for the use of technology resources. For more information read our terms of service.');
	
	
	$login->username->write('jose');
	
	$page->view->body->write( $login );
}

?>