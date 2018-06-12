import React, { Component } from 'react';

import './Balance.css';

class Balance extends Component {

  render() {
    const balance = this.props.balance;
    return(
      <div>
        {balance !== "" &&
          <div className="balanceBlock">
            <p>Balance</p>
            <h2>
              {balance*0.00000001} BTC
            </h2>
          </div>
        }
    </div>
    )
  }
}

export default Balance;
