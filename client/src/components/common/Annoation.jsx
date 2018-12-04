import React, { Component } from "react";
import { Stage, Layer, Rect, Transformer } from "react-konva";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";

import TextField from "@material-ui/core/TextField";
import Icon from "@material-ui/core/Icon";

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import Hidden from "@material-ui/core/Hidden";

import Dialog from "@material-ui/core/Dialog";
//import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
//import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import annoationColors from "../common/annoationColors.json";

const styles = theme => ({
  annoationPlacement: {
    //position: "absolute",
    //top: 0,
    //marginTop: "8.7rem"
    marginTop: "3.7rem",
    gridColumnStart: "pdf-start",
    gridColumnEnd: "menu-end",
    gridRow: 1
  },
  annoationDisplay: {
    display: "grid",
    gridTemplateColumns: "auto",
    //gridTemplateAreas: "stage comments",
    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: "auto auto"
      //gridTemplateAreas: "stage comments"
    }
  },
  button: {
    textTransform: "inherit",
    marginTop: "0.6rem",
    marginBottom: "0.6rem",
    marginLeft: "0.6rem",
    fontSize: "1.2rem",
    backgroundColor: theme.palette.secondary.main
  },
  commentList: {
    width: "20rem"
  },
  commentPrev: {
    maxWidth: "14.5rem"
  },
  annoationMenu: {
    marginLeft: "",
    marginTop: "",
    width: "",
    [theme.breakpoints.up("md")]: {
      //marginLeft: "1rem",
      marginTop: "-3.7rem",
      width: "20rem"
    }
  },
  moblieMenu: {
    display: "inline-flex",
    marginTop: "1rem"
  },
  final: {
    display: "grid",
    gridColumnStart: 1,
    gridColumnEnd: 2,
    width: "95%",
    margin: "auto",
    [theme.breakpoints.up("md")]: {
      gridColumnEnd: 3,
      marginLeft: "20%",
      marginRight: "20%",
      width: "auto"
    }
  },
  dialog: {
    width: "50vw",
    minWidth: "200px"
  }
});

class Rectangle extends React.Component {
  handleChange = e => {
    const shape = e.target;
    // take a look into width and height properties
    // by default Transformer will change scaleX and scaleY
    // while transforming
    // so we need to adjust that properties to width and height
    this.props.onTransform({
      x: shape.x(),
      y: shape.y(),
      width: shape.width() * shape.scaleX(),
      height: shape.height() * shape.scaleY(),
      rotation: shape.rotation()
    });
  };
  render() {
    return (
      <Rect
        x={this.props.x}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
        // force no scaling
        // otherwise Transformer will change it
        scaleX={1}
        scaleY={1}
        fill={this.props.fill}
        name={this.props.name}
        // save state on dragend or transformend
        onDragEnd={this.handleChange}
        onTransformEnd={this.handleChange}
        draggable
        stroke={this.props.stroke}
        strokeWidth={2}
        strokeEnabled={this.props.strokeEnabled}
        strokeScaleEnabled={false}
      />
    );
  }
}

class TransformerComponent extends React.Component {
  state = {
    selectedShapeName: this.props.selectedShapeName
  };

  componentDidMount() {
    this.checkNode();
  }
  componentDidUpdate(prevProps) {
    this.checkNode();
  }

  checkNode() {
    // here we need to manually attach or detach Transformer node
    const stage = this.transformer.getStage();
    const { selectedShapeName } = this.props;

    const selectedNode = stage.findOne("." + selectedShapeName);
    // do nothing if selected node is already attached
    if (selectedNode === this.transformer.node()) {
      return;
    }

    if (selectedNode) {
      // attach to another node
      this.transformer.attachTo(selectedNode);
    } else {
      // remove transformer
      this.transformer.detach();
    }
    this.transformer.getLayer().batchDraw();
  }
  render() {
    return (
      <Transformer
        ref={node => {
          this.transformer = node;
        }}
        keepRatio={false}
        rotateEnabled={false}
      />
    );
  }
}

