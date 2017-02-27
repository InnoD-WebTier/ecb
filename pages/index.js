import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { prefixLink } from 'gatsby-helpers';
import { config } from 'config';
import $ from 'jquery';
import data from './data/bug';

export default class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = ({
      searchTerm: "",
      activeTab: "about",
      bugs: data.bugs,
      map: null,
    });
  }

  componentDidMount() {

    String.prototype.format = function() {
      var args = arguments;
      return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined'
          ? args[number]
          : match
        ;
      });
    };
  }

  render () {
    const searchTerm = this.state.searchTerm;
    const activeTab = this.state.activeTab;

    const handleSearch = (e) => {
      this.setState({ searchTerm: e.target.value });
    }
    const goToSearch = () => {
      this.setState({activeTab: "search"});
    }
    const goToAbout = () => {
      this.setState({activeTab: "about"})
    }

    const tabs = () => {
      if (activeTab === "about") {
        return (
          <div className="header-container">
            <span onClick={goToAbout} className="active-tab">About</span>
            <span onClick={goToSearch} className="tab">Search</span>
          </div>
        );
      }
      return (
        <div className="header-container">
          <span onClick={goToAbout} className="tab">About</span>
          <span onClick={goToSearch} className="active-tab">Search</span>
        </div>
      );
    }

    const showMarker = (item) => {
      item.infowindow.open(this.state.map, item.marker);
    }

    const populateData = () => {
      const searchTerm = this.state.searchTerm.toLowerCase();
      const filtered = this.state.bugs.filter(bug => {
        const valid = bug.name.toLowerCase().includes(searchTerm);
        if (!valid) {
          bug.marker.setVisible(false);
        } else {
          bug.marker.setVisible(true);
        }
        return valid;
      });
      const content = filtered.map((item, i) => (
        <div key={i} onClick={() => showMarker(item)} className="result">
          {item.name}
        </div>
      ));
      return content;
    }

    const genSideBar = () => {
      if (activeTab === "about") {
        return (
          <div className="sidebar-container">
            {tabs()}
            <p className="info-text">The Berkeley Bug Project tries to make it easier for students to collect bugs for their assignments or for fun. The website is run by the Etomology Club at Berkeley.<br/><br/> If you think we missed a bug or have some feedback, feel free to reach out to us at <span className="underline">ecb@gmail.com</span>. We would love to hear from you!</p>
          </div>
        );
      } else {
        return (
          <div className="sidebar-container">
            {tabs()}
            <p className="info-text">Trying to find a specific bug? You can search below and see if it is in our collection.</p>
            <div className="search-container">
              <img className="search-icon" src="./assets/search-blue.png" />
              <input
                id="search-bar"
                className="search-bar"
                onChange={handleSearch}
                value={searchTerm}
              />
            </div>
            <div className="results-container">
              {populateData()}
            </div>
          </div>
        );
      }
    }

    return (
      <div>
        <Helmet
          title={config.siteTitle}
        />
        <div className="main-container">
          {genSideBar()}
          <div id="map"></div>
        </div>
      </div>
    )
  }
}
