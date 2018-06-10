import React, { Component } from 'react';
import Transaction from './Transaction.js';

class TransactionList extends Component {

  buildTransactionList = (txs) => {
    return txs.map((tx) => (
      <Transaction
        key={tx.hash}
        hash={tx.hash} />
    ))
  }

  render() {
    return(
      <div>
        <p>Transaction list for address {this.props.address}:</p>
        <p>{this.props.tx}</p>
        {this.buildTransactionList(this.props.txs)}
      </div>
    )
  }
}

export default TransactionList;
