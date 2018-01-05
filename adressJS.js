var Contacts = {
			index: window.localStorage.getItem("Contacts:index"), // locates local storage (new contacts are saved here)
			$table: document.getElementById("contacts-table"), // locates table (list) of contacts
			$form: document.getElementById("contacts-form"),  //  locates input form for adding new contacts
			$button_save: document.getElementById("contacts-op-save"),  // save button action
			$button_discard: document.getElementById("contacts-op-discard"), // discard button action

			init: function() {
				
				if (!Contacts.index) {
					window.localStorage.setItem("Contacts:index", Contacts.index = -1);
				}

				
				Contacts.$form.reset();
				Contacts.$button_discard.addEventListener("click", function(event) {
					Contacts.$form.reset();
					Contacts.$form.id_entry.value = 0;
				}, true);
				Contacts.$form.addEventListener("submit", function(event) { // new contact prototype
					var entry = {
						id: parseInt(this.id_entry.value), //assigns new ID to new contact
						first_name: this.first_name.value, // adds first name 
						last_name: this.last_name.value, // last name
						email: this.email.value,  // email adress
						adress: this.adress.value // adress
					};
					if (entry.id == 0) { 
						Contacts.storeAdd(entry); // calls local storage function (for first new contact)
						Contacts.tableAdd(entry); // calls table add function (for first new contact)
					}
					else { 
						Contacts.storeEdit(entry); // calls local storage edit function (for new contact after first one)
						Contacts.tableEdit(entry); // calls table edit function (for new contacts after first one)
					}

					this.reset();
					this.id_entry.value = 0; //sets the first ID at 0
					event.preventDefault();
				}, true);

				
				if (window.localStorage.length - 1) {
					var contacts_list = [], i, key;
					for (i = 0; i < window.localStorage.length; i++) {
						key = window.localStorage.key(i);
						if (/Contacts:\d+/.test(key)) {
							contacts_list.push(JSON.parse(window.localStorage.getItem(key))); // saves entries as JSON in local storage
						}
					}

					if (contacts_list.length) {
						contacts_list
							.sort(function(a, b) {
								return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
							})
							.forEach(Contacts.tableAdd); //adds contacts from local storage to table
					}
				}
				Contacts.$table.addEventListener("click", function(event) { // adds an event listener for the edit and remove buttons
					var op = event.target.getAttribute("data-op");
					if (/edit|remove/.test(op)) {
						var entry = JSON.parse(window.localStorage.getItem("Contacts:"+ event.target.getAttribute("data-id"))); // parsed JSON: separate values so they can be edited
						if (op == "edit") { //edit contacts: call values to form, save upon save.
							Contacts.$form.first_name.value = entry.first_name;
							Contacts.$form.last_name.value = entry.last_name;
							Contacts.$form.email.value = entry.email;
							Contacts.$form.adress.value= entry.adress;
							Contacts.$form.id_entry.value = entry.id;
						}
						else if (op == "remove") { //remove contacts
							if (confirm('Do you want to remove "'+ entry.first_name +' '+ entry.last_name +'" from your contact list?')) {
								Contacts.storeRemove(entry);
								Contacts.tableRemove(entry);
							}
						}
						event.preventDefault();
					}
				}, true);
			},

			storeAdd: function(entry) {  
				entry.id = Contacts.index;
				window.localStorage.setItem("Contacts:index", ++Contacts.index); // creates new ID for new contact
				window.localStorage.setItem("Contacts:"+ entry.id, JSON.stringify(entry)); // saves new contact as JSON string
			},
			storeEdit: function(entry) {
				window.localStorage.setItem("Contacts:"+ entry.id, JSON.stringify(entry)); // edits existing contact in storage
			},
			storeRemove: function(entry) {
				window.localStorage.removeItem("Contacts:"+ entry.id); //removes contact from local storage
			},
 
			tableAdd: function(entry) { // adds a new row to the table
				var $tr = document.createElement("tr"), $td, key;
				for (key in entry) {
					if (entry.hasOwnProperty(key)) {
						$td = document.createElement("td");
						$td.appendChild(document.createTextNode(entry[key]));
						$tr.appendChild($td);
					}
				}
				$td = document.createElement("td"); // adds new contact to table
				$td.innerHTML = '<a data-op="edit" data-id="'+ entry.id +'">Edit</a> | <a data-op="remove" data-id="'+ entry.id +'">Remove</a>';
				$tr.appendChild($td);
				$tr.setAttribute("id", "entry-"+ entry.id); 
				Contacts.$table.appendChild($tr);
			},
			tableEdit: function(entry) { //edits targeted contact into table 
				var $tr = document.getElementById("entry-"+ entry.id), $td, key;
				$tr.innerHTML = "";
				for (key in entry) {
					if (entry.hasOwnProperty(key)) {
						$td = document.createElement("td");
						$td.appendChild(document.createTextNode(entry[key]));
						$tr.appendChild($td);
					}
				}
				$td = document.createElement("td"); // adds a new edit and remove button?
				$td.innerHTML = '<a data-op="edit" data-id="'+ entry.id +'">Edit</a> | <a data-op="remove" data-id="'+ entry.id +'">Remove</a>';
				$tr.appendChild($td);
			},
			tableRemove: function(entry) { //removes contact from table
				Contacts.$table.removeChild(document.getElementById("entry-"+ entry.id));
			}
		};
		Contacts.init(); //starts the contact function