import React, { Component } from "react";
import "./SchoolListItem.css";
import { Link } from "@reach/router";

class SchoolListItem extends Component {
  render() {
    return (
      <li className="SchoolListItem-wrapper">
        <Link to={this.props.route}>
          <div className="SchoolListItem">
            <span>{this.props.school.name}</span>
          </div>
        </Link>
      </li>
    );
  }
}

export default SchoolListItem;
