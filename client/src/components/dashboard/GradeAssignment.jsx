import React, { Component } from "react";

import { Document, Page } from "react-pdf";

import Annoation from "../common/Annoation";

var sample = require("./sample2.pdf");

export default class GradeAssignment extends Component {
  state = {
    numPages: null,
    pageNumber: 1,
    pageWidth: 600,
    pageHeight: 750
  };

  onDocumentLoad = ({ numPages }) => {
    this.setState({ numPages });
  };

  onDocumentLoadSuccess = document => {
    const { numPages } = document;
    this.setState({
      numPages,
      pageNumber: 1
    });
  };

  onPageLoadSuccess = page => {
    console.log(page.originalHeight);
    this.setState({
      pageWidth: page.originalWidth,
      pageHeight: page.originalHeight
    });
  };

  changePage = offset =>
    this.setState(prevState => ({
      pageNumber: prevState.pageNumber + offset
    }));

  previousPage = () => this.changePage(-1);

  nextPage = () => this.changePage(1);

  //componentDidUpdate(old) {}

  //let pdfWidth = document.getElementById("foo").offsetWidth;

  render() {
    const { numPages, pageNumber, pageWidth, pageHeight } = this.state;

    const react_pdf = (
      <div>
        <Document file={sample} onLoadSuccess={this.onDocumentLoadSuccess}>
          <Page
            pageNumber={pageNumber}
            renderInteractiveForms={true}
            renderMode="svg"
            className="pdfpage"
            inputRef={ref => {
              this.myPage = ref;
            }}
            onLoadSuccess={this.onPageLoadSuccess}
          />
        </Document>
        <p>
          {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
        </p>
        <button
          type="button"
          disabled={pageNumber <= 1}
          onClick={this.previousPage}
        >
          Previous
        </button>
        <button
          type="button"
          disabled={pageNumber >= numPages}
          onClick={this.nextPage}
        >
          Next
        </button>
      </div>
    );

    return (
      <div>
        <div>{react_pdf}</div>

        <Annoation stageWidth={pageWidth} stageHeight={pageHeight} />
      </div>
    );
  }
}
