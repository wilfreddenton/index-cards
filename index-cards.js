'use strict'

const fs = require('fs');
const read = require('readline-sync');

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function IndexCard(term, def) {
  this.term = term;
  this.def = def;
}

function Node(key, show, data) {
  this.key = key;
  this.data = data;
  this.show = show;
  this.left = null;
  this.right = null;
  this.marked = false;
}
function BST() {
  this.root = null;
}
BST.prototype.insert = function(node) {
  if (this.root === null) {
    this.root = node;
    return;
  }
  const traverse = (root) => {
    if (node.key < root.key) {
      if (root.left === null) {
        root.left = node;
        return;
      } else {
        traverse(root.left);
      }
    } else {
      if (root.right === null) {
        root.right = node;
        return;
      } else {
        traverse(root.right);
      }
    }
  }
  traverse(this.root);
}
BST.prototype.preOrder = function() {
  const traverse = (root) => {
    return root === null ? '' : root.show + ' ' + traverse(root.left) + traverse(root.right);
  }
  return traverse(this.root).trim();
}
BST.prototype.inOrder = function() {
  const traverse = (root) => {
    return root === null ? '' : traverse(root.left) + ' ' + root.show + traverse(root.right);
  }
  return traverse(this.root).trim();
}
BST.prototype.balance = function() {
  const order = (root) => {
    return root === null ? [] : order(root.left).concat(root, order(root.right));
  }
  const buildTree = (nodes) => {
    if (nodes.length === 0) return null;
    const midI = Math.floor((nodes.length - 1) / 2);
    const root = nodes[midI];
    root.left = buildTree(nodes.slice(0, midI));
    root.right = buildTree(nodes.slice(midI + 1));
    return root;
  }
  const ordered = order(this.root);
  this.root = buildTree(ordered);
}
BST.prototype.bfs = function() {
  let list = [];
  let frontier = [this.root];
  while (frontier.length > 0) {
    var node = frontier.shift();
    if (!node.marked) {
      node.marked = true;
      list.push(node.data);
    }
    if (node.left !== null)
      frontier.push(node.left);
    if (node.right !== null)
      frontier.push(node.right);
  }
  return list;
}
if (process.argv.length !== 3) {
  console.log('You need to provide a file.');
  process.exit(0);
}
const file = process.argv[2];
const text = fs.readFileSync(file, 'utf-8');
let trigger = true;
const lines = text.split('\n').filter((line) => {
  return line !== '';
});
while (trigger) {
  const nodes = lines.map((line) => {
    const match = /^\*\*(.*)\*\*:\s+(.*)$/g.exec(line);
    const term = match[1];
    const def = match[2];
    const card = new IndexCard(term, def);
    return new Node(randInt(0, lines.length), term, card);
  });
  const cardTree = new BST();
  nodes.forEach((node) => {
    cardTree.insert(node);
  });
  cardTree.balance();
  const cardStack = cardTree.bfs();
  let i = 0;
  while(i < cardStack.length) {
    let card = cardStack[i];
    console.log('\n' + (i + 1).toString() + '/' + cardStack.length.toString());
    console.log(card.def + '\n');
    let guess = read.question('term: ').trim();
    if (guess === card.term) {
      console.log('correct!');
      i += 1;
    } else if (guess === 'flip') {
      console.log('The answer is ' + card.term);
    } else {
      console.log('wrong!');
    }
  }
  let action = read.question('\nStudy again? (y/n): ').trim();
  if (action === 'y' || action === 'Y') {
    console.log('shuffling cards...');
  } else {
    trigger = false;
  }
}
