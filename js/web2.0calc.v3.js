// (c) 2006-2011 Andre Massow britnex@gmail.com
var key = "kx";
var input = "_";
var result = null;
var display = null;
var plot = null;
var checksyntax = false;
var request = null;
var servers = {
    preview: [{ url: "/img/", time: 0}],
    img: [{ url: "/img/", time: 0}]
};
var lastbtn = null;
var histories = new Array();
var history_index = -1;
var history_backup = null;
var minDisplayHeight = 90;
var checkforinputchanges_input = "";
var checkforinputchanges_lasttime = new Date();
var checkforinputchanges_interval = 0.15;
var checkforinputchanges_count = 0;
var checkforinputchanges_extrawait = 0.0;
var checkforinputchanges_input_last = "_";
var checkForInputChanges_lastinterval = new Date(2010, 0, 1);
var checkforinputchanges_timeouts = 0;
var insertposition = 0;
var plotinfo = { minx: 0, maxx: 0, miny: 0, maxy: 0 };

var lastequalinput = ",";
var lastequalinputcount = 0;

function checkEqual(inputstr) {

    if (inputstr.length == 0)
        return false;

    if (lastequalinput == inputstr) {
        lastequalinputcount++;
        if (lastequalinputcount > 5)
            return false;
    } else {
        lastequalinputcount = 0;
        lastequalinput = inputstr;
    }
    
    return true;
}


function equal() {   

    var inputstr = $("input.input").val();

    if (!checkEqual(inputstr))
        return;

    if (inputstr == "") {
        plot.hide();
        result.hide();
        return;
    }
    setLoadingImg(true);

    histories.unshift(inputstr);

    // request = 1;

            console.log(inputstr);

            setLoadingImg(false);
            checkforinputchanges_input = input.val();
            request = null;
            
            return inputstr;

}





function historyScroll(down) {

    if (down && history_index == -1) {
        history_backup = $("input.input").val();
    }

    if (down) {

        if (history_index+ 1 < histories.length) {
            history_index++;
            $("input.input").val(histories[history_index]);
        }
    } else {
        history_index--;

        if (history_index <= -1) {
            history_index = -1;
            if (history_backup != null)
                $("input.input").val(history_backup);
        } else {

            if (history_index < histories.length)
              $("input.input").val(histories[history_index]);
        }
         
    }
}

function setLoadingImg(show) {
    try {
        input.css({
            backgroundImage: (show ? "url(http://cdn.web2.0calc.es/img/loading.gif)" : "none"),
            backgroundPosition: (show ? "top right" : "111% 110%")
        });
    } catch (e) {
    }
}


function showcmd(cmd, btn) {

    if (btn == null || btn.hasClass("active")) {

        $("#plotinput").empty();
        $("#solveinput").empty();
        $("#matrixinput").empty();
        $("#unitsinput").empty();
        $(".cmd").removeClass("active");


    } else {

        $(".cmd").removeClass("active");
        btn.addClass("active");

        switch (cmd) {
            case "plot":
                $("#solveinput").empty();
                $("#matrixinput").empty();
                $("#unitsinput").empty();
                $("#plotinput").load("/js/helpers/?" + cmd, function () {

                   // input = $("#input_plot1");

                    $("#plotinput").removeClass("invisible");
                });

                break;
            case "solve":
                $("#plotinput").empty();
                $("#matrixinput").empty();
                $("#unitsinput").empty();
                $("#solveinput").load("/js/helpers/?" + cmd + "&type=solver&order=1", function () {

                    //  input = $("#input_solve1");

                    $("#solveinput").removeClass("invisible");
                });

                break;
            case "matrix":
                $("#solveinput").empty();
                $("#plotinput").empty();
                $("#unitsinput").empty();

                $("#matrixinput").load("/js/helpers/?" + cmd, function () {
                
                    $("#matrixinput").removeClass("invisible");
                });

                break;

            case "units":
                $("#solveinput").empty();
                $("#plotinput").empty();
                $("#matrixinput").empty();                
                $("#unitsinput").load("/js/helpers/?" + cmd, function () {

                    $("#unitsinput").removeClass("invisible");
                });

                break;
        }
    }
}

