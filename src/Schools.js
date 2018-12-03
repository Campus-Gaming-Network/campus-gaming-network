import React, { Component } from "react";
import axios from "axios";
import kebabCase from "lodash/kebabCase";
import sortBy from "lodash/sortBy";
import { Router } from "@reach/router";
import SchoolList from "./SchoolList";
import SchoolDetail from "./SchoolDetail";

class Schools extends Component {
  constructor() {
    super();

    this.state = {
      schools: null,
      error: null,
      loading: false,
      filteredSchools: null,
      selectedSchool: null,
      searchSchools: null
    };

    this.getSchools = this.getSchools.bind(this);
    this.setSchools = this.setSchools.bind(this);
    this.setError = this.setError.bind(this);
    this.filterSchools = this.filterSchools.bind(this);
    this.setSelectedSchool = this.setSelectedSchool.bind(this);
  }

  async componentDidMount() {
    await this.getSchools();
  }

  async getSchools() {
    this.setState(
      {
        loading: true
      },
      async () => {
        try {
          const response = await axios.get(
            "https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json"
          );
          this.setSchools(response.data);
        } catch (error) {
          this.setError(`Error retrieving list of schools. ${error}`);
        }
      }
    );
  }

  setSchools(schools) {
    const _schools = sortBy(
      schools
        .filter(school => school.country === "United States")
        .map((school, i) => ({
          ...school,
          id: kebabCase(`${school.name}-${i}`)
        })),
      ["name"]
    );
    const searchSchools = _schools.map(school => school.name.toLowerCase());

    this.setState({
      loading: false,
      schools: _schools,
      filteredSchools: _schools,
      searchSchools
    });
  }

  setError(error) {
    this.setError({
      loading: false,
      error
    });
  }

  filterSchools(e) {
    const searchTerm = e.target.value.toLowerCase();

    let filteredSchools = [];

    if (searchTerm) {
      for (let i = 0; i < this.state.schools.length; i++) {
        if (this.state.searchSchools[i].indexOf(searchTerm) !== -1) {
          filteredSchools = [...filteredSchools, this.state.schools[i]];
        }
      }
    } else {
      filteredSchools = [...this.state.schools];
    }

    this.setState({ filteredSchools });
  }

  setSelectedSchool(selectedSchool) {
    this.setState({ selectedSchool });
  }

  render() {
    return (
      <Router>
        <SchoolList
          path="/"
          {...this.state}
          filterSchools={this.filterSchools}
          setSelectedSchool={this.setSelectedSchool}
        />
        <SchoolDetail path=":school" {...this.state} />
      </Router>
    );
  }
}

export default Schools;
