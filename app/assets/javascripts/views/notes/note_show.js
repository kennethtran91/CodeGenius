CodeGenius.Views.NoteShow = Backbone.View.extend({
  template: JST["notes/note_show"],

  render: function () {
    this.$el.html(this.template({note: this.model}));
    return this;
  }
});
