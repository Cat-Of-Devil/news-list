
;(function () {

	var url = "http://localhost:3000/messages";
	var messageList = document.getElementsByClassName('messages')[0];
	var input = document.getElementById('new-message');
	var submit = document.getElementsByClassName('message-form__button')[0];

	function showMessages (data) {
		messageList.innerHTML = '';
		for(var i in data) {
			var el = document.createElement('div');
			el.classList.add('message');
			el.innerHTML = data[i].text;
			messageList.appendChild(el);
		}
	}

	function query(url, method, data, callback) 
	{
		callback = callback || function(){};
		var xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function() {
			if (this.readyState != 4) return;

			if (this.status == 200) {
				if (this.responseText) {
				  callback(this.responseText);
				}
				return;
			}
	  	};

		xhr.open(method || "GET", url, true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	    xhr.send(data||"");
	}

	function sendMessage() {
		var formData = new FormData();
		formData.append('author', "");
		formData.append('text', input.value);
		formData.append('created', (new Date()).getTime());

		query(url, "POST", formData, function(data){
			//data = JSON.parse(data);
			//showMessages(data);
			console.log(data);
		});
	}

	;(function poll() {
	   setTimeout(function() {
			query(url, "GET", "", function(data){
				data = JSON.parse(data);
				showMessages(data);
				console.log(data);
				poll();
			});
	    }, 5000);
	})();

	query(url, "GET", "", function(data){
		data = JSON.parse(data);
		showMessages(data);
		console.log(data);
	});

	submit.addEventListener('click', function(e){
		sendMessage()
	});

})();