var socket = io();
var supportVibrate = "vibrate" in navigator;
var username = "";
var roomname = "";

$(document).ready(function(){

  $('#myModal').modal({
  	backdrop: 'static',
  	keyboard: true
	});
	var myRoomID = null;
});

window.onresize = function (event) {
  applyOrientation();
}

function applyOrientation() {
  if (window.innerHeight > window.innerWidth) {
    	alert('Best view in landscape mode');
  }
}

$(document).on('submit','#myForm', function(e){
	e.preventDefault();
	username =$('#username').val();
	if(username!='')
	{
		socket.emit('joinServerClient', username);
	}
	else alert("Username tidak boleh kosong");

});

socket.on('showNext', function(){
	$('#myModal').modal('hide');
	$('#myModalRoom').modal({
  		backdrop: 'static',
  		keyboard: true
	});
});

$(document).on('submit','#myFormRoom', function(e){
	e.preventDefault();
	roomname =$('#roomname').val();
	if(roomname!='')
	{
		//socket.emit('room', socket.id,username);
		socket.emit('joinRoom', roomname);
		//$('#myModal').modal('hide');
	}
	else alert("Nama room tidak boleh kosong");

});

socket.on('showReady', function(){
	$("#userApp").text(username);
	$("#roomApp").text(roomname);
	$("#myModalReady").modal({
	  		backdrop: 'static',
	  		keyboard: true
		});
	$("#haiUser").text(username);
	$("#haiRoom").text(roomname);
	$('#myModalRoom').modal('hide');
});

socket.on('status', function(status){
	if (status == 200) {
		$("#clientContaint").css('display','');
		$("#myModalReady").modal('hide');
		$("#myModalRoom").modal('hide');
	}
});

$(document).on('click','.but-ans', function(e){
	e.preventDefault();

	$('.but-ans').css('background-color','#555555');
	$(this).css('background-color','#50c878');
	//$('.but-ans').css('background-color','red');
	var noSoal = $('#noSoal').text();
	var answer = $(this).attr('value');
	var username = $("#userApp").text();
	var room = $("#roomApp").text();
	var time = new Date();
	var times = time.valueOf();
	var data = {	
					'id': socket.id,
					'username':username,
					'roomID':room,
					'soal':noSoal,
					'jawaban':answer,
					'times':times
	};

	socket.emit('receiveClient',data);
});

socket.on('showTimer', function(counter)
{
	$('#timerClient').text(counter);
	//console.log(counter);
});

socket.on('recvNoSoal', function(noSoal, soalData)
{
	$('.but-ans').css('background-color','#555555');
	$('#opsiA').text(soalData.opsiA);
	$('#opsiB').text(soalData.opsiB);
	$('#opsiC').text(soalData.opsiC);
	$('#opsiD').text(soalData.opsiD);
	$('#noSoal').text(noSoal);
	navigator.vibrate(1000);
});

socket.on("errorMsg", function(data) {
  $("#errMsg").empty();
  $("#errMsg").show();
  $("#errMsg").append(data.msg + " Try <strong>" + data.proposedName + "</strong>");
    toggleNameForm();
    toggleChatWindow();
});

socket.on("errorMsgRoom", function(data) {
  $("#errMsgRoom").empty();
  $("#errMsgRoom").show();
  $("#errMsgRoom").append(data.msg);
  toggleNameForm();
  toggleChatWindow();
});

socket.on('recvScore', function(userScore){
	var tmp_id = socket.id;
	/*if( userScore[tmp_id].nilai!=undefined)
	{
		$("#userScore").text(userScore[tmp_id].nilai);
	}
	else $("#userScore").text(0);
*/
	var flag_score=0;
	for(i in userScore)
	{
		if(userScore[i].id==tmp_id)
		{
			$("#userScore").text(userScore[i].nilai);
			$("#winLose").text(userScore[i].urutan);
			flag_score=1;
			break;
		}
	}

	if(flag_score==0) $("#userScore").text(0);
	$("#myModalWinner").modal({
  	backdrop: 'static',
  	keyboard: true
	});
});


