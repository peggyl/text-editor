var documents = (function() {

    function Document(data) {
        this.id = data.id || parseInt(localStorage.getItem("nextId"), 10);
        this.name = data.name|| ("Document" + this.id);
        this.created = data.created || new Date();
        this.created = new Date(this.created);
        this.modified = new Date(data.modified) || new Date();
        this.modified = new Date(this.modified);
        this.tags = data.tags || [];
        this.text = data.text || "";
        return this;
    }

    Document.prototype.makeString = function() {
            return JSON.stringify({
                "id": this.id,
                "name": this.name,
                "created": this.created,
                "modified": this.modified,
                "tags": this.tags,
                "text": this.text
            });
    };

    Document.prototype.populateEditor = function() {
        document.getElementById("text").value = this.text;
        document.getElementById("title").value = this.name;
        document.getElementById("tags").value = this.tags;
        document.getElementById("created").innerHTML = this.created;
        document.getElementById("modified").innerHTML = this.modified;
    };

	
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
		var doc_json = getDocument(doc_ids[i]);
		if (doc_json !== null) {
			var doc = new Document(doc_json);
			doc_list.push(doc);
		}
	}
	updateDocList();


	//holds current document--starting with the first one
	var currDoc;
	if (doc_list.length !== 0) {
		currDoc = doc_list[0];
        currDoc.populateEditor();
	}
	else {
		newDocument();
	}

	function getAllDocumentIds() {
		return JSON.parse(localStorage.getItem("ids"));
	}

	function getDocument(id) {
		return JSON.parse(localStorage.getItem(id)) || null;
	}

	/* ====================
	 * Creating a new document
	 * ====================
	 */

     function newDocument() {
        //save the current document
        saveAs();
        var doc = new Document({});
        doc.created = new Date();
        doc.modified = new Date();
        localStorage.setItem("nextId", (parseInt(localStorage.getItem("nextId"), 10)+1).toString());
        doc_ids.push(doc.id);
        localStorage.setItem("ids", JSON.stringify(doc_ids));
        currDoc = doc;
        doc_list.push(doc);
        currDoc.populateEditor();
        saveAs();
        updateDocList();
     }

     function newAction(event) {
     	if (event.type=="keydown" && event.which==78 && event.ctrlKey) {
     		newDocument();
     	}
     }

	document.getElementById("new").addEventListener("click", newDocument, false);
	document.addEventListener("keydown", newAction, false);


    /* ===== End creating a new document code ===== */


	/* ====================
	 * Autosaving document
	 * ====================
	 */

	var hasChanged = true;

	function saveAs() {
		if (!hasChanged || (currDoc === undefined)) {
			return;
		}

		var now = new Date();

		currDoc.name = document.getElementById("title").value;
		currDoc.modified = now;
		currDoc.tags = document.getElementById("tags").value;
		currDoc.text = document.getElementById("text").value;

		// save to localStorage
		localStorage.setItem(currDoc.id, currDoc.makeString());

		// update modified date on document
		document.getElementById("modified").innerHTML = now;
        document.getElementById("created").innerHTML = currDoc.created;

        updateDocList();
	}

	function saveAction(event) {
		if (event.type=="keydown" && event.which==83 && event.ctrlKey) {
			saveAs();
		}
	}

	// autosave the document every 5 seconds
	window.setInterval(saveAs, 5000);
	document.getElementById("save-as").addEventListener("click", saveAs, false);
	document.addEventListener("keydown", saveAction, false);

	/* ===== End autosaving code ===== */


	/* ====================
	 * Updating the document list
	 * ====================
	 */

    function updateDocList() {

		doc_list_copy = doc_list.slice(0);

		doc_list_copy.sort(function(obj1, obj2) {
			// Ascending: first age less than the previous
			if (obj2.modified-obj1.modified < 0 ) {
				return -1;
			}
			else if(obj2.modified-obj1.modified > 0){
				return 1;
			}
			return 0;
			//return dates.compare(date1, date2);

		});


    

		//add the documents to the documents list on the page itself
		var listElement = document.getElementById('doclist');

		while (listElement.firstChild) {
            listElement.removeChild(listElement.firstChild);
		}

		var numRecDocumentsToShow = 5;




		for(var i in doc_list_copy) {
			doc = doc_list_copy[i];
			var entry = document.createElement('li');

            entry['indexInDocList']=i;
			entry.appendChild(document.createTextNode(doc.name));
			listElement.appendChild(entry);

			var created = document.createElement('p');
			created.className = "recent-created no-padding no-margin";
			created.innerHTML = 'Created: ' + new Date(doc.created);
			entry.appendChild(created);

			var modified = document.createElement('p');
			modified.className = "recent-modified no-padding no-margin";
			modified.innerHTML = 'Modified: ' + new Date(doc.modified);
			entry.appendChild(modified);

			var tags = document.createElement('p');
			tags.className = "recent-tags";
			tags.innerHTML = 'Tags: ' + doc.tags;
			entry.appendChild(tags);

			numRecDocumentsToShow = numRecDocumentsToShow-1;

			if (numRecDocumentsToShow === 0)
					break;
			
		}
     }

     var update = window.setInterval(updateDocList, 2000);

     /* ===== End updating the document list code ===== */


    /* ====================
     * Loading document when clicked in list
     * ====================
     */

     function switchCurrentDocument (e){

        var target = e.target;
        if(target.tagName === 'LI') {
            saveAs();
            currDoc = doc_list[target['indexInDocList']];
            currDoc.populateEditor();
        }
     }


     document.getElementById("doclist").addEventListener("click", switchCurrentDocument);

     /* ===== End loading document code  ===== */


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