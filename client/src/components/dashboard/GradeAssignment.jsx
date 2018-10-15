import React, { Component } from "react";

import { Document, Page } from "react-pdf";

import { Stage, Layer, Rect, Text, Line } from "react-konva";
import Konva from "konva";
import TransformerComponent from "../common/TransformerComponent";

var sample = require("./sample.pdf");

const highlightPattern = (text, pattern) => {
  const splitText = text.split(pattern);
  console.log(splitText);
  if (splitText.length <= 1) {
    return text;
  }

  const matches = text.match(pattern);

  return splitText.reduce(
    (arr, element, index) =>
      matches[index]
        ? [...arr, element, <mark>{matches[index]}</mark>]
        : [...arr, element],
    []
  );
};

export default class GradeAssignment extends Component {
  state = {
    numPages: null,
    pageNumber: 1,
    searchText: ""
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

  changePage = offset =>
    this.setState(prevState => ({
      pageNumber: prevState.pageNumber + offset
    }));

  previousPage = () => this.changePage(-1);

  nextPage = () => this.changePage(1);

  makeTextRenderer = searchText => textItem =>
    highlightPattern(textItem.str, searchText);

  onChange = event => this.setState({ searchText: event.target.value });

  render() {
    const { numPages, pageNumber, searchText } = this.state;

    const CANVAS_VIRTUAL_WIDTH = 612;
    const CANVAS_VIRTUAL_HEIGHT = 796;

    const scale = Math.min(
      window.innerWidth / CANVAS_VIRTUAL_WIDTH,
      window.innerHeight / CANVAS_VIRTUAL_HEIGHT
    );

    const react_pdf = (
      <div>
        <Document file={sample} onLoadSuccess={this.onDocumentLoadSuccess}>
          <Page
            pageNumber={pageNumber}
            renderAnnotations={true}
            renderInteractiveForms={true}
            renderMode="svg"
            className="pdfpage"
            customTextRenderer={this.makeTextRenderer(searchText)}
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

        <TransformerComponent />
      </div>
    );
  }
}
