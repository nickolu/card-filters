const React = require('react');
const ReactDOM = require('react-dom');
const utilities = require("../../../node_modules/simple-react-utilities/js/utilities.js");

import Filter from './filter.js';
import { Card } from './components/card.js';
import { CardGroup } from './components/card-group.js';
import { ShowHideButton } from './components/show-hide-button.js';

export class CardBook extends React.Component {
  /**
   * constructor for CardBook
   * @param  {object} props [element properties/attributes passed in at initialization]
   */
  constructor(props) {
    super(props);

    var sortedCardData = utilities.sortObjectsByProp(this.props.cardData, "name");

    this.state = {
      cards : sortedCardData,
      filters : []
    };

    this.resetState = this.resetState.bind(this);
    this.executeFilters = this.executeFilters.bind(this);
    this.addFilterToFilterGroup = this.addFilterToFilterGroup.bind(this);
    this.removeFilterFromFilterGroup = this.removeFilterFromFilterGroup.bind(this);
  }

  executeFilters(filters) {
    var _this = this;
    var cards = this.props.cardData;
    let filterArgs;

    for (let filter in filters) {
      filterArgs = filters[filter].filterArgs;
      
      if (filterArgs.length) {
        cards = filters[filter].filterFunc(filterArgs[0], cards); // run once to cut down to this filter

        for (let i = 1, l = filterArgs.length; i < l; i++) {
          cards = cards.concat(filters[filter].filterFunc(filterArgs[i],this.props.cardData)); // loop through cards to add back
        }  
      }
    }

    cards = utilities.sortObjectsByProp(cards, "name");
    cards = utilities.arrayUnique(cards);

    if (!Array.isArray(cards)) {
      cards = [];
    }
  
    this.setState({
      cards : cards,
      filters : this.state.filters
    });
  }

  addFilterToFilterGroup(filterName,filterObject) {
    let filters = this.state.filters;
    filters[filterName] = filters[filterName] || {};
    filters[filterName].filterArgs = filters[filterName].filterArgs || [];
    
    // add the filter args and update the filter function 
    filters[filterName].filterArgs.push(filterObject.filterArgs);
    filters[filterName].filterFunc = filterObject.filterFunc;

    // TODO: workaround for search filter
    if (filterName === 'search') {

      filters[filterName].filterArgs = [filterObject.filterArgs];
    }

    // save 
    this.setState({
      cards : [],
      filters : filters[filterName]
    });

    // update
    this.executeFilters(this.state.filters);
    this.updateHeight();
  }

  removeFilterFromFilterGroup(filterName,filter) {
    var filterArgsList;
    var removeIndex;

    if (this.state.filters[filterName]) {
      filterArgsList = this.state.filters[filterName].filterArgs;
      removeIndex = filterArgsList.indexOf(filter);

      filterArgsList.splice(removeIndex, 1);  
    }

    this.setState({
      cards : this.state.cards,
      filters : Object.assign({},this.state.filters[filterName], filterArgsList)
    });


    this.executeFilters(this.state.filters);
    this.updateHeight();
  }

  
  resetState() {
    var sortedCardData = utilities.sortObjectsByProp(this.props.cardData, "name");

    this.setState({
      cards : sortedCardData,
      filters : []
    });
  }

  componentDidMount() {
    this.updateHeight();
  }

  updateHeight() {
    if (document.querySelector('.card-container')) {
      document.querySelector('.card-container').style.height = 'auto';
      let currentHeight = document.querySelector('.card-container').offsetHeight;
      let newHeight = Math.ceil(currentHeight/3) + 800;
      document.querySelector('.card-container').style.height = newHeight+'px';
      
      console.log(currentHeight);
      console.log(newHeight);
      
    }
  }

  /**
   * puts everything in the DOM
   */
  render() {
    let i = 0;
    let j = 0;

    
    
    return  <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <h1>Cards ({this.state.cards.length})</h1>
                  
                  {this.props.searchFilter(this.addFilterToFilterGroup, this.removeFilterFromFilterGroup)}
                  <div className="row">
                    {this.props.filters.map((filterRender) => {
                      i++;
                      return <div className="col-xs-12 col-sm-6" key={i-1}>{filterRender(this.addFilterToFilterGroup, this.removeFilterFromFilterGroup)}</div>;
                    })}
                  </div>

                  <h2>Advanced Filters<span className="show-hide-advanced-filter"><ShowHideButton target={".advanced-filters"} showText="+" hideText="-" startClosed="true"/></span></h2>
                  <div className="row height-zero advanced-filters">
                    {this.props.advancedFilters.map((filterRender) => {
                      j++;
                      return <div className="col-xs-12 col-sm-4 col- filter-group filters-advanced" key={j-1}>{filterRender(this.addFilterToFilterGroup, this.removeFilterFromFilterGroup)}</div>;
                    })}
                  </div>
                  <div className="row">
                    <CardGroup cards={this.state.cards} />
                  </div>
                </div>
              </div>
            </div>;
  }
}
