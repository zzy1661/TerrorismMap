const http = require('http');
const qs = require('querystring');
const fs = require("fs");
const write = require('./write.js');
var data = '';
var convered = [];
/**
 * 读取数据
 */
const readerStream = fs.createReadStream('./public/gps.json');

readerStream.setEncoding('UTF8');

readerStream.on('data', function(chunk) {
   data += chunk;
});

readerStream.on('end',function(){
   	const allPoints = JSON.parse(data);
   	//将其变成2维数组
   	const pointsArr = pointsToPointsArr(allPoints);
   	pointsArr.forEach(function(item,index) {
   		var coordstr =  item.join(';')
   		conver(coordstr);
   	})
});
function pointsToPointsArr(points) {
	var arr = new Array();
	var temp = points.map(function(item){
			return [item.lon,item.lat];
		})
	while(temp.length>=100) {
		arr.push(temp.splice(0,100))
	}
	arr.push(temp.splice(0,temp.length));
	return arr;
}
readerStream.on('error', function(err){
   console.log(err.stack);
});
function conver(coordstr) {
	var url = `http://api.map.baidu.com/geoconv/v1/?coords=${coordstr}&from=1&to=5&ak=eNxvR05iX64b3peEGOHYhlrBqttwNTlf`;
	const req = http.request(url, (res) => {
	  res.setEncoding('utf8');
	  let data = '';
	  res.on('data', (chunk) => {
	  	data+=chunk;
	   	
	  });
	  res.on('end', () => {
	  	try{
	  		data = JSON.parse(data);
	  	} catch(e) {
	  		console.log(e,data);
	  	}
	  	
	    if(data.status===0) {
	   		write('./public/bd.json',JSON.stringify(data.result));
	   	}else {
	   		console.log('err',data);
	   	}
	  });
	});
	req.on('error', (e) => {
	  console.error(`请求遇到问题: ${e.message}`);
	});
	req.end();
}

