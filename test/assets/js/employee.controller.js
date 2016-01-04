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
	}
}