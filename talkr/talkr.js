'use strict';

(function () {
	var talkrObj = {};

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

		var userDataBtn = document.getElementById('send-user-details');
		userDataBtn.addEventListener('click', function () {
			var formInput = document.getElementById('talkr-user-name');			
			if (!!formInput.value && formInput.value.length !== 0) {
				//sendUserData();
				talkrObj.username = formInput.value;

				//Show Chats
				document.getElementById('talkr-form-user').classList.add('hidden');
				document.getElementById('chat-msgs').classList.remove('hidden');

				//Show Forms
				document.getElementById('submit-user-chat').classList.add('hidden');
				document.getElementById('submit-msg-chat').classList.remove('hidden');
				

				bootstrapChat();
			}
			else alert('You did not put any data in!');
		}, false);	
	};

	var bootstrapChat = function () {
		
		var textPresent = function () {
			var text = document.getElementById('chat-input').value;
			return !!text && text.length > 0;
		};
		
		var sendBtn = document.getElementById('send-chat');
		sendBtn.addEventListener('click', function () {
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

	var loadTalkrCSS = function () {
		var head  = document.getElementsByTagName('head')[0];
		var link  = document.createElement('link');
		link.rel  = 'stylesheet';
		link.type = 'text/css';
		link.href = '/talkr/talkr.css';
		link.media = 'all';
		head.appendChild(link);
	};

	var loadTalkrHTML = function () {
		var request = new XMLHttpRequest ();
		request.open('GET', '/talkr/talkr.html', true);

		request.onload = function() {
		  if (request.status >= 200 && request.status < 400){
		    bootstrapTalkr(request.responseText);
		  } 
		  else console.error('Server error');
		};

		request.onerror = function() {
		  console.error('Internet errorr');
		};

		request.send();
	};

	loadTalkrCSS();
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