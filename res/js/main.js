const API_URL = "";

let Model = {
	//DO NOT WRITE HERE
	data: "",
	cats: "",
	shop_list: ""
}

let Controller = {
	
	consultaLista: function() {
		$.ajax({
			method: "GET",
			url: API_URL + "/getlist",
			contentType: "application/json",
			/* headers: {
				"x-api-key": ""
			} */
		}).done(function(data) {
			let cats = [...new Set(data.Items.map(x => x.categoria["S"]))];
			cats.sort((a, b) => (a > b)? 1 : -1);
			data.Items.sort((a, b) => (a.nombre["S"] > b.nombre["S"])? 1 : -1);
			Model.shop_list = data.Items;
			localStorage.setItem(0, JSON.stringify(data.Items));
			View.muestraListaCabecera();
			View.muestraLista(data.Items, cats);
			View.recuento();			
		}).fail(function(err){
			//If there is no connection, use LocalStorage (check code at the end of this file)
			console.log(err);
			let off_list = JSON.parse(localStorage.getItem(0));
			let cats = [...new Set(off_list.map(x => x.categoria["S"]))];
			cats.sort((a, b) => (a > b)? 1 : -1);
			Model.shop_list = off_list;
			View.muestraListaCabecera();
			View.muestraLista(off_list, cats);
			View.recuento();		

		});
		
	},
	consultaTodos: function() {
		$.ajax({
			method: "GET",
			url: API_URL + "/getall",
			contentType: "application/json",
			/* headers: {
				"x-api-key": ""
			} */
		}).done((data) => {
			if(Model.shop_list.length > 0){
				for(let i = 0; i < Model.shop_list.length; i++){
					for(let j = 0; j < data.Items.length; j++){
						if(Model.shop_list[i].id["N"] == data.Items[j].id["N"]){
							data.Items.splice(j, 1);
						}
					}
				}
			}
			let cats = [...new Set(data.Items.map(x => x.categoria["S"]))];
			cats.sort((a, b) => (a > b)? 1 : -1);
			data.Items.sort((a, b) => (a.nombre["S"] > b.nombre["S"])? 1 : -1);
			Model.data = data.Items;
			Model.cats = cats;
			//console.log(Model.data);
			//console.log(Model.cats);
			
			View.muestraTotalCabecera();
			View.muestraTotal(Model.data, Model.cats, []);
		}).fail((err) => console.log(err));

	},
	marcaComprado: function(id, comprado) {
		let data = {
			id: id,
			comprado: comprado
		}
		let data_str = JSON.stringify(data);
		$.ajax({
			method: "POST",
			url: API_URL + "/setcheck",
			contentType: "application/json",
			/* headers: {
				"x-api-key": ""
			}, */
			data: data_str
		}).done((response) => console.log(response))
		.fail((err) => console.log(err));
	},
	borraComprados: function(id, resolve, j) {
		console.log('Empieza petición a la base con id ' + id + ': ' + new Date().getMilliseconds());
		let data = {
			id: id
		}
		let data_str = JSON.stringify(data);
		$.ajax({
			method: "POST",
			url: API_URL + "/removefromlist",
			contentType: "application/json",
			/* headers: {
				"x-api-key": ""
			}, */
			data: data_str
		}).done((response) => {
			if(j == $(".comprado").length - 1){
				resolve('Termina peticion a la base con id ' + id + ': ' + new Date().getMilliseconds());
			}
		}).fail((err) => console.log(err));
	},
	incluyeProductoLista: function(id, cantidad, resolve, j) {
		let cantidad_corregida = 0;
		if(cantidad != ""){
			cantidad_corregida = cantidad;
		}
		console.log('Empieza peticion a la base con id ' + id + ': ' + new Date().getMilliseconds());
		let data = {
			id: id,
			cantidad: cantidad_corregida
		}
		let data_str = JSON.stringify(data);
		
		$.ajax({
			method: "POST",
			url: API_URL + "/addtolist",
			contentType: "application/json",
			/* headers: {
				"x-api-key": ""
			}, */
			data: data_str
		}).done((response) => {
			if(j == $(".checkbox_checked").length - 1){
				resolve('Termina petición a la base con id ' + id + ': ' + new Date().getMilliseconds());
			}
		}).fail((err) => console.log(err));
	},
	creaProducto: function(nombre){
		let data = {
			id: new Date().getTime(),
			nombre: nombre,
			categoria: "Sin categoría"
		}
		let data_str = JSON.stringify(data);
		$.ajax({
			method: "POST",
			url: API_URL + "/additem",
			contentType: "application/json",
			/* headers: {
				"x-api-key": ""
			}, */
			data: data_str
		}).done((response) => {
			Controller.consultaTodos();
		}).fail((err) => console.log(err));
	},
	importaProducto: function(id) {
		let data = {
			id: id
		}
		$.ajax({
			method: "GET",
			url: API_URL + "/getitem",
			contentType: "application/json",
			/* headers: {
				"x-api-key": ""
			}, */
			data: data
		}).done((data) => {
			View.muestraEditaProductoCabecera();
			View.muestraEditaProducto(data.Item, Model.cats);
		}).fail((err) => console.log(err));
	},
	editaProducto: function(id, nombre, categoria) {
		let data = {
			id: id,
			nombre: nombre,
			categoria: categoria
		}
		let data_str = JSON.stringify(data);
		$.ajax({
			method: "POST",
			url: API_URL + "/updateitem",
			contentType: "application/json",
			/* headers: {
				"x-api-key": ""
			}, */
			data: data_str
		}).done((response) => {
			Controller.consultaTodos();
		}).fail((err) => console.log(err));
	},
	borraProducto: function(id) {
		let data = {
			id: id
		}
		let data_str = JSON.stringify(data);
		$.ajax({
			method: "DELETE",
			url: API_URL + "/deleteitem",
			contentType: "application/json",
			/* headers: {
				"x-api-key": ""
			}, */
			data: data_str
		}).done((response) => {
			Controller.consultaTodos();
		}).fail((err) => console.log(err));
	}
}

