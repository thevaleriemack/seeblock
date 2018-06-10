import React, { Component } from 'react';

class Balance extends Component {

  render() {
    return(
      <div>
        <p>
          Balance for address {this.props.address}: {this.props.balance}
        </p>
      </div>
    )
  }
}

export default Balance;
