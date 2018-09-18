const http = require('http');
const qs = require('querystring');
const fs = require("fs");
const write = require('./write.js');
var fileData = '';
/**
 * 读取数据
 */
const fname = 'gps-2015';
const readerStream = fs.createReadStream(`./public/${fname}.json`);

readerStream.setEncoding('UTF8');

readerStream.on('data', function(chunk) {
   fileData += chunk;
});

readerStream.on('end',function(){
   	const allPoints = JSON.parse(fileData);
   	console.log(allPoints.length);
   	var allLength = allPoints.length;
   	//将其变成2维数组
   	var pointsOfBD = [];
   	while(allPoints.length>=100){
   		//取100个
   		let temp100 = allPoints.splice(0,100);
   		//114.21892734521,29.575429778924;114.21892734521,29.575429778924
   		var coordstr = temp100.map(item => [item.lon,item.lat]).join(';');
// 		console.log(coordstr);
// 		return;

		conver(coordstr,function(result){
   			//放入百度坐标数组
   			temp100.forEach((item,index)=>{
   				item.x=result[index].x;
   				item.y=result[index].y;
   				pointsOfBD.push(item);
   			})   
   			console.log(pointsOfBD.length)
   			if(pointsOfBD.length===allLength) {
   				write(`./public/${fname}-bd.json`,JSON.stringify(pointsOfBD));
   			}
   		},function(data){
   			console.log('err 100');
   		})
		//剩下的
		if(allPoints.length&&allPoints.length<100){
			console.log('剩下'+allPoints.length)
			let tempRest = allPoints.splice(0,allPoints.length);
			var coordstr = tempRest.map(item => [item.lon,item.lat]).join(';');
			conver(coordstr,function(result){
	   			//放入百度坐标数组
	   			tempRest.forEach((item,index)=>{
	   				item.x=result[index].x;
	   				item.y=result[index].y;
	   				pointsOfBD.push(item);
	   			})
	   			console.log(pointsOfBD.length)
	   			if(pointsOfBD.length===allLength) {
	   				write(`./public/${fname}-bd.json`,JSON.stringify(pointsOfBD));
	   			}
	 			
	   		},function(data){
	   			console.log('err rest');
	   		})
		}
   	}
   	
});
function conver(coordstr,suc,err) {
	var url = `http://api.map.baidu.com/geoconv/v1/?coords=${coordstr}&from=1&to=5&ak=eNxvR05iX64b3peEGOHYhlrBqttwNTlf`;
	const req = http.request(url, (res) => {
	  res.setEncoding('utf8');
	  let data = '';
	  res.on('data', (chunk) => {
	  	data+=chunk;
	  });
	  res.on('end', () => {
	  	req.end();
	  	if(data){
	  		try{
		  		data = JSON.parse(data);
		  	} catch(e) {
		  		console.log('parse err',e,'data',data);
		  	}
		    if(data.status===0) {
				suc(data.result);
		   	}else {
		   		err(data);
		   	}
	  	}
	  	
	  });
	});
	req.on('error', (e) => {
	  console.error(`请求遇到问题: ${e.message}`);
	});
	req.end();
}