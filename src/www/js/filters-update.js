var React = require('react');
var ReactDOM = require('react-dom');
var utilities = require("../../../node_modules/simple-react-utilities/js/utilities.js");

import config from '../json/config.json';
import spellData from '../json/spells.json';
import Filter from './filter.js';
import { ShowHideButton } from './components/show-hide-button.js';
import { SearchFilter } from './components/search-filter.js';
import { CardSizeButton } from './components/card-size-button.js';
import { FilterButton } from './components/filter-button.js';
import { FilterButtonGroup } from './components/filter-button-group.js';
import { FilterSet } from './components/filter-set.js';
import { SubmitButton } from '../../../node_modules/simple-react-forms/form-fields/submit-button.js';



//TODO: when making multiple selections in school or level, should add to total cards
//TODO: add spell sorting to the UI

class SpellBook extends React.Component {
  /**
   * constructor for SpellBook
   * @param  {object} props [element properties/attributes passed in at initialization]
   */
  constructor(props) {
    super(props);

    var sortedSpellData = utilities.sortObjectsByProp(spellData, "name");

    this.state = {
      spells : sortedSpellData,
      filters : []
    };

    this.addFilteredToState = this.addFilteredToState.bind(this);
    this.resetState = this.resetState.bind(this);
    this.removeFilteredFromState = this.removeFilteredFromState.bind(this);
  }

  
  classFilters() {
    var filter = new Filter(utilities.sortObjectsByProp(spellData, "name"));

    return  <div>
              <FilterButton 
                label="Bard" 
                filter={filter.by.subProp("class").value("Bard", "yes")} 
                onActivate={this.addFilteredToState}
                onDisable={this.removeFilteredFromState}
              />
              <FilterButton 
                label="Cleric" 
                filter={filter.by.subProp("class").value("Cleric", "yes")} 
                onActivate={this.addFilteredToState}
                onDisable={this.removeFilteredFromState}
              />
              <FilterButton 
                label="Druid" 
                filter={filter.by.subProp("class").value("Druid", "yes")} 
                onActivate={this.addFilteredToState}
                onDisable={this.removeFilteredFromState}
              />
              <FilterButton 
                label="Paladin" 
                filter={filter.by.subProp("class").value("Paladin", "yes")} 
                onActivate={this.addFilteredToState}
                onDisable={this.removeFilteredFromState}
              />
              <FilterButton 
                label="Ranger" 
                filter={filter.by.subProp("class").value("Ranger", "yes")} 
                onActivate={this.addFilteredToState}
                onDisable={this.removeFilteredFromState}
              />
              <FilterButton 
                label="Sorcerer" 
                filter={filter.by.subProp("class").value("Sorcerer", "yes")} 
                onActivate={this.addFilteredToState}
                onDisable={this.removeFilteredFromState}
              />
              <FilterButton 
                label="Warlock" 
                filter={filter.by.subProp("class").value("Warlock", "yes")} 
                onActivate={this.addFilteredToState}
                onDisable={this.removeFilteredFromState}
              />
              <FilterButton 
                label="Wizard" 
                filter={filter.by.subProp("class").value("Wizard", "yes")} 
                onActivate={this.addFilteredToState}
                onDisable={this.removeFilteredFromState}
              />
            </div>
  }


  addFilteredToState(filtered) {
    var uniqueFiltered;

    if (this.state.spells.length === spellData.length) {
      uniqueFiltered = utilities.arrayUnique(filtered);
    } else {
      uniqueFiltered = utilities.arrayUnique(this.state.spells.concat(filtered));
    }

    this.setState({
      spells : utilities.sortObjectsByProp(uniqueFiltered, "name")
    });
  }

  removeFilteredFromState(filtered) {
    var toRemove = filtered;
    var newState = this.state.spells.filter(function(el){
      return toRemove.indexOf(el) === -1;
    });

    if (newState.length > 0) {
      this.setState({
        spells : utilities.sortObjectsByProp(newState, "name")
      });  
    } else {
      this.resetState();
    }
    


  }

  resetState() {
    debugger;
    var sortedSpellData = spellData;

    this.setState({
      spells : sortedSpellData,
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
   * renders the list of spells
   */
  renderSpells() {
    var i = 0;
    var spells = <div className="spell-card-container row">{this.state.spells.map(spell => <div key={spell.name} className="spell-card col-xs-12 col-sm-6 col-md-4"> 
                     <div className="spell-card-inner">
                        <h2 className="spell_name">{spell.name}</h2>
                        <span className="open-button"><ShowHideButton target={".row"+".spell"+i} showText="+" hideText="-" /></span>
                        <span className="closed-button"><ShowHideButton target={".row"+".spell"+i} showText="+" hideText="-" startClosed="true"/></span>
                        <div className={"row spell-card-content " + "spell"+i++}>
                          <div className="col-xs-6">
                            <p className="spell-card-property spell_level"><strong>Level:</strong> {spell.level}</p>
                            <p className="spell-card-property spell_casting_time"><strong>Casting Time:</strong> {spell.casting_time}</p>
                            <p className="spell-card-property spell_duration"><strong>Duration:</strong> {spell.duration}</p>
                            <p className="spell-card-property spell_range"><strong>Range:</strong> {spell.range}</p>
                            <p className="spell-card-property spell_components"><strong>Components:</strong> {spell.components}</p>
                          </div>
                          <div className="col-xs-6">
                            <p className="spell-card-property spell_concentration"><strong>Concentration:</strong> {spell.concentration}</p>
                            <p className="spell-card-property spell_ritual"><strong>Ritual:</strong> {spell.ritual}</p>
                            <p className="spell-card-property spell_page"><strong>Page:</strong> {spell.page}</p>
                            <p className="spell-card-property spell_school"><strong>School:</strong> {spell.school}</p>
                            <p className="spell-card-property spell_class"><strong>Class:</strong> {getClassNames(spell)}</p>
                          </div>
                          <div className="col-xs-12">
                            <hr />
                            <p className="spell_description" dangerouslySetInnerHTML={ { __html: spell.description } }></p>
                          </div>  
                        </div>
                      </div>
                   </div>
              )}</div>;

    function getClassNames(spellObj) {
      var classes = spellObj.class;
      var classArray = [];

      for (var obj in classes) {
        classArray.push(obj);
      }

      return classArray.join(", ");
    }


    if (this.state.spells.length === 0) {
      spells = <div className="spell-card-container"><h4 className="no-spells">No spells matching the selected filters</h4></div>
    }

    return spells;
  }


  componentDidMount () {
    var _this = this;
    //window.getFilteredSpells = this.getFilteredSpells;

    function updatefromQuery() {
      var sortedSpellData = utilities.sortObjectsByProp(spellData, "name");

      this.state = {
        spells : sortedSpellData,
        sortSpells : "name",
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
    var filterOptions = config;

    return  <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <h2>Spells ({this.state.spells.length})</h2>
                  <div>{this.classFilters()}</div>
                  
                  {this.renderSpells()}

                </div>
              </div>
      		  </div>;
	}
}

ReactDOM.render(<SpellBook/>, document.querySelector('main'));
