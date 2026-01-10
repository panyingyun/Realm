export namespace main {
	
	export class Category {
	    name: string;
	    icon: string;
	    color: string;
	
	    static createFrom(source: any = {}) {
	        return new Category(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.icon = source["icon"];
	        this.color = source["color"];
	    }
	}
	export class Password {
	    id: string;
	    name: string;
	    domain: string;
	    username: string;
	    password: string;
	    category: string;
	
	    static createFrom(source: any = {}) {
	        return new Password(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.domain = source["domain"];
	        this.username = source["username"];
	        this.password = source["password"];
	        this.category = source["category"];
	    }
	}

}

