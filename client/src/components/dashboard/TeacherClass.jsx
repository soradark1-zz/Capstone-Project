import React from "react";
import { Link } from "react-router-dom";

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
import Divider from '@material-ui/core/Divider';

import CircularProgress from "@material-ui/core/CircularProgress";

import { deleteClass, getClass } from "../../actions/classesActions";

import moment from "moment";

const styles = theme => ({
  button: {
    textTransform: "inherit",
    margin: "0.6rem",
    fontSize: "1.2rem",
    backgroundColor: theme.palette.secondary.main,
	marginTop: 30
  },
  loading: {
    marginTop: "45vh",
    marginLeft: "-25px",
    position: "absolute",
    top: 0
  },
  table: {
    minWidth: 700,
    whiteSpace: "pre-line",
	marginTop: 30
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
  constructor(props) {
    super(props);

    this.state = {
      className: "",
      classCode: ""
    };

    this.deleteClass = this.deleteClass.bind(this);
    this.getClass = this.getClass.bind(this);
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params !== this.props.match.params) {
      this.props.getClass({});
      this.setClass();
    }
  }

  componentDidMount() {
    this.setClass();
  }

  componentWillUnmount() {
    this.props.getClass({});
  }

  deleteClass() {
    const newClassData = {
      code: this.state.classCode
    };
    this.props.deleteClass(newClassData);
    this.props.history.push(`/dashboard`);
  }

  getClass() {
    const newClassData = {
      code: this.state.classCode
    };

    this.props.getClass(newClassData);
  }

  render() {
    const { classes } = this.props;
    const { className, classCode } = this.state;
    console.log(this.props);
    return (
      <div>
        {this.props.class.isLoaded ? (
          <div>
            <h1>{className}</h1>
            <div>Class Code: {classCode}</div>
			<Paper className={classes.root}>
          <Table className={classes.table}>
		  <TableHead>
			<TableRow>
				<TableCell>Enrolled Students</TableCell>
			</TableRow>
		  </TableHead>
            <TableBody>
			  {this.props.class.enrolled_students &&
              this.props.class.enrolled_students.map((studnet, i) => {
			return (
				<TableRow key={i}>
					<TableCell>
					<div key={i}>{studnet.name}</div>
					</TableCell>
				</TableRow>
              );
              })}
            </TableBody>
          </Table>
        </Paper>
		
		
			  
		<Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Assignments</TableCell>
                <TableCell>Dates</TableCell>
                <TableCell>Grade</TableCell>
				<TableCell>Download</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.class.assignments && this.props.class.assignments.map((assignment,i) => {
                return (
                  <TableRow key={i}>
                    <TableCell>
						<Link
							to={this.props.match.url + `/assignment/${assignment._id}`}
							key={i}
						>
							{assignment.assignment_name}
						</Link>
                    </TableCell>
                    <TableCell>
						<div
							key={i}
						>
							{assignment.date_due}
						</div>
						<div
							key={i}
						>
							{assignment.date_assigned}
						</div>
					</TableCell>
                    <TableCell>
						<div
							key={i}
						>
							{assignment.grade} / {assignment.max_grade}
						</div>
					</TableCell>
                    <TableCell>
						<Link
							to={this.props.match.url + `/assignment/${assignment._id}`}
							key={i}
						>
							File{assignment.uploadFile}
						</Link>
					</TableCell>
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
              onClick={this.deleteClass}
            >
              Delete Class
            </Button>
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
    { deleteClass, getClass }
  )
)(TeacherClass);
