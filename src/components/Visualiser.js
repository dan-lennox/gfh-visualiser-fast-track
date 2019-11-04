import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setVariant } from '../actions';
import { CircularPreloader } from 'gfh-react-components';

class Visualiser extends Component {

  componentDidMount() {
    this.props.setVariant(this.props.globalId);
  }

  render() {
    // Return a loader if we're still waiting for the initial variant response from the API.
    if (!this.props.variant) {
      console.log('none');
      return <CircularPreloader />;
    }

    console.log(this.props);

    return (
      <div>
        Test visualiser component.
      </div>
    );
  }
}

function mapStateToProps({ variant }) {
  return { variant };
}

export default connect(mapStateToProps, { setVariant })(Visualiser);