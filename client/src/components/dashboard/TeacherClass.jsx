import React from "react";

import { connect } from "react-redux";
import compose from "recompose/compose";

import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import moment from "moment";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700,
    whiteSpace: "pre-line"
  }
});

let id = 0;
function createData(name, calories, fat, carbs, protein) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}

const rows = [
  createData(
    "Homework 1",
    `Date Due: ${moment().format("LLL")}
     Date Due: ${moment().format("LLL")} `,
    "hello \n hello",
    "-/100",
    4.0
  ),
  createData("Homework 1", 159, 6.0, 24, 4.0)
];

class TeacherClass extends React.Component {
  state = {
    className: "",
    classCode: ""
  };

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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match !== this.props.match) {
      this.setClass();
    }
  }

  componentDidMount() {
    this.setClass();
  }

  render() {
    //const { classes } = this.props;
    const { className, classCode } = this.state;
    //console.log(this.props);
    return (
      <div>
        <h1>{className + " " + classCode}</h1>
      </div>
    );
  }
}

//export default withStyles(styles)(SimpleTable);

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    {}
  )
)(TeacherClass);
