$(function () {
  for (var i = 0; i < 5; i++) {
    var row = $('<tr>');
    var iteration = $('<td>' + i + '</td>');
    var fractal = $('<td>');
    var side = $('<td>');
    var canvas = $('<canvas id="canvas_' + i + '" width="128" height="128" />')
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

  $("table tr:nth-child(odd)").addClass("odd-row");
  $("table td:first-child, table th:first-child").addClass("first");
  $("table td:last-child, table th:last-child").addClass("last");
});
