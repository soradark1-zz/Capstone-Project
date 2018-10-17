import React, { Component } from "react";
import { Stage, Layer, Rect, Transformer } from "react-konva";
import data from "./data.json";

//https://codesandbox.io/s/8k2m333m92?from-embed

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
        strokeScaleEnabled={false}
      />
    );
  }
}

class TransformerComponent extends React.Component {
  componentDidMount() {
    this.checkNode();
  }
  componentDidUpdate() {
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

export default class Annoation extends Component {
  state = {
    rectangles: data.rectangles,
    comments: data.comments,
    commentColor: "white",
    selectedShapeName: "",
    scale: Math.min(window.innerWidth / this.props.stageWidth, 1)
  };

  handleStageMouseDown = e => {
    this.handleStageClick(e);

    // clicked on stage - cler selection
    if (e.target === e.target.getStage()) {
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

  addNewRect = () => {
    const newRect = {
      x: 10,
      y: 10,
      width: 100,
      height: 100,
      fill: "rgba(255,255,0, 0.35)",
      name: `rect${this.state.rectangles.length + 1}`
    };

    let rects = this.state.rectangles;
    rects.push(newRect);
    let comms = this.state.comments;
    comms.push("This is a brand new comment!");

    this.setState({
      rectangles: rects,
      comments: comms
    });
  };

  handleStageClick = e => {
    let name = e.target.name();
    console.log(typeof e.target);
    if (name === undefined || !name.includes("rect")) return;
    let index = name[name.length - 1];
    let rects = this.state.rectangles;

    for (let i = 1; i < this.state.comments.length + 1; i++) {
      let selComment = document.getElementById(`comment${i}`);
      if (i === Number(index)) {
        selComment.classList.add("selected-comment");

        let strokeColor = rects[i - 1].fill.replace("0.35", "1");
        rects[i - 1].stroke = strokeColor;
      } else {
        selComment.classList.remove("selected-comment");
        rects[i - 1].stroke = "";
      }
    }
  };

  removeRect = () => {
    if (this.state.selectedShapeName === "") {
      return;
    }
    const name = this.state.selectedShapeName;
    const rect = this.state.rectangles.find(r => r.name === name);

    const indexRect = this.state.rectangles.indexOf(rect);

    var filteredRect = this.state.rectangles.filter(function(value) {
      return value !== rect;
    });

    var filteredComm = this.state.comments.filter(function(value, index) {
      return indexRect !== index;
    });

    this.setState({
      rectangles: filteredRect,
      comments: filteredComm
    });
  };

  sizeOfStage = () => {
    this.setState({
      scale: Math.min(window.innerWidth / this.props.stageWidth, 1)
    });
  };

  render() {
    //console.log(this.props);

    const { scale } = this.state;
    const { stageWidth, stageHeight } = this.props;
    window.addEventListener("resize", this.sizeOfStage);
    return (
      <div>
        <Stage
          className="annoation-layer"
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
              selectedShapeName={this.state.selectedShapeName}
            />
          </Layer>
        </Stage>
        <button type="button" onClick={this.addNewRect}>
          Add
        </button>
        <button type="button" onClick={this.removeRect}>
          Remove
        </button>
        <div>
          {this.state.comments.map((comm, i) => (
            <div id={`comment${i + 1}`} className="">
              {comm}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
