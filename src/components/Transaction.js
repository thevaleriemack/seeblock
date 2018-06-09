import React, { Component } from 'react';

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return(
      <div>Transaction: {this.props.data}</div>
    )
  }
}

export default Transaction;