let View = {
	recuento: function() {
		let content = "";
		let num_total = $(".div_producto").length;
		let num_comprado = $(".comprado").length;
		content = num_comprado + "/" + num_total;
		let p = $("<p></p>").text(content);
		$(".recuento").html(p);
		//		$(".div_espacio").html();
		if(num_comprado == num_total) {
			$(".recuento").children("p").css({color: "#00CC00", fontWeight: "bold"});
		}
	},
	muestraListaCabecera: function() {
		let content = "<div class='recuento'></div>" +
		"<div class='div_titulo'>" +
		"<h1>Lista de la compra</h1>" +
		"</div>" +
		"<div class='div_boton_elim_comp'>" +
		"<button type='button'><i class='fas fa-trash-alt'></i></button>" +
		"</div>";
		$("header").empty().html(content);
		$(".subtitulo").empty();
		$(".div_boton_add").show();
		//let sincro = setInterval(() => Controller.revisaActualizaciones(docClient), 2000);
		let boton_add = $(".div_boton_add").children("button");
		boton_add.click(function(){
			View.showLoadScreen();
			//clearInterval(sincro);
			Controller.consultaTodos();
		});

	},
	muestraLista: function(datos, categorias) {
		$("main").empty();
		let content = "";
		for(cat of categorias){
			content += "<div class='div_grupo'>" +
			"<div class='div_categoria'>" +
			"<h2>" + cat + "</h2>" +
			"</div>";
			for(item of datos) {
				if(item.categoria["S"] == cat) {
					if(item.comprado) {
						if(item.comprado["N"] == 1){
							content += "<div class='div_producto comprado'>";
						}else{
							content += "<div class='div_producto'>" ;
						}	
					}else{
						content += "<div class='div_producto'>" ;
					}
					content += "<div class='div_id' style='display:none'><p>" + item.id["N"] + "</p></div>";
					content += "<div class='div_cantidad'>";
					if(item.cantidad){
						if(item.cantidad["N"] != 0){
							content += "<p>" + item.cantidad["N"] + "</p>";
						}else{
							content += "<p></p>";
						}
					}else{
						content += "<p></p>";
					}
					content += "</div>" +
					"<div class='div_nombre_producto'>" +
					"<p>" + item.nombre["S"] + "</p>" +
					"</div>" +
					"</div>";
				}
			}
			content += "</div>";
		}
		$("main").html(content);
		let div_producto = $(".div_nombre_producto");
		div_producto.click(function(){
			$(this).parent().toggleClass("comprado");
			let id = $(this).parent().children(".div_id").children("p").text();
			id = parseInt(id);
			if($(this).parent().hasClass("comprado")){
				Controller.marcaComprado(id, 1);
			}else{
				Controller.marcaComprado(id, 0);
			}
			View.recuento();
		});

		let boton_borra_completados = $(".div_boton_elim_comp").children("button");
		boton_borra_completados.click(function(){
			View.showLoadScreen();
			let j = 0;
			let prom = new Promise(function(resolve,reject){
				if($(".comprado").length > 0){
					$(".comprado").each(function(){
						let id = $(this).children(".div_id").children("p").text();
						id = parseInt(id);
						Controller.borraComprados(id, resolve, j);
						j++;
					});
				} else {
					resolve("No hay nada de borrar");
				}

			});
			prom.then(function(res){
				console.log(res);
				console.log('Empieza renderizado: ' + new Date().getMilliseconds());
				Controller.consultaLista();
			});
		});


	},
	muestraTotalCabecera: function() {
		let content = "<div class='div_boton_rechazar'>" +
		"<button type='button'><i class='fas fa-times-circle'></i></button>" +
		"</div>" +
		"<div class='div_titulo'>" +
		"<h1>Añade productos</h1>" +
		"</div>" +
		"<div class='div_boton_aceptar addList'>" +
		"<button type='button'><i class='fas fa-check-circle'></i></button>" +
		"</div>";
		$("header").empty().html(content);
		content = "<div class='div_input_busca_producto'>" +
		"<input type='text' placeholder='Busca o crea un producto...'>" +
		"</div>" +
		"<div class='div_button_busca_producto'>" +
		"<button type='button'>NUEVO</button>" +
		"</div>";
		$(".subtitulo").empty().html(content);
		$(".div_boton_add").hide();
		$("main").removeClass("main_edit");

		let boton_rechazar = $(".div_boton_rechazar").children("button");
		boton_rechazar.click(function(){
			View.showLoadScreen();
			Controller.consultaLista();
		});

		let input_busca = $(".div_input_busca_producto").children("input");
		input_busca.keyup(function(){
			let result = [];
			let res_cats = [];
			let result_checked = [];
			$(".checkbox_checked").each(function(){
				let obj = {
					id: {},
					nombre: {},
					categoria: {},
					cantidad: {}
				};
				obj.id["N"] = $(this).children(".div_id").children("p").text();
				obj.nombre["S"] = $(this).children(".div_nombre_producto").children("p").text();
				obj.categoria["S"] = $(this).parents(".div_grupo").children(".div_categoria").children("h2").text();
				obj.cantidad["N"] = $(this).children(".div_cantidad").children("input").val();
				result_checked.push(obj);
				res_cats.push(obj.categoria["S"]);
			});
			let value = input_busca.val().toLowerCase();
			let items = Model.data;
			let cats = Model.cats;
			for(let item of items) {
				let nombre_minuscula = item.nombre["S"].toLowerCase();
				if(nombre_minuscula.indexOf(value) != -1) {
					result.push(item);
					if(cats.indexOf(item.categoria["S"]) != -1) {
						let index = cats.indexOf(item.categoria["S"]);
						res_cats.push(cats[index]);
					}
				}
			}
			let res_cats_unicas = [...new Set(res_cats)];
			View.muestraTotal(result, res_cats_unicas, result_checked);
		});

		let boton_nuevo = $(".div_button_busca_producto").children("button");
		boton_nuevo.click(function(){
			let confirma = confirm("¿Quiere crear el producto?");
			if(confirma == true){
				View.showLoadScreen();
				let input_busca = $(".div_input_busca_producto").children("input").val();
				Controller.creaProducto(input_busca);
				//$(".div_input_busca_producto").children("input").val("");
			}
		});
	},
	muestraTotal: function(datos, categorias, datos_checked) {
		$("main").empty();
		let content = "";
		for(cat of categorias){
			content += "<div class='div_grupo'>" +
			"<div class='div_categoria'>" +
			"<h2>" + cat + "</h2>" +
			"</div>";
			if(datos_checked.length > 0) {
				for(item_checked of datos_checked) {
					if(item_checked.categoria["S"] == cat) {
						content += "<div class='div_producto checkbox_checked'>" +
						"<div class='div_id' style='display:none'><p>" + item_checked.id["N"] + "</p></div>" +
						"<div class='div_cantidad'>" +
						"<input type='number' placeholder='1' value ='" + item_checked.cantidad["N"] + "'/>" +
						"</div>" +
						"<div class='div_nombre_producto'>" +
						"<p>" + item_checked.nombre["S"] + "</p>" +
						"</div>" +
						"<div class='div_boton_edit'>" +
						"<button onclick=Controller.importaProducto(" + item_checked.id["N"] + ");><i class='fas fa-edit'></i></button>" +
						"</div>" +
						"</div>";
					}
				}
				for(item of datos) {
					let isChecked = 0;
					for (item_checked of datos_checked) {
						if(item.nombre["S"] == item_checked.nombre["S"]) {
							isChecked++;
						}
					}
					if(isChecked == 0) {
						if(item.categoria["S"] == cat) {
							content += "<div class='div_producto'>" +
							"<div class='div_id' style='display:none'><p>" + item.id["N"] + "</p></div>" +
							"<div class='div_cantidad'>" +
							"<input type='number' placeholder='1'/>" +
							"</div>" +
							"<div class='div_nombre_producto'>" +
							"<p>" + item.nombre["S"] + "</p>" +
							"</div>" +
							"<div class='div_boton_edit'>" +
							"<button onclick=Controller.importaProducto(" + item.id["N"] + ");><i class='fas fa-edit'></i></button>" +
							"</div>" +
							"</div>";
						}
					}
				}
			}else{
				for(item of datos) {
					if(item.categoria["S"] == cat) {
						content += "<div class='div_producto'>" +
						"<div class='div_id' style='display:none'><p>" + item.id["N"] + "</p></div>" +
						"<div class='div_cantidad'>" +
						"<input type='number' placeholder='1'/>" +
						"</div>" +
						"<div class='div_nombre_producto'>" +
						"<p>" + item.nombre["S"] + "</p>" +
						"</div>" +
						"<div class='div_boton_edit'>" +
						"<button onclick='Controller.importaProducto(" + item.id["N"] + ");'><i class='fas fa-edit'></i></button>" +
						"</div>" +
						"</div>";
					}
				}
			}
			content += "</div>";
		}
		$("main").html(content);

		let boton_check = $(".div_nombre_producto");
		boton_check.click(function(){
			$(this).parent().toggleClass("checkbox_checked");
		});

		let boton_aceptar = $(".addList").children("button");
		boton_aceptar.click(function(){
			View.showLoadScreen();
			let a = "";
			let j = 0;
			let prom = new Promise(function(resolve, reject){
				if($(".checkbox_checked").length > 0) {
					$(".checkbox_checked").each(function(){
						let id = $(this).children(".div_id").children("p").text();
						id = parseInt(id);
						let nombre = $(this).children(".div_nombre_producto").children("p").text();
						let categoria = $(this).parents(".div_grupo").children(".div_categoria").children("h2").text();
						let cantidad = $(this).children(".div_cantidad").children("input").val();
						Controller.incluyeProductoLista(id, cantidad, resolve, j);
						j++;
					});
				} else {
					resolve("No hay nada que agregar");
				}

			});
			prom.then(function(res){
				console.log(res);
				console.log('Empieza renderizado: ' + new Date().getMilliseconds());
				Controller.consultaLista();
			});


		});

	},
	muestraEditaProductoCabecera: function() {
		let content = "<div class='div_boton_rechazar discardEdit'>" +
		"<button type='button'><i class='fas fa-times-circle'></i></button>" +
		"</div>" +
		"<div class='div_titulo'>" +
		"<h1>Edita el producto</h1>" +
		"</div>" +
		"<div class='div_boton_aceptar editProduct'>" +
		"<button type='button'><i class='fas fa-check-circle'></i></button>" +
		"</div>";
		$("header").empty().html(content);
		$(".subtitulo").empty();
		$("main").addClass("main_edit");

		let boton_rechazar_edit = $(".discardEdit").children("button");
		boton_rechazar_edit.click(function(){
			View.showLoadScreen();
			Controller.consultaTodos();
		});
	},
	muestraEditaProducto: function(producto, categorias) {
		let id = producto.id["N"];
		$("main").empty().append(
			$("<div></div>")
			.addClass("div_edit_nombre")
			.append(
				$("<div></div>")
				.addClass("div_edit_label")
				.html(
					$("<label></label>")
					.attr("for", "nombre")
					.text("Nombre")
				)
			).append(
				$("<div></div>")
				.addClass("div_edit_input")
				.html(
					$("<input></input>")
					.attr("type", "text")
					.attr("id", "nombre")
					.val(producto.nombre["S"])
				)
			)
		).append(
			$("<div></div>")
			.addClass("div_edit_cat")
			.append(
				$("<div></div>")
				.addClass("div_edit_label")
				.html(
					$("<label></label>")
					.attr("for", "categoria")
					.text("Categoría")
				)
			).append(
				$("<div></div>")
				.addClass("div_edit_input")
				.append(
					$("<input></input>")
					.attr("type", "text")
					.attr("id", "categoria")
					.attr("list", "cats")
					.val(producto.categoria["S"])
				).append(
					$("<datalist></datalist>")
					.attr("id", "cats")
				)
			).append(
				$("<div></div>")
				.addClass("div_del_button")
				.html(
					$("<button></button>")
					.text("BORRAR PRODUCTO")
					.click(function(){
						let r = confirm("¿Quiere borrar el producto?");
						if(r == true){
							View.showLoadScreen();
							Controller.borraProducto(id);
						}
					})
				)
			)
		);
		let datalist = $("datalist");
		for(cat of categorias){
			datalist.append(
				$("<option></option>")
				.val(cat)
			)
		}

		let boton_aceptar_edit = $(".editProduct").children("button");
		boton_aceptar_edit.click(function(){
			View.showLoadScreen();
			let nombre = $(".div_edit_nombre").find("input").val();
			let categoria = $(".div_edit_cat").find("input").val();
			Controller.editaProducto(id, nombre, categoria);
		});
	},
	showLoadScreen: function() {
		let content = "<div class='load_screen'><i class='fas fa-spinner'></i></div>";
		$("main").append(content);
	}
}
//If you want offline use for the initial list
/*if ('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
	navigator.serviceWorker.register('/sw.js').then(function(registration) {
		// Registration was successful
		console.log('ServiceWorker registration successful with scope: ', registration.scope);
	}, function(err) {
		// registration failed :(
		console.log('ServiceWorker registration failed: ', err);
	});
	});
} else {
	console.log('ServiceWorker is not allowed in this browser');
}*/

Controller.consultaLista();
