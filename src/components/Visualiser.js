import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setVariant, alterColour, alterColours, setPatternLoaded } from '../actions';
import { CircularPreloader, ColourLayers } from 'gfh-react-components';
import { Installation } from 'installation-builder';
import queryString from 'query-string';

class Visualiser extends Component {

  constructor(props) {
    super(props);

    // Set flag to hide content with css while initial patterns are loaded.
    // Unset after the first page load.
    this.initialLoad = true;
  }

  componentDidMount() {

    // Retrieve initial state from url query params if possible.
    // Alternatively use the globalId passed in via initial props.
    let { globalId } = queryString.parse(location.search);
    this.props.setVariant(globalId || this.props.globalId);
  }

  renderPrimaryImage() {
    return (
      <div id="primary-image-wrapper">
        <Installation
          pattern="SingleTile"
          id="single-tile"
          scale="0.35"
          width="560"
          height="560"
          fullWidth="560"
          fullHeight="560"
          showUI={false}
          patternImgUrl={this.props.patternUrl}
          sliced={false}
          orientation="vertical"
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
        <Installation
          pattern={ variant.designRepeat === 'halfDrop' ? "HalfDrop" : "Straight" }
          id="install1"
          scale="0.2"
          width="1170"
          height="450"
          fullWidth="1170"
          fullHeight="450"
          showUI={false}
          patternImgUrl={this.props.patternUrl}
          sliced={false}
          hasLoaded={ () => { this.props.setPatternLoaded(true) } }
        />
      </div>
    );
  }

  render() {
    let classes = [];

    // Return a loader if we're still waiting for the initial variant response from the API.
    if (!this.props.variant) {
      return <CircularPreloader />;
    }

    if (this.initialLoad && !this.props.patternLoaded.loaded) {
      // Add a class to hide the initial page load content with css while the initial
      // pattern loads.
      classes.push('initial-load');
    }
    else {
      this.initialLoad = false;
    }

    return (
      <div>
        { this.initialLoad && <CircularPreloader />}
        <div className={classes.join(" ")}>
          { this.renderDisplayArea() }
        </div>
      </div>
    );
  }
}

function mapStateToProps({ variant, alterableColours, patternUrl, patternLoaded }) {
  return { variant, alterableColours, patternUrl, patternLoaded };
}

export default connect(mapStateToProps, {
  setVariant,
  alterColour,
  alterColours,
  setPatternLoaded
})(Visualiser);