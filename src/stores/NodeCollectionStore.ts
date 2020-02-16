import { computed, observable, action } from "mobx";
import { NodeStore } from "./NodeStore";
import { LinkCollectionStore } from "./LinkCollectionStore";

/*
This class stores all collection of nodes (primarily in the
form of an array of NodeStores). It also contains instance variables
to store the scale of the collection (for zooming in and out), 
the z-Index of the node on top, the current view of the collection 
(freeform, grid, or stack), and variables to store how much the screen
was transformed by (in the x and y direction) when the user
moves around. It also includes an link collection store that stores
all the links in this collection. Finally, it has a method to 
move around and adjust the scale fo the collection, and it includes
a method to add a node to the collection, which is essentially adding
a node to the array of nodes. 
Once again, all variables in this class are tagged as observable 
because their values are read and changed in other classes.
*/
export class NodeCollectionStore extends NodeStore {

    @observable
    public Scale: number = 1;

    @observable
    public Nodes: NodeStore[] = new Array<NodeStore>();

    @computed
    public get Transform(): string {
        return "translate("+ this.X + "px," + this.Y + "px) scale(" + this.Scale + "," + this.Scale + ")";
    }

    @action
    public AddNode(store: NodeStore): void {
        this.Nodes.push(store);
    }

    @observable
    public zIndex: number = 1000;

    @observable
    public links: LinkCollectionStore = new LinkCollectionStore(this);

    @observable
    public collectionView: String = "freeform";


    //these are the two variables that store how much the screen was transformed by
    
    @observable 
    public xAdjustment: number = 0;

    @observable 
    public yAdjustment: number = 0;

}