import { observer } from "mobx-react";
import { NodeStore } from "../../stores/NodeStore";
import "./NodeView.scss";
import React = require("react");
import "./ExitButton.scss";
import { NodeCollectionStore } from "../../stores/NodeCollectionStore";

/*
This class renders the top bar. It renders the bar and the button
that it has to remove it. It contains a method to remove that 
node when the button is clicked. The class also contains pointer
event methods to handle when the top bar is moved so that the
node will move.
*/
interface IProps {
    store: NodeStore;
    nodeCollection: NodeCollectionStore;
}

@observer
export class TopBar extends React.Component<IProps> {

    //the pointer down class adds event listeners for pointer up and pointer move
    private _isPointerDown = false;
    onPointerDown = (e: React.PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this._isPointerDown = true;
        document.removeEventListener("pointermove", this.onPointerMove);
        document.addEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);
        document.addEventListener("pointerup", this.onPointerUp);
    }

    //removes the event listeners when the pointer goes up
    onPointerUp = (e: PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this._isPointerDown = false;
        document.removeEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);
    }

    //moves the node when the pointer is down and moves
    onPointerMove = (e: PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        if (!this._isPointerDown) {
            return;
        }
        if (this.props.store.freeForm && !this.props.store.gridView &&!this.props.store.stack){
            this.props.store.X += e.movementX / this.props.nodeCollection.Scale;
            this.props.store.Y += e.movementY / this.props.nodeCollection.Scale;
        }
    }

    /*
    rendering the actual top bar
    */
    render() {
        return <div className="top" onPointerDown={this.onPointerDown}>  
        <button onClick={this.exit} className="button"> X </button>
        </div>
    }

    /*
    This method changes the boolean toDisplay of the node to indicate that it
    should be removed and then physically removes it from the array.
    */
    exit = () => {
        this.props.store.toDisplay = false;
        var index = this.props.nodeCollection.Nodes.indexOf(this.props.store);;
        if (index > -1) { 
            this.props.nodeCollection.Nodes.splice(index, 1);
        }
    }
}
