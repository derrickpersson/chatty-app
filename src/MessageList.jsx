import React, {Component} from 'react';
import Message from './Message.jsx';

class MessageList extends Component{

  render(){
    return (
      <main className="messages">
        {this.props.messages.map((message) => {
          const {id, username, content, type, color } = message;
          return (
            <Message
            key={id}
            username={username}
            content={content}
            type={type}
            color={color}/>
            )
        })}

      </main>)
  }
}

export default MessageList;