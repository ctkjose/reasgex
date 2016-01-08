/**
 * My UI controller
 */

var employee_controller = {
	
	onChange_email : function(msg){
		var value = this.getValue();
		console.log("@myController with value=" + value);
	},
	onChange_school_name : function(msg){
		var value = this.getValue();
		console.log("@myController with school_name=" + value);
	},
	onChange_field_enabled : function(msg){
		var value = this.getValue();
		console.log("@myController with field_enabled=" + value);
	},
	
	onChange_emp_state : function(msg){
		console.log(this.def);
		var value = this.getValue();
		
		console.log("@myController with emp_state=" + value);
		
		var ds = ui_datasource_controller.getDatsourceWithName("cities");
		ds.setParams({"q":value});
		ds.refresh();
	}
}