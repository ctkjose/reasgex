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
	public function cities($values){
		$ds = \reasg\ui_datasource::createDataset('cities');
		
		$ds->items = ['options'=>[
			'ag'=>'Aguadilla',
			'ad'=>'Aguada',
			'an'=>'Añasco',
			'ar'=>'Arecibo',
			'is'=>'Isabela',
			'mc'=>'Moca',
			'mg'=>'Mayagüez',
			'sb'=>'Sabana Grande',
			'sb'=>'San German',
			'sj'=>'San Juan',
			'ho'=>'Hormigeros',
			'ya'=>'Yauco',
			'po'=>'Ponce',
			'ri'=>'Rincon',
			'by'=>'Bayamon',
			'hu'=>'Humacao',
			'ut'=>'Utuado',
		]];
		
		
		$ui = $this->controller->sendDataSet($ds);

	}
}