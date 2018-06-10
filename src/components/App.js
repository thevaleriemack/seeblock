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
        // TODO: allow input only if we are connected
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
    this.subscribeToAddress(address);
  }

  subscribeToAddress = (address) => {
    this.setState({ address: address }, () => {
      // 13hQVEstgo4iPQZv9C7VELnLWF7UWtF4Q3
      let balanceURL = `https://blockchain.info/q/addressbalance/${address}`;
      let txsURL = `https://blockchain.info/multiaddr?active=${address}&n=2&cors=true`;
      this.fetchDataToState(balanceURL, 'balance');
      this.fetchDataToState(txsURL, 'txs');
      websocket.send(`{"op":"addr_sub", "addr":"${this.state.address}"}`);
      console.log(`Subscribed to ${this.state.address} ...`);
    });
  }

  fetchDataToState = (url, stateName) => {
    fetch(url)
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
        console.log(err);
        if (stateName === 'balance') {
          this.setState({ balance: "" })
        }
        if (stateName === 'txs') {
          this.setState({ txs: [] })
        }
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
