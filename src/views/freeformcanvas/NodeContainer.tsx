import { observer } from "mobx-react";
import { NodeCollectionStore } from "../../stores/NodeCollectionStore";
import { StaticTextNodeStore } from "../../stores/StaticTextNodeStore";
import { VideoNodeStore } from "../../stores/VideoNodeStore";
import { TextNodeView } from "../nodes/TextNodeView";
import { VideoNodeView } from "../nodes/VideoNodeView";
import "./FreeFormCanvas.scss";
import React = require("../../../node_modules/react");
import { WebNodeStore } from "../../stores/WebNodeStore";
import { WebNodeView } from "../nodes/WebNodeView";
import { PdfNodeStore } from "../../stores/PdfNodeStore";
import { PdfNodeView } from "../nodes/PdfNodeView";
import { ImageNodeStore } from "../../stores/ImageNodeStore";
import { ImageNodeView } from "../nodes/ImageNodeView";
import { RichTextNodeStore } from "../../stores/RichTextNodeStore";
import { RichTextNodeView } from "../nodes/RichTextNodeView";
import { CollectionNodeStore } from "../../stores/CollectionNodeStore";
import { CollectionNodeView } from "../nodes/CollectionNodeView";
import { InkNodeStore } from "../../stores/InkNodeStore";
import { InkNodeView } from "../nodes/InkNodeView";
import { Component } from "react";

interface IProps {
    store: NodeCollectionStore
}

/*
This class maps the nodes on the screen as components. It first
renders the node container, then it checks to see if the node
should be displayed. If it should, then it checks to see what kind
of node it is by checking to see what class the node store is an
instance of. Depending on what type of node it is, it will render 
that node's nodeview class. 
*/
@observer
export class NodeContainer extends Component<IProps> {

    render() {
        return (
            <div className="node-container">
                {this.props.store.Nodes.map(nodeStore => {

                    if (nodeStore.toDisplay){

                        if (nodeStore instanceof StaticTextNodeStore) {
                            return (<TextNodeView key={nodeStore.Id} store={nodeStore as StaticTextNodeStore} />)
                        } else if (nodeStore instanceof VideoNodeStore) {
                            return (<VideoNodeView key={nodeStore.Id} store={nodeStore as VideoNodeStore} />)
                        } else if (nodeStore instanceof WebNodeStore) {
                            return (<WebNodeView key={nodeStore.Id} store={nodeStore as WebNodeStore} />)
                        } else if (nodeStore instanceof PdfNodeStore) {
                            return (<PdfNodeView key={nodeStore.Id} store={nodeStore as PdfNodeStore} />)
                        } else if (nodeStore instanceof ImageNodeStore) {
                            return (<ImageNodeView key={nodeStore.Id} store={nodeStore as ImageNodeStore} />)
                        } else if (nodeStore instanceof RichTextNodeStore) {
                            return (<RichTextNodeView key={nodeStore.Id} store={nodeStore as RichTextNodeStore} />)
                        } else if (nodeStore instanceof CollectionNodeStore) {
                            return (<CollectionNodeView key={nodeStore.Id} store={nodeStore as CollectionNodeStore} />)
                        } else if (nodeStore instanceof InkNodeStore) {
                            return (<InkNodeView key={nodeStore.Id} store={nodeStore as InkNodeStore} />)
                        }
                    }
                })}
            </div>
        );
    }
}