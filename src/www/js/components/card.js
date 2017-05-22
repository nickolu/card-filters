var React = require('react');
var ReactDOM = require('react-dom');
import { ShowHideButton } from './show-hide-button.js';

export class Card extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.props.settings.parentState;
  };

  propertiesColumn(properties) {
    const cssClass = ''
    return <div className="col-xs-6">{properties.map(prop => <p key={prop.cssClass} className={'card-property '+prop.cssClass}><strong>{prop.label}</strong>{prop.value}</p>)}</div>
  }

  render() {
    return  <div>
              <h2 className="card_name">{this.props.settings.name}</h2>
              <span className="open-button"><ShowHideButton target={".row"+".card"} showText="+" hideText="-" /></span>
              <span className="closed-button"><ShowHideButton target={".row"+".card"} showText="+" hideText="-" startClosed="true"/></span>
              <div className={"row card-content " + "card"}>
                {this.propertiesColumn(this.props.settings.col1Props)}
                {this.propertiesColumn(this.props.settings.col2Props)}
                <div className="col-xs-12">
                  <hr />
                  <p className="card_description" dangerouslySetInnerHTML={ { __html: this.props.settings.description } }></p>
                </div>  
              </div>
            </div>
               
             
              
  }
}



