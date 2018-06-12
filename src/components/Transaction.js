import React, { Component } from 'react';
import './Transaction.css';

class Transaction extends Component {

  listInputs = (inputs) => {
    return inputs.map((input) => {
      if (input && input.prev_out && input.prev_out.addr) {
        return <p key={inputs.indexOf(input)}>{input.prev_out.addr}</p>;
      }
      return "No previous output address";
    });
  }

  listOutputs = (outputs) => {
    return outputs.map((output) => {
      if (output && output.addr) {
        return (
          <div key={outputs.indexOf(output)}>
            <p>{output.addr}</p>
            <p className="txValue">{output.value*0.00000001} BTC</p>
          </div>
        );
      }
      return "No address";
    });
  }

  render() {
    const date = new Date(this.props.time*1000);
    return(
      <div className="tx">
        <p>
          <a href={`https://blockchain.info/tx/${this.props.hash}`}>
            {date.toString()}
          </a>
        </p>
        <div className="txPuts">
          <div className="puts outputs">
            <p className="putsTitle">Outputs</p>
            {this.listOutputs(this.props.outputs)}
          </div>
          <div className="puts inputs">
            <p className="putsTitle">Inputs</p>
            {this.listInputs(this.props.inputs)}
          </div>
        </div>
      </div>
    )
  }
}

export default Transaction;
