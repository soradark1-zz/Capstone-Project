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

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import annoationColors from "../common/annoationColors.json";

//https://codesandbox.io/s/8k2m333m92?from-embed

const styles = theme => ({
  annoationPlacement: {
    position: "absolute",
    top: 0,
    marginTop: "8.7rem"
  },
  annoationDisplay: {
    display: "flex"
  },
  button: {
    textTransform: "inherit",
    margin: "0.6rem",
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
    marginLeft: "2rem",
    marginTop: "-3.7rem"
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
  state = {
    rectangles: this.props.annoations.rectangles,
    selectedShapeName: "",
    scale: Math.min(window.innerWidth / this.props.stageWidth, 1),
    colorSelected: 0
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.annoations !== this.props.annoations) {
      //Updates the current page's annoations before loading next page
      //Does not save those changes to database
      this.props.updateAnnoations(
        { rectangles: this.state.rectangles },
        this.props.pageNumber
      );

      //Next page doesn't have any annoations
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
      //Next page does have annoations already
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
    const rectangles = this.state.rectangles.concat();
    rectangles[index] = {
      ...rectangles[index],
      ...newProps
    };

    this.setState({ rectangles });
  };

  handleCommentChange = (evt, index) => {
    const rectangles = this.state.rectangles;
    rectangles[index] = {
      ...rectangles[index],
      comment: evt.target.value
    };

    this.setState({ rectangles });
  };

  addNewRect = () => {
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
      comment: "This is a brand new comment!"
    };

    let rects = this.state.rectangles;
    rects.push(newRect);

    this.setState({
      rectangles: rects
    });
  };

  updateHighlight = name => {
    let rects = this.state.rectangles;

    //Resets all highlights to none
    if (name === "") {
      for (let i = 1; i < this.state.rectangles.length + 1; i++) {
        //let selComment = document.getElementById(`comment${i}`);
        //selComment.classList.remove("selected-comment");
        rects[i - 1].strokeEnabled = false;
      }
      return;
    }

    //Highlights selected annoation
    let index = name.slice(4);
    console.log(name);
    for (let i = 1; i < this.state.rectangles.length + 1; i++) {
      //let selComment = document.getElementById(`comment${i}`);
      if (i === Number(index)) {
        //selComment.classList.add("selected-comment");

        //let strokeColor = rects[i - 1].fill.replace("0.35", "1");
        rects[i - 1].strokeEnabled = true;
      } else {
        //selComment.classList.remove("selected-comment");
        rects[i - 1].strokeEnabled = false;
      }
    }
  };

  removeRect = () => {
    if (this.state.selectedShapeName === "") {
      return;
    }
    const name = this.state.selectedShapeName;
    const rect = this.state.rectangles.find(r => r.name === name);

    // /const indexRect = this.state.rectangles.indexOf(rect);

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

  sizeOfStage = () => {
    this.setState({
      scale: Math.min(window.innerWidth / this.props.stageWidth, 1)
    });
  };

  handleColorChange = evt => {
    this.setState({
      colorSelected: evt.target.value
    });
  };

  render() {
    //console.log(this.props);

    const { scale, selectedShapeName } = this.state;
    const { stageWidth, stageHeight, isLoaded } = this.props;
    const { classes } = this.props;

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
              {this.state.rectangles.map((rect, i) => (
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
            <FormControl>
              <InputLabel>Color</InputLabel>
              <Select
                value={this.state.colorSelected}
                onChange={this.handleColorChange}
                input={<Input name="colorSelected" />}
                autoWidth
              >
                <MenuItem value={0}>Red</MenuItem>
                <MenuItem value={1}>Green</MenuItem>
                <MenuItem value={2}>Blue</MenuItem>
                <MenuItem value={3}>Yellow</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              disabled={this.state.rectangles.length >= 20}
              onClick={this.addNewRect}
              className={classNames(classes.button)}
            >
              Add
            </Button>

            <Button
              variant="contained"
              disabled={selectedShapeName === ""}
              onClick={this.removeRect}
              className={classNames(classes.button)}
            >
              Remove
            </Button>

            <div>
              <div className={classNames(classes.commentList)}>
                {this.state.rectangles.map((rect, i) => (
                  <ExpansionPanel
                    expanded={selectedShapeName === rect.name}
                    id={`comment${i}`}
                  >
                    <ExpansionPanelSummary
                      onClick={() => {
                        console.log(rect);
                        this.updateHighlight(rect.name);
                        this.setState(
                          {
                            selectedShapeName: rect.name
                          },
                          () => {
                            //this.updateHighlight(selectedShapeName);
                          }
                        );
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
                        margin="none"
                        variant="standard"
                        multiline
                        fullWidth
                        rowsMax="4"
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
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Annoation);
