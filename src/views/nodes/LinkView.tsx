import { observer } from "mobx-react";
import "../freeformcanvas/FreeFormCanvas.scss";
import React = require("react");
import { LinkStore } from "../../stores/LinkStore";

/*
This is the class that renders the links themselves. It renders
a link with it's coordinates set according to the coordinates of the 
nodes that it is linking. It's on click function is the only other 
main part of this class. It handles what happens when the link is clicked 
on. It leads it to the node that the click is further from.
*/
interface IProps {
    store: LinkStore;
}

@observer
export class LinkView extends React.Component<IProps> {

    private firstDistance: number = 0;
    private otherDistance: number = 0;

    render() {
        let store = this.props.store;
        return (
            <div className = "link" onPointerDown = {this.onPointerDown} style={{ transform: store.Transform }}>
            <svg style = {{position: "absolute", overflow: "visible"}}>
            <line x1={(store.firstNode.X + store.nodeStorage.X + 150 - store.nodeStorage.xAdjustment*2)/store.nodeStorage.Scale}
                y1={(store.firstNode.Y + store.nodeStorage.Y + 20 - store.nodeStorage.yAdjustment*2)/store.nodeStorage.Scale} 
                x2={(store.otherNode.X + store.nodeStorage.X + 150 - store.nodeStorage.xAdjustment*2)/store.nodeStorage.Scale} 
                y2={(store.otherNode.Y + store.nodeStorage.Y + 20 - store.nodeStorage.yAdjustment*2)/store.nodeStorage.Scale} 
                style={{stroke:"black", strokeWidth:7}}/>
            </svg>
            </div>
        );
    }

    /*
    This method takes in the location of the click and determines the distance between
    that click ad each node that the link is connecting. Depending on which distance
    is larger, it will move the canvas to center that link.
    */
    onPointerDown = (e: React.PointerEvent): void => {
        e.stopPropagation();

        //using the distance formula to calculate both distances
        this.firstDistance = Math.sqrt(Math.pow((e.screenX - this.props.store.nodeStorage.xAdjustment 
            - this.props.store.firstNode.X - 150), 2) + 
            Math.pow((e.screenY - this.props.store.nodeStorage.yAdjustment - this.props.store.firstNode.Y - 150),2));
        this.otherDistance = Math.sqrt(Math.pow((e.screenX - this.props.store.nodeStorage.xAdjustment 
            - this.props.store.otherNode.X - 150),2) + 
            Math.pow((e.screenY - this.props.store.nodeStorage.yAdjustment - this.props.store.otherNode.Y - 150),2));
          
        //leading to the node whose distance is larger
        if (this.firstDistance > this.otherDistance){
            let nodeDim = document.getElementById(this.props.store.firstNode.Id).getBoundingClientRect();
            let horizontal = nodeDim.left;
            let vertical = nodeDim.top;
            this.props.store.nodeStorage.X = this.props.store.nodeStorage.X - horizontal + window.innerWidth/3;
            this.props.store.nodeStorage.Y = this.props.store.nodeStorage.Y - vertical + window.innerHeight/3;

            //updating the canvas adjustments
            this.props.store.nodeStorage.xAdjustment = this.props.store.nodeStorage.xAdjustment - horizontal + window.innerWidth/3;
            this.props.store.nodeStorage.yAdjustment = this.props.store.nodeStorage.yAdjustment - vertical + window.innerHeight/3;
        } else {
            let nodeDim = document.getElementById(this.props.store.otherNode.Id).getBoundingClientRect();
            let horizontal = nodeDim.left;
            let vertical = nodeDim.top;
            this.props.store.nodeStorage.X = this.props.store.nodeStorage.X - horizontal + window.innerWidth/3;
            this.props.store.nodeStorage.Y = this.props.store.nodeStorage.Y - vertical + window.innerHeight/3;
            
            //updating the canvas adjustments
            this.props.store.nodeStorage.xAdjustment = this.props.store.nodeStorage.xAdjustment - horizontal + window.innerWidth/3;
            this.props.store.nodeStorage.yAdjustment = this.props.store.nodeStorage.yAdjustment - vertical + window.innerHeight/3;
        }

        //reseting the distances
        this.firstDistance = 0;
        this.otherDistance = 0;
    }
}