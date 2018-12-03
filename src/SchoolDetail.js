import React, { Component } from "react";
import "./SchoolDetail.css";

class SchoolDetail extends Component {
  render() {
    return (
      <section className="SchoolDetail">
        <h1>{this.props.selectedSchool.name}</h1>
        <p>
          School site(s):{" "}
          {this.props.selectedSchool.web_pages &&
            this.props.selectedSchool.web_pages.length > 0 &&
            this.props.selectedSchool.web_pages.map(web_page => (
              <a
                key={web_page}
                rel="noopener noreferrer"
                target="_blank"
                href={web_page}
              >
                {web_page}
              </a>
            ))}
        </p>
      </section>
    );
  }
}

export default SchoolDetail;
