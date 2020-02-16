import { computed, observable, action } from "mobx";
import { Utils } from "../Utils";
import { NodeCollectionStore } from "./NodeCollectionStore";

/*
This class is the parent class for all types of node stores and for the
node collection store. It contains all the basic elements that 
every single node (regardless of their type) should have, such as
a unique ID, X and Y coordinates, a width, a height, the parent collection 
that they belong to, and a string indicating their type.
It also contains a method used to move the nodes.
Additionally, it has a boolean that indicates whether the node
should be on display or not. The value of this boolean is accessed 
in other classes to actually remove the node.
Finally, it contains three booleans that indicate which collection
view the node is in (freeform, grid view, or stack).
All of the variables in this class are tagged as observable because 
they are all accessed and mutated by different classes.
*/
export class NodeStore {

    public Id: string = Utils.GenerateGuid();

    @observable
    public X: number = 0;

    @observable
    public Y: number = 0;

    @observable
    public Width: number = 0;

    @observable
    public Height: number = 0;

    //this method moves the nodes and canvas around
    @computed
    public get Transform(): string {
        return "translate(" + this.X + "px, " + this.Y + "px)";
    }

    @observable
    public toDisplay: boolean = true;

    @observable
    public freeForm: boolean = true;

    @observable
    public gridView: boolean = false;

    @observable
    public stack: boolean = false;

    @observable
    public parentCollectionStore: NodeCollectionStore;

    @observable
    public type: string;
}