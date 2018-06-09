import React, { Component } from 'react';
import Balance from './Balance.js';
import TransactionList from './TransactionList.js';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: ""
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Enter an address to watch</h1>
          <input type="text" name="address" defaultValue="" />
        </header>
        <div>
          <Balance address={this.state.address} />
        </div>
        <div>
          <TransactionList address={this.state.address} />
        </div>
      </div>
    );
  }
}

export default App;
