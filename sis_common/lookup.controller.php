<?php
namespace sis_common;



class lookup extends \reasg\view_controller {
	public $app_options = [
		'views'=>['views_path'=> REASG_SELF_DIRECTORY ],
		'op_commit_explicit'=>false, //user must commit outputs (not used as 1/JAN/16)
	];
	public function initialize($values){
		
		
	}
	public function main($values){
		
		
	}
	public function states($values){
		$ds = \reasg\ui_datasource::createDataset('states');
		
		$ds->items = ['options'=>[
			'pr'=>'Puerto Rico',
			'fl'=>'Florida',
			'ny'=>'New York',
			'vi'=>'Virginia',
		]];
		
		
		$this->controller->sendDataSet($ds);

	}
	public function cities($values){
		$ds = \reasg\ui_datasource::createDataset('cities');
		
		$cities = [
			'pr'=> ['ag'=>'Aguadilla','ad'=>'Aguada', 'an'=>'Añasco', 'ar'=>'Arecibo', 'is'=>'Isabela', 'mc'=>'Moca', 'mg'=>'Mayagüez', 'sb'=>'Sabana Grande', 'sb'=>'San German', 'sj'=>'San Juan', 'ho'=>'Hormigeros', 'ya'=>'Yauco', 'po'=>'Ponce', 'ri'=>'Rincon', 'by'=>'Bayamon', 'hu'=>'Humacao', 'ut'=>'Utuado'],
			'fl'=> ['or'=>'Orlando','mi'=>'Miami'],
		];
		
		//this event may receive an optional "q" parameter with a state 
		$k = (isset($values['q'])) ? $values['q'] : 'pr';
		if(!array_key_exists($k, $cities)) $k = 'pr';
		
		$ds->items['options'] = $cities[$k];
		
		$this->controller->sendDataSet($ds);

	}
}