import React from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import compose from "recompose/compose";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";

import CircularProgress from "@material-ui/core/CircularProgress";

import { getClass } from "../../actions/classesActions";

import moment from "moment";
import axios from "axios";

const styles = theme => ({
  button: {
    textTransform: "inherit",
    margin: "0.6rem",
    fontSize: "1.2rem",
    backgroundColor: theme.palette.secondary.main
  },
  loading: {
    marginTop: "45vh",
    marginLeft: "-25px",
    position: "absolute",
    top: 0
  },
  table: {
    minWidth: 700,
    whiteSpace: "pre-line"
  }
});

class StudentAssignment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      className: "",
      classCode: "",
      assignment_name: "",
      date_assigned: "",
      date_due: "",
      description: "",
      max_grade: "",
      hasSubmitted: false,
      uploadFile: null,
      docId: ""
    };

    this.getClass = this.getClass.bind(this);
    this.fileHandler = this.fileHandler.bind(this);
    this.fileSubmit = this.fileSubmit.bind(this);
  }

  setClass() {
    if (this.props.user.isLoaded) {
      const {
        match: { params }
      } = this.props;

      const enrolled_classes = this.props.user.enrolled_classes;
      const currentClass = enrolled_classes.find(userClass => {
        return userClass.code === params.classCode;
      });

      //Is teacher of class
      if (currentClass) {
        this.props.getClass({ code: currentClass.code });

        this.setState({
          className: currentClass.name,
          classCode: currentClass.code
        });
      }
      //If not teacher, redirect to Dashboard
      else {
        this.props.history.push(`/dashboard`);
      }
    }
  }

  setAssignment() {
    const {
      match: { params }
    } = this.props;

    const assignment = this.props.class.assignments.find(assignment => {
      return params.assignmentId === assignment._id;
    });

    const doc = assignment.submitted_docs.find(doc => {
      return doc.owner === this.props.user.id;
    });

    let hasSubmitted = false;
    let docId = "";
    if (doc) {
      hasSubmitted = true;
      docId = doc.doc_id;
    }

    this.setState({ ...assignment, hasSubmitted, docId });

    console.log(assignment);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params !== this.props.match.params) {
      this.props.getClass({});
      this.setClass();
    }
    if (
      prevProps.class.isLoaded !== this.props.class.isLoaded &&
      this.props.class.isLoaded
    ) {
      this.setAssignment();
    }
  }

  componentDidMount() {
    console.log("mounted");
    this.setClass();
  }

  componentWillUnmount() {
    this.props.getClass({});
  }

  getClass() {
    const newClassData = {
      code: this.state.classCode
    };

    this.props.getClass(newClassData);
  }

  fileHandler(evt) {
    this.setState({
      uploadFile: evt.target.files[0]
    });
  }

  fileSubmit() {
    console.log(typeof this.state.uploadFile);
    const documentData = {
      assignment_name: this.state.assignment_name,
      code: this.state.classCode,
      doc_name: "Some DOC",
      doc_contents: this.state.uploadFile
    };

    const data = new FormData();
    data.append("file", this.state.uploadFile);
    data.append("doc_name", "Some DOC");
    data.append("code", this.state.classCode);
    data.append("assignment_name", this.state.assignment_name);

    console.log("CLIFTON COMMENT", documentData);
    axios
      .post("/api/classes/submit_assignment", data)
      .then(() => {
        console.log("Doc submited");
      })
      .catch(err => {
        console.log(err);
      });
  }

  hasSubmitted() {
    const {
      match: { params }
    } = this.props;

    const assignemnt = this.props.class.assignments.find(assignment => {
      return assignment.id === params.assignmentId;
    });

    if (assignemnt) {
      const ownerId = assignemnt.submitted_docs.find(doc => {
        return doc.owner === this.props.user.id;
      });

      if (ownerId) {
        return true;
      }
    }
    return false;
  }

  render() {
    const { classes } = this.props;
    const {
      className,
      classCode,
      assignment_name,
      date_assigned,
      date_due,
      description,
      max_grade
    } = this.state;
    console.log("PROPS", this.state);

    return (
      <div>
        {this.props.class.isLoaded ? (
          <div>
            <h1>{assignment_name}</h1>
            <div>Description: {description}</div>
            <div>Date Assigned: {`${moment(date_assigned).format("LLL")}`}</div>
            <div>Date Due: {`${moment(date_due).format("LLL")}`}</div>
            <div>Max Grade: {max_grade}</div>

            {this.state.hasSubmitted ? (
              <Link
                style={{ color: "white" }}
                to={this.props.match.url + `/${this.state.docId}`}
              >
                <div>Submission</div>
              </Link>
            ) : (
              <div>
                <Input type="file" onChange={this.fileHandler} />
                <br />
                <Button
                  className={classNames(classes.button)}
                  variant="contained"
                  size="large"
                  onClick={this.fileSubmit}
                >
                  Submit
                </Button>
              </div>
            )}
          </div>
        ) : (
          <CircularProgress
            className={classNames(classes.loading)}
            color="secondary"
            size={50}
          />
        )}
      </div>
    );
  }
}

//export default withStyles(styles)(SimpleTable);

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  class: state.class
});

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    { getClass }
  )
)(StudentAssignment);
