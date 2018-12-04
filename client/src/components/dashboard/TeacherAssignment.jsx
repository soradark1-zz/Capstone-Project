import React from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import compose from "recompose/compose";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import CircularProgress from "@material-ui/core/CircularProgress";

import { deleteClass, getClass } from "../../actions/classesActions";
import axios from "axios";

import moment from "moment";

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

class TeacherAssignment extends React.Component {
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
      submitted_docs: [],
      peer_grading_assignment: []
    };

    this.getClass = this.getClass.bind(this);
    this.assignPeerGraders = this.assignPeerGraders.bind(this);
  }

  setClass() {
    if (this.props.user.isLoaded) {
      const {
        match: { params }
      } = this.props;

      const teaching_classes = this.props.user.teaching_classes;
      const currentClass = teaching_classes.find(userClass => {
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

    this.setState({ ...assignment });

    console.log("Assignment", assignment);
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

  studnetName(studnetId) {
    //console.log("CLASS", this.props.class);
    const studnet = this.props.class.enrolled_students.find(student => {
      return student.id === studnetId;
    });

    if (studnet) {
      return studnet.name;
    }
    return "";
  }

  peerName(docId) {
    const doc = this.state.submitted_docs.find(doc => {
      return doc.doc_id === docId;
    });

    return this.studnetName(doc.owner);
  }

  assignPeerGraders() {
    const assignmentData = {
      assignment_name: this.state.assignment_name,
      code: this.state.classCode
    };
    axios
      .post("/api/classes/assign_graders", assignmentData)
      .then(res => {
        console.log("Peer Graders Assigned!");
      })
      .catch(err => {
        console.log(err);
      });
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
      max_grade,
      submitted_docs,
      peer_grading_assignment
    } = this.state;
    console.log(this.state);

    return (
      <div>
        {this.props.class.isLoaded ? (
          <div>
            <h1>{assignment_name}</h1>
            <div>Description: {description}</div>
            <div>Date Assigned: {`${moment(date_assigned).format("LLL")}`}</div>
            <div>Date Due: {`${moment(date_due).format("LLL")}`}</div>
            <div>Max Grade: {max_grade}</div>
            <br />
            <div>
              Student's Submissions:{" "}
              {submitted_docs.length > 0 &&
                submitted_docs.map((doc, i) => {
                  return (
                    <div>
                      <div>
                        <Link
                          style={{ color: "white" }}
                          to={this.props.match.url + `/${doc.doc_id}`}
                          key={i}
                        >
                          <div>{this.studnetName(doc.owner)}</div>
                        </Link>
                      </div>
                    </div>
                  );
                })}
            </div>

            <br />

            {peer_grading_assignment.length > 0 ? (
              <div>
                Peer Grading Assignments:
                {peer_grading_assignment.map((doc, i) => {
                  return (
                    <div>
                      {this.studnetName(doc.grader) +
                        " --> " +
                        this.peerName(doc.doc_id)}
                    </div>
                  );
                })}
              </div>
            ) : (
              <Button
                className={classNames(classes.button)}
                variant="contained"
                size="large"
                onClick={this.assignPeerGraders}
              >
                Assign Peer Graders
              </Button>
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
  user: state.auth.user,
  class: state.class
});

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    { deleteClass, getClass }
  )
)(TeacherAssignment);
