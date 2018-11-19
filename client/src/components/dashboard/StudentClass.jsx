import React from "react";

import { connect } from "react-redux";
import compose from "recompose/compose";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import moment from "moment";

import { dropClass } from "../../actions/classesActions";

const styles = theme => ({
  button: {
    textTransform: "inherit",
    margin: "0.6rem",
    fontSize: "1.2rem",
    backgroundColor: theme.palette.secondary.main
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

class StudnetClass extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      className: "",
      classCode: ""
    };

    this.dropClass = this.dropClass.bind(this);
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

      //Is enrolled in class
      if (currentClass) {
        this.setState({
          className: currentClass.name,
          classCode: currentClass.code
        });
      }
      //If not enrolled, redirect to Dashboard
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

  dropClass() {
    const newClassData = {
      code: this.state.classCode
    };

    this.props.dropClass(newClassData);
  }

  render() {
    const { classes } = this.props;
    const { className } = this.state;
    return (
      <div>
        <h1>{className}</h1>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Assignments</TableCell>
                <TableCell>Dates</TableCell>
                <TableCell>Date Due</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Submited</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => {
                return (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>{row.calories}</TableCell>
                    <TableCell>{row.fat}</TableCell>
                    <TableCell>{row.carbs}</TableCell>
                    <TableCell>{row.protein}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>

        <Button
          className={classNames(classes.button)}
          variant="contained"
          size="large"
          onClick={this.dropClass}
        >
          Drop Class
        </Button>
      </div>
    );
  }
}

//export default withStyles(styles)(SimpleTable);

const mapStateToProps = state => ({
  user: state.auth.user
});

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    { dropClass }
  )
)(StudnetClass);
