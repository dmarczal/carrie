function NodeTree(data, leftChild, rightChild) {

    this.data = data;
    this.leftChild = leftChild;
    this.rightChild = rightChild;

    this.getLeftChild = function() {
        return this.leftChild;
    }

    this.getRightChild = function() {
        return this.rightChild;
    }

    this.getData = function() {
        return this.data;
    }

};


function CowTree(node) {
    this.root = node;
    
    this.level = 0;

    this.insert = function(data) {
        this.root = this.insertAt(null, this.root, data);
        this.toString();
    }

    this.insertAt = function(father, node, data) {
      if(node == null) {
  
        if (this.isParenthesis(data)) {
          if (!(father && !father.leftChild)) {              
            this.level++;
            node = new NodeTree('(');
            node.leftChild = new NodeTree('');
          }
          else if (father && !father.leftChild && this.level>0) {
            this.level--;
            node = new NodeTree(')');
            father.leftChild = new NodeTree('');
          }
          else {
            console.log('[ERROR] Cant put parenthesis mdf');                    
          }
        }
        else if ((!father && this.isOperation(data)) || (father && father.leftChild && this.isOperation(data))) {
          
          if(father && this.isClose(father.data)) {
            father.leftChild.data = new NodeTree(data);
          }
          else { console.log('[ERROR] Cant insert an operation right now'); }
        
        }
        else if(father && this.isClose(father.data) && father.leftChild == null && this.isNumber(data)){
          console.log('[ERROR] You cant put a number here, bitch!');
        }
        else if(father && !this.isOpen(father.data) && !father.leftChild && this.isNumber(data)) {
            //console.log('[ERROR] Cant insert a number right now')
            father.data = father.data + "" + data; 
        }
        else {
           node = new NodeTree(data);
        }
        
      }
      else if(node.leftChild == null && this.isOperation(data)) {
//            console.log('inserting into left child');
          node.leftChild = this.insertAt(node, node.leftChild, data);
      } else {
//            console.log('insert into right child');
          node.rightChild = this.insertAt(node, node.rightChild, data);
      }
      return node;
    }

    this.toString = function() {
        return this.printPreOrder(this.root);
    }

    this.printPreOrder = function(node) {
        var str = '';
        if(node != null) {
            str += node.data;
            str += this.printPreOrder(node.leftChild);
            str += this.printPreOrder(node.rightChild);
        }
        return str;
    }
    
    this.isOperation = function(data) {
        return ((data == '+') || 
                (data == '-') ||
                (data == '*') ||
                (data == '/'));
    }
    
    this.isNumber = function(data) {
        return isFinite(data);
    }   
    
    this.isOpen = function(data) {
        return data == '(';
    }

    this.isClose = function(data) {
        return data == ')';
    }
    
    this.isParenthesis = function(data) {
        return data == '()';
    }
}
    
