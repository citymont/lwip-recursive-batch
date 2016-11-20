var lwip = require('lwip');
var recursive = require('recursive-readdir');
var fs = require('fs');
var fileExistSync = require('./fileExistSync');
var junk = require('junk');

var i = 0;

function createModel(source, target) {
	
	var pathModel = fs.readdirSync(source);
	var pathModelFinal = pathModel.filter(junk.not);
	var newPath = target;

	if (!fs.existsSync(newPath)){	
		fs.mkdirSync(newPath);
	}

	for (var i = 0; i < pathModelFinal.length; i++) {
		if(fs.lstatSync(source+'/'+pathModelFinal[i]).isDirectory()) {
			var dir = newPath+'/'+pathModelFinal[i];
			if (!fs.existsSync(dir)){	
				fs.mkdirSync(dir);
			}
		}
	};

}


function cb(files,source,target,scaleValue) {
		
  	convert(files,i,source,target,scaleValue);

}

function convert(files,i,source,target,scaleValue) {

	fullPath = files[i];

		if(fullPath) {

			path = fullPath.split('/');
			pathFinal = target+'/'+path[1]; // Change if there is multiple path

    			if(fileExistSync(pathFinal)) {

    				if(i < files.length) {
					    b = i+1; 
					    convert(files,b,source,target,scaleValue);
					}

    			} else {

	    			lwip.open(fullPath, function(err, image){ 
					
						width = scaleValue;
						height = scaleValue / ( image.width() / image.height() );

						image.batch()
						    .resize(width, height)
						    .writeFile(pathFinal, function(err){
						    	if(!err) {
						    		if(i < files.length) {
						    			b = i+1; 
						    			convert(files,b,source,target,scaleValue);
						    		}
						    	} 
						    });
					});

    			}
    		

		}
	
}

function start(source, target, scaleValue) {
	
	var target = target;
	var source = source;
	var scaleValue = scaleValue;

	createModel(source,target);

	recursive(source, ['.DS_Store', '*.zip'], function (err, files) {

	  cb(files,source,target,scaleValue);

	});

}

module.exports = start