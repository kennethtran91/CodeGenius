CodeGenius.Views.NoteRevisionModal = Backbone.View.extend({
  template: JST["notes/revision_modal"],

  events: {
    "click .modal-overlay": "remove",
    "click a.modal-dismiss": "remove",
    "click a.revision-next": "nextRevision",
    "click a.revision-prev": "prevRevision",
    "click a.revision-revert": "revert"
  },

  initialize: function () {
    this.listenTo(this.model, "sync", this.render);
    this.model.fetch();
  },

  render: function () {
    this.$el.html(this.template({note: this.model}));
    this.revision = 0;
    this.activateRevision();
    return this;
  },

  nextRevision: function (event) {
    event.preventDefault();
    if (this.revision > 0) {
      this.revision--;
      this.activateRevision();
    }
  },

  prevRevision: function (event) {
    event.preventDefault();
    if (this.revision < this.model.get("revisions").length) {
      this.revision++;
      this.activateRevision();
    }
  },

  activateRevision: function () {
    this.$(".revision-list > li").addClass("hidden");
    $(this.$(".revision-list > li").get(this.revision)).removeClass("hidden");
  },

  revert: function (event) {
    var revisionId, url;
    event.preventDefault();

    revisionId = $(this.$(".revision-list > li").get(this.revision))
        .data("revision-id");
    url = "/api/notes/" + this.model.id + "/revert/" + revisionId;

    $.ajax(url, {
      method: "POST",
      success: function (data) {
        this.model.set(data);
        debugger
        this.render();
      }.bind(this)
    });
  }
});
