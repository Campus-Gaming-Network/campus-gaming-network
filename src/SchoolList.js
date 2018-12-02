import React, { Component } from "react";
import axios from "axios";
import { compareValues, kebabCase } from "./utils";
import Spinner from "./Spinner";
import SchoolListItem from "./SchoolListItem";
import SchoolDetail from "./SchoolDetail";
import "./SchoolList.css";
// import { navigate } from "@reach/router";

class SchoolList extends Component {
  constructor() {
    super();

    this.state = {
      schools: null,
      error: null,
      loading: false,
      filteredSchools: null,
      school: null
    };

    this.getSchools = this.getSchools.bind(this);
    this.setSchools = this.setSchools.bind(this);
    this.setError = this.setError.bind(this);
    this.renderSchoolListItems = this.renderSchoolListItems.bind(this);
    this.filterSchools = this.filterSchools.bind(this);
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
    const _schools = schools
      .filter(school => school.country === "United States")
      .sort(compareValues("name"));

    this.setState({
      loading: false,
      schools: _schools,
      filteredSchools: _schools
    });
  }

  setError(error) {
    this.setError({
      loading: false,
      error
    });
  }

  renderSchoolListItems() {
    return this.state.loading ? (
      <Spinner />
    ) : this.state.error ? (
      <p>{this.state.error}</p>
    ) : this.state.schools ? (
      <section>
        <ul className="SchoolList">
          {this.state.filteredSchools.map((school, i) => {
            const key = kebabCase(`${school.name}-${i}`);

            return <SchoolListItem key={key} school={school} route={key} />;
          })}
        </ul>
      </section>
    ) : null;
  }

  filterSchools(e) {
    const searchTerm = e.target.value.toLowerCase();
    let filteredSchools = this.state.schools;
    if (searchTerm) {
      filteredSchools = filteredSchools.filter(
        school => school.name.toLowerCase().indexOf(searchTerm) !== -1
      );
    }
    this.setState({ filteredSchools });
  }

  render() {
    console.log("this.props : ", this.props);
    return (
      <article>
        <section className="SchoolList-header">
          <h1>School List</h1>
          <input
            className="SchoolList-search"
            type="text"
            placeholder="Search for your school"
            onChange={this.filterSchools}
          />
        </section>
        {this.renderSchoolListItems()}
      </article>
    );
  }
}

export default SchoolList;