function base64(a) { var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="; var b = ""; var c, d, e, f, g, h, i; var j = 0; while (j < a.length) { c = a.charCodeAt(j++); d = a.charCodeAt(j++); e = a.charCodeAt(j++); f = c >> 2; g = (c & 3) << 4 | d >> 4; h = (d & 15) << 2 | e >> 6; i = e & 63; if (isNaN(d)) { h = i = 64 } else if (isNaN(e)) { i = 64 } b = b + b64.charAt(f) + b64.charAt(g) + b64.charAt(h) + b64.charAt(i) } return b }



function updateMinHeight() {
    var height = parseInt(result.height()) + (plot.is(':visible')?parseInt(plot.height()):0);
    if (height < minDisplayHeight)
        height = minDisplayHeight;
    if (height > parseInt(display.css("min-height"))) {
        display.css({
            minHeight: (height + "px")
        });
    }

}

function checkForInputChanges() {

    if (request != null)
        return;

    //if (checkforinputchanges_timeouts > 5)
    //    return;

    updateMinHeight();

    var inputval = input.val();
    if (inputval == checkforinputchanges_input)
        return;
    var now = new Date();
    var timediff = (now.getTime() - checkforinputchanges_lasttime.getTime()) / 1000.0;
    if (timediff < checkforinputchanges_interval)
        return;
    if (inputval != checkforinputchanges_input_last) {
        checkforinputchanges_input_last = inputval;
        return;
    }
    checkforinputchanges_input_last = inputval;
        
    var img_preview_server = servers["preview"][0];
    for (var i = 1; i < servers["preview"].length; i++) {
        if (servers["preview"][i]["time"] < img_preview_server["time"])
            img_preview_server = servers["preview"][i];
    }


    if (input.attr("id")) {

        var id = input.attr("id");
        if (id.indexOf("input_matrix_") == 0)
            onMatrixInputChange();
        if (id.indexOf("input_plot") == 0)
            onPlotInputChange();
        if (id.indexOf("input_solver_") == 0)
            onSolveInputChange('solver');
        if (id.indexOf("input_solve_") == 0)
            onSolveInputChange('poly');
        if (id=="input_unit")
            onUnitInputChange();

    }

    var url = "";
    if (img_preview_server["old"])
     url = img_preview_server["url"] + "?p=" + encodeURIComponent( $("input.input").val() ) + "&key=" + key + ($("#trigorad").attr("checked") ? "&rad" : "");
    else
     url = img_preview_server["url"] + "P" + base64(Math.round(1000 * checkforinputchanges_interval) + "," + key + "," + ($("#trigorad").attr("checked") ? "r" : "d") + ":" + encodeURIComponent($("input.input").val()));

    result.attr("src", url);
    result.css({
        opacity: "0.9"
    });
    result.show();

    checkforinputchanges_input = input.val();
    checkforinputchanges_count++;
    checkforinputchanges_lasttime = new Date();

    
   
    plot.css({ opacity: "0.5" });

}

function plotLoaded() {

    updateMinHeight();
}

function resultLoaded() {
    var now = new Date();
    var loadtime = (now.getTime() - checkforinputchanges_lasttime.getTime()) / 1000.0;
    loadtime *= 0.75;
    if (loadtime < 0.15)
        loadtime = 0.15;
    if (loadtime > 1) {
        loadtime = 1;
        checkforinputchanges_timeouts++;
    }
    checkforinputchanges_interval = loadtime;
    
    updateMinHeight();

    result.css({
        opacity: "1"
    });
}




function makeInput(newinput) {
    try {
        setLoadingImg(false);
        input = $(newinput);
        input.attr("autocomplete", "off");
    } catch (e) {
    }
}

function getInputCaretPosition() {
    var pos = input.val().length;
    if (document.selection) {
        try {
            input.focus();
        } catch (e) {
        }
        var Sel = document.selection.createRange();
        Sel.moveStart('character', -input.val().length);
        pos = Sel.text.length;
    } else {
        try {
            if (input[0].selectionStart || input[0].selectionStart == '0')
                pos = input[0].selectionStart;
        } catch (e) {
        }
    }
    if ($.browser.msie || $.browser.opera)
        pos -= getInputSelectionLength();
    return (pos);
}
function getInputSelectionLength() {
    var pos = input.val().length;
    try {
        if (document.selection) {
            try {
                input.focus();
            } catch (e) {
            }
            var Sel = document.selection.createRange();
            pos = Sel.text.length;
        } else if (input[0].selectionEnd || input[0].selectionEnd == '0')
            pos = input[0].selectionEnd - input[0].selectionStart;
    } catch (ee) {
    }
    return (pos);
}
function setInputCaretPosition(pos) {
    
    if (input[0].setSelectionRange) {
        try {
            input.focus();
        } catch (e) {
        }
        try {
            if ($.browser.webkit) {
                window.setTimeout(function () {
                    var _pos = pos;
                    input[0].selectionEnd = input[0].selectionStart = _pos;
                }, 10);
            } else
                input[0].setSelectionRange(pos, pos);
        } catch (e) {
        }
    } else if (input[0].createTextRange) {
        var range = input[0].createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
}
function smartinsert(val, parameters) {
   
    var sellen;
    if ((sellen = getInputSelectionLength()) > 0) {
        var inp = input.val();
        var selpos = getInputCaretPosition();
        input.val( (inp.substring(0, selpos) + val + "("
				+ inp.substr(selpos, sellen) + (parameters == 1 ? "" : ", ")
				+ ")" + inp.substring(selpos + sellen)) );
        if (parameters == 1)
            setInputCaretPosition(val.length + selpos + sellen + 2);
        else
            setInputCaretPosition(val.length + selpos + sellen + 3);
    } else {
        var regex = /^[-]?[0-9.abcdef]+$/;
        if (!regex.test(input.val())) {
            if (parameters == 1)
                ins(val + "(");
            else
                ins(val + "(");
        } else {
            if (parameters == 1)
                input.val( (val + "(" + input.val() + ")") );
            else
                input.val( (val + "(" + input.val() + ", ") );
        }
    }
}
function inputKeyChange() {
    var parans = 0;
    var inputstr = input.val();
    var len = inputstr.length;
    for (var i = 0; i < len; i++) {
        var ch = inputstr[i];
        if (ch == '(')
            parans++;
        if (ch == ')')
            parans--;
    }
    if (request == null)
        input.css({
            backgroundImage: (parans > 0 ? "url(http://cdn.web2.0calc.es/img/paranr.gif)" : "none"),
            backgroundPosition: (parans > 0 ? "top right" : "110% 110%")
        });
    checkForInputChanges();
    checkForInputChanges();
}
function paranl() {
    ins("(");
    operation = "(";
    inputKeyChange();
}
function paranr() {
    ins(")");
    inputKeyChange();
}
function cmd(name) {
    if (checksyntax)
        checksyntax(false);
    if (name == "exp")
        smartinsert("exp", 1);
    else if (name == "logyx") {
        smartinsert("log", 2);
        return false;
    } else if (name == "sqrty") {
        smartinsert("sqrt", 2);
        return false;
    } else if (name == "x^2" || name == "x^3") {
        var sellen;
        if ((sellen = getInputSelectionLength()) > 0) {
            var inp = input.val();
            var selpos = getInputCaretPosition();
            input.val( (inp.substring(0, selpos) + "("
					+ inp.substr(selpos, sellen) + ")" + name.substr(1) + inp
					.substring(selpos + sellen)) );
            setInputCaretPosition(selpos + sellen + 4);
        } else
            ins((name == "x^2") ? "^2" : "^3");
    } else if (name == "1/x")
        smartinsert("1/", 1);
    else if (name == "10^x")
        smartinsert("10^", 1);
    else if (name == "faculty")
        ins("!");
    else
        smartinsert(name, 1);
    checkForInputChanges();
    checkForInputChanges();
    return false;
}
function clearall() {
    
    if (checksyntax)
        checksyntax(false);

    if (input.val().length == 0 || input.hasClass("unfocused")) {
        showcmd();
        $("#display").css({
            minHeight: (minDisplayHeight + "px")
        });
        input = $("input.input");
        input.focus();
    }
    result.hide();
    plot.hide();
    var value = "";
    var len = 0;
    if ($.browser.webkit || $.browser.mozilla
			|| $.browser.msie) {
        len = getInputSelectionLength();
        var pos = getInputCaretPosition();
        if (len > 0 && pos >= 0)
            value = input.val().substring(0, pos)
					+ input.val().substring(pos + len);
        else {
            value = "";
        }
    } else {
        value = "";
    }
    if (len <= 0) {
        checkforinputchanges_input = value;
        result.attr("src", "http://cdn.web2.0calc.es/img/loading.gif" );
    }
    input.val( value );
    setLoadingImg(false);
    input.focus();
    return false;
}
function setoperation(op) {
    ins(op);
    operation = op;
    return false;
}

function ins(s) {
  
    if (checksyntax)
        checksyntax(false);
    if ($.browser.mozilla || $.browser.webkit
			|| $.browser.opera || $.browser.msie) {
        var inputval = input.val();
        var len = getInputSelectionLength();
        var pos = getInputCaretPosition();
        if ($.browser.msie && pos == 0 && len == 0)
            pos = inputval.length;
        if (len > 0)
            inputval = inputval.substring(0, pos)
					+ inputval.substring(pos + len);
        input.val( (inputval.substring(0, pos) + s + inputval.substring(pos)) );
        if (s == "\n" && $.browser.opera)
            pos++;
        insertposition = pos + s.length;
        setInputCaretPosition(insertposition);
    } else
        input.val( inputval.value + s);
    operation = "";
    checkForInputChanges();
    checkForInputChanges();
    return false;
}
function sign() {
    var inputval = input.val();
    for (var i = inputval.length - 1; i >= 0; i--) {
        var ch = inputval.substring(i, i + 1);
        if ("0123456789e.".indexOf(ch) >= 0) {
        } else if (ch == "-") {
            inputval = inputval.substring(0, i) + inputval.substring(i + 1);
            break;
        } else {
            inputval = inputval.substring(0, i + 1) + "-"
					+ inputval.substring(i + 1);
            break;
        }
        if (i == 0)
            inputval = "-" + inputval;
    }
    input.val( inputval );
}
function doundo() {
   
    if (getInputSelectionLength() > 1) {
        clearall();
       
        return;
    }
    var pos = getInputCaretPosition();
    var inputval = input.val();
    if (pos < 0)
        return;
    if (pos > inputval.length)
        return;
    if (pos == 0 && inputval.length > 0)
        pos = 1;
    inputval = (pos > 0 ? inputval.substring(0, pos - 1) : "")
			+ inputval.substring(pos);
    input.val( inputval );
    setInputCaretPosition(pos > 0 ? pos - 1 : 0);
}



function doundo() {
    if (getInputSelectionLength() > 1) {
        clearall();
        return;
    }
    var pos = getInputCaretPosition();
    var inputval = input.val();
    if (pos < 0)
        return;
    if (pos > inputval.length)
        return;
    if (pos == 0 && inputval.length > 0)
        pos = 1;
    inputval = (pos > 0 ? inputval.substring(0, pos - 1) : "") + inputval.substring(pos);
    input.val( inputval );
    setInputCaretPosition(pos > 0 ? pos - 1 : 0);
}



function onKey(event) {
   
    if (event.target && event.target.nodeName && event.target.nodeName.toLowerCase() == "input") {
        if (event.keyCode == 13)
            equal();
        if (event.keyCode == 27)
            clearall();
        return;
    }
    
    switch (event.keyCode) {
        case 94: setoperation('^'); break;
        case 48: ins('0'); break;
        case 49: ins('1'); break;
        case 50: ins('2'); break;
        case 51: ins('3'); break;
        case 52: ins('4'); break;
        case 53: ins('5'); break;
        case 54: ins('6'); break;
        case 55: ins('7'); break;
        case 56: ins('8'); break;
        case 57: ins('9'); break;
        case 43: setoperation('+'); break;
        case 45: setoperation('-'); break;
        case 42: setoperation('*'); break;
        case 47: setoperation('/'); break;
        case 46:
        case 44: ins('.'); break;
        case 8: doundo(); break;
        case 13: equal(); break;
        case 27: input.val(""); clearall(); break;
        default:

            if (event.charCode >= 32 && event.charCode <= 125)
                ins(String.fromCharCode(event.charCode));
            
            return;
    }
    if (event.keyCode != 0)
        event.preventDefault();
}


function isIframe() {
    try {
        if (window.location != window.parent.location)
            return true;
    } catch (e) { }
    return false;
}

$(document).ready(function () {
    input = $("#input");
    input.val("");
    result = $("img#result");
    display = $("#display");
    plot = $("#plot");

    if (!isIframe())
        input.focus();


    $("#trigorad").attr("checked", false);
    $("#trigodeg").attr("checked", true);

    $('.btn').each(function (index) {
        var btn = $(this);

        btn.attr("href", "#" + btn.attr("title"));

        if (btn.attr("tabindex") == null || btn.attr("tabindex") == 0)
            btn.attr("tabindex", 10 + index + (btn.hasClass("r") ? 100 : 0));

        if (!$.browser.msie) {
            btn.mousedown(function () {
                if (lastbtn != null)
                    lastbtn.removeClass("active");
                lastbtn = $(this);
                lastbtn.addClass("active");
                return false;
            });
            btn.mouseup(function () {
                if (lastbtn != null)
                    lastbtn.removeClass("active");
                $(this).removeClass("active");
            });
            //  btn.mouseout(function () {
            //      $(this).removeClass("active");
            //  });
            btn.keydown(function (event) {
                if (event.keyCode == '13')
                    $(this).mousedown();
            });
            btn.keyup(function (event) {
                $(this).removeClass("active");
            });

            btn.click(function () {
                return false;
            });
        } else {
            btn.mousedown(function () {
                return false;
            });
            btn.click(function () {
                return false;
            });

        }

    });

    result.click(function () {

        if (histories.length > 0) {
            input.val(histories[0]);
        }

    });

    plot.mousemove(plotmousemove);
    plot.mouseup(plotmouseup);
    plot.bind("contextmenu", function (e) { return false; });


    var interval = 150;
    window.setInterval(checkForInputChanges, interval);

    result.load(resultLoaded);
    plot.load(plotLoaded);

    if ($("div.history").is(':visible'))
        window.setTimeout(loadHistory, 10);

    if ($.browser.msie)
        $("body").addClass("ie");


    if ($.browser.msie && parseInt($.browser.version) < 8) {
        if (document.createStyleSheet)
            document.createStyleSheet("/css/ie7.css");
        else
            $("head").append("<link rel='stylesheet' type='text/css' href='/css/ie7.css'>");
    }

    if ($('#socialshareprivacy').length > 0) {
        $('#socialshareprivacy').socialSharePrivacy();
    }
});



function loadHistory() {

    if (!$('.history').hasClass("loaded")) {
        $('.history').addClass("loaded");

        $(".entries").load("/js/history/", function () {
            $(".entries .l").click(function () { input.val($(this).attr("title")); });
            $(".entries .r").click(function () { ins($(this).attr("title")); });
        });
    }

}


function onSolveTypeChange(type, order) {

    var solveInputBackup = new Array();
    $("#solveinput input").each(function (index) {
        if ($(this).val().length > 0 && !$(this).hasClass("unfocused"))
        solveInputBackup.push( new Array( $(this).attr("id"), $(this).val() ) );
    });

    $("#solveinput").load("/js/helpers/?solve&type=" + type + "&order=" + order, function () {
        
            while (solveInputBackup.length > 0) {
                var arr = solveInputBackup.shift();
                $("#"+arr[0]).removeClass("unfocused");
                $("#"+arr[0]).val(arr[1]);
            }
        
    });
    
}


function onMatrixTypeChange(typea, typeb, op) {

    var matrixInputBackup = new Array();
    $("#matrixinput input").each(function (index) {
        if ($(this).val().length > 0 && !$(this).hasClass("unfocused"))
            matrixInputBackup.push(new Array($(this).attr("id"), $(this).val()));
    });

    $("#matrixinput").load("/js/helpers/?matrix&a=" + typea + "&b=" + typeb+"&op="+op , function () {

        while (matrixInputBackup.length > 0) {
            var arr = matrixInputBackup.shift();
            $("#" + arr[0]).removeClass("unfocused");
            $("#" + arr[0]).val(arr[1]);
        }

        onMatrixInputChange();
    });
    
}


function onUnitTypeChange(type) {
    var unitsInputBackup = new Array();
    $("#unitsinput input").each(function (index) {
        if ($(this).val().length > 0 && !$(this).hasClass("unfocused"))
            unitsInputBackup.push(new Array($(this).attr("id"), $(this).val()));
    });

    $("#unitsinput").load("/js/helpers/?units&type=" + type, function () {

        while (unitsInputBackup.length > 0) {
            var arr = unitsInputBackup.shift();
            $("#" + arr[0]).removeClass("unfocused");
            $("#" + arr[0]).val(arr[1]);
        }
                
    });
}


function onUnitInputChange() {
    var a = $("#input_unit").val();
    var from = $("#convert_unit_from").val();
    var to = $("#convert_unit_to").val();

    $("#input").val( a+""+from+" in "+to );
}

function onMatrixInputChange() {

    var a = "";
    var b = "";

    var aisvec = $("#view_matrix_sizea").val().indexOf("x") < 0;
    var bisvec = $("#view_matrix_sizeb").val().indexOf("x") < 0
    for (var y = 0; y < 5; y++) {
        var rowa = "";
        var rowb = "";
        for (var x = 0; x < 5; x++) {

            var inp = $("#input_matrix_a" + x + ""+y );
            if (inp != null && inp.val() != null)
                rowa += (inp.val().length>0?inp.val():"0") +", ";

            var inp = $("#input_matrix_b" + x + "" + y);
            if (inp != null && inp.val() != null)
                rowb += (inp.val().length > 0 ? inp.val() : "0") + ", ";
        }
        if (rowa.length > 0)
        a += (aisvec ? "" : "[") + rowa.replace(/[, ]+$/g, '') + (aisvec ? "" : "]")+", ";
        if (rowb.length > 0)
        b += (bisvec ? "" : "[") + rowb.replace(/[, ]+$/g, '') + (bisvec ? "" : "]") + ", ";
    }
    
    a = a.replace(/[, ]+$/g, '');
    b = b.replace(/[, ]+$/g, '');
    if (aisvec)
        a = "(" + a + ")";
    else
        a = "[" + a + "]";
    if (bisvec)
        b = "(" + b + ")";
    else
        b = "[" + b + "]";

    if (b.length == 2)
        $("#input").val(a); 
    else
    switch ($("#view_matrix_op").val())
    {
        case "plus": $("#input").val(a + "+" + b); break;
        case "minus": $("#input").val(a + "-" + b); break;
        case "mult": $("#input").val(a + "*" + b); break;
        case "cross": $("#input").val(a + "#" + b); break;
        case "inv": $("#input").val(a + "^-1"); break;
        case "trans": $("#input").val(a + "^T"); break;        
    }
    
    
}

function onSolveInputChange(type) {

    switch (type) {
        case "poly":
            var inputstr = "";
            for (var i = 0; i < 8; i++) {

                var inp = $("#input_solve_a" + i);
                if (inp != null && inp.val() != null && inp.val().length > 0 && inp.val() != "0") {
                    var a = inp.val();
                    if (!(/^[0-9\.]+$/.test(a)))
                        a = "(" + a + ")";
                    inputstr = a + "*x" + (i > 0 ? ("^" + i + "+") : "") + inputstr;
                }
            }
            inputstr = inputstr.replace(/[+]+$/g, '');
            $("#input").val(inputstr + " = " + $("#input_solve_b").val());
            break;
        case "solver":
            var inputstr = "";
            var j = 0;
            for (var i = 0; i < 8; i++) {

                var inp = $("#input_solver_" + i);
                if (inp != null && inp.val() != null && !inp.hasClass('unfocused')) {
                    inputstr += inp.val() + ", ";
                    j++;
                }
            }
            inputstr = inputstr.replace(/[, ]+$/g, '');
            inputstr = "solve( " + inputstr + " )";
            $("#input").val(inputstr);
            break;
    }
    
}

function onPlotInputChange()
{
    var plot1 = $("#input_plot1");
    var plot2 = $("#input_plot2");
    var a = plot1.val();
    var b = plot2.val();

    var len = a.length;
    var parans = 0;
    for (var i = 0; i < len; i++) {
        var ch = a[i];
        if (ch == '(')
            parans++;
        if (ch == ')')
            parans--;
    }
    for (var i = 0; i < parans; i++)
        a += ")";

    parans = 0;
    len = b.length;
    for (var i = 0; i < len; i++) {
        var ch = b[i];
        if (ch == '(')
            parans++;
        if (ch == ')')
            parans--;
    }
    for (var i = 0; i < parans; i++)
        b += ")";


    if (a.length > 0 && b.length > 0 && !plot2.hasClass("unfocused"))
        a += ", " + b;

    var ymax = $("#ymax").val();
    var xmax = $("#xmax").val();
    var ymin = $("#ymin").val();
    var xmin = $("#xmin").val();
    if ($("#trigorad").attr("checked")) {
        xmax = $("#xmax1").val();
        xmin = $("#xmin1").val();
    }

    var range = "";
    if (xmin != "auto" && xmax != "auto")
        range = ", x=" + xmin + ".." + xmax;
    if (ymin != "auto" && ymax != "auto")
        range += ", " + ymin + ".." + ymax;

    $("#input").val("plot(" + a + "" + range + ")");
}


function plotmousemove(e) {
   
}
function plotmouseup(e) {
    var offset = $(this).offset();
    var relX = e.pageX - offset.left;
    var relY = e.pageY - offset.top;

    var d = plotinfo.maxx - plotinfo.minx;

    var w = $(this).width();
    var minx = plotinfo.minx+d * (relX / w) - d / 4;
    var maxx = plotinfo.minx + d * (relX / w) + d / 4;

    if (e.button == 2) {
        minx -= d / 2;
        maxx += d / 2;
    }
    
    var text = input.val();

    if (text.indexOf("plot") < 0)
        text = "plot( " + text + ", x=-50..50)";
    else if (text.indexOf("..") < 0) {
        var tmp = text.lastIndexOf(")");
        if (tmp > 0)
            text = text.substring(0, tmp) + ", x=-50..50)";
    }
    text = text.replace(/\.\./, "&");
    text = text.replace(/=([^&]+)&([^)^,]+)/, "="
				+ (Math.round(1000 * minx) / 1000) + ".."
				+ (Math.round(1000 * maxx) / 1000));
    text = text.replace(/&/, "..");
    input.val(text);
    equal();

    if (e.button == 2) {
        e.preventDefault();
    }
}

