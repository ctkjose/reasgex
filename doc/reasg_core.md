
## Constants ##

The following constants are available.

| Constant | Description |
|----------|-------------|
| REASG_DOC_ROOT | Absolute path to the document roor folder. |
| REASG_ROOT_PATH | Absolute path to the folder where ```engine``` is. |
| REASG_ROOT_URL | An absolute URL to the folder where ```engine``` is. |
| REASG_ENGINE_PATH | Absolute path to the ```engine``` folder. |
| REASG_ENGINE_JS_PATH | Absolute path to the ```engine\js\``` folder. |
| REASG_ENGINE_PHP_PATH | Absolute path to the ```engine\server\``` folder. |
| REASG_SELF_PATH | Absolute path to your main controller |
| REASG_SELF_DIRECTORY | Absolute path to the folder where your main controller is. |
| REASG_SELF_CONTROLLER | The class name of your main controller. Including the namesapece. |
| REASG_RUNMODE_CLI | True when running on CLI, else false. |
| REASG_RUNMODE_WEB | True when running over HTTP/Web, else false. |


## Paths and URLs ##

Get an url to an item in your assets ```url_app_assets($path, $controller=null)```.

```php
$url = \reasg\url_app_assets("./js/controller.js", "\\registrar\\records");
```

Get an url to a controller using ```url_app_controller($controller, $event, $params)```.

```php
$url = \reasg\url_app_controller('\\registrar\\records', 'create', ['name'=>'jose']);
```

You also have some helper functions:

Use ```\reasg\core\paths_rel2p($f, $p)``` to convert an absolute path to a relative path assuming is under the path in $p.

Use ```\reasg\core\paths_rel2dr($f)``` to convert an absolute path to a relative path assuming is under the document root.

Use ```\reasg\core\paths_rel2r($f)``` to convert an absolute path to a relative to the folder where your engine is at (reasg's root folder).


### A note on special urls ###
Since REASG uses url rewrites to handle calls into the framework it also needs a way to create these urls. To do this REASG uses the closure ```$reasg_path_mapper``` to create all of its special urls.

The config file ```reasg.mapper.default.php``` defines the default closure used by REASG which assumes that your installation of REASG is using the default rewrite rules. If you have different rewrite rules, then you must define your own closure function.





## Trait ObjectExtendable ##


Use the ```ObjectExtendable``` trait to allow to assign ```closures``` to your object.

```php

class myClass {
	use \reasg\core\ObjectExtendable;
}

$a = new myClass();

$a->doThis = function($name){
	print "Hello " . $name . "<br>";
};

$a->doThis("Jose Cuevas");
```

You can delegate methods to another object using ```delegate(closure)``` and ```delegateFor(fnName)```.

```php

class myClass {
	use \reasg\core\ObjectExtendable;
}
class myWorker {
	use \reasg\core\ObjectExtendable;
	
	public $name = "Record Worker";
	function doSomething($value){
		print "Doing something for " . $this->name . " with value " . $value . ".<br>";
	}
}

$a = new myClass();
$b = new myWorker();

$a->delegate("dothat", $b->delegateFor("doSomething"));

$a->dothat("500.50");
```


