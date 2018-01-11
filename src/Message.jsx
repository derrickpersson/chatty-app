import React, {Component} from 'react';

class Message extends Component{
  render(){
    const detectImage = function(url){
      let re = /.png$|.jpg$|.gif$/;
      return re.test(url);
    }

    if(this.props.type === 'incomingMessage'){
      let contentArray = this.props.content.split(' ');
      let lastItem = contentArray[contentArray.length - 1];
      let otherItems = contentArray.slice(0, (contentArray.length - 1)).join(' ');

      if(detectImage(lastItem)){
        return (
          <div className="message">
            <span key={this.props.id} className={"message-username " + this.props.color}>{this.props.username}</span>
            <div className="message-content">{otherItems && (<div>{otherItems}</div>)}<img className="images" src={lastItem} /></div>
          </div>)
      }
      return (
        <div className="message" key={this.props.id}>
          <span className={"message-username " + this.props.color}>{this.props.username}</span>
          <span className="message-content">{this.props.content}</span>
        </div>)
    }else{
      return (
        <div key={this.props.id} className="message system">
          {this.props.content}
        </div>)
    }
  }
}

export default Message;