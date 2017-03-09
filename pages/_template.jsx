import React from 'react'
import Helmet from 'react-helmet'
import { Link } from 'react-router'
import { prefixLink } from 'gatsby-helpers'
import { config } from 'config';
import $ from 'jquery';
import '../css/markdown-styles';
import '../css/main';
import data from './data/bug';

class Template extends React.Component {

  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div>
        <Helmet
          title={config.siteTitle}
        />
        {this.props.children}
      </div>
    )
  }
}

export default Template;
