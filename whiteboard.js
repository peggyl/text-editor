

	function Document() {
		this.constructor = Document;
		this.title;
		this.text;
		this.tags;
		this.created = new Date().getTime();
		this.modified = new Date().getTime();
	}

	Document.prototype.toString = function() {
		return JSON.stringify({
			"title": this.title,
			"tags": this.tags, 
			"text": this.text,
			"created": this.created,
			"modified": this.modified,
		});
	}

	Document.prototype.parseDocument = function(doc) {
		var doc = JSON.parse(doc);
		this.title = doc.title;
		this.text = doc.text;
		this.tags = doc.tags;
		this.created = doc.created;
		this.modified = doc.modified;
		return this;
	}

	Document.prototype.saveAs = function() {
		this.title = document.getElementById('title').value;
		var original = localStorage.getItem(this.title);

		if (original && !window.confirm("A document named " + this.title + " already exists. Are you sure you would like to overwrite it?")) {
			return false;
		}

		if (!this.title) {
			window.alert("Please Enter a Title!");
			return false;
		}

		this.text = document.getElementById('text').value;
		this.tags = document.getElementById('tags').value;
		if (this.tags) {this.tags = this.tags.split(',');}
		this.created = document.getElementById('created').value;
		this.modified = new Date().getTime();

		localStorage.setItem(this.title, this.toString());

		if ((new Document()).parseDocument(localStorage.getItem(this.title)).modified != this.modified) {
			alert("Save Failed!");
			return false;
		}
		alert("Save Sucessful")
		return true;
	}

	Document.prototype.load = function(doc) {
		var json = localStorage.getItem(doc);
		if (!json) {
			alert("Specified document does not exist!");
			return null;
		}
		this.parseDocument(json);
		document.getElementById('title').value = this.title;
		document.getElementById('text').value = this.text;
		document.getElementById('tags').value = this.tags.join(', ');
		document.getElementById('created').value = this.created;
		document.getElementById('modified').value = this.modified;
		return this;
	}

	function saveAs() {
		return new Document().saveAs();
	}

	document.getElementById("save-as").addEventListener("click", saveAs, false);

	function load(id) {
		return new Document().load(id);
	}

	function getTime() {
		return new Date().getTime();
	}