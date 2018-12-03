import React, { Component } from "react";
import "./SchoolListItem.css";
import { Link } from "@reach/router";

class SchoolListItem extends Component {
  constructor() {
    super();

    this.handleSchoolClick = this.handleSchoolClick.bind(this);
  }

  handleSchoolClick() {
    this.props.setSelectedSchool(this.props.school);
  }

  render() {
    return (
      <li className="SchoolListItem-wrapper">
        <Link to={this.props.route} onClick={this.handleSchoolClick}>
          <div className="SchoolListItem">
            <span>{this.props.school.name}</span>
          </div>
        </Link>
      </li>
    );
  }
}

export default SchoolListItem;
