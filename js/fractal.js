$(function () {
    for (var i = 0; i < 5; i++) {
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
        canvas.lsystem(i, 120, "", "F-G-G", ["F=F-G+F+G-F", "G=GG"]);
        // Koch Snowflake
        // canvas.lsystem(i, 60, "X", "F++F++F", ["F=F-F++F-F", "X=FF"]);
    }
    var last = null;
    $("table tr:nth-child(odd)").addClass("odd-row");
    $("table td:first-child, table th:first-child").addClass("first");
    $("table td:last-child, table th:last-child").addClass("last");
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