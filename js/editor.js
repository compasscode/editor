const Tutorial = require('./Tutorial')

let tut = Tutorial.from(`
# Cool Tutorial
~~~css
body {
  background-color: [$bgcolor];
}
~~~
Try setting the **background-color** to **blue**, or any other color
you can think of!
~~~lock
return [ 'red', 'green', 'blue' ].includes($bgcolor)
~~~
You can also set the text color to anything you like using CSS, using
**color**. Try it!
~~~css
body {
  background-color: <$bgcolor>;
  color: [$color];
}
~~~
~~~lock
return [ 'red', 'green', 'blue' ].includes($color)
~~~
That's it! You're reached the end of this tutorial.

~~~actualhtml
<html>
  <body></body>
</html>
~~~
~~~actualcss
body {
  background-color: <$bgcolor>;
  color: <$color>;
}
~~~
`)

console.log(tut)

// Manipulates "event bubbling": https://stackoverflow.com/a/2457291/
$("body").click(function(){
	$(".nav-userDropdown").addClass("nav-userDropdown_hidden");
}).find(".nav-userIcon").click(function(){
	$(".nav-userDropdown").toggleClass("nav-userDropdown_hidden");
	return false;
}).find(".nav-userDropdown").click(function(){
	return false;
});

var compass = (function(){
	var dir = 45;
	var vel = 0.1;
	var updateNeedleStyle = function() {
		$(".nav-branding-compass-needle").attr("style", "transform:rotateX(36deg) rotate(" + dir + "deg)");
	};
	var updateLoop = function() {
		updateNeedleStyle();
		dir = (dir + vel) % 360;
		if($(".nav-branding").is(":hover")) {
			vel += 0.05 * (10 - vel);
		} else {
			if(dir > 180 + 45) {
				vel += 0.05 * (45 + 360 - dir);
			} else {
				vel += 0.05 * (45 - dir);
			}
		}
		vel *= 0.95;
		window.requestAnimationFrame(updateLoop);
	};
	updateLoop();
})();

var editors = (function(){
	var Editor = function(elem, mode){
		var editor =
			CodeMirror.fromTextArea(
				elem,
				{
					lineNumbers: true,
					mode: mode,
					matchBrackets: true
				}
			)
		return editor;
	}
	return {
		"html": new Editor($(".editor-html-input")[0], "xml"),
		"css": new Editor($(".editor-css-input")[0], "css"),
		"javascript": new Editor($(".editor-js-input")[0], "javascript")
	};
})();

var run = (function(){
	var runFromCode = function(html, css, js, iframe) {
		doc = `<!DOCTYPE html><html><head><style>${css}<\/style><\/head><body>${html}<script>${js}<\/script><\/body><\/html>`;

		var iframeWindow = iframe.contentWindow || iframe.contentDocument.document || iframe.contentDocument;
		iframeWindow.document.open();
		iframeWindow.document.write(doc);
		iframeWindow.document.close();
	};

	var runFromEditors = function() {
		runFromCode(
			editors["html"].getValue(),
			editors["css"].getValue(),
			editors["javascript"].getValue(),
			$(".output-frame")[0]
		);
	};

	var runFromEditorsOnChange = function(delay){
		var updateTimer;
		$.each(editors, function(i, editor){
			editor.on("changes", function(){
				clearTimeout(updateTimer);
				updateTimer = window.setTimeout(runFromEditors, delay || 1000);
			});
		});
		runFromEditors();
	};

	return {
		runFromCode: runFromCode,
		runFromEditors: runFromEditors,
		runFromEditorsOnChange: runFromEditorsOnChange
	}
})();

var loadProject = (function(url, success, failure){
	var fileRequest = $.getJSON(url);
	fileRequest.done(function(response) {
		$.each(editors, function(lang, editor){
			editor.getDoc().setValue(response.files[lang]);
		});
		$(".nav-titleInput").val(response.title);
		success();
	})
	.fail(failure);
})("projects/default-web.json", run.runFromEditorsOnChange, function() { window.alert("failed to load project"); });

// Control editor layout (resize, open/close)
var helpOpen = false;
function openHelp(search) {
	helpOpen = true;
	$(".help").addClass("help_open");
	$(".help").css("width", "500px");
	$(".pageInner").css("left", "500px");
	window.setTimeout(refreshEditorScrollbars, 500);
	if(search) $(".help-searchBox").val(String(search));
}
function closeHelp() {
	helpOpen = false;
	$(".help").removeClass("help_open");
	$(".help").css("width", "");
	$(".pageInner").css("left", "64px");
	window.setTimeout(refreshEditorScrollbars, 500);
	$(".help-searchBox").val("");
	$(".help-searchResults").html("");
}
openHelp();

