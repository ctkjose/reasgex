<?php
require_once("../engine/reasg/reasg.core.php");
require_once("../engine/reasg/reasg.app.php");
require_once("../engine/reasg/reasg.app.router.php");
require_once("../engine/reasg/reasg.app.controller.php");

print "Alive<br><pre>";
print "DR = [" . REASG_ENGINE_PATH . "]\n";

var_dump($rea_route);

print "test00-------------\n";
$controller = new \reasg\app\controller();
$controller->test1();
print "test00-------------\n";
\reasg\app\controller::run();

//$s = \reasg\app\$rea_test1 . " is working\n";
print "";

$r = new \reasg\app\router();
var_dump($r);

print "</pre><br>DONE";

function app_start1(){
	print "@app_start global\n";
}
?>
