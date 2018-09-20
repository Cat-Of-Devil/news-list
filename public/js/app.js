
;(function () {
	
	var news = [];

	var baseUrl = "http://localhost:3000/articles";
	//var baseUrl = "https://simple-chat-92389.herokuapp.com/articles";
	
	var newsList = document.getElementById('news-list');
	var newsView = document.getElementById('news-view');

	var annonceTmpl = [
		'<article class="card col-md-3 m-t-15">',
			'<img class="card-img-top" src="{{urlToImage}}"/>',
			'<div class="card-body">',
				'<h6 class="card-title">{{title}}</h6>',
				'<div class="card-text">{{description}}</div>',
				//'<div class="card-text">{{author}}</div>',
			'</div>',
		'</article>',
	].join(' ');

	function showNews () {
		newsList.innerHTML = '';

		for(var i in news) {
			var annonce = annonceTmpl;
			
			if (!news[i].urlToImage) {
				var defaultImageUrl = '/img/news24.jpg';
				news[i].urlToImage = defaultImageUrl;
			}

			for(var fieldName in news[i]) {
				annonce = annonce.replace('{{'+fieldName+'}}', news[i][fieldName]);
			}

			newsList.insertAdjacentHTML('beforeend', annonce);
		}
	}

	function fetchNews(cb) {
		api.get(baseUrl, function(items){
			news = items;
			showNews();
			cb && cb();
		})
	}

	fetchNews();

})();