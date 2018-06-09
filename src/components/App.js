import React, { Component } from 'react';
import Balance from './Balance.js';
import TransactionList from './TransactionList.js';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      data: null
    }
  }

  componentDidMount() {
    this.openWebSocket("wss://ws.blockchain.info/inv");
  }

  handleAddressLookup = (event) => {
    // TODO: send the value to webhook and get response data
    let address = event.target.value;
    this.setState({ address: address }, () => {
      console.log(this.state.address);
    });
  }

  openWebSocket = (wsURI) => {
    const websocket = new WebSocket(wsURI);
    websocket.onopen = (event) => {
      websocket.send({"op":"ping"});
      if (event.target.readyState === 1) {
        console.log('Connection open...')
      };
     };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Enter an address to watch</h1>
          <input
            type="text"
            name="address"
            value={this.state.address}
            onChange={this.handleAddressLookup}/>
        </header>
        <div>
          <Balance data={this.state.data} />
        </div>
        <div>
          <TransactionList data={this.state.data} />
        </div>
      </div>
    );
  }
}

export default App;
