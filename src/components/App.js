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
      balance: "",
      updateReceived: false
    }
  }

  componentDidMount() {
    // TODO: don't allow typing until connection is open
    this.openWebSocket();
  }

  openWebSocket = () => {
    websocket.onopen = (event) => {
      if (event.target.readyState === 1) {
        console.log('Connection open ...');
        websocket.send('{"op":"ping"}');
      }
    }
    websocket.onmessage = (event) => {
      console.log(event);
      this.setState({
        updateReceived: true
      });
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
    this.getBalance(address);
    this.setState({ address: address }, () => {
      // 13hQVEstgo4iPQZv9C7VELnLWF7UWtF4Q3
      websocket.send(`{"op":"addr_sub", "addr":"${this.state.address}"}`);
      console.log(`Subscribed to ${this.state.address} ...`);
    });
  }

  getBalance = (address) => {
    console.log('get balance called');
    // TODO: fix app to check address on keyup
    // TODO: if address is not valid, balance should be blank
    if (address) {
      let apiURI = `https://blockchain.info/q/addressbalance/${address}`;
      fetch(apiURI)
      .then(res => res.json())
      .then(
        (data) => {
          this.setState({
            balance: data
          });
        }, (err) => {
          console.log(err);
        }
      );
    }
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
          <Balance balance={this.state.balance} />
        </div>
        <div>
          <TransactionList address={this.state.address} />
        </div>
      </div>
    );
  }
}

export default App;
