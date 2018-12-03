import React, { Component } from "react";
import Spinner from "./Spinner";
import SchoolListItem from "./SchoolListItem";
import "./SchoolList.css";

class SchoolList extends Component {
  constructor() {
    super();

    this.renderSchoolListItems = this.renderSchoolListItems.bind(this);
  }

  renderSchoolListItems() {
    return this.props.loading ? (
      <Spinner />
    ) : this.props.error ? (
      <p>{this.props.error}</p>
    ) : this.props.schools ? (
      <section>
        <ul className="SchoolList">
          {this.props.filteredSchools.map((school, i) => (
            <SchoolListItem
              key={school.id}
              school={school}
              route={school.id}
              setSelectedSchool={this.props.setSelectedSchool}
            />
          ))}
        </ul>
      </section>
    ) : null;
  }

  render() {
    return (
      <article>
        <section className="SchoolList-header">
          <h1>Find Your School</h1>
          <input
            className="SchoolList-search"
            type="text"
            placeholder="Enter school name"
            onChange={this.props.filterSchools}
          />
        </section>
        {this.renderSchoolListItems()}
      </article>
    );
  }
}

export default SchoolList;
