<?php

require_once("./reasg.core.php");
require_once("./reasg.app.php");
require_once("./reasg.app.controller.php");
require_once("./reasg.app.router.php");


require_once("./config/reasg.mapper.default.php");

require_once("./reasg.helper.js.php");

$name = "radio[value='jose']";

reasg_dev_debuger_enabled();

\reasg\app_controller::init();

require_once("./reasg.app.ds.php");
require_once("./reasg.app.view.php");
require_once("./reasg.helper.compatibility.php");


\reasg\app::run();


?>