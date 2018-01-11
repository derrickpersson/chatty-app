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
    this.ws.onopen = (event) => {
      const openConnection = {
        type: "postConnection",
        connected: true
      }
      this.ws.send(JSON.stringify(openConnection));
    }

    this.ws.onclose = (event) => {
      const closeConnection = {
        type: "postConnection",
        connected: false
      }
      this.ws.send(JSON.stringify(closeConnection));
    }

    console.log('Connected to server');
    console.log("componentDidMount <App />");
    this.ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      if(newMessage.type === "connectedUsers"){
        this.setState({currentUsers : newMessage.size });
      }else if(newMessage.type === "incomingConnection"){
        const newNotification = {
          content: `A user has ${(newMessage.connected && 'joined') || 'left'} chatty.`,
          type: 'incomingNotification',
          id: newMessage.id
        }
        this.setState({messages: this.state.messages.concat(newNotification)})
      }else if(newMessage.type === "color"){
        const newUserState = {
          name: this.state.currentUser.name,
          color: newMessage.color
        }
        this.setState({currentUser: newUserState})
      }else{
        this.setState({ messages: this.state.messages.concat(newMessage)});
      }
    };
  }

  addMessage(input){
    let messageQueue = [];
    if(this.state.currentUser.name !== input.name){
      messageQueue = messageQueue.concat({
        type: 'postNotification',
        content: `${this.state.currentUser.name || 'Anonymous'} changed their username to ${input.name || 'Anonymous'}`
      });
    }
    if(input.content) {
      messageQueue = messageQueue.concat({
        username: input.name || 'Anonymous',
        type: 'postMessage',
        content: input.content,
        color: input.color
      });
    }
    this.setState({currentUser: {
      name: input.name,
      color: input.color
      }});
    messageQueue.forEach((message) => {
      this.ws.send(JSON.stringify(message));
    });
  }

  render() {
    return (
      <div>
        <nav className="navbar">
        <a href="/" className="navbar-brand">Chatty</a>
          <p className="navbar-users"> {this.state.currentUsers} {this.state.currentUsers > 1 ? 'users' : 'user'}  online</p>
        </nav>
        <MessageList messages={this.state.messages} />
        <ChatBar currentUser={this.state.currentUser} addMessage={this.addMessage.bind(this)} />
      </div>
    );
  }
}
export default App;
