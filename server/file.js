const fs = require("fs");
const write = require('./write.js');
var data = '';

// 创建可读流
var readerStream = fs.createReadStream('./public/g.json');

// 设置编码为 utf8。
readerStream.setEncoding('UTF8');

// 处理流事件 --> data, end, and error
readerStream.on('data', function(chunk) {
   data += chunk;
});

readerStream.on('end',function(){
	data = data.replace(/\s/g,'');
   	var points = JSON.parse(data);
   	write('./public/gps.json',data);
});

readerStream.on('error', function(err){
   console.log(err.stack);
});



console.log("程序执行完毕");