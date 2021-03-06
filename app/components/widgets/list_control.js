import Ember from 'ember';
import Item from '../../models/item';

/**
@module app
@submodule widgets
*/



/**
 A list of objects. Gives the user a sortable list where each item has its own
 widgets.

 @class ListControl
 @extends Ember.Component
 */
export default Ember.Component.extend({
  /*
    Increases each time we add an item to have a unique identifer for each item
    in the list.
  */
  _itemId: 0,

  /*
    Instantiate a new item and add it to the list.
  */
  _newItem: function(value) {
    var item = Item.create({
      id: ++this._itemId,
      widget: this.get("widget"),
      value: Ember.$.extend({}, value)
    });

    return item;
  },

  /*
    Initialize the initial items based on the widget value and setup a validator
    that will invalidate the widget unless all item values are valid.
  */
  init: function() {
    this._super.apply(this, arguments);
    var items = Ember.A();
    var values = this.get("widget.value");
    if (values && values.length) {
      for (var i=0; i<values.length; i++) {
        items.pushObject(this._newItem(values[i]));
      }
    } else {
      items.pushObject(this._newItem());
    }
    this.set("widget.items", items);
    this.set("widget.addLabel", "Add " + (this.get("widget.item_label") || "one"));
    this.didUpdateItem();
    this.get("widget").registerValidator(function() {
      var items = this.get("widget.items");
      return items && items.every(function(item) {
        return item.isEmpty() || item.isValid();
      });
    }.bind(this));
  },

  /*
    Update the value of the widget whenever the value of one of the widget items
    change.
  */
  didUpdateItem: function() {
    var value = [];
    this.get("widget.items").forEach(function(item) {
      if (item.isEmpty()) { return; }
      value.push(item.get("value"));
    });
    this.set("widget.value", value);
  }.observes("widget.items.@each.value"),


  actions: {
    /**
      Add an item to the list

      @method addItem
    */
    addItem: function() {
      this.get("widget.items").pushObject(this._newItem());
    },

    /**
      Reorder the items in the list

      @method reorder
    */
    reorder: function(items) {
      this.set("widget.items", items);
    }
  }
});
