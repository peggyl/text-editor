var documents = (function() {
	
	//create id list if it doesn't exist	
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
		console.log(doc_ids[i]);
		var doc_json = getDocument(doc_ids[i]);
		if (doc_json !== null) {
			var doc = new Document();

			doc.id = doc_ids[i];
			doc.name = doc_json["name"];
			doc.created = doc_json["created"];
			doc.modified = doc_json["modified"];
			doc.tags = doc_json["tags"];
			doc.text = doc_json["text"];
			doc_list.push(doc);
		}
	}

	//holds current document--starting with the first one
	var currDoc;
	if( doc_list.length !== 0) {
		currDoc = doc_list[0];
	}


	function Document() {
		this.id = parseInt(localStorage.getItem("nextId"), 10);
		this.name = "Document" + this.id;
		this.created = new Date().getTime();
		this.modified = new Date().getTime();
		this.tags = [];
		this.text = "";
		return this;
	}

	Document.prototype.makeString = function() {
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

	function getDocument(id) {return JSON.parse(localStorage.getItem(id)) || null;
	}

	/* ====================
	 * Creating a new document
	 * ====================
	 */

	 function newDocument() {
	 	//TODO: save the old document? ****
	 	var doc = new Document();
	 	localStorage.setItem("nextId", (parseInt(localStorage.getItem("nextId"), 10)+1).toString());
	 	doc_ids.push(doc.id);
	 	localStorage.setItem("ids", JSON.stringify(doc_ids));
	 	currDoc = doc;
	 	doc_list.push(doc);
	 	document.getElementById("text").value = doc.text;

	 }

	 document.getElementById("new").addEventListener("click", newDocument, false);




	/* ====================
	 * Autosaving document
	 * ====================
	 */

	var hasChanged = true;

	function saveAs() {
		if (!hasChanged || (currDoc == undefined)) {
			return;
		}

		var now = new Date();

		currDoc.name = document.getElementById("title").value;
		currDoc.created = now;
		currDoc.modified = now;
		currDoc.tags = document.getElementById("tags").value;
		currDoc.text = document.getElementById("text").value;

		// save to localStorage
		localStorage.setItem(currDoc.id, currDoc.makeString());

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

	 //returning all of the documents
	return doc_list;


}());