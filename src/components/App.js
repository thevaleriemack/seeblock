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

  handleAddressLookup = (event) => {
    // TODO: send the value to webhook and get response data
    this.setState({ address: event.target.value });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Enter an address to watch</h1>
          <input
            type="text"
            name="address"
            defaultValue=""
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
