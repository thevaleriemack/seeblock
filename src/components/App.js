import React, { Component } from 'react';
import Balance from './Balance.js';
import TransactionList from './TransactionList.js';
import './App.css';

const websocket = new WebSocket("wss://ws.blockchain.info/inv");
let timeout = null;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      address: "",
      balance: "",
      txData: {},
    }
  }

  componentDidMount() {
    this.openWebSocket();
  }

  openWebSocket = () => {
    websocket.onopen = (event) => {
      if (event.target.readyState === 1) {
        this.setState({ connected: true });
      }
    }
    websocket.onmessage = (event) => {
      console.log(event);
      this.forceUpdate();
    }
    websocket.onclose = (event) => {
      console.log('Disconnected.');
    }
    websocket.onerror = (event) => {
      console.log('Error:', event.data);
    }
  }

  handleAddressLookup = (event) => {
    // TODO: if connection is closed, try to reconnect
    clearTimeout(timeout);
    let prevAddress = this.state.address.trim();
    this.unsubscribeFromAddress(prevAddress);
    let tempAddress = event.target.value;
    this.setState({ address: tempAddress });
    timeout = setTimeout(() => {
      let currAddress = this.state.address.trim();
      this.subscribeToAddress(currAddress);
    }, 300);
  }

  unsubscribeFromAddress = (address) => {
    let cleanedAddress = address.trim();
    websocket.send(`{"op":"addr_unsub", "addr":"${cleanedAddress}"}`);
    console.log(`Unsubscribed from ${cleanedAddress}`);
  }

  subscribeToAddress = (address) => {
    if (address === '') {
      this.setState({ balance: "" });
      this.setState({ txData: {} });
      console.error('Input must not be blank');
      return;
    }

    let balanceURL = `https://blockchain.info/q/addressbalance/${address}`;
    let txsURL = `https://blockchain.info/multiaddr?active=${address}&cors=true`;

    this.fetchData(balanceURL).then(out => {
      this.setState({balance: out});
      if (this.state.balance) {
        websocket.send(`{"op":"addr_sub", "addr":"${address}"}`);
        console.log(`Subscribed to ${address}`);
      }
    });
    this.fetchData(txsURL).then(out => this.setState({txData: out}));
  }

  handleErrors = (res) => {
    if (res.status !== 200) {
      throw Error(res);
    } else {
      return res;
    }
  }

  fetchData = (url) => {
    return fetch(url)
      .then(this.handleErrors)
      .then(res => res.json())
      .then(data => {
        return data;
      })
      .catch(err => {
        // pass
      });
  }

  render() {
    const connected = this.state.connected;
    return (
      <div className="App">
        <header className="App-header">
          <h1>Seeblock</h1>
          <div className="App-address">
          { connected ? (
            <input
              className="addressInput"
              type="text"
              name="address"
              placeholder='Enter a Bitcoin address to watch'
              value={this.state.address}
              onChange={this.handleAddressLookup}
              onKeyDown={this.handleInput}/>
            ) : (
              'Loading...'
            )}
          </div>
          <Balance address={this.state.address} balance={this.state.balance} />
        </header>
        <div>
          <TransactionList address={this.state.address} txData={this.state.txData} />
        </div>
      </div>
    );
  }
}

export default App;
