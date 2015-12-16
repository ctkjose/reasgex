<?php

if( isset($_SERVER)){
	print "GOT \$_SERVER[]\n";
	var_dump($_SERVER);
}else{
	print "NO \$_SERVER[]\n";
}
?>