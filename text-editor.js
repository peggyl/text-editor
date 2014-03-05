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

		localStorage.setItem("nextId", parseInt(localStorage.getItem("nextId"), 10) + 1);

		this.save = function() {
			localStorage.setItem(id, this.toString());
		};
		this.constructor = Document;

		return this;
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

	/* ====================
	 * Autosaving document
	 * ====================
	 */

	var hasChanged = true;

	function saveAs() {
		if (!hasChanged) {
			return;
		}

		var now = new Date();

		var doc = Document();
		doc.name = document.getElementById("title");
		doc.created = now;
		doc.modified = now;
		doc.tags = document.getElementById("tags");
		doc.text = document.getElementById("text");

		// save to localStorage
		localStorage.setItem(id, doc);

		// update modified date on document
		document.getElementById("modified").innerHTML = now;
	}

	// autosave the document every 5 seconds
	var save = window.setInterval(saveAs, 2000);

	/* ===== End autosaving code ===== */


	/* =================
	 * Find and replace
	 * =================
	 */
	function findAndReplace() {
		console.log("called find/replace");
		var find = document.getElementById("find").value,
			replace = document.getElementById("replace").value,
		 	text = document.getElementById("text").value;

		console.log("replace " + find + " with " + replace + " in " + text);
		var re = new RegExp(find, "g");
		newText = text.replace(re, replace);
		console.log(newText);
		document.getElementById("text").value = newText;
		saveAs();
	}

	 document.getElementById("find-replace-btn").addEventListener("click", findAndReplace);


	 /* ===== End find/replace code ===== */

	return {
		Document: Document
	};


}());