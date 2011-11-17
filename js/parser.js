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
      if (this.op == '')
        this.op = value;
      else if (this.right != '')
        return false;
    }
    else if (/()/.test(value)) {
      this.lef
    }
    
    return true;
  }

  this.toString = function() {
    return this.left.toString() + this.op + this.right.toString();
  }

  this.init = function () {
  }
}
