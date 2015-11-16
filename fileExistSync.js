/*
  fileExistSync - Check if a file exist in NodeJS
  Twitter: @FGRibreau / fgribreau.com
  Usage: 
    var fileExistSync = require('./fileExistSync');
    
    var exist = fileExistSync('/var/folders/zm/jmjb49l172g6g/T/65b199');
    
  Support for Nodev0.6
*/

var fs         = require('fs');

module.exports = fs.existsSync || function existsSync(filePath){
  try{
    fs.statSync(filePath);
  }catch(err){
    if(err.code == 'ENOENT') return false;
  }
  return true;
};