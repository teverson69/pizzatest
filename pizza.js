
var CLIENT = CLIENT || {};

CLIENT.Pizza = function(initValues){
    this.id = initValues.id;
    this.name = initValues.name;
    this.description = initValues.description;
};        


CLIENT.Pizza.prototype.displayValues = function (){
    return '<div id="pizza'+ this.id +'" class="pizza"><p>ID: '+ this.id +'</p>' + 
	    '<p>Name: ' + this.name + '</p>' + 
	    '<p>Desc: ' + this.description + '</p>' + 
	    '<input class="pizza-button" type="button" onclick="CLIENT.getPizzaToppings('+ this.id +')" value="Show Toppings"/>' +
	    '<div id="pizza'+ this.id +'-toppings" class="pizza-topping-list"></div>'
	    '</div>';
    
};

CLIENT.PizzaTopping = function(initValues){
    this.id = initValues.id;
    this.name = initValues.name;
}; 

CLIENT.PizzaTopping.prototype.displayValues = function (){
    return '<div id="pizzatopping'+ this.id +'" class="pizza-topping"><p>ID: '+ this.id +'</p>' + 
	    '<p>Name: ' + this.name + '</p>' + 
	    '</div>';
    
};


CLIENT.Topping = function(initValues){
    this.id = initValues.id;
    this.name = initValues.name;
}; 

CLIENT.Topping.prototype.displayValues = function (){
    return '<div id="topping'+ this.id +'" class="topping"><p>ID: '+ this.id +'</p>' + 
	    '<p>Name: ' + this.name + '</p>' +
	    'Pizza Id: <input class="pizza-id-field" name="pizza_id" id="pizza-id-topping-' + this.id + '" /> ' +
	    '<input class="add-topping-button" type="button" onclick="CLIENT.addPizzaTopping($(\'#pizza-id-topping-'+this.id+'\').val(),  '+ this.id +')" value="Add This Topping"/>' +
	    '</div>';
    
};

CLIENT.apiUrl = 'https://pizzaserver.herokuapp.com/';
CLIENT.pizzaList = [];
CLIENT.toppingList = [];
CLIENT.pizzaToppingList = [];

CLIENT.displayPizzaList = function(){
    for(var i = 0; i < CLIENT.pizzaList.length; i++){
	$('#pizza-list').append(CLIENT.pizzaList[i].displayValues());
    };
};

CLIENT.displayToppingList = function(){
    for(var i = 0; i < CLIENT.toppingList.length; i++){
	$('#topping-list').append(CLIENT.toppingList[i].displayValues());
    };
};

CLIENT.displayPizzaToppingList = function(){
    var output = '';
    for(var i = 0; i < CLIENT.pizzaToppingList.length; i++){
	output += CLIENT.pizzaToppingList[i].displayValues();
    };
    
    return output;
};

CLIENT.initArrayOfPizzas = function(){
    $.get(CLIENT.apiUrl + 'pizzas', 
	function (data){
	    for(var i = 0; i < data.length; i++) {
		CLIENT.pizzaList.push(new CLIENT.Pizza(data[i]));
	    }
	    
	    CLIENT.displayPizzaList();
	}
    );
};

CLIENT.initArrayOfToppings = function(){
    $.get(CLIENT.apiUrl + 'toppings', 
	function (data){
	    for(var i = 0; i < data.length; i++) {
		CLIENT.toppingList.push(new CLIENT.Topping(data[i]));
	    }
	    
	    CLIENT.displayToppingList();
	}
    );
};

CLIENT.getPizzaToppings = function(pizzaId){
    $.get(CLIENT.apiUrl + 'pizzas/' + pizzaId + '/toppings', 
	function (data){
	    CLIENT.pizzaToppingList = [];
	    for(var i = 0; i < data.length; i++) {
		CLIENT.pizzaToppingList.push(new CLIENT.PizzaTopping(data[i]));
	    }
	    
	    $('#pizza' + pizzaId + '-toppings').html(CLIENT.displayPizzaToppingList());
	}
    );
};

CLIENT.addPizzaTopping = function(pizzaId, toppingId){
    $.post(CLIENT.apiUrl + 'pizzas/' + pizzaId + '/toppings',
	{topping_id: toppingId},
	function (){
	    alert('Topping ' + toppingId  + ' Added to Pizza ' + pizzaId + '!')
	}
    );
};

CLIENT.createPizza = function(){
    $.post(CLIENT.apiUrl + 'pizzas',
	{pizza:  {name: $('#pizza-name').val(), description: $('#pizza-description').val()}},
	function (){
	    alert('New Pizza ' + $('#pizza-name').val()  + ' created!');
	    window.location.reload();
	}
    );
};

CLIENT.createTopping = function(){
    $.post(CLIENT.apiUrl + 'toppings',
	{topping:  {name: $('#topping-name').val()}},
	function (){
	    alert('New Topping ' + $('#topping-name').val()  + ' created!');
	    window.location.reload();
	}
    );
};

$( document ).ready(function() {
    //init list of pizzas
    CLIENT.initArrayOfPizzas();
    CLIENT.initArrayOfToppings();
    $('#pizza-form-save').click(function(){
	CLIENT.createPizza();
    });
    $('#topping-form-save').click(function(){
	CLIENT.createTopping();
    });
});
