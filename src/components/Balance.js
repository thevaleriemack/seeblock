import React, { Component } from 'react';

class Balance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      balance: ""
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.address === prevState.address) {
      return null;
    }
    return {
      address: nextProps.address
    };
  }

  componentWillUnmount() {
    // TODO: keep track of inflight AJAX requests and cancel them
  }

  render() {
    return(
      <div>
        Balance: {this.props.balance}
      </div>
    )
  }
}

export default Balance;
