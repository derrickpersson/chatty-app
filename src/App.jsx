import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
        currentUser: {name: "Anonymous"},
        messages: [
          // {
          //   id: '1',
          //   type: 'chat',
          //   username: "Anonymous1",
          //   content: "I won't be impressed with technology until I can download food."
          // },
          // {
          //   id: '2',
          //   type: 'chat',
          //   username: "Anonymous2",
          //   content: "I won't be impressed with technology until I can download food."
          // },
          // {
          //   id: '3',
          //   type: 'system',
          //   content: "Anonymous changed their name to nomnom"
          // }
        ],
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
        console.log(newMessage);
        this.setState({currentUsers : newMessage.size });
      }else if(newMessage.type === "incomingConnection"){
        const newNotification = {
          content: `A user has ${(newMessage.connected && 'joined') || 'left'} chatty.`,
          type: 'incomingNotification',
        }
        this.setState({messages: this.state.messages.concat(newNotification)})
      }else{
        this.setState({ messages: this.state.messages.concat(newMessage)});
      }
    };
    // setTimeout(() => {
    //   console.log("Simulating incoming message");
    //   // Add a new message to the list of messages in the data store
    //   const newMessage = {id: "4", username: "Michelle",type: 'chat', content: "Hello there!"};
    //   const messages = this.state.messages.concat(newMessage)
    //   // Update the state of the app component.
    //   // Calling setState will trigger a call to render() in App and all child components.
    //   this.setState({messages: messages})
    // }, 3000);
  }

  addMessage(input){
    let messageQueue = [];
    if(this.state.currentUser.name !== input.name){
      messageQueue = messageQueue.concat({
        type: 'postNotification',
        content: `${this.state.currentUser.name || 'Anonymous'} changed their username to ${input.name || 'Anonymous'}`
      });
    }
    if (input.content) {
      messageQueue = messageQueue.concat({
        username: input.name || 'Anonymous',
        type: 'postMessage',
        content: input.content
      });
    }
    this.setState({currentUser: { name: input.name }});
    messageQueue.forEach((message) => {
      this.ws.send(JSON.stringify(message));
    });
    // this.setState({messages: this.state.messages.concat(newMessage)});
  }

  // addSystemMessage(input){
  //   const content = `${this.state.currentUser} changed their username to ${input.name || 'Anonymous'}`;
  //   const newMessage = {
  //     type: 'postNotification',
  //     content: content
  //   }
  //   this.setState({currentUser: input.name});
  //   this.ws.send(JSON.stringify(newMessage));
  //   // this.setState({messages: this.state.messages.concat(newMessage)});
  // }

  // changeUser(input){
  //   this.setState({ currentUser: input});
  // }

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
