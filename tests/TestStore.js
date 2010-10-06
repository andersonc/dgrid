dojo.provide("dojo.store.Memory");

dojo.require("dojo.store.util.QueryResults");
dojo.require("dojo.store.util.SimpleQueryEngine");

dojo.store.TestStore = function(options){
	// summary:
	// 		This is a store.
	//	options:
	//		This provides any configuration information that will be mixed into the store
	// options.data:
	// 		An array of data to use as the source of all the objects
	var store = {
		// summary:
		// 		The array of all the objects in the memory store	
		data:[],
		idProperty: "id",
		queryEngine: dojo.store.util.SimpleQueryEngine,
		get: function(id){
		},
		getIdentity: function(object){
			//	summary:
			// 		Returns an object's identity
			// object:
			// 		The object to get the identity from		
			return object[this.idProperty];
		},
		put: function(object, options){
			//	summary:
			// 		Stores an object		
			// object:
			// 		The object to store.
			// options:
			// 		Additional metadata for storing the data		
			// options.id:
			// 		The identity to use for storing the data		
			id = options && options.id || object[this.idProperty] || Math.random();
			this.index[id] = object;
		},
		add: function(object, options){
			//	summary:
			// 		Creates an object, throws an error if the object already exists	
			// object:
			// 		The object to store.
			// options:
			// 		Additional metadata for storing the data		
			// options.id:
			// 		The identity to use for storing the data		
			if(this.index[options && options.id || object[this.idProperty]]){
				throw new Error("Object already exists");
			}
			return this.put(object, options);
		},
		remove: function(id){
			//	summary:
			// 		Deletes an object by it's identity
			// id:
			// 		The identity to use to delete the object		
			delete this.index[id];
		},
		query: function(query, options){
			//	summary:
			// 		Queries the store for objects.
			// query:
			// 		The query to use for retrieving objects from the store		
			return dojo.store.util.QueryResults(this.queryEngine(query, options)(this.data));
		},
		setData: function(data){
			//	summary:
			// 		Sets the given data as the source for this store, and indexes it
			//	data:
			//		An array of objects to use as the source of data.
			if(data.items){
				// just for convenience with the data format IFRS expects
				this.idProperty = data.identifier;
				data = this.data = data.items;
			}else{
				this.data = data;	
			}
			
			for(var i = 0, l = data.length; i < l; i++){
				var object = data[i];
				this.index[object[this.idProperty]] = object; 
			}
		}
	};
	dojo.mixin(store, options);
	store.setData(store.data);
	return store;
};