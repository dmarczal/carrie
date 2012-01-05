var currentExercise = 0;

var exerciseList = [
	["Complete o exercicio do Sierpinski triangle", 5, 120, "", "F-G-G", ["F=F-G+F+G-F", "G=GG"]],
	["Complete o exercicio do Koch Curve", 5, 90, "", "-F", ["F=F+F-F-F+F"]],
	["Complete o exercicio do moda fuck", 5, 90, "X", "F++F++F", ["F=F-F++F-F", "X=FF"]]
]


var $j = jQuery.noConflict();
jQuery(document).ready(function($){ 

	$('input #prev').click(function() {  
		if (currentExercise > 0) {
			currentExercise--;
			loadExercise(exerciseList[currentExercise][0],exerciseList[currentExercise][1],exerciseList[currentExercise][2],exerciseList[currentExercise][3],exerciseList[currentExercise][4],exerciseList[currentExercise][5]);
		}
	});

	$('#next').click(function() {  
	  if (currentExercise < exerciseList.length) {
			currentExercise++;
			loadExercise(exerciseList[currentExercise][0],exerciseList[currentExercise][1],exerciseList[currentExercise][2],exerciseList[currentExercise][3],exerciseList[currentExercise][4],exerciseList[currentExercise][5]);
		}
	});


	
	loadExercise(exerciseList[currentExercise][0],exerciseList[currentExercise][1],exerciseList[currentExercise][2],exerciseList[currentExercise][3],exerciseList[currentExercise][4],exerciseList[currentExercise][5]);
	function loadExercise(title, rows, angle, p1, p2, p3) {
		$("div#div_table table").find("tr:gt(0)").remove();
		for (var i = 0; i < rows; i++) {
			
		    var row = $('<tr>');
		    var iteration = $('<td>' + i + '</td>');
		    var fractal = $('<td>');
		    var side = $('<td>');
		    var canvas = $('<canvas id="canvas_' + i + '" width="128" height="128" />');
		    row.append(iteration, fractal, side);
		    $('table').append(row);
		    fractal.append(canvas);
		    // Koch Curve
		    // canvas.lsystem(i, 90, "", "-F", ["F=F+F-F-F+F"]);
		    // Sierpinski triangle (triangles)
		    canvas.lsystem(i, angle, p1,p2,p3);
		    // Koch Snowflake
		    // canvas.lsystem(i, 60, "X", "F++F++F", ["F=F-F++F-F", "X=FF"]);
		}
		var last = null;
		$("div#title").html(title);
		$("table tr:nth-child(odd)").addClass("odd-row");
		$("table td:first-child, table th:first-child").addClass("first");
		$("table td:last-child, table th:last-child").addClass("last");		
	}


	$("#dialog-calc").hide();
		$( "#dialog:ui-dialog" ).dialog( "destroy" );
		$( "#dialog-calc" ).dialog({
		    autoOpen: false,
		    height: 370,
		    width: 350,
		    modal: true,
		    resizable: false,
		    buttons: {
		        "OK" : function() {
		            last.html(document.getElementById("resp-inv").attributes.value.value);
		            $(this).dialog("close");
		        }
		    }
		}); 
		$(".last").click(function() {
		    // a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
		    last = $(this);
		    $( "#dialog-calc" ).dialog( "open");
		});
});

var Fractal = Class.create(LSystems, {
	initialize:  function(name, angle, axiom, rules, width, height) {
		this.setName(name);
		this.setAngle(angle);
		this.setAxiom(axiom);
		this.setRules(rules);
		this.setWidth(width);
		this.setHeight(height);
		this.it = 0;
	},



	iterate: function() {
		var row = $j('<tr>');
		var iteration = $j('<td>' + this.getIteration() + '</td>');
		var fractal = $j('<td>');
		var side = $j('<td>');
		var canvas = $j('<canvas id="canvas_' + this.getName() + '_' + this.getIteration() + 
					'" width="' + this.getWidth()  +'" height="' + this.getHeight() + '" />');
		row.append(iteration, fractal, side);
		$j('table').append(row);
		fractal.append(canvas);
		canvas.lsystem(this.getIteration(), this.getAngle(), "", this.getAxiom(), this.getRules());
		
		this.it++;

	},

	setName:  function(name) {
		this.name = name;
	},
	
	setAngle: function(angle) {
		this.angle = angle;
	},

	setAxiom: function(axiom) {
		this.axiom = axiom;
	},
	
	setRules: function(rules) {
		this.rules = rules;
	},

	setWidth: function(width) {
		this.width = width;
	},

	setHeight: function(height) {
		this.height = height;
	},

	getName: function() {
		return this.name;
	},

	getAngle: function() {
		return this.angle;
	},

	getAxiom: function() {
		return this.axiom;
	},

	getRules: function() {
		return this.rules;
	},

	getWidth: function() {
		return this.width
	},

	getHeight: function() {
		return this.height;
	},
		
	getIteration: function() {
		return this.it;
	}
});