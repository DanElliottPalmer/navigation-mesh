"use strict";

module.exports = function(grunt) {

	grunt.initConfig({
		"babel": {
			"dev": {
				"files": [{
					"cwd": "./src/",
					"expand": true,
					"dest": "./tmp/",
					"src": [ "**/*.js" ]
				}]
			}
		},
		"browserify": {
			"dev": {
				"files": {
					"dist/NavigationMesh.js": [ "tmp/NavigationMesh.js" ]
				},
				"options": {
					"browserifyOptions": {
						"standalone": "NavigationMesh"
					}
				}
			}
		},
		"pkg": grunt.file.readJSON("package.json"),
		"watch": {
			"dev-js": {
				"files": [ "src/**/*" ],
				"tasks": [ "babel:dev", "browserify:dev" ]
			},
			"options": {
				"livereload": true
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-browserify");
	grunt.loadNpmTasks("grunt-babel");

};