var dragging = "";
var mouseY = 0;
var height = {
	"html": 0.333,
	"css": 0.333,
	"js": 0.333
};
var width = {
	"editor": 0.5,
	"output": 0.5
}
$(".editor-css-header").mousedown(function(e){
	dragging = "css";
	mouseY = e.pageY;
	e.preventDefault();
});
$(".editor-js-header").mousedown(function(e){
	dragging = "js";
	mouseY = e.pageY;
	e.preventDefault();
});
$(".editorOutputResizer").mousedown(function(e){
	dragging = "editor-output";
	mouseX = e.pageX;
	$(".output-frame").css("pointer-events", "none");
	e.preventDefault();
});
$(window).mousemove(function(e){
	if(dragging === "editor-output") {
		var diffPx = e.pageX - mouseX;
		var diffDec = diffPx / ($(".pageInner").width() - 8);
		width.editor = Math.min(0.9, Math.max(0.1, width.editor + diffDec));
		width.output = Math.min(0.9, Math.max(0.1, width.output - diffDec));
		$(".editor").css("width", "calc((100% - 8px) * " + width.editor + ")");
		$(".output").css("width", "calc((100% - 8px) * " + width.output + ")");
	} else {
		var diffPx = e.pageY - mouseY;
		var diffDec = diffPx / ($(".editor").height() - 72);
		if(dragging === "css") {
			height.html += diffDec;
			height.css -= diffDec;
			if(height.css < 0) {
				height.js += height.css;
				height.css = 0;
			}
		}
		if(dragging === "js") {
			height.css += diffDec;
			height.js -= diffDec;
		}
		if(height.js < 0) {
			height.css += height.js;
			height.js = 0;
		}
		if(height.css < 0) {
			height.html += height.css;
			height.css = 0;
		}
		if(height.html < 0) {
			height.css += height.html;
			height.html = 0;
		}
		if(height.css < 0) {
			height.js += height.css;
			height.css = 0;
		}
		$(".editor-html").css("height", "calc((100% - 72px) * " + height.html + " + 24px)");
		$(".editor-css").css("height", "calc((100% - 72px) * " + height.css + " + 24px)");
		$(".editor-js").css("height", "calc((100% - 72px) * " + height.js + " + 24px)");
	}
	mouseX = e.pageX;
	mouseY = e.pageY;
})
.mouseup(function(){
	if(dragging !== "") {
		refreshEditorScrollbars();
	}
	dragging = "";
	$(".output-frame").css("pointer-events", "auto");
});

function refreshEditorScrollbars() {
	$.each(editors, function(i, editor){ editor.refresh(); });
}

// Handle search
var search = (function() {
	var articles = [];
	var loadArticles = function(url, success, failure) {
		$.getJSON(url)
		.done(function(response) {
			articles = response;
			success();
		})
		.fail(failure);
	};
	loadArticles(
		"articles.json",
		function(){},
		function(){ window.alert("failed to load articles"); }
	);

	var query = function(searchString, max, minScore) {
		if(max === 0) max = articles.length;
		var searchWords = searchString
		                      .toLowerCase()
		                      .split(" ")
		                      .filter(a => a);
		for(n = 0; n < articles.length; n++) {
			var score = 0;
			var titleWords = articles[n].title.toLowerCase().split(" ");
			for(i = 0; i < searchWords.length; i++) {
				if(titleWords.indexOf(searchWords[i]) > -1) score += 1;
				if(articles[n].keywords.indexOf(searchWords[i]) > -1) score += 5;
			}
			articles[n].searchScore = score;
		}
		var topArticles = articles
		                      .sort((art1, art2) => (art2.searchScore - art1.searchScore))
		                      .filter(function(art, i, allArticles){ return art.searchScore >= Math.max(minScore, allArticles[0].searchScore / 2) });
		return topArticles.slice(0, max || 5);
	};

	$(".help-searchBox").bind("propertychange change click keyup input paste", function(e){
		$(".help-searchResults").html("");
		var results = query($(this).val(), 0, 1);
		$(".help-searchResults").append(results.map(function(result){
			var $resultElem = $("<div>", {"class": "help-searchResults-result help-searchResults-result_" + result.category});
			var $header = $("<div>", {"class": "help-searchResults-result-header"}).text(result.title + " (" + result.searchScore + ")");
			var $content = $("<div>", {"class": "help-searchResults-result-content"}).html(result.content);
			$resultElem.append($header);
			$resultElem.append($content);
			return $resultElem;
		}));
	});

	return {
		query: query
	}
})();
