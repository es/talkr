'use strict';

(function () {
	var talkrObj = {};

	function readCookie(name) { //http://www.quirksmode.org/js/cookies.html
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}

	function escapeHtml(str) { //https://gist.github.com/BMintern/1795519
    	var div = document.createElement('div');
    	div.appendChild(document.createTextNode(str));
    	var content = div.innerHTML;
   	   	return content;
	}

	function signIn(username){
		//sendUserData();
		username = escapeHtml (username);
		talkrObj.username = username;
		document.cookie="username="+talkrObj.username;
		//Show Chats
		document.getElementById('talkr-form-user').classList.add('hidden');
		document.getElementById('chat-msgs').classList.remove('hidden');

		//Show Forms
		document.getElementById('submit-user-chat').classList.add('hidden');
		document.getElementById('submit-msg-chat').classList.remove('hidden');

		document.getElementById('talkr-toggle').insertAdjacentHTML('beforebegin',
			'<button class="btn btn-success btn-xs" id="clear-username">Logout</button>');
		bootstrapChat();
	}

	var bootstrapTalkr = function (talkrHTML) {
		document.body.insertAdjacentHTML('beforeend', talkrHTML);

		var talkrDisplayed = false,
		talkr = document.getElementById('talkr'),
		talkrToggle = document.getElementById('talkr-toggle');

		talkrToggle.addEventListener('click', function () {
			if (talkrDisplayed)
				talkrToggle.innerHTML = '<span class="glyphicon glyphicon-chevron-up"></span>';
			else
				talkrToggle.innerHTML = '<span class="glyphicon glyphicon-chevron-down"></span>';
			talkrDisplayed = !talkrDisplayed;
			talkr.classList.toggle('hide-talkr');
		}, false);

		var cookieValue = readCookie("username");
		if (cookieValue != null && cookieValue == ""){
			cookieValue = null;
		}
		//cookieValue = "just a username";
		console.log("Username is " + cookieValue);
		if (cookieValue != null){
			signIn(cookieValue);
		}
		else {
			var userDataBtn = document.getElementById('send-user-details');
			userDataBtn.addEventListener('click', function () {
				var formInput = document.getElementById('talkr-user-name');
				if (!!formInput.value && formInput.value.length !== 0) {
					signIn(formInput.value);
				}
				else alert('You did not put any data in!');
			}, false);	
		}
	};


	var bootstrapChat = function () {

		var textPresent = function () {
			var text = document.getElementById('chat-input').value;
			return !!text && text.length > 0;
		};

		var sendMsgIfPossible = function (){
			if (textPresent()) {
				var msgObj = {
					from: talkrObj.username,
					msg: document.getElementById('chat-input').value,
					created: new Date ().getTime(),
				};
				socket.emit('msg', msgObj);

				addMsg(msgObj, true);
				document.getElementById('chat-input').value = '';
			}
		}
		var sendBtn = document.getElementById('send-chat');
		sendBtn.addEventListener('click', function () {
			sendMsgIfPossible();
		}, false);

		var inputText = document.getElementById('chat-input');
		inputText.addEventListener('keyup', function (e) {
			var key = e.keyCode ? e.keyCode : e.which;
			if (key == 13){
				sendMsgIfPossible();
			}
		}, false);

		document.getElementById('clear-username').addEventListener('click', function () {
			document.cookie="username=";
			location.reload();
		}, false);

		var socket = io.connect('{{Server running socket.io}}');
		socket.emit('newUser', {name: talkrObj.username});
		socket.on('msg', function (msgObj) {
			addMsg(msgObj, false);
		});

		setInterval(function () {
			var timeDispalys = document.getElementsByClassName('talkr-time-display');
			for (var i = timeDispalys.length - 1; i >= 0; i--)
				timeDispalys[i].innerHTML = '<span class="glyphicon glyphicon-time"></span>' + howLongAgo(Number(timeDispalys[i].dataset.time)) + ' ago';
		}, 60000);
	};

	var loadTalkrHTML = function () {
		var finalHtml = '';
		finalHtml += '<div id="talkr" style="color: #333" class="talkr talkr-fixed-bottom hide-talkr">'
		finalHtml += '  <div>'
		finalHtml += '    <div style="width: 390px; float:right; margin-right: 75px">'
		finalHtml += '      <div class="panel panel-primary" style="margin-bottom: 0">'
		finalHtml += '        <div class="panel-heading">'
		finalHtml += '          <span class="glyphicon glyphicon-comment"></span> Talkr'
		finalHtml += '          <div class="btn-group pull-right">'
		finalHtml += '            <button type="button" id="talkr-toggle" class="btn btn-default btn-xs" data-toggle="dropdown">'
		finalHtml += '              <span class="glyphicon glyphicon-chevron-up"></span>'
		finalHtml += '            </button>'
		finalHtml += '          </div>'
		finalHtml += '        </div>'
		finalHtml += '        <div style="height: 301px">'
		finalHtml += '          <div id="panel-body-msgs" class="panel-body">'
		finalHtml += '            <ul id="chat-msgs" class="chat hidden">'
		finalHtml += '            </ul>'
		finalHtml += '            <div id="talkr-form-user" class="form-signin">'
		finalHtml += '              <h5 style="color: #333" class="form-signin-heading">Please fill out the field(s) below:</h5>'
		finalHtml += '              <input type="text" id="talkr-user-name" style="margin-top: 20px" class="form-control" placeholder="Full Name" required="" autofocus="">'
		finalHtml += '              <!-- <input type="email" style="margin-top: 10px" class="form-control" placeholder="Email address" required="" autofocus=""> -->'
		finalHtml += '            </div>'
		finalHtml += '          </div>'
		finalHtml += '          <div class="panel-footer">'
		finalHtml += '            <div id="submit-user-chat">'
		finalHtml += '                <button class="btn btn-block btn-warning btn-sm" id="send-user-details"> Submit</button>'
		finalHtml += '            </div>'
		finalHtml += '            <div id="submit-msg-chat" class="input-group hidden">'
		finalHtml += '              <input id="chat-input" type="text" class="form-control input-sm" placeholder="Type your message here..." />'
		finalHtml += '              <span class="input-group-btn">'
		finalHtml += '                <button class="btn btn-warning btn-sm" id="send-chat"> Send</button>'
		finalHtml += '              </span>'
		finalHtml += '            </div>'
		finalHtml += '          </div>'
		finalHtml += '        </div>'
		finalHtml += '      </div>'
		finalHtml += '    </div>'
		finalHtml += '  </div>'
		finalHtml += '</div>'
		bootstrapTalkr(finalHtml);
	};

	loadTalkrHTML();

	var addMsg = function (msgObj, generatedLocally) {
		var msgHtml = createMsg (msgObj, generatedLocally);
		document.getElementById('chat-msgs').insertAdjacentHTML('beforeend', msgHtml);

		var objDiv = document.getElementById('panel-body-msgs');
		objDiv.scrollTop = objDiv.scrollHeight - 10;
	};

	var howLongAgo = function (dateWritten) {
		var seconds = (new Date ().getTime() - dateWritten) / 1000;
		if (seconds < 3600)  return '' + Math.round(seconds / 60) + ' min';
		else if (seconds < 86400)  return '' + Math.round(seconds / 60) + ' hr';
		else return 'long time';
	};

	var createMsg = function (msgObj, localUser) {
		var side = localUser ? 'right' : 'left';
		var msgHtml = '';
		msgHtml += '<li class="' + side + ' clearfix">';
	    /*
	    msgHtml += '<span class="chat-img pull-' + side + '">';
	    msgHtml += '<img src="http://placehold.it/50/FA6F57/fff&text=ME" alt="User Avatar" class="img-circle" />';
	    msgHtml += '</span>';
	    */
	   	msgObj.msg = escapeHtml(msgObj.msg);
	    console.log(msgObj.msg);
	    msgHtml += '<div class="chat-body clearfix">';
	    msgHtml += '<div class="header">';
	    if (localUser) {
	    	msgHtml += '<small class="talkr-time-display text-muted" data-time="' + msgObj.created + '"><span class="glyphicon glyphicon-time"></span>' + howLongAgo(msgObj.created) + ' ago</small>';
	    	msgHtml += '<strong class="pull-right primary-font">' + msgObj.from + '</strong>';
	    }
	    else {
	    	msgHtml += '<strong class="primary-font">' + msgObj.from + '</strong>';
	    	msgHtml += '<small class="pull-right talkr-time-display text-muted" data-time="' + msgObj.created + '"><span class="glyphicon glyphicon-time"></span>' + howLongAgo(msgObj.created) + ' ago</small>';
	    }
	    msgHtml += '</div>';
	    msgHtml += '<p>';
	    msgHtml += msgObj.msg;
	    msgHtml += '</p>';
	    msgHtml += '</div>';
	    msgHtml += '</li>';
	    return msgHtml;
	};


})();