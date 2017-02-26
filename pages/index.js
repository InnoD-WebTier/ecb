import React from 'react'
import Helmet from 'react-helmet'
import { Link } from 'react-router'
import { prefixLink } from 'gatsby-helpers'
import { config } from 'config'
import $ from 'jquery'

export default class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = ({
      showSearch: false,
      searchTerm: "",
      activeTab: "about"
    });
  }

  componentDidMount() {
    const loadMap = () => {
      const uluru = {lat: 37.8713466, lng: -122.2589184};
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: uluru
      });
      const markers = [
        {lat: 37.8713466, lng: -122.2589184, string: "<p>Big memes</p>"},
        {lat: 37.872, lng: -122.251, string: "<p>Small memes</p>"},
      ];
      for (let position of markers) {
        const infowindow = new google.maps.InfoWindow({
          content: position.string,
        });
        const marker = new google.maps.Marker({
          position,
          map: map
        });
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
      }
    }
    $.loadScript = function (url, callback) {
      $.ajax({
          url: url,
          dataType: 'script',
          success: callback,
          async: true
      });
    }
    $.loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyAK-0aO8lrEis8_DuFJj8EevofQjhOh9Oc', loadMap);
  }

  render () {
    const searchTerm = this.state.searchTerm;
    const activeTab = this.state.activeTab;

    const handleSearch = () => {
      this.setState({ searchTerm: e.target.value });
    }
    const toggleSearch = () => {
      this.setState({showSearch: !this.state.showSearch });
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
    const genSideBar = () => {
      if (activeTab === "about") {
        return (
          <div className="sidebar-container">
            {tabs()}
            <p className="info-text">The Berkeley Bug Project tries to make it easier for Berkeley students to collect bugs for assignments. This website is run by the <span className="underline">Etomology Club at Berkeley</span>. If you want to suggest that we add a specific bug to the map, feel free to reach out to us at ecb@gmail.com. We would love to hear from you!</p>
            <p className="contact-info">
              <span className="underline clickable">Facebook</span> <br/><br/>
              <span className="underline clickable">Twitter</span>
            </p>
          </div>
        );
      } else {
        return (
          <div className="sidebar-container">
            {tabs()}
            <p className="info-text">Trying to find a specific bug? You can search below and see if it is in our collection!</p>
            <div className="search-container">
              <img onClick={toggleSearch} className="search-icon" src="./assets/search-black.png" />
              <input
                id="search-bar"
                className="search-bar"
                onChange={handleSearch}
                value={searchTerm}
              />
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
          <div className="map-container">
            <div id="map"></div>
          </div>
        </div>
      </div>
    )
  }
}
