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

    const startData = this.props.startData || this.props.cardData;

    this.state = this.props.state || {
      cards : startData,
      savedCards : [],
      filters : this.props.startFilter
    };

    this.resetState = this.resetState.bind(this);
    this.executeFilters = this.executeFilters.bind(this);
    this.startFilteringBy = this.startFilteringBy.bind(this);
    this.stopFilteringBy = this.stopFilteringBy.bind(this);
    this.saveCard = this.saveCard.bind(this);
  }

  /**
   * loops through filters and reduces data to just the matching cards
   * @param  {array} filters
   *
      filters = {
        "class" : {
          "filterArgs" : [
            {"Bard" : "yes"},
            {"Cleric" : "yes"},
          ],
          "filterFunc" : filter.by.value
        },
        "level" : {
          "filterArgs" : [
            {"Level" : "1st"},
            {"Level" : "2nd"}
          ],
          "filterFunc" : filter.by.value
        }
      }
   */
  executeFilters(filters) {
    var _this = this;
    var cards = this.props.cardData;
    var allCards = cards;
    let filterArgs;
    
    for (let filter in filters) {
      filterArgs = filters[filter].filterArgs;
      
      if (filterArgs.length) {
        cards = filters[filter].filterFunc(filterArgs[0], cards); // run once to cut down to this filter

        for (let i = 1, l = filterArgs.length; i < l; i++) {
          cards = cards.concat(filters[filter].filterFunc(filterArgs[i],allCards)); // loop through cards to add back
        }
      }

      allCards = cards;
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
      if (filterArg === filterObject.filterArgs || 
        filterArg[0] === filterObject.filterArgs[0] && 
        filterArg[1] === filterObject.filterArgs[1]) {
        
        filters[filterName].filterArgs.splice(i, 1);
      }

      i++;
    });
    
    // save 
    this.setState(Object.assign({}, this.state, {
      filters : filters
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

  saveCard(card) {
    let savedCards = this.state.savedCards;
    savedCards.push(card);

    this.setState(Object.assign({}, this.state, {
      savedCards : savedCards,
    }));
  }

  clearSavedCards() {
    this.setState(Object.assign({}, this.state, {
      savedCards : [],
    }));
  }

  advancedFilters() {
    return <div><h2>Advanced Filters<span className="show-hide-advanced-filter"><ShowHideButton target={".advanced-filters"} showText="+" hideText="-" startClosed="true"/></span></h2>
            <div className="row height-zero advanced-filters">
              {this.props.advancedFilters.map((renderFilterButtons) => {
                j++;
                return <div className="col-xs-12 col-sm-6 filter-group filters-advanced" key={j-1}>{renderFilterButtons(this.startFilteringBy, this.stopFilteringBy)}</div>;
              })}
            </div>
          </div>
  }


  /**
   * puts everything in the DOM
   */
  render() {
    const _this = this;
    let i = 0;
    let j = 0;

    function savedCardsLength() {
      
      let cardsLength = 0;


      return _this.state.savedCards && _this.state.savedCards.length ? _this.state.savedCards.length : 0;
    }

    return  <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <h1>{this.props.label} ({this.state.cards.length})</h1>
                  
                  {this.props.searchFilter(this.startFilteringBy, this.stopFilteringBy)}
                  {this.props.navigation(this.startFilteringBy, this.stopFilteringBy)}
                  <h2>Filters<span className="show-hide-advanced-filter"><ShowHideButton target={".basic-filters"} showText="+" hideText="-" startClosed="falses"/></span></h2>
                  

                  <div className="row basic-filters">
                    
                    {this.props.filters.map((renderFilterButtons) => {
                      i++;
                      return <div className="col-xs-12 col-sm-6 filter-group filters-advanced" key={i-1}>{renderFilterButtons(this.startFilteringBy, this.stopFilteringBy)}</div>;
                    })}
                  </div>                  

                  <h2>Saved Cards ({savedCardsLength()})<span className="show-hide-advanced-filter"><ShowHideButton target={".saved-cards"} showText="+" hideText="-" startClosed="true"/></span></h2>
                  <div className="height-zero saved-cards">
                    {this.props.renderCards(this.state.savedCards, this.saveCard)}
                  </div>
                  
                  <h2>Search Results ({this.state.cards.length})<span className="show-hide-advanced-filter"><ShowHideButton target={".filtered-cards"} showText="+" hideText="-" startClosed="false"/></span></h2>
                  <div className="filtered-cards">
                    {this.props.renderCards(this.state.cards, this.saveCard)}
                  </div>
                  
                </div>
              </div>
            </div>;
  }
}
