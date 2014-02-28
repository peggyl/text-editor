var documents = (function() {
		
	if (!localStorage.getItem("ids")) {
		localStorage.setItem("ids", JSON.stringify([]));
	}
	if (!localStorage.getItem("nextId")) {
		localStorage.setItem("nextId", "1");
	}
	
	/* Load all documents */
	var doc_ids = getAllDocumentIds(), 
	    doc_list = [];
	for (var i in doc_ids) {
		var doc_json = getDocument(doc_ids[i]),
			doc = new Document();
		doc.name = doc_json["name"];
		doc.created = doc_json["created"];
		doc.modified = doc_json["modified"];
		doc.tags = doc_json["tags"];
		doc.text = doc_json["text"];

	}

	function Document() {
		this.id = parseInt(localStorage.getItem("nextId"), 10);
		this.name = "Document" + this.id;
		this.created = new Date().getTime();
		this.modified = new Date().getTime();
		this.tags = [];
		this.text = "";

		localStorage.setItem("nextID", parseInt(localStorage.getItem("nextId"), 10) + 1);

		this.save = function() {
			localStorage.setItem(id, this.toString());
		};
		this.constructor = Document;
	}

	Document.prototype.toString = function() {
			return JSON.stringify({
				"name": this.name,
				"created": this.created,
				"modified": this.modified,
				"tags": this.tags, 
				"text": this.text
			});
	};

	function getAllDocumentIds() {
		return JSON.parse(localStorage.getItem("ids"));
	}

	function getDocument(id) {
		return JSON.parse(localStorage.getItem(id)) || null;
	}

	return {
		Document: Document
	};


}());