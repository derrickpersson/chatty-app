import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
        currentUser: {name: "Anonymous"},
        messages: [],
        currentUsers : 0
    }
  }

  componentDidMount() {
    this.ws = new WebSocket('ws://localhost:3001');

    this.ws.onmessage = (event) => {
      // JSON parse & stringify must be wrapped in Try and Catch
      const newMessage = JSON.parse(event.data);
      switch (newMessage.type){
        case "connectedUsers":
          this.setState({currentUsers : newMessage.size});
          break;
        case "incomingConnection":
          const newNotification = {
            content: `A user has ${(newMessage.connected && 'joined') || 'left'} chatty.`,
            type: 'incomingNotification',
            id: newMessage.id
          }
          this.setState({messages: this.state.messages.concat(newNotification)});
          break;
        case "incomingMessage":
        case "incomingNotification":
          this.setState({ messages: this.state.messages.concat(newMessage)});
          break;
        default:
          console.log("Unexpected message type: ", newMessage);
      }
    };
  }

  addMessage(input){
    if(this.state.currentUser.name !== input.name){
      const notificationMessage = {
        type: 'postNotification',
        content: `${this.state.currentUser.name || 'Anonymous'} changed their username to ${input.name || 'Anonymous'}`
      };
      this.ws.send(JSON.stringify(notificationMessage));
    }
    if(input.content) {
      const message = {
        username: input.name || 'Anonymous',
        type: 'postMessage',
        content: input.content
      };
      this.ws.send(JSON.stringify(message));
    }
    this.setState({currentUser: {
      name: input.name
      }});
    };

  render() {
    return (
      <div>
        <nav className="navbar">
        <a href="/" className="navbar-brand">Chatty</a>
          <p className="navbar-users"> {this.state.currentUsers} {this.state.currentUsers === 1 ? 'users' : 'user'}  online</p>
        </nav>
        <MessageList messages={this.state.messages} />
        <ChatBar currentUser={this.state.currentUser} addMessage={this.addMessage.bind(this)} />
      </div>
    );
  }
}
export default App;
