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
    this.startFilteringBy = this.startFilteringBy.bind(this);
    this.stopFilteringBy = this.stopFilteringBy.bind(this);
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

  startFilteringBy(filterName,filterObject) {
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
  }

  stopFilteringBy(filterName,filterObject) {
    let filters = this.state.filters;
    let i = 0;

    filters[filterName] = filters[filterName] || {};
    filters[filterName].filterArgs = filters[filterName].filterArgs || [];
    
    // remove the filter args 
    filters[filterName].filterArgs.forEach((filterArg) => {
      if (filterArg === filterObject.filterArgs) {
        filters[filterName].filterArgs.splice(i, 1);
      }
      i++;
    });
    
    // save 
    this.setState(Object.assign({}, this.state, {
      filters : filters[filterName]
    }));

    // update
    this.executeFilters(this.state.filters);
  }

  
  resetState() {
    var sortedCardData = utilities.sortObjectsByProp(this.props.cardData, "name");

    this.setState({
      cards : sortedCardData,
      filters : []
    });
  }

  componentDidMount() {
    let timeout;
    let _this = this;
    this.updateHeight();
    
    function throttled() {
      clearTimeout(timeout);
      timeout = setTimeout(_this.updateHeight, 0);
    }

    window.addEventListener("resize", throttled);
  }

  componentDidUpdate() {
    this.updateHeight();
  }

  updateHeight() {
    let cardContainer = document.querySelector('.card-container');
    cardContainer.style.height = 'auto';
    let currentHeight = cardContainer.offsetHeight;
    let denominator = 3;

    if (window.innerWidth < 992) {
      denominator = 2;
    } 

    let newHeight = Math.ceil(currentHeight/denominator) + 350;
    cardContainer.style.height = newHeight+'px';
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
                  <h1>{this.props.label} ({this.state.cards.length})</h1>
                  
                  {this.props.searchFilter(this.startFilteringBy, this.stopFilteringBy)}
                  <div className="row">
                    {this.props.filters.map((renderFilterButtons) => {
                      i++;
                      return <div className="col-xs-12 col-sm-4 filter-group filters-advanced" key={i-1}>{renderFilterButtons(this.startFilteringBy, this.stopFilteringBy)}</div>;
                    })}
                  </div>

                  <h2>Advanced Filters<span className="show-hide-advanced-filter"><ShowHideButton target={".advanced-filters"} showText="+" hideText="-" startClosed="true"/></span></h2>
                  <div className="row height-zero advanced-filters">
                    {this.props.advancedFilters.map((renderFilterButtons) => {
                      j++;
                      return <div className="col-xs-12 col-sm-4 filter-group filters-advanced" key={j-1}>{renderFilterButtons(this.startFilteringBy, this.stopFilteringBy)}</div>;
                    })}
                  </div>
                  <div className="row">
                    {this.props.renderCards(this.state.cards)}
                  </div>
                </div>
              </div>
            </div>;
  }
}
