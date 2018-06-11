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
      txs: [],
    }
  }

  componentDidMount() {
    this.openWebSocket();
  }

  openWebSocket = () => {
    websocket.onopen = (event) => {
      if (event.target.readyState === 1) {
        this.setState({
          connected: true
        });
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
    this.subscribeToAddress(address);
  }

  subscribeToAddress = (address) => {
    this.setState({ address: address }, () => {
      // 13hQVEstgo4iPQZv9C7VELnLWF7UWtF4Q3
      let cleanedAddress = address.trim();
      if (cleanedAddress === '') {
        console.error(
          'Input must not be blank');
        return;
      }
      let balanceURL = `https://blockchain.info/q/addressbalance/${cleanedAddress}`;
      let txsURL = `https://blockchain.info/multiaddr?active=${cleanedAddress}&cors=true`;
      if (
        this.fetchDataToState(balanceURL, 'balance')
        && this.fetchDataToState(txsURL, 'txs')
      ) {
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

  fetchDataToState = (url, stateName) => {
    fetch(url)
      .then(this.handleErrors)
      .then(res => res.json())
      .then(data => {
        if (stateName === 'balance') {
          this.setState({ balance: data })
        }
        if (stateName === 'txs') {
          this.setState({ txs: data.txs })
        }
      })
      .catch(err => {
        console.error(err);
        if (stateName === 'balance') {
          this.setState({ balance: "" })
        }
        if (stateName === 'txs') {
          this.setState({ txs: [] })
        }
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
          <TransactionList address={this.state.address} txs={this.state.txs} />
        </div>
      </div>
    );
  }
}

export default App;
