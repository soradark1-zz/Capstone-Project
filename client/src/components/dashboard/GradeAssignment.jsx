import React, { Component } from "react";
import { Document, Page } from "react-pdf";
import Annoation from "../common/Annoation";

import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";

import data from "../common/data.json";

var sample = require("./sample2.pdf");

const styles = theme => ({
  button: {
    textTransform: "inherit",
    margin: "0.6rem",
    fontSize: "1.2rem",
    backgroundColor: theme.palette.secondary.main
  },
  pdfMenu: {
    display: "inline-flex"
  },
  pageNumber: {
    margin: "auto"
  }
});

class GradeAssignment extends Component {
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
    //console.log(page);
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
    const { classes } = this.props;
    const react_pdf = (
      <div>
        <div className={classNames(classes.pdfMenu)}>
          <Button
            variant="contained"
            disabled={pageNumber <= 1}
            onClick={this.previousPage}
            className={classNames(classes.button)}
          >
            <Icon className="fas fa-angle-left" />
          </Button>
          <div className={classNames(classes.pageNumber)}>
            {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
          </div>

          <Button
            variant="contained"
            disabled={pageNumber >= numPages}
            onClick={this.nextPage}
            className={classNames(classes.button)}
          >
            <Icon className="fas fa-angle-right" />
          </Button>
        </div>
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
      </div>
    );

    return (
      <div>
        <div>{react_pdf}</div>

        <Annoation
          stageWidth={pageWidth}
          stageHeight={pageHeight}
          annoations={data.pages[pageNumber - 1]}
        />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(GradeAssignment);
