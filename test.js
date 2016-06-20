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
		main:[],
		start:0,
		bpm:[]

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
  readother();

  var blob = new Blob(
	[JSON.stringify(json_obj)]
	);

  var link = document.createElement("a");
  link.download = file.name + ".json";
  link.href = window.URL.createObjectURL(blob);

  var disp = document.getElementById("disp");

  disp.innerHTML = '<a href="' + link.href + '" target="_blank">ファイルダウンロード</a>';

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
	if(name == "GENRE" || name == "TITLE" || name == "ARTIST")
		return bms.substring(head+name.length+2,bms.indexOf("\n",head)-1);
	else
		return Number(bms.substring(head+name.length+2,bms.indexOf("\n",head)-1));
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
	var lane;
	while(head != -1){
		for(i=11;i<14;i++){
			head = (bms.indexOf("#",head+1));
			if(head==-1)
				break;
			lane = Number(bms.substr(head+4,2));
			if(lane <11 || lane > 13){
				data.push([]);
				continue;
			}
			if(Number(bms.substr(head+1,3)) != measure ||  lane != i){
				head--;
				data.push([]);
				continue;
			}
				data.push(slice_two(bms.substring(bms.indexOf(":",head)+1,bms.indexOf("\n",head)-1)));
		}
		var main_obj = new Main(measure,data);
		main_data.push(main_obj);
		data = [];
		measure++;
	}
	return main_data;
}

function readother(){
	var head = bms.indexOf("MAIN DATA FIELD");
	while(head != -1){
		head = bms.indexOf("#",head+1);
		if(Number(bms.substr(head+4,2)) == 1){
			json_obj.start=Number(bms.substr(head+1,3));
		}
		if(Number(bms.substr(head+4,2)) == 3){
			json_obj.bpm.push([Number(bms.substr(head+1,3)),parseInt(bms.substr(bms.indexOf(":",head)+1,2),16)]);
			if(parseInt(bms.substr(bms.indexOf(":",head)+1,2),16) == 0){
				alert("bpm変更エラー：bpmが正しく設定されていないか、小節の頭に指定されていない可能性があります");
			}
		}

	}
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

