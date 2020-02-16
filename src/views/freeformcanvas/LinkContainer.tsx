import { observer } from "mobx-react";
import "./FreeFormCanvas.scss";
import React = require("../../../node_modules/react");
import { Component } from "react";
import {LinkView} from "../nodes/LinkView";
import { LinkStore } from "../../stores/LinkStore";
import { NodeCollectionStore } from "../../stores/NodeCollectionStore";
 

/*
This class maps the links on the screen as components. First it checks
if both of the nodes that it should be linking together are actually
on the screen (haven't been removed), if they are, then it renders
the LinkView class. If they shouldn't be it resets the value of 
the first node boolean.
*/

interface IProps {
    store: NodeCollectionStore
}

@observer
export class LinkContainer extends Component<IProps> {
    render() {
        return (
            <div className="link-container">
                {this.props.store.links.Links.map(linkStore => {
                    if(linkStore.firstNode.toDisplay && linkStore.otherNode.toDisplay){
                        return (<LinkView store={linkStore as LinkStore}/>)
                    } else {
                        this.props.store.links.firstLink = true;
                    }
                })}
            </div>
        );
    }
}