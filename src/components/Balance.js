import React, { Component } from 'react';

class Balance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: ""
    }
  }

  componentDidUpdate() {
    this.getBalance();
  }

  getBalance = () => {
    // TODO: send api req for address
    console.log(this.props.address);
  }

  render() {
    return(
      <div>
        Balance for address {this.props.address}: {this.state.balance}
      </div>
    )
  }
}

export default Balance;
