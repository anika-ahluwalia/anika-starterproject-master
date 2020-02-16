import { observable, action } from "mobx";
import { LinkStore } from "./LinkStore";
import { NodeCollectionStore } from "./NodeCollectionStore";
import { NodeStore } from "./NodeStore";

/*
This class stores link collections. It's main purpose is to store the array
that contains all the links in a given collection. This array is an array of
LinkStores, another class that stores all the important properties for each 
indivdual link. It also takes in the collection of nodes to which
it belongs (which is useful to access in other classes). When a node's button
to add a link is clicked, this class is called. Thus, it has NodeStores that 
store the first and second node clicked on to be linked together. It also has
a boolean to indicate whether the node being clicked on is the first or second
node in this link (this is helpful because if it is the second one, it will
know to create the link). Finally, it includes a method to actually 
add the links.
The link array in this class is tagged as observable because it is 
accessed in other classes.
*/
export class LinkCollectionStore {

    @observable
    nodeStorage: NodeCollectionStore;
    constructor(NodeCollectionStore: NodeCollectionStore){
        this.nodeStorage = NodeCollectionStore;
    }
    
    @observable
    public Links: LinkStore[] = new Array<LinkStore>();

    public firstLink: boolean = true;
 
    public firstNode: NodeStore;

    public otherNode: NodeStore;

    /*
    This method is called on in node views when the button to add links
    is clicked. It takes in the nodestore of the node in which the button
    was clicked, depending on which part of the link it is (first or second
    node to be clicked), it stores it accordingly. It also changes the value
    of the boolean indicating if the node is first or not accordingly.
    If the node is the second to be clicked, a new LinkStore is created with
    these two nodes as the two nodes it collects. That link is then added
    to the array of links stored in this class. 
    */
    @action
    public AddLink(store: NodeStore){
        if (this.firstLink){
            this.firstNode = store;
            this.firstLink = false;
        } else {
            this.otherNode = store;
            this.firstLink = true;
            const link: LinkStore = new LinkStore(this.firstNode, this.otherNode, this.nodeStorage);
            this.Links.push(link);
        }
    }
}