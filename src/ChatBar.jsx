import React, {Component} from 'react';

class ChatBar extends Component{
  render(){
    return (
      <footer className="chatbar">
        <input className="chatbar-username" placeholder="Your Name (Optional)" defaultValue={this.props.currentUser.name} name="username"/>
        <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyPress={
          // Add event handler for username.
          (event) => {
            if(event.key === 'Enter'){
              this.props.addMessage({
                name: event.target.parentElement.childNodes[0].value,
                type: 'chat',
                content: event.target.value
              });
              event.target.value = '';
            }
          }
        }/>
      </footer>);
  }
}

export default ChatBar;