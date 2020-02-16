import { observer } from "mobx-react";
import { ImageNodeStore } from "../../stores/ImageNodeStore";
import "./NodeView.scss";
import { TopBar } from "./TopBar";
import "./ImageNodeView.scss";
import React = require("react");
import { observable } from "mobx";

/*
This is the class that displays the image node. It takes in a 
image node store that contains all the relevant variables of the 
image node. Then it renders the image node. It first renders 
the top bar, then the button to add links, and finally adds a scroll
box and title. The last thing that it renders (the actual content of
the node) is the image itself. It does this by using the TS image 
element and drawing on the URL for the image from it's store.
The class also contains various methods to control the node.
*/
interface IProps {
    store: ImageNodeStore;
}

@observer
export class ImageNodeView extends React.Component<IProps> {
    
    render() {
        let store = this.props.store;
        return (
            <div className="node image-node" onClick = {this.onClick} style={{ transform: store.Transform }}
            onPointerDown={this.onPointerDown}>
                <TopBar store={store} nodeCollection = {this.props.store.parentCollectionStore}/>
                <button className="btn" onClick = {this.onLinkClick}> Add Link </button>
                <button className="btn" onClick = {this.duplicate}> Duplicate Node </button>
                <div className="scroll-box">
                    <div className="content" id = {this.props.store.Id}>
                        <h3 className="title" contentEditable = {true}> {store.Title}</h3>
                        <img className="image" src = {store.Url} />
                    </div>
                </div>
            </div>
        );
    }

    /*
    This method duplicates the image node. It creates a new node with all 
    the same variables as the old node and then adds that node to the parent 
    collection.
    */
    duplicate = () => {
        let newNode: ImageNodeStore = new ImageNodeStore({ X: this.props.store.X - 100, 
            Y: this.props.store.Y - 100, 
            Title: this.props.store.Title, 
            Url: this.props.store.Url, 
            parentCollectionStore: this.props.store.parentCollectionStore,  type: "image"  });
        this.props.store.parentCollectionStore.AddNode(newNode);
    }

    /*
    This method is called when the add link button is clicked. It calls on the method 
    in the link collection store (in the node collection to which this node belongs) to
    add this node as one end of a link.
    */
    onLinkClick = () => {
        this.props.store.parentCollectionStore.links.AddLink(this.props.store);
    }

    /*
    This method is called any time the node is clicked. It increases the z-Index of the 
    node in order to bring it to the front (so that any time it is clicked, it is
    on top). It does this by setting it's z-Index to 1 + the variable in the node
    collection store that indicates the z-Index of the top most node.
    */
    onClick = (event) => {
        document.getElementById(this.props.store.Id).parentElement.parentElement.style.zIndex 
        = (this.props.store.parentCollectionStore.zIndex++).toString();
    }

    /*
    This method is here to make sure that when this node is clicked on, the free form 
    canvas doesn't simply move around and that the node is resizable.
    */
    onPointerDown = (e: React.PointerEvent): void => {
        e.stopPropagation();
    }
}