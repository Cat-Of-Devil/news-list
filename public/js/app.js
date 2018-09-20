
;(function () {
	
	var news = [];

	var totalCount = 0;
	var currentPage = 1;
	var itemsPerPage = 8; // 8 записей на страницу

	var baseUrl = "articles?_page=" + currentPage + "&_limit=" + itemsPerPage;
	
	var newsList = document.getElementById('news-list');
	var newsView = document.getElementById('news-view');
	var newsPager = document.getElementById('news-pager');
	var newsCounter = document.getElementById('news-counter');

	var annonceTmpl = [
		'<div class="col-md-3 mb-4">',
			'<article class="card">',
				'<img class="card-img-top" src="{{urlToImage}}"/>',
				'<div class="card-body">',
					'<h6 class="card-title">{{title}}</h6>',
					'<div class="card-text">{{description}}</div>',
					//'<div class="card-text">{{author}}</div>',
				'</div>',
			'</article>',
		'</div>',
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
				annonce = annonce.replace('{{'+fieldName+'}}', news[i][fieldName] || "");
			}

			newsList.insertAdjacentHTML('beforeend', annonce);
		}
	}

	function fetchNews() {
		api.get(baseUrl, function(items, headers){
			news = items;
			showNews();
			updatePagination(headers);
			updateCounter(headers)
		})
	}

	function updatePagination(headers) {

		newsPager.innerHTML = '';

		var pagination = {};

		headers['link'].split(',').map(function(link){
			var matches = link.match(/<(.*)>; rel=\"(.*)\"/);
			return pagination[matches[2]] = matches[1];
		});

		for (var rel in pagination) {
			var li = document.createElement('li');
			li.classList.add('page-item');

			var a = document.createElement('a');
			a.classList.add('page-link');
			a.href = pagination[rel];
			a.innerHTML = rel;

			a.onclick = function(){
				baseUrl = this.href;
				fetchNews();
				return false;
			}

			li.appendChild(a);
			newsPager.appendChild(li);
		}
	}

	function updateCounter(headers) {
		totalCount = +headers['x-total-count'];
		newsCounter.innerHTML = news.length + ' из ' + totalCount;
	}

	fetchNews();

})();