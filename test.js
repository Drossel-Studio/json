var obj1 = document.getElementById("selfile");
var bms;

var json_obj = {
		header:{
			genre:null,
			title:null,
			artist:null,
			bpm:null,
			playlevel:0,
			rank:0,
			wav:[],
		},
		main:[]
};




//ダイアログでファイルが選択された時
if(obj1 != null){
obj1.addEventListener("change",function(evt){

  var file = evt.target.files;

  //FileReaderの作成
  var reader = new FileReader();
  //テキスト形式で読み込む
  reader.readAsText(file[0]);
  //読込終了後の処理
  reader.onload = function(ev){
  bms = reader.result;

  //ヘッダの読み込み
  var key;
  for (key in json_obj.header){
	  json_obj.header[key] = readheader(key.toUpperCase());
  }
  json_obj.main = readmain();
  alert(JSON.stringify(json_obj));

}
},false);
}

function readheader(name){
	var head = bms.indexOf("#"+name,0);
	if(head == -1)
		return NULL;
	if(name == "WAV"){
		var wav = [];
		while(head != -1){
		wav.push(bms.substring(head+name.length+4,bms.indexOf("\n",head)-1));
		head = bms.indexOf("#"+name,head+1);
		}
		return wav;
	}
    return bms.substring(head+name.length+2,bms.indexOf("\n",head)-1);
}

function Main(_line,_data){
	this.line = _line;
	this.data = _data;
}


function readmain(){
	var head = bms.indexOf("MAIN DATA FIELD");
	var measure = 0;
	var data = [];
	var i;
	var main_data = [];
	while(head != -1){
		for(i=11;i<14;i++){
			head = (bms.indexOf("#",head+1));
			if(head==-1)
				break;
			if(Number(bms.substr(head+4,2)) <11 || Number(bms.substr(head+4,2)) > 13){
				data.push([]);
				continue;
			}
			if(Number(bms.substr(head+1,3)) != measure || (Number(bms.substr(head+4,2)) != i)){
				head--;
				data.push([]);
			} else {
				data.push(slice_two(bms.substring(bms.indexOf(":",head)+1,bms.indexOf("\n",head)-1)));
			}
		}
		var main_obj = new Main(measure,data);
		main_data.push(main_obj);
		data = [];
		measure++;
	}
	return main_data;


}

function slice_two(data){
	var length = data.length;
	var i;
	var num = [];
	for(i=0;i<length;i+=2){
		num.push(Number(data.slice(i,i+2)));
	}
	return num;
}

