//WebStorage.js

var storageAPI = function() {
    var catalog;
	
    //init the local storage
    var init = function() {
        if(window.localStorage) {
            catalog = {};
            for(var i = 0; i < localStorage.length; i++)
                catalog[localStorage.key(i)] = true;
            console.log("Storage initiallized");
        }
        else {
            console.log("No Storage API available");
        }
    };
	
    //create table in local storage
    var createObject = function(type) {
        if(!localStorage.getItem(type))
            localStorage.setItem(type, JSON.stringify({}));
        catalog[type] = true;
    };
	
    //create object in table
    var save = function(type, obj) {
        if(!catalog[type])
            console.log("No such object " + type);
        else {
            var dataString = localStorage.getItem(type);
            var dataObject = JSON.parse(dataString);
            dataObject[obj.name] = obj;
            localStorage.setItem(type, JSON.stringify(dataObject));
        }
    };
	
    //get all records from the table
    var getAll = function(type) {
        if(!catalog[type])
            console.log("No such object " + type);
        else {
            var res = [];
            var dataString = localStorage.getItem(type);
            var dataObject = JSON.parse(dataString);
            for(var prop in dataObject)
                res.push(dataObject[prop]);
            return res;
        }
    };
	
    //delete record from the table
	var deleteLine = function(type ,obj){
		
        if(!catalog[type])
            console.log("No such object " + type);
        else {
            var dataString = localStorage.getItem(type);
            var dataObject = JSON.parse(dataString);
            delete dataObject[obj];
            localStorage.setItem(type, JSON.stringify(dataObject));
        }		
	};
	
	//Sort storage by few elements
	var sortStorage = function(type , sortby){
		if(!catalog[type])
            console.log("No such object " + type);
		else{
			var dataString = localStorage.getItem(type);
            var dataObject = JSON.parse(dataString);
			var items = storageAPI.getAll(type);
			if(sortby == "date")//sort by date
				items.sort(function(a,b){return new Date(a.date).getTime() - new Date(b.date).getTime();});			
			if(sortby == "name")//sort by name			
				items.sort(function(a,b){return a.name.toLowerCase().localeCompare(b.name.toLowerCase());});
			if(sortby == "priority")//sort by priority
				items.sort(function(a,b){return (b.priority || "!!!").toUpperCase().localeCompare((a.priority || "!!!").toUpperCase());});
			this.drop(type);
			this.createObject(type);
			$.each(items,function(i,item){storageAPI.save(type,item);});
		}
	};
	
	//drop the table from local storage
    var drop = function(type) {
        if(!catalog[type])
            console.log("No such object " + type);
        else 
            localStorage.removeItem(type);
    };
    
    return {
        init : init,
        createObject : createObject,
        save : save,
        getAll : getAll,
        drop : drop,
		deleteLine : deleteLine,
		sortStorage : sortStorage
    };
    
}();