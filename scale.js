var lwip = require('lwip');
var recursive = require('recursive-readdir');
var fs = require('fs');

var i = 0;

function createModel(source, target) {
	
	var pathModel = fs.readdirSync(source);
	var newPath = target;

	if (!fs.existsSync(newPath)){	
		fs.mkdirSync(newPath);
	}

	for (var i = 0; i < pathModel.length; i++) {
		if(! /^\..*/.test(pathModel[i])) { console.log(pathModel[i]);
			var dir = newPath+'/'+pathModel[i];
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
	console.log(i);

		if(fullPath) {

			lwip.open(fullPath, function(err, image){ 
				path = fullPath.split('/');
				console.log(target+'/'+path[1]+'/'+path[2])
				width = scaleValue;
				height = scaleValue / ( image.width() / image.height() ) ;
				console.log(width, height)
				image.batch()
				    .resize(width, height)          // scale to 75% // 0.30 (for mobile)
				    .writeFile(target+'/'+path[1]+'/'+path[2], function(err){
				    	if(!err) {
				    		console.log('done'); 
				    		if(i < files.length) {
				    			b = i+1; 
				    			convert(files,b,source,target,scaleValue);
				    		}
				    	}
				    });
			});

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
