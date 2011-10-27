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
    this.text = '';

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
        button.click(this, this.putNumber);
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
      content.append(plus);
      return content;
    }

    /*
     *
     * Refrão de um bolero - Engenheiros do Hawaii
     */
    this.putNumber = function(e) {
      e.data.text += $(this).text();
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
      this.context.fillText(this.text, 5, 20);
    }

    this.init();
  }
})(jQuery);
