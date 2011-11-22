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
//    this.expression = new Expression();
    this.expression = new CowTree();

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
      var minus = $('<button/>').text('-');
      var times = $('<button/>').text('x');
      var fraction = $('<button/>').text('÷');
      var parentheses = $('<button/>').text('()');
      
      plus.click(this, this.add);
      minus.click(this, this.add);
      times.click(this, this.add);
      fraction.click(this, this.add);
      parentheses.click(this, this.add);
      
      content.append(plus);
      content.append(minus);
      content.append(times);
      content.append(fraction);
      content.append(parentheses);
      return content;
    }

    /*
     *
     * Refrão de um bolero - Engenheiros do Hawaii
     */
    this.add = function(e) {
//      console.log($(this).text());
      if ($(this).text() == '÷') {
        e.data.expression.insert('/');  
      }
      else {
        e.data.expression.insert($(this).text());      
      }
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

