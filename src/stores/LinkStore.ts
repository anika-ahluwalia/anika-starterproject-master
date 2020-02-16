import { computed, observable} from "mobx";
import { NodeCollectionStore } from "./NodeCollectionStore";
import { NodeStore } from "./NodeStore";

/*
This class stores all important attributes of links. All the values in
this class are accessed in other classes where the link is created
and changed. It stores the two nodes that it links together. 
It also stores the node collection that it belongs to. This is helpful 
to access in other classes where links are called and created.
Finally, it contains a method to change the size of the link when
the node collection is zoomed in and out on.
*/
export class LinkStore {

    firstNode: NodeStore;
    otherNode: NodeStore;
    @observable
    nodeStorage: NodeCollectionStore;

    constructor(firstNode: NodeStore, otherNode: NodeStore, nodeCollection: NodeCollectionStore){
        this.firstNode = firstNode;
        this.otherNode = otherNode;
        this.nodeStorage = nodeCollection;
    }

    //this method makes sure that the link transforms with the screen
    @computed
    public get Transform(): string {
        return "translate("+ this.nodeStorage.X + "px," + this.nodeStorage.Y + "px) scale(" + this.nodeStorage.Scale + "," + this.nodeStorage.Scale + ")";
    }
}