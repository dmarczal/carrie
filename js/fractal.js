	var currentExercise = 0;

	var exerciseList = [
		["Complete o exercicio do Sierpinski triangle", 5, 120, "", "F-G-G", ["F=F-G+F+G-F", "G=GG"]],
		["Complete o exercicio do Koch Curve", 5, 90, "", "-F", ["F=F+F-F-F+F"]],
		["Complete o exercicio do moda fuck", 5, 90, "X", "F++F++F", ["F=F-F++F-F", "X=FF"]]
	]

$(function () {


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
