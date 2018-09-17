const fs = require('fs');
var count=0;
function write(path,data) {
	fs.appendFile(path, data, (err) => {
	  if (err) throw err;
	  count++;
	  console.log(`写入${count}`);
	});
}
module.exports = exports = write;