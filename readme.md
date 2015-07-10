# Skywalker generators

## Install

```
$ npm install skywalker-generators --global
```

## Usage

```
$ skygen generate -n user
```

It's also required to create a `.skygen` config file in your project's root directory. The file contains the config options in JSON format, like this:

```json
{
	"path": "scr/scripts/",
	"connector": {
		"default": {
			"type": "mysql",
			"config": {
				"host": "127.0.01",
				"user": "foo",
				"password": "bar",
				"database": "baz"
			}
		}
	}
}
```

The **path** field is required, while the **connector** is needed only if you have a mysql database from which you want to get data for your modules.

## Options

* `-n`, `--name`: the name of the module to generate (**required**);
* `-t`, `--table`: the name of the database table relative to the module (**optional**);
