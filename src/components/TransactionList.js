import React, { Component } from 'react';
import Transaction from './Transaction.js';

class TransactionList extends Component {

  buildTransactionList = (txData) => {
    if (txData && txData.txs){
      return txData.txs.map((tx) => (
        <Transaction
          key={tx.hash}
          hash={tx.hash}
          inputs={tx.inputs}
          outputs={tx.out}
          time={tx.time} />
      ))
    }
  }

  render() {
    return(
      <div>
        {this.buildTransactionList(this.props.txData)}
      </div>
    )
  }
}

export default TransactionList;
