/**
 * L-Systems for jQuery
 *
 * @author Migdi Team
 *
 */

(function ($) {
  $.fn.lsystem = function(iterations, angle, constants, axiom, rules) {
    var g_renderer;
    var g_commands;
    var $canvas = $(this);
    var height = $canvas.attr('height');
    var width = $canvas.attr('width');

    generateCmdString = function () {
      var lsys = new LSystems.LSystemsProcessor();
      lsys.iterations = iterations;
      lsys.axiom = axiom;
      for (var i=0; i<5; i++) {
        var rule = rules[i];
        if (rule && rule.length !== 0) {
          lsys.addRule(rule);
        }
      }
      var before = new Date();
      g_commands = lsys.generate();
      var after = new Date();

      calcOffsets();
    }

    calcOffsets = function () {
      g_renderer = new LSystems.TurtleRenderer($canvas[0], width, height);
      g_renderer.setAngle(angle);
      g_renderer.setConstants(constants);
      var before = new Date();
      g_renderer.process(g_commands, false);
      var after = new Date();
      renderCmds();
    }

    renderCmds = function () {
      var oldDistance = 10.0;
      var newDistance;
      var dim = g_renderer.getMinMaxValues();;
      if (dim.maxx - dim.minx > dim.maxy - dim.miny) {
        newDistance = (width / (dim.maxx - dim.minx)) * oldDistance;
      }
      else {
        newDistance = (height / (dim.maxy - dim.miny)) * oldDistance;
      }

      dim.minx *= (newDistance / oldDistance);
      dim.maxx *= (newDistance / oldDistance);
      dim.miny *= (newDistance / oldDistance);
      dim.maxy *= (newDistance / oldDistance);

      var xoffset = (width / 2) - (((dim.maxx - dim.minx) / 2) + dim.minx);
      var yoffset = (height / 2) - (((dim.maxy - dim.miny) / 2) + dim.miny);

      g_renderer.setOffsets(xoffset, yoffset);
      g_renderer.setAngle(angle);
      g_renderer.setDistance(newDistance);
      var before = new Date();
      g_renderer.process(g_commands, true);
      var after = new Date();
    }

    generateCmdString();
  };
})(jQuery);