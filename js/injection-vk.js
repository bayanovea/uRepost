"use strict";

console.log("VK [search posts]");

var posts = document.querySelectorAll('div .post.all.own');

for (var i = posts.length; i-- ;) {
	var post = posts[i];
	
	console.dir(post.id);
	
	post.addEventListener('click', function () {
		var id = this.id;
		chrome.runtime.sendMessage({id: id}, function(response) {
			console.log(response);
		});
	});
	
}
