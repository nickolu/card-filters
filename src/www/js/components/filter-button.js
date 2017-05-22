var React = require('react');
var ReactDOM = require('react-dom');
var utilities = require("../../../../node_modules/simple-react-utilities/js/utilities.js");

import Filter from '../filter.js';
import { SubmitButton } from '../../../../node_modules/simple-react-forms/form-fields/submit-button.js';

/**
 * makes a button that filters the state by specified key and value
 * @param  {string} key   [key to search]
 * @param  {string} val   [value to search]
 * @param  {string} label [label for the button]
 */
export class FilterButton extends React.Component {
  constructor(props) {
    super(props);

    this.update = this.update.bind(this);
  };

  update(e) {
    var spells = [];
    var filter = {
      filterFunc : this.props.buttonOptions.filterFunc,
      filterArgs : this.props.filterArgs
    };

    if (e.target.className.indexOf("active") === -1) {
      e.target.className += " active";
      this.props.buttonOptions.onActivate(this.props.buttonOptions.filterName, filter);
    } else {
      e.target.className = e.target.className.replace(/active/g,'');
      filter.exclude = true;
      this.props.buttonOptions.onDeactivate(this.props.buttonOptions.filterName, filter);
    }
  }

  render() {
    var label = this.props.label || this.props.val;

    return <SubmitButton label={this.props.label} onUpdate={this.update} />
  }
}
