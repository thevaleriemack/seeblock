import React, { Component } from 'react';
import Transaction from './Transaction.js';

class TransactionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: []
    }
  }

  buildTransactionList = (transactions) => {
    return transactions.map((tx) => (
      <Transaction
        key={tx.id}
        data={tx.data} />
    ))
  }

  componentDidUpdate() {
    this.updateTransactions();
  }

  updateTransactions = () => {
    // TODO: send api req for address and add to state
    console.log(this.props.address);
  }

  render() {
    // const transactions = this.state.transactions;
    return(
      <div>
        <p>Transaction list for address {this.props.address}:</p>
        {this.buildTransactionList(this.state.transactions)}
      </div>
    )
  }
}

export default TransactionList;
