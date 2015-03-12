CodeGenius.Views.PhileShow = Backbone.View.extend({
  template: JST["philes/phile_show"],

  events: {
    "mouseup pre": "newNote",
    "mouseup pre *": "newNote"
  },

  initialize: function () {
    this.listenTo(this.model, "sync", this.render);
    this.listenTo(this.model.notes(), "add", this.render);
  },

  render: function () {
    this.$el.html(this.template({phile: this.model}));
    this._textNodes = null;
    return this;
  },

  newNote: function (event) {
    var selection = window.getSelection(),
        start, finish;

    if (this.invalidSelection(selection)) return;

    start = this.findSelectionStart(selection);
    finish = start + selection.toString().length - 1;

    Backbone.history.navigate(
      "notes/new/" + start + "/" + finish,
      {trigger: true}
    );
  },

  invalidSelection: function (selection) {
    return selection.toString().length === 0 ||
        this.textNodes().indexOf(selection.anchorNode) === -1 ||
        this.textNodes().indexOf(selection.focusNode ) === -1
  },

  findTextNodeOffset: function (node, nodeList) {
    var offset = 0;

    _.find(this.textNodes(), function (curNode) {
      offset += curNode.length;
      return curNode === node;
    });

    return offset - node.length;
  },

  findSelectionStart: function (selection) {
    var startNode;

    if (this.textNodes().indexOf(selection.anchorNode) <=
        this.textNodes().indexOf(selection.focusNode)) {
      startNode = selection.anchorNode;
    } else {
      startNode = selection.focusNode;
    }

    return this.findTextNodeOffset(startNode) +
        selection.getRangeAt(0).startOffset;
  },

  textNodes: function () {
    this._textNodes || this._findTextNodes(this.$("pre"), []);
    return this._textNodes;
  },

  _findTextNodes: function ($el, nodeList) {
    _.each($el.contents(), function (node) {
      //text nodes have a nodeType === 3
      node.nodeType === 3 ? nodeList.push(node) :
          this._findTextNodes($(node), nodeList);
    }, this);

    this._textNodes = nodeList;
  }
});
