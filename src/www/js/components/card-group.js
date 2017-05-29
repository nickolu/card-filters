var React = require('react');
var ReactDOM = require('react-dom');
import { Card } from './card.js';

export class CardGroup extends React.Component {
  constructor(props) {
    super(props);
  };

  render() {
    var i = 0;
    var cardsArr = this.props.cards || [];
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


    if (!this.props.cards || this.props.cards.length === 0) {
      cards = <div className="card-container col-xs-12"><h4 className="no-cards">No cards matching the selected filters</h4></div>
    }

    return cards;
  }
}





