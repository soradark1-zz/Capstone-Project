import React, { Component } from "react";
import { Document, Page } from "react-pdf";
import Annoation from "../common/Annoation";
import { connect } from "react-redux";
import compose from "recompose/compose";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";

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
  },
  loading: {
    marginTop: "45vh",
    marginLeft: "-25px",
    position: "absolute",
    top: 0
  },
  pdfAndAnnoation: {
    display: "grid",
    gridTemplateColumns: "auto",
    gridTemplateAreas: '"pdf" "menu"',
    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: "auto auto",
      gridTemplateAreas: '"pdf menu" "bottom bottom"'
    }
  },
  pdfDisplay: {
    gridColumnStart: "pdf-start",
    gridRow: 1
  }
});

class GradeAssignment extends Component {
  constructor(props) {
    super(props);
    var myfile = require("../../uploads/cf939620829af3354913b03528335875");
    this.state = {
      numPages: null,
      pageNumber: 1,
      pageWidth: 600,
      pageHeight: 750,
      isLoaded: false,
      annoations: data,
      pdfFile: sample
    };

    this.updateAnnoations = this.updateAnnoations.bind(this);
  }
  getDocument() {
    if (this.props.user.isLoaded) {
      const {
        match: { params }
      } = this.props;

      console.log("PROPS", params);

      const documentData = {
        doc_id: params.docId
      };

      axios
        .post("/api/classes/get_document", documentData)
        .then(res => {
          console.log("Got Doc", res.data.contents.filename);
          this.setState({
            pdfFile: require(`../../uploads/${res.data.contents.filename}`)
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params !== this.props.match.params) {
      this.getDocument();
    }
  }

  componentDidMount() {
    this.getDocument();
  }

  componentWillUnmount() {}

  updateAnnoations(updatedPage, index) {
    let { annoations } = this.state;
    annoations.pages[index - 1] = updatedPage;

    this.setState({
      annoations
    });

    console.log("Grade State", this.state);
  }

  onDocumentLoad = ({ numPages }) => {
    this.setState({ numPages });
  };

  onDocumentLoadSuccess = doc => {
    const { numPages } = doc;
    this.setState({
      numPages,
      pageNumber: 1
      //isLoaded: true
    });
  };

  onPageLoadSuccess = page => {
    //console.log(page);
    this.setState({
      pageWidth: page.originalWidth,
      pageHeight: page.originalHeight,
      isLoaded: true
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
    const {
      numPages,
      pageNumber,
      pageWidth,
      pageHeight,
      isLoaded
    } = this.state;
    const { classes } = this.props;
    const react_pdf = (
      <div>
        <div className={classNames(isLoaded ? classes.pdfMenu : "no-display")}>
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
        <Document
          file={this.state.pdfFile}
          onLoadSuccess={this.onDocumentLoadSuccess}
          loading={
            <CircularProgress
              className={classNames(classes.loading)}
              color="secondary"
              size={50}
            />
          }
        >
          <div id="pdfpage">
            <Page
              pageNumber={pageNumber}
              renderInteractiveForms={true}
              renderMode="svg"
              className="pdfpage"
              scale={1}
              inputRef={ref => {
                this.myPage = ref;
              }}
              onLoadSuccess={this.onPageLoadSuccess}
            />
          </div>
        </Document>
      </div>
    );

    return (
      <div className={classNames(classes.pdfAndAnnoation)}>
        <div className={classNames(classes.pdfDisplay)}>{react_pdf}</div>

        <Annoation
          stageWidth={pageWidth}
          stageHeight={pageHeight}
          annoations={this.state.annoations.pages[pageNumber - 1]}
          finalComment={this.state.annoations.finalComment}
          grade={this.state.annoations.grade}
          updateAnnoations={this.updateAnnoations}
          pageNumber={pageNumber}
          isLoaded={isLoaded}
        />
      </div>
    );
  }
}

//export default withStyles(styles, { withTheme: true })(GradeAssignment);

const mapStateToProps = state => ({
  user: state.auth.user,
  class: state.class
});

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(mapStateToProps)
)(GradeAssignment);
