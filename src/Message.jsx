import React, {Component} from 'react';

class Message extends Component{
  render(){
    const detectImage = function(url){
      let re = /.*?.png$ || .*?.jpg$ || .*?.gif$/;
      return re.test(url);
    }

    if(this.props.type === 'incomingMessage'){
      if(detectImage(this.props.content)){
        return (
          <div>
            <span className={"message-username " + this.props.color}>{this.props.username}</span>
            <img className="images" src={this.props.content} />
          </div>)
      }
      return (
        <div className="message" key={this.props.id}>
          <span className={"message-username " + this.props.color}>{this.props.username}</span>
          <span className="message-content">{this.props.content}</span>
        </div>)
    }else{
      return (
        <div className="message system">
          {this.props.content}
        </div>)
    }
  }
}

export default Message;