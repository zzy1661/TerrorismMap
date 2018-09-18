
//获得文件系统模块
const fs = require('fs');
//基于Node.js解析excel文件数据及生成excel文件，仅支持xlsx格式文件；
const xlsx = require('node-xlsx');
const write = require('./write.js');
var filepath = './public/data.xlsx';

var obj = xlsx.parse(filepath);
 
var excelObj=obj[0].data, data=[];

for(let i=1;i<excelObj.length;i++) {
	var item = excelObj[i];
	let point = {
		id:item[0],
		year:item[1],
		region:item[2],
		lat:item[3],
		lon:item[4]
	}
	data.push(point)
}
//将数据写入gps.js
//write('./public/gps.json',JSON.stringify(data));
write('./public/gps-2015.json',JSON.stringify(data.filter(item=>item.year===2015)));
write('./public/gps-2016.json',JSON.stringify(data.filter(item=>item.year===2016)));
write('./public/gps-2017.json',JSON.stringify(data.filter(item=>item.year===2017)));