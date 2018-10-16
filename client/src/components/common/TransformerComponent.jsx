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

export default class App extends Component {
  state = {
    rectangles: data.rectangles,
    comments: data.comments,
    commentColor: "white",
    selectedShapeName: ""
  };
  handleStageMouseDown = e => {
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

    this.setState({
      rectangles: rects
    });
  };

  handleStageMouseOver = e => {
    if (e.target === e.target.getStage()) {
      this.setState({
        selectedShapeName: ""
      });
      return;
    }
  };

  removeRect = () => {
    if (this.state.selectedShapeName === "") {
      return;
    }
    const name = this.state.selectedShapeName;
    const rect = this.state.rectangles.find(r => r.name === name);

    var filtered = this.state.rectangles.filter(function(value, index, arr) {
      return value !== rect;
    });

    this.setState({
      rectangles: filtered
    });
  };

  render() {
    console.log(this.state);
    return (
      <div>
        <Stage
          className="annoation-layer"
          width={612}
          height={796}
          onMouseDown={this.handleStageMouseDown}
          onClick={() => {
            this.setState({
              commentColor: "red"
            });
          }}
          onMouseOut={() => {
            this.setState({
              commentColor: "white"
            });
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
            <div
              id={`comment${i + 1}`}
              style={{ color: this.state.commentColor }}
            >
              {comm}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
