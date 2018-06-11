import React, { Component } from 'react';
import Balance from './Balance.js';
import TransactionList from './TransactionList.js';
import './App.css';

const websocket = new WebSocket("wss://ws.blockchain.info/inv");

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
      // TODO: re-render children
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
    this.subscribeToAddress(address);
  }

  subscribeToAddress = (address) => {
    this.setState({ address: address }, () => {
      // 13hQVEstgo4iPQZv9C7VELnLWF7UWtF4Q3
      let cleanedAddress = address.trim();
      if (cleanedAddress === '') {
        this.setState({ balance: "" });
        this.setState({ txData: {} });
        console.error('Input must not be blank');
        return;
      }
      let balanceURL = `https://blockchain.info/q/addressbalance/${cleanedAddress}`;
      let txsURL = `https://blockchain.info/multiaddr?active=${cleanedAddress}&cors=true`;

      this.fetchData(balanceURL).then(out => this.setState({balance: out}));
      this.fetchData(txsURL).then(out => this.setState({txData: out}));

      if (this.state.balance) {
        websocket.send(`{"op":"addr_sub", "addr":"${cleanedAddress}"}`);
        console.log(`Subscribed to ${cleanedAddress} ...`);
      }
    });
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
        null
      });
  }

  render() {
    const connected = this.state.connected;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Enter an address to watch</h1>
          { connected ? (
            <input
              type="text"
              name="address"
              value={this.state.address}
              onChange={this.handleAddressLookup}/>
            ) : (
              'Loading...'
            )}
        </header>
        <div>
          <Balance address={this.state.address} balance={this.state.balance} />
        </div>
        <div>
          <TransactionList address={this.state.address} txData={this.state.txData} />
        </div>
      </div>
    );
  }
}

export default App;
