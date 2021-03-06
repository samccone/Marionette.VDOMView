'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var Marionette = require('backbone.marionette');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');
var virtualize = require('vdom-virtualize');

module.exports = Marionette.ItemView.extend({
  setElement: function(element, delegate) {
    if (this.$el) this.undelegateEvents();

    this.el = element instanceof Backbone.$ ? element[0] : Backbone.$(element)[0];
    this.$el = Backbone.$(this.el);

    if (this.el) {
      this.virtualEl = virtualize(this.el);

      if (!this.$el.parent().length || this.$el.parent('body').length) {
        this.el = createElement(this.virtualEl);
        this.$el = Backbone.$(this.el);
      }
    }

    if (delegate !== false) this.delegateEvents();

    _.invoke(this._behaviors, 'proxyViewProperties', this);
    return this;
  },

  attachElContent: function(html) {
    var newVirtualEl = virtualize.fromHTML(html);
    var patches = diff(this.virtualEl, newVirtualEl);
    this.el = patch(this.el, patches);
    this.$el = Backbone.$(this.el);
    this.virtualEl = newVirtualEl;
    return this;
  }
});
