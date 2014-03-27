		var prompts = [
			{
				type: "list",
				name: "generatorType",
				message: "What kind of project would you like to generate?",
				choices: [	
							{
								name: "Laravel",	
								value: _TYPE_LARAVEL	
							},{
								name: "HTML Flatfile",
								value: _TYPE_FLAT
							},
							{
								name: "Wordpress",	
								value: _TYPE_WORDPRESS	
							},{
								name: "Email Template",
								value: _TYPE_EMAIL
							}							
				]
			},
			{
				type: "checkbox",
				name: "libs",
				message: "What libraries would you like to use?",
				choices: [	
							{
								name: "Angular.js",
								value: _TYPE_FLAT
							},{
								name: "jQuery",	
								value: _TYPE_LARAVEL
							},{
								name: "holder.js",	
								value: _TYPE_LARAVEL								
							},{
								name: "require.js",	
								value: _TYPE_LARAVEL								
							}
						] 
			},				
			{
				name: "webDir",
				message: "What would you like to name the www dir (www, public, httpdocs etc...)?",
				when: function(props){
					return props.generatorType === _TYPE_FLAT;
				}
			},				
			{
				name: "appName",
				message: "What would you like to call this project?",
				default: "Playground"
			},
			{
				name: "author",
				message: "What is the authors (your) name?",
				default: "Marc Broad"
			},
			{
				name: "authorEmail",
				message: "What is your email?",
				default: "mbroad@thepowertoprovoke.com"
			},
			{
				type: "confirm",
				name: "IE8",
				message: "Do you need IE8 support (jquery 1.9, respond.js) ?",
				default: false
			},
			{
				name: "bowerDir",
				message: "What directory would you like bower to install components to?",
				default: "vendor"
			},

		];
