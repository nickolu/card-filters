var React = require('react');
var ReactDOM = require('react-dom');
var utilities = require("../../../node_modules/simple-react-utilities/js/utilities.js");

import config from '../json/config.json';
import cardData from '../json/cards.json';
import filterOptions from '../json/filter-configs.json';
import Filter from './filter.js';
import { ShowHideButton } from './components/show-hide-button.js';
import { SearchFilter } from './components/search-filter.js';
import { CardSizeButton } from './components/card-size-button.js';
import { Card } from './components/card.js';
import { FilterButton } from './components/filter-button.js';
import { FilterButtonGroup } from './components/filter-button-group.js';
import { FilterSet } from './components/filter-set.js';
import { SubmitButton } from '../../../node_modules/simple-react-forms/form-fields/submit-button.js';


export class CardBook extends React.Component {
  /**
   * constructor for CardBook
   * @param  {object} props [element properties/attributes passed in at initialization]
   */
  constructor(props) {
    super(props);

    var sortedCardData = utilities.sortObjectsByProp(cardData, "name");

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
    var cards = cardData;
    let filterArgs;

    for (let filter in filters) {
      filterArgs = filters[filter].filterArgs;
      
      if (filterArgs.length) {
        cards = filters[filter].filterFunc(filterArgs[0], cards); // run once to cut down to this filter

        for (let i = 1, l = filterArgs.length; i < l; i++) {
          cards = cards.concat(filters[filter].filterFunc(filterArgs[i],cardData)); // loop through cards to add back
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

    console.log(this.state.filters);
    // update
    this.executeFilters(this.state.filters);
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
  }

  
  resetState() {
    var sortedCardData = utilities.sortObjectsByProp(cardData, "name");

    this.setState({
      cards : sortedCardData,
      filters : []
    });
  }
  

  /**
   * this should be moved to the utilities project
   */
  getQueryVariable(variable) {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
  }

  /**
   * produces a filter with the search query string
   */
  getFiltersFromQueryString() {
    var filter = {};

    filter = {
      key:"name",
      type:"search",
      usePartialMatch:true,
      value:decodeURIComponent(this.getQueryVariable('search'))
    }

    return filter;
  }


  /**
   * renders the list of cards
   * TODO: move cards to its own component
   */
  renderCards() {
    var i = 0;
    var cardsArr = this.state.cards || [];
    var cards = <div className="row card-container">{cardsArr.map(card => <div className="card card-inner col-xs-12 col-sm-6 col-md-4" key={card.name}><Card settings={{
                        name : card.name,
                        description : card.description,
                        col1Props : [
                          {
                            cssClass : 'card_level',
                            label : 'Level',
                            value : card.level 
                          },
                          {
                            cssClass : 'card_casting_time',
                            label : 'Casting Time',
                            value : card.casting_time 
                          },
                          {
                            cssClass : 'card_duration',
                            label : 'Duration',
                            value : card.duration 
                          },
                          {
                            cssClass : 'card_range',
                            label : 'Range',
                            value : card.range 
                          },
                          {
                            cssClass : 'card_components',
                            label : 'Components',
                            value : card.components 
                          }
                        ],
                        col2Props : [
                          {
                            cssClass : 'card_concentration',
                            label : 'Concentration',
                            value : card.concentration 
                          },
                          {
                            cssClass : 'card_ritual',
                            label : 'Ritual',
                            value : card.ritual 
                          },
                          {
                            cssClass : 'card_page',
                            label : 'Page',
                            value : card.page 
                          },
                          {
                            cssClass : 'card_school',
                            label : 'School',
                            value : card.school 
                          },
                          {
                            cssClass : 'card_class',
                            label : 'Class',
                            value : getClassNames(card) 
                          }
                        ]
                     }} /></div>)}
              </div>;
    
    function getClassNames(cardObj) {
      var classes = cardObj.class;
      var classArray = [];

      for (var obj in classes) {
        classArray.push(obj);
      }

      return classArray.join(", ");
    }


    if (!this.state.cards || this.state.cards.length === 0) {
      cards = <div className="card-container col-xs-12 col-sm-6 col-md-4"><h4 className="no-cards">No cards matching the selected filters</h4></div>
    }

    return cards;
  }


  componentDidMount () {
    var _this = this;
    //window.getFilteredCards = this.getFilteredCards;

    function updatefromQuery() {
      var sortedCardData = utilities.sortObjectsByProp(cardData, "name");

      this.state = {
        cards : sortedCardData,
        sortCards : "name",
        descriptionSearch : false,
        filter : [this.getFiltersFromQueryString()]
      };
      this.setExclusiveFilters();
      this.setInclusiveFilters();
    }
    

    if (this.getQueryVariable('search')) {
      this.forceUpdate(updatefromQuery);  
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
                      return <div className="col-xs-12 col-sm-6" key={j-1}>{filterRender(this.addFilterToFilterGroup, this.removeFilterFromFilterGroup)}</div>;
                    })}
                  </div>
                  <div className="row">{this.renderCards()}</div>
                  

                </div>
              </div>
      		  </div>;
	}
}
