import React, { Component } from 'react';
import Balance from './Balance.js';
import TransactionList from './TransactionList.js';
import './App.css';

const websocket = new WebSocket("wss://ws.blockchain.info/inv");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      data: null
    }
  }

  componentDidMount() {
    this.openWebSocket();
  }

  openWebSocket = () => {
    websocket.onopen = (event) => {
      if (event.target.readyState === 1) {
        console.log('Connection open...');
        websocket.send('{"op":"ping"}');
      }
    }
    websocket.onmessage = (event) => {
      console.log(event);
    }
    websocket.onclose = (event) => {
      console.log('Disconnected.');
    }
    websocket.onerror = (event) => {
      console.log('Error:', event.data);
    }
  }

  handleAddressLookup = (event) => {
    let address = event.target.value;
    // TODO: validation after user has stopped typing
    this.setState({ address: address }, () => {
      console.log(this.state.address);
      websocket.send(`{"op":"addr_sub", "addr":${this.state.address}`);
    });
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
