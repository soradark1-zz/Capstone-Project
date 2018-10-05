import React, { Component } from "react";
import { Document, Page } from "react-pdf/dist/entry.webpack";
import "react-pdf/dist/Page/AnnotationLayer.css";
var sample = require("./sample.pdf");

export default class GradeAssignment extends Component {
  state = {
    numPages: null,
    pageNumber: 1
  };

  onDocumentLoad = ({ numPages }) => {
    this.setState({ numPages });
  };

  render() {
    const { pageNumber, numPages } = this.state;

    return (
      <div>
        <Document file={sample} onLoadSuccess={this.onDocumentLoad}>
          <Page
            pageNumber={pageNumber}
            renderAnnotations={true}
            renderInteractiveForms={true}
          />
        </Document>
        <p>
          Page {pageNumber} of {numPages}
        </p>
      </div>
    );
  }
}
