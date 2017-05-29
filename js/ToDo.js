//ToDo.js

var ToDo = function(){
	//HTML content
	var configMap = {
		inputSec : 
			"<header>"+		
				"<h1 class ='logo'><a href ='#'><span>T</span>o<span>D</span>o Manager</a></h1>" +
			"</header>" +		
			"<form class = 'todoForm'>" +				
				"<label for = 'taskDate'><span><span>D</span>ate:</span></label>" +
				"<input type = 'date' id = 'taskDate' >" +
				"<label for = 'taskName'><span><span>N</span>ame:</span></label>" +
				"<input id = 'taskName' class = 'inputext'>" + 
				"<label for = 'taskPriority'><span><span>P</span>riority:</span></label>" +
				"<select id='prioritySel' class = 'inputext'>" +
					"<option></option>" +
					"<option id = '1'>Low</option>" +
					"<option id = '2'>Medium</option>" +
					"<option id = '3'>Top</option>" +
				"</select>" +
				"<label for = 'taskDetails'><span><span>N</span>otes:</span></label>" +
				"<input id = 'taskDetails' class = 'inputext'>" +
				"<br/><br/>" +
				"<button type='button' id = 'cmdAddTask'><span>A</span>dd <span>T</span>ask</button>" +
				"<button type='button' id = 'cmdClearForm'><span>C</span>lear <span>F</span>orm</button>" +
				"<button type='button' id = 'cmdClearDB'><span>C</span>lear <span>L</span>ocal <span>S</span>torage</button><br>" +
				" <input type='radio' name='view' id='today' value='today'> " +
				'<label for="today"><span></span>Today Tasks</label>'+
				" <input type='radio' name='view' id='alltasks' value='alltasks' checked='checked'> " + 
				'<label for="alltasks"><span></span>All Tasks</label>'+
				"<input type='radio' name='view' id='specDate' value='specDate'> " + 
				'<label for="specDate"><span></span>Specific Dates</label>'+
				"<label for = 'fromDate'>From:</label>" +
				"<input type = 'date' id = 'fromDate' disabled >" +
				"<label for = 'toDate'>To:</label>" +
				"<input type = 'date' id = 'toDate' disabled>" +
			"</form>" +
			"<div class = 'taskList'>" +
			"<div id = 'title'>Today Tasks</div>" +
			"<table id = 'list'><tr><th id = 'numCol'>No.</th><th>Name<span  id = 'cmdSortByName' class = 'filterIMG'></span></th><th>Due Date<span class = 'filterIMG' id = 'cmdSortByDate'></span></th><th>Priority<span class = 'filterIMG' id ='cmdSortByPriority'></span></th><th>Edit/View</th><th>Remove</th><th id = 'priorityIMG'></th></tr></table>" +
			"<div id='noTable'>No Tasks to show</div>" +
			"<p>&copy; 2017 Roy Shani & Karin Marjieh<p>" +
			"</div>"
	};
	
	//Task Object Constructor
	function Task(date, name, priority, details){
		this.name = name;
		this.date = date;
		this.priority = priority;
		this.details = details;			
	};
	
	Task.prototype = {
	constructor : Task 
	};
	
	//TaskList Object Constructor
	function TaskList(){
		this.list = [];
	};
	
	TaskList.prototype = {
		constructor : TaskList,
		
		addItem : function(item){
			this.list[item.name] =item;
			storageAPI.save("Tasks",item);
			drawTable();
		}
	};
	
	//Global varibles
	var stateMap = {$cont : null};
	
	//current task list
	var list = new TaskList();
	
	//today's date
	var today = new Date();
	
	//Array of name of months
	var month = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
	
	//app init
	var init = function($cont){
		
		stateMap.$cont = $cont;
		$('#ToDo').html(configMap.inputSec);
		//Storage init
		storageAPI.init();
        storageAPI.createObject("Tasks");
		//click listeners
		$("#cmdAddTask").click(addTask);
		$('#cmdClearForm').click(function(){$("#taskName").val("");$("#taskDetails").val("");$("#prioritySel").val("");$('#taskDate').val("");});		
		$("#cmdClearDB").click(function(){storageAPI.drop("Tasks");drawTable();});
		$('#cmdSortByDate').click(function(){storageAPI.sortStorage("Tasks","date"); drawTable();});
		$('#cmdSortByName').click(function(){storageAPI.sortStorage("Tasks","name"); drawTable();});
		$('#cmdSortByPriority').click(function(){storageAPI.sortStorage("Tasks","priority"); drawTable();});
		$('#priorityIMG').click(function(){storageAPI.sortStorage("Tasks","priority"); drawTable();});
		$('#today').click(function(){drawTable();$("#title").css("visibility","visible");});
		$('#alltasks').click(function(){drawTable();$("#title").css("visibility","hidden");});
		
		//hiding and showing date for specific date
		$("input#fromDate").css("visibility", "hidden");
		$('label[for="toDate"]').css('visibility', 'hidden');
		$('label[for="fromDate"]').css('visibility', 'hidden');
		$('input#toDate').css('visibility', 'hidden');
		
		$('input[type=radio][name=view]').change(function(){
												if(this.value == 'specDate'){
													//$("input#toDate").prop('disabled', false);
													$("input#fromDate").css("visibility", "visible");
													$('label[for="toDate"]').css('visibility', 'visible');
													$('label[for="fromDate"]').css('visibility', 'visible');
													$('input#toDate').css('visibility', 'visible');
													$("input#fromDate").prop('disabled', false);
													$("input#toDate").css("cursor", "no-drop")
													$("label[for=specDate]").html("<span></span>Specific Dates:");
												}
												else{
													$("#fromDate").val("dd/mm/yyyy");
													$("#toDate").val("dd/mm/yyyy");
													$("input#toDate").prop('disabled', true);
													$("input#fromDate").prop('disabled', true);
													$("input#fromDate").css("visibility", "hidden");
													$('label[for="toDate"]').css('visibility', 'hidden');
													$('label[for="fromDate"]').css('visibility', 'hidden');
													$('input#toDate').css('visibility', 'hidden');
													$("label[for=specDate]").html("<span></span>Specific Dates");
												}});
		$('input[type=date][id=fromDate]').change(function(){
			$("input#toDate").prop('disabled', false);
			$("input#toDate").css("cursor", "default")
			var fromString = dateSet($("#fromDate").val());
			$("input#toDate").prop('min', fromString[0]+"-"+fromString[1] + "-" + fromString[2]);
			drawTable();
		});
		$('input[type=date][id=toDate]').change(drawTable);
		
		drawTable();
	};	
	
	//get string date and decompose to array
	var dateSet = function(date){
		var arr = [];
		arr = date.split('-');
		return arr;
	};
	
	//draw table
	var drawTable = function(){
		$("tr:gt(0)").remove();
		var items= storageAPI.getAll("Tasks");
		//no items to show
		if(items.length == 0){
			return;	
		}
	
		var j = 0;
		$.each(items, function(i,item){
			var tempDate = dateSet(item.date);
			//draw all tasks
			if($("input[name='view']:checked").val() == "alltasks")
				$('#list').append("<tr class ='task'><td>" + (i+1) + "</td><td>" + item.name  + "</td><td>" + tempDate[2] + "/" + month[parseInt(tempDate[1]) -1] + "/" + tempDate[0] + "</td><td>" + item.priority + "</td><td class = 'edit' id ='" + item.name +"'>Edit/View</td><td class = 'delete' id ='" + item.name +"'>X</td><td></td></tr>");
			//draw specific dates tasks
			else if($("input[name='view']:checked").val() == "specDate"){
				var d = new Date();
				var fromString = dateSet($("#fromDate").val());
				var toString = dateSet($("#toDate").val());
				var from = new Date();
				var to = new Date();
				from.setFullYear(parseInt(fromString[0]) ,parseInt(fromString[1]) - 1 ,parseInt(fromString[2]));
				to.setFullYear(parseInt(toString[0]) ,parseInt(toString[1]) - 1 ,parseInt(toString[2]));
				d.setFullYear(parseInt(tempDate[0]) ,parseInt(tempDate[1]) - 1 ,parseInt(tempDate[2]) );
				//both dates are set
				if(!isNaN(from.getTime()) && !isNaN(to.getTime())){
					if(d > from && d < to){
						$('#list').append("<tr class ='task'><td>" + (j+1) + "</td><td>" + item.name  + "</td><td>" + tempDate[2] + "/" + month[parseInt(tempDate[1]) -1] + "/" + tempDate[0] + "</td><td>" + item.priority + "</td><td class = 'edit' id ='" + item.name +"'>Edit/View</td><td class = 'delete' id ='" + item.name +"'>X</td><td></td></tr>");
						j++;
					}
					else
						return true;
				}
				//to date is invalid
				else if(isNaN(to.getTime())){
					if(d > from){
						$('#list').append("<tr class ='task'><td>" + (j+1) + "</td><td>" + item.name  + "</td><td>" + tempDate[2] + "/" + month[parseInt(tempDate[1]) -1] + "/" + tempDate[0] + "</td><td>" + item.priority + "</td><td class = 'edit' id ='" + item.name +"'>Edit/View</td><td class = 'delete' id ='" + item.name +"'>X</td><td></td></tr>");
						j++;
					}
					else
						return true;
				}					
			}
			//draw today's tasks
			else{
				if(parseInt(tempDate[2]) == today.getDate() && parseInt(tempDate[1])-1 == today.getMonth() && parseInt(tempDate[0]) == today.getFullYear()){
						$('#list').append("<tr class ='task'><td>" + (j+1) + "</td><td>" + item.name  + "</td><td>" + tempDate[2] + "/" + month[parseInt(tempDate[1]) -1] + "/" + tempDate[0] + "</td><td>" + item.priority + "</td><td class = 'edit' id ='" + item.name +"'>Edit/View</td><td class = 'delete' id ='" + item.name +"'>X</td><td></td></tr>");
						j++;
				}
				else
					return true;				
			}
			//set priority img for every task
			if(item.priority == "Top")
				$("td").last().addClass("topPriority");
			else if(item.priority == "Medium")
				$("td").last().addClass("medPriority");
			else if(item.priority == "Low")
				$("td").last().addClass("lowPriority");
			else
				$("td").last().addClass("defaultPriority");
			
			//add item to list
			list.list[item.name] = item;
		});
		//click listeners
		$(".delete").click(function(){
			var name = $(this).attr('id');
			storageAPI.deleteLine("Tasks",name);
			delete list.list[name];
			$(this).parent().remove();			
		});
		$(".edit").click(function(){
			var name = $(this).attr('id');
			var obj;
			$.each(items, function(i,item){
				if(name == item.name)
					obj = item;
			});
			$("#taskName").val(obj.name);
			$("#taskDetails").val(obj.details);
			$("#prioritySel").val(obj.priority);
			$('#taskDate').val(obj.date);			
		});
	};
	
	//Add Task Function
	var addTask = function(){
		var name = $("#taskName").val();	
		if(name == ""){
			alert("Please enter vaild name!");
			return;
		}		
		var d = $('#taskDate').val();
		if(d == ""){
			alert("Please enter vaild date!");
			return;			
		}		
		//create Task
		var task = new Task(d,name ,$("#prioritySel").val() , $("#taskDetails").val());
		
		list.addItem(task);
		$("#taskName").val("");
		$("#taskDetails").val("");
		$("#prioritySel").val("");
		$('#taskDate').val("");		
	};	
	return { init : init};
}();

$(document).ready(function(){ToDo.init($("#ToDo"));});