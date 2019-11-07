import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setVariant, alterColour, alterColours, setPatternLoaded } from '../actions';
import { CircularPreloader, ColourLayers } from 'gfh-react-components';
import { Installation } from 'installation-builder';

class Visualiser extends Component {

  componentDidMount() {
    this.props.setVariant(this.props.globalId);
  }

  renderPrimaryImage() {
    return (
      <div id="primary-image-wrapper">
        <Installation
          pattern="Sparse"
          id="sparse"
          scale="1"
          width="530"
          height="650"
          fullWidth="530"
          fullHeight="650"
          showUI={false}
          //setModal={this.props.setModal}
          patternImgUrl={this.props.patternUrl}
          orientation="vertical"
          // Lock down the tiles to a specific set of 3 (default random 3/16).
          tiles={[20, 9, 7]}
          hasLoaded={ () => this.props.setPatternLoaded(true) }
        />
      </div>
    );
  }

  renderDisplayArea() {
    let { pickerHeading, alterableColours, variant, alterColour, alterColours } = this.props;

    return (
      <div id="display-area">
        <div id="display-top">
          { this.renderPrimaryImage() }
          <div id="layers-wrapper">
            <div id="layers-inner">
              { pickerHeading && <h3>{ pickerHeading }</h3> }
              <ColourLayers
                reset={() => alterColours(alterableColours)}
                alterableColours={alterableColours}
                availableColours={variant.availableColours}
                alterColour={alterColour}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    // Return a loader if we're still waiting for the initial variant response from the API.
    if (!this.props.variant) {
      return <CircularPreloader />;
    }

    return (
      <div>
        { this.renderDisplayArea() }
      </div>
    );
  }
}

function mapStateToProps({ variant, alterableColours, patternUrl }) {
  return { variant, alterableColours, patternUrl };
}

export default connect(mapStateToProps, {
  setVariant,
  alterColour,
  alterColours,
  setPatternLoaded
})(Visualiser);