class Annoation extends Component {
  constructor(props) {
    super(props);
    this.saveChanges = this.saveChanges.bind(this);
  }

  state = {
    rectangles: this.props.annoations.rectangles,
    selectedShapeName: "",
    scale: Math.min(window.innerWidth / this.props.stageWidth, 1),
    colorSelected: 0,
    dialogOpen: false,
    finalComment: this.props.finalComment,
    grade: this.props.grade
  };

  componentWillMount() {
    this.setState({
      finalComment: this.props.finalComment,
      grade: this.props.grade
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.annoations !== this.props.annoations) {
      //Updates the current page's annoations before loading next page
      //Does not save those changes to database
      this.props.updateAnnoations(
        { rectangles: this.state.rectangles },
        this.props.pageNumber
      );

      //Next page doesn't have any annoations, make empty list
      if (nextProps.annoations === undefined) {
        this.setState(
          {
            rectangles: [],
            selectedShapeName: ""
          },
          () => {
            this.updateHighlight("");
          }
        );
      }
      //Next page does have annoations already, load those
      else {
        this.setState(
          {
            rectangles: nextProps.annoations.rectangles,
            selectedShapeName: ""
          },
          () => {
            this.updateHighlight("");
          }
        );
      }
    }
  }

  handleStageMouseDown = e => {
    // clicked on stage - clear selection
    if (e.target === e.target.getStage()) {
      this.updateHighlight("");
      this.setState({
        selectedShapeName: ""
      });
      return;
    }

    // clicked on transformer - do nothing
    const clickedOnTransformer =
      e.target.getParent().className === "Transformer";
    if (clickedOnTransformer) {
      return;
    }

    // find clicked rect by its name
    const name = e.target.name();
    this.updateHighlight(name);
    const rect = this.state.rectangles.find(r => r.name === name);
    if (rect) {
      this.setState({
        selectedShapeName: name
      });
    } else {
      this.setState({
        selectedShapeName: ""
      });
    }
  };

  handleRectChange = (index, newProps) => {
    //Handles change of position and size of rectangles
    const rectangles = this.state.rectangles.concat();
    rectangles[index] = {
      ...rectangles[index],
      ...newProps
    };

    //Sorts rectangles by their new positions
    const rect = rectangles.find(r => r.name === rectangles[index].name);
    rectangles.sort(
      (rect1, rect2) => (rect1.y > rect2.y ? 1 : rect2.y > rect1.y ? -1 : 0)
    );
    const rectIndex = rectangles.indexOf(rect);
    rectangles.map((rect, i) => (rect.name = `rect${i + 1}`));

    this.setState({
      rectangles,
      selectedShapeName: `rect${rectIndex + 1}`
    });
  };

  addNewRect = () => {
    //Creates and adds new rectangle based on selected color
    const colorSelected = this.state.colorSelected;
    const newRect = {
      x: 10,
      y: 10,
      width: 100,
      height: 100,
      fill: annoationColors.colors[colorSelected].fill,
      name: `rect${this.state.rectangles.length + 1}`,
      stroke: annoationColors.colors[colorSelected].stroke,
      strokeEnabled: false,
      comment: ""
    };
    let rectangles = this.state.rectangles;
    rectangles.push(newRect);

    //Sorts all rectangles with new rectangle
    const rect = rectangles.find(r => r.name === this.state.selectedShapeName);
    rectangles.sort(
      (rect1, rect2) => (rect1.y > rect2.y ? 1 : rect2.y > rect1.y ? -1 : 0)
    );
    const rectIndex = rectangles.indexOf(rect);
    rectangles.map((rect, i) => (rect.name = `rect${i + 1}`));

    this.setState({
      rectangles
    });
  };

  removeRect = () => {
    if (this.state.selectedShapeName === "") {
      return;
    }
    const name = this.state.selectedShapeName;
    const rect = this.state.rectangles.find(r => r.name === name);

    var filteredRect = this.state.rectangles.filter(function(value) {
      return value !== rect;
    });

    for (let i = 0; i < filteredRect.length; i++) {
      filteredRect[i].name = `rect${i + 1}`;
    }

    this.setState({
      rectangles: filteredRect,
      selectedShapeName: ""
    });
  };

  updateHighlight = name => {
    let rects = this.state.rectangles;

    //Resets all highlights to none
    if (name === "") {
      for (let i = 1; i < this.state.rectangles.length + 1; i++) {
        rects[i - 1].strokeEnabled = false;
      }
      return;
    }

    //Highlights selected annoation
    let index = name.slice(4);
    console.log(name);
    for (let i = 1; i < this.state.rectangles.length + 1; i++) {
      if (i === Number(index)) {
        rects[i - 1].strokeEnabled = true;
      } else {
        rects[i - 1].strokeEnabled = false;
      }
    }
    //document.getElementById(`comment${index}`).focus();
  };

  handleColorChange = evt => {
    this.setState({
      colorSelected: evt.target.value
    });
  };

  handleCommentChange = (evt, index) => {
    const rectangles = this.state.rectangles;
    rectangles[index] = {
      ...rectangles[index],
      comment: evt.target.value
    };

    this.setState({ rectangles });
  };

  handleDialog = () => {
    this.setState({ dialogOpen: !this.state.dialogOpen });
  };

  selectedCommentDialog = () => {
    const { rectangles, selectedShapeName } = this.state;

    let rect = rectangles.find(rect => {
      return rect.name === selectedShapeName;
    });

    if (rect === undefined) return;

    //console.log("DIALOG", rect);

    let rectIndex = parseInt(rect.name.slice(4)) - 1;
    //console.log(rectIndex);
    return (
      <TextField
        id={`comment${rectIndex + 1}`}
        margin="none"
        variant="standard"
        multiline
        fullWidth
        rowsMax="10"
        value={rect.comment}
        onChange={evt => {
          this.handleCommentChange(evt, rectIndex);
        }}
      />
    );
  };

  handleFinalComment = evt => {
    this.setState({
      finalComment: evt.target.value
    });
  };

  handleGrade = evt => {
    let newGrade = evt.target.value;
    if (newGrade === "") {
      this.setState({
        grade: newGrade
      });
      return;
    }
    newGrade = parseInt(newGrade, 10);

    if (isNaN(newGrade)) return;

    this.setState({
      grade: newGrade
    });
  };

  sizeOfStage = () => {
    //let pdfWidth = document.getElementById("pdfpage").offsetWidth;
    //console.log(pdfWidth);
    this.setState({
      scale: Math.min(window.innerWidth / this.props.stageWidth, 1)
    });
  };

  saveChanges() {
    this.props.updateComments(
      { rectangles: this.state.rectangles },
      this.props.pageNumber,
      this.state.grade,
      this.state.finalComment
    );
  }

  render() {
    //console.log(styles);

    const { scale, selectedShapeName, colorSelected, rectangles } = this.state;
    const { stageWidth, stageHeight, isLoaded } = this.props;
    const { classes } = this.props;
    const commentHeight = {
      height: stageHeight
    };

    const colorSelectedStyle = {
      color: annoationColors.colors[colorSelected].fill.replace("0.35", "1")
    };

    const commentDialog = (
      <Dialog open={this.state.dialogOpen} onClose={this.handleDialog}>
        <DialogTitle>{`Comment ${selectedShapeName.slice(4)}`}</DialogTitle>
        <DialogContent className={classNames(classes.dialog)}>
          {this.selectedCommentDialog()}
        </DialogContent>
      </Dialog>
    );

    const annoationMenu = (
      <div>
        <FormControl>
          <InputLabel>Color</InputLabel>
          <Select
            value={this.state.colorSelected}
            onChange={this.handleColorChange}
            input={<Input name="colorSelected" />}
            style={colorSelectedStyle}
            autoWidth
          >
            <MenuItem
              value={0}
              style={{
                color: annoationColors.colors[0].fill.replace("0.35", "1")
              }}
            >
              Red
            </MenuItem>
            <MenuItem
              value={1}
              style={{
                color: annoationColors.colors[1].fill.replace("0.35", "1")
              }}
            >
              Green
            </MenuItem>
            <MenuItem
              value={2}
              style={{
                color: annoationColors.colors[2].fill.replace("0.35", "1")
              }}
            >
              Blue
            </MenuItem>
            <MenuItem
              value={3}
              style={{
                color: annoationColors.colors[3].fill.replace("0.35", "1")
              }}
            >
              Yellow
            </MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          disabled={rectangles.length >= 20}
          onClick={this.addNewRect}
          className={classNames(classes.button)}
        >
          <Icon className="fas fa-plus" />
        </Button>

        <Button
          variant="contained"
          disabled={selectedShapeName === ""}
          onClick={this.removeRect}
          className={classNames(classes.button)}
        >
          <Icon className="fas fa-minus" />
        </Button>
      </div>
    );

    //console.log("STATE", this.props);

    window.addEventListener("resize", this.sizeOfStage);
    return (
      <div
        className={classNames(
          isLoaded ? classes.annoationPlacement : "no-display"
        )}
      >
        <div className={classNames(classes.annoationDisplay)}>
          <Stage
            className=""
            width={stageWidth * scale}
            height={stageHeight * scale}
            scaleX={scale}
            scaleY={scale}
            onMouseDown={this.handleStageMouseDown}
            onTap={this.handleStageMouseDown}
            ref={node => {
              this.stage = node;
            }}
          >
            <Layer>
              {rectangles.map((rect, i) => (
                <Rectangle
                  key={i}
                  {...rect}
                  onTransform={newProps => {
                    this.handleRectChange(i, newProps);
                  }}
                />
              ))}
              <TransformerComponent
                selectedShapeName={selectedShapeName}
                ref={node => {
                  this.transformer = node;
                }}
              />
            </Layer>
          </Stage>

          <div className={classNames(classes.annoationMenu)}>
            <Hidden smDown>
              {annoationMenu}
              <div
                data-simplebar
                data-simplebar-auto-hide="false"
                style={commentHeight}
              >
                <div className={classNames(classes.commentList)}>
                  {rectangles.map((rect, i) => (
                    <ExpansionPanel expanded={selectedShapeName === rect.name}>
                      <ExpansionPanelSummary
                        onClick={() => {
                          console.log(rect);
                          this.updateHighlight(rect.name);
                          this.setState({
                            selectedShapeName: rect.name
                          });
                        }}
                      >
                        <Typography
                          className={classNames(classes.commentPrev)}
                          color={
                            selectedShapeName === rect.name
                              ? "secondary"
                              : "default"
                          }
                          noWrap
                        >
                          {selectedShapeName === `rect${i + 1}`
                            ? `Comment ${i + 1}`
                            : rect.comment}
                        </Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <TextField
                          id={`comment${i + 1}`}
                          margin="none"
                          variant="standard"
                          multiline
                          fullWidth
                          rowsMax="10"
                          value={rect.comment}
                          onChange={evt => {
                            this.handleCommentChange(evt, i);
                          }}
                        />
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  ))}
                </div>
              </div>
            </Hidden>

            <Hidden mdUp>
              <div className={classNames(classes.moblieMenu)}>
                {annoationMenu}
                <Button
                  onClick={this.handleDialog}
                  disabled={selectedShapeName === ""}
                  variant="contained"
                  className={classNames(classes.button)}
                >
                  Edit
                </Button>
              </div>
              {commentDialog}
            </Hidden>
          </div>

          <div className={classNames(classes.final)}>
            <TextField
              variant="outlined"
              label="Final Comments"
              multiline
              fullWidth
              rowsMax="10"
              value={this.state.finalComment}
              margin="normal"
              onChange={this.handleFinalComment}
            />
            <TextField
              variant="outlined"
              label="Grade"
              value={this.state.grade}
              margin="normal"
              onChange={this.handleGrade}
            />
            <div>
              <Button
                variant="contained"
                className={classNames(classes.button)}
                onClick={this.saveChanges}
              >
                Save
              </Button>
              <Button
                variant="contained"
                className={classNames(classes.button)}
                onClick={this.saveChanges}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Annoation);
