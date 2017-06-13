var React = require('react');
var ReactDOM = require('react-dom');
import Filter from '../filter.js';
var utilities = require("../../../../node_modules/simple-react-utilities/js/utilities.js");

import { ButtonGroup } from '../../../../node_modules/simple-react-forms/form-fields/button-group.js';
import { FilterButton } from './filter-button.js';

/**
 * renders a group of buttons which filter the spells by a key and list of options
 * @param  {string}   key           the value for the spell filter key ("class","level","school", etc)
 * @param  {array}    choices       list of options for the provided key
 * @param  {boolean}  multiSelect   whether to allow multiple options to be selected at one time
 * @return {ButtonGroup}            <ButtonGroup /> element to render
 */
export class FilterButtonGroup extends React.Component {
  constructor(props) {
    super(props);
  };

  render() {
    var _this = this;
    var filter = new Filter(this.props.cardData);
    
    var buttons = function() {
      return _this.props.filters.map(function(button){
        return <FilterButton key={button.label}
          label={button.label}
          filterArgs={button.filterArgs}
          buttonOptions={_this.props.buttonOptions}
        />
      });
    }
    

    return  <div className="filter-button-group">
              {buttons()}
            </div>
  }

}
