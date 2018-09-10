
;(function () {
	
	var messages = [];

	//var baseUrl = "http://localhost:3000/messages";
	var baseUrl = "https://simple-chat-92389.herokuapp.com/messages";
	
	var messageList = document.getElementById('message-list');
	var input = document.getElementById('new-message');
	var submit = document.getElementsByClassName('message-form__button')[0];


	var api = {
		_q: function(url, method, data, callback) 
		{
			callback = callback || function(){};
			var xhr = new XMLHttpRequest();

			xhr.onreadystatechange = function() {
				if (this.readyState == 4 && [200,201].indexOf(this.status) != -1) {
					if (this.responseText) {
						callback(JSON.parse(this.responseText));
					}
				}
			};
	
			xhr.open(method, url, true);
			xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
			xhr.send(data||'');
		},
		get: function(url, cb) {
			return this._q(url, 'GET', [], cb);
		},
		post: function(url, data, cb) {
			return this._q(url, 'POST', data, cb);
		},
		put: function(url, data, cb) {
			return this._q(url, 'PUT', data, cb);
		},
		delete: function(url, cb) {
			return this._q(url, 'DELETE', null, cb);
		},
	}


	function showMessages () {
		messageList.innerHTML = '';

		for(var i in messages) {
			var btnDel = document.createElement('button');
			btnDel.classList.add('close');
			btnDel.innerHTML = 'x';

			btnDel.onclick = function(){
				var deleteUrl = baseUrl + '/' + messages[i].id;

				api.delete(deleteUrl, function(){
					alert('Cообщение удалено!');
					fetchMessages()
				});
			}

			var el = document.createElement('div');
			el.classList.add('message');
			el.innerHTML = messages[i].text;
			el.appendChild(btnDel);

			messageList.appendChild(el);
		}
	}

	function fetchMessages(cb) {
		api.get(baseUrl, function(response){
			messages = response;
			showMessages();
			cb && cb();
		})
	}

	function sendMessage(message, cb) {
		api.post(baseUrl, message, cb);
	}

	;(function poll() {
		setTimeout(function() {
			fetchMessages(function(){
				setTimeout(poll, 3000);
			});
		}, 10);
	}());

	submit.addEventListener('click', function(e){

		var message = JSON.stringify({
			text: input.value,
			author: "Roman Masyagin",
			created: (new Date()).getTime()
		});

		sendMessage(message, function(){
			fetchMessages(function(){
				input.value = '';
			});
		});
	});

})();