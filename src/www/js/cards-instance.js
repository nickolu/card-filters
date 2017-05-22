var React = require('react');
var ReactDOM = require('react-dom');
var utilities = require("../../../node_modules/simple-react-utilities/js/utilities.js");


import cardData from '../json/cards.json';
import filterOptions from '../json/filter-configs.json';
import Filter from './filter.js';
import { CardBook } from './cards.js'
import { FilterButtonGroup } from './components/filter-button-group.js';

class SomeCards extends React.Component {
  /**
   * constructor for CardBook
   * @param  {object} props [element properties/attributes passed in at initialization]
   */
  constructor(props) {
    super(props);
  }

  classFilters(activate,deactivate) {
    var filter = new Filter(cardData);
    var buttonOptions = {
      filterName : "class",
      filterFunc : filter.by.subProp("class").value, 
      onActivate : activate, 
      onDeactivate : deactivate
    }

    return  <div>
              <FilterButtonGroup cardData={cardData} buttonOptions={buttonOptions} filters={filterOptions.class} />
            </div>
  }

  levelFilters(activate,deactivate) {
    var filter = new Filter(cardData);
    var buttonOptions = {
      filterName : "level",
      filterFunc : filter.by.value, 
      onActivate : activate, 
      onDeactivate : deactivate
    }

    return  <div>
              <FilterButtonGroup cardData={cardData} buttonOptions={buttonOptions} filters={filterOptions.level} />
            </div>
  }
  
  /**
   * puts everything in the DOM
   */
	render() {
    return  <div className="container">
              <CardBook filters={[this.classFilters, this.levelFilters]}/>
      		  </div>;
	}
}

ReactDOM.render(<SomeCards />, document.querySelector('main'));
