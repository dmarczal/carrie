/**
 * Virtual KeyBoard for jQuery
 *
 * @author Migdi Team
 *
 */

(function ($) {
  $.fn.virtualKeyboard = function() {
    var vk = new VirtualKeyboard();

   	$(this).append(vk.canvas);

   	var buttons = vk.createNumberButtons();
    $(this).append(buttons);

    var operations = vk.createOperationsButtons();
    $(this).append(operations);    
  };

  function VirtualKeyboard() {
    this.canvas = $('<canvas/>').attr  ({width: 100, height: 100});
    this.context = this.canvas[0].getContext('2d');
    this.expression = new Expression();

    /*
     *
     * A Man of a Thousand Faces - Regina Spector
     */

    this.init = function () {
      this.context.font = '16px sans-serif';
      this.redraw();
    }

    /*
     * Function that return div with numbers button!
     * Tempo Perdido - Legião Urbana.
     */
    this.createNumberButtons = function() {
      var content = $('<div/>');
      for (var i = 0; i < 10; i++) {
        var button = $('<button/>').text(i);
        button.click(this, this.add);
        content.append(button);
        if ((i % 3) == 2) {
          content.append($('<br/>'));
        }
      }
      return content;
    }

    /*
     * Function cool =)
     * A Cruz e a Espada - RPM
     */
    this.createOperationsButtons = function() {
      var content = $('<div/>');
      var plus = $('<button/>').text('+');
      plus.click(this, this.add);
      content.append(plus);
      return content;
    }

    /*
     *
     * Refrão de um bolero - Engenheiros do Hawaii
     */
    this.add = function(e) {
      e.data.expression.add($(this).text());
      e.data.redraw();
    }

    /*
     *
     * Here Without You - 3 Doors Down
     */
    this.redraw = function() {
      this.context.fillStyle = "white";
      this.context.fillRect(0, 0, this.canvas.attr('width'), this.canvas.attr('height'));
      this.context.fillStyle = "black";
      this.context.fillText(this.expression.toString(), 5, 20);
    }

    this.init();
  }
})(jQuery);

function Expression() {
  this.left  = '';
  this.op    = '';
  this.right = '';

  this.add = function(value) {
    var expression;
    
    if (/[0-9]/.test(value)) {
      if (this.op == '')
        this.left += value;
      else
        this.right += value;
    }
    else if (/[\+\-\*\/]/.test(value)) {
      this.op = value;
    }
  }

  this.toString = function() {
    return this.left + this.op + this.right;
  }

  this.init = function () {
  }
}
