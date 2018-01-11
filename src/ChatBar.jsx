import React, {Component} from 'react';

class ChatBar extends Component{
  constructor(props){
    super(props);
    this.state = {
      username: this.props.currentUser.name,
      content: ''
    }
  }
  render(){
    return (
      <footer className="chatbar">
        <input
          className="chatbar-username"
          placeholder="Your Name (Optional)"
          value={this.state.username}
          onChange={
            (event) => {
              this.setState({
                username: event.target.value
              })
            }
          }
        />
        <input
          className="chatbar-message"
          placeholder="Type a message and hit ENTER"
          value={this.state.content}
          onChange={
            (event) => {
              this.setState({
                content: event.target.value
              })
            }
          }
            onKeyPress={
            (event) => {
              if(event.key === 'Enter'){
                  this.props.addMessage({
                    name: this.state.username,
                    content: event.target.value,
                    color: this.props.currentUser.color
                  });
                  this.setState({content: ''});
              }
            }
        }/>
      </footer>);
  }
}

export default ChatBar;