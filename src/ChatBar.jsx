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
          name="username"
          onChange={
            (event) => {
              this.setState({username: event.target.value })
            }
          }
        />
        <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyPress={
          // Add event handler for username.
          (event) => {
            if(event.key === 'Enter'){
              // if (event.target.value) {
                this.props.addMessage({
                  name: this.state.username,
                  content: event.target.value
                });
                event.target.value = '';
              // } else {
              //   alert('Please enter a proper message');
              // }
            }
          }
        }/>
      </footer>);
  }
}

export default ChatBar;

/*          onKeyPress={
            (event) => {
              if(event.key === 'Enter'){
                this.props.changeUser({
                  name: this.state.username
                })
              }
            }
          }*/

          //             if(event.key === 'Enter' && this.state.username !== this.props.currentUser.name){
          //     this.props.addSystemMessage({
          //       type: 'postNotification',
          //       name: this.state.username
          //     })
          //   }
          // }