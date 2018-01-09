import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
        currentUser: {name: "Derrick"},
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
        ]
    }
  }

  componentDidMount() {
    this.ws = new WebSocket('ws://localhost:3001');
    console.log('Connected to server');
    console.log("componentDidMount <App />");
    this.ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      this.setState({ messages: this.state.messages.concat(newMessage)});
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
    const newMessage = {
      username: input.name,
      type: 'chat',
      content: input.content
    }
    this.ws.send(JSON.stringify(newMessage));
    // this.setState({messages: this.state.messages.concat(newMessage)});
  }

  render() {
    return (
      <div>
        <nav className="navbar">
        <a href="/" className="navbar-brand">Chatty</a>
        </nav>
        <MessageList messages={this.state.messages} />
        <ChatBar currentUser={this.state.currentUser} addMessage={this.addMessage.bind(this)}/>
      </div>
    );
  }
}
export default App;
