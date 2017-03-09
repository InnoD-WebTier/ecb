import React from 'react'
import Helmet from 'react-helmet'
import { Link } from 'react-router'
import { prefixLink } from 'gatsby-helpers'
import { config } from 'config';
import $ from 'jquery';
import '../css/markdown-styles';
import '../css/main';
import data from './data/bug';

export default class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = ({
      markersCreated: false,
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

    const loadMap = () => {
      const berkeley_loc = {lat: 37.8749987, lng: -122.2580837};
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: berkeley_loc,
        mapTypeControl: false
      });
      this.setState({ map });
      const bugs = this.state.bugs;
      const updated_bugs = [];
      for (let bug of bugs) {

        const desc = "<div class='info-container'><p class='title'>{0}</p><br/><p class='desc'>{1}</p></div>".format(bug.name, bug.string);

        const infowindow = new google.maps.InfoWindow({
          content: desc,
        });
        const marker = new google.maps.Marker({
          position: bug.position,
          map: map
        });

        const updated_bug = bug;
        updated_bug["marker"] = marker;
        updated_bug["infowindow"] = infowindow;
        updated_bugs.push(updated_bug);

        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
      }
      this.setState({ bugs: updated_bugs });
      this.setState({ markersCreated: true });
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

    const handleSearch = (e) => {
      this.setState({ searchTerm: e.target.value });
    }

    const showMarker = (item) => {
      item.infowindow.open(this.state.map, item.marker);
    }

    const populateData = () => {
      if (!this.state.markersCreated) {
        return ( <div /> );
      }
      const searchTerm = this.state.searchTerm.toLowerCase();
      const filtered = this.state.bugs.filter(bug => {
        const valid = bug.name.toLowerCase().includes(searchTerm);
        bug.marker.setVisible(valid);
        return valid;
      });
      const content = filtered.map((item, i) => (
        <div key={i} onClick={() => showMarker(item)} className="result">
          {item.name}
        </div>
      ));
      return content;
    }

    return (
      <div className="main-container">
        <div className="search-container">
          <img className="search-icon" src="./assets/search-blue.png" />
          <input
            placeholder="Search"
            className="search-bar"
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>
        <div className="results-container">
          {populateData()}
        </div>
        <div id="map"></div>
      </div>
    )
  }
}
