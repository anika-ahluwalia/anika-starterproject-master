import { observable } from "mobx";
import { NodeStore } from "./NodeStore";
import { NodeCollectionStore } from "./NodeCollectionStore";

/*
The class that stores the collection nodes' meaningful attributes. 
This class extends the NodeStore class, and thus also has all the 
variables that are declared in the NodeStore class.
Collection nodes require their own node collection store and a title.
Those values are observable because their values can be read and changed
in different classes.
*/
export class CollectionNodeStore extends NodeStore {

    constructor(initializer: Partial<CollectionNodeStore>) {
        super();
        Object.assign(this, initializer);
    }

    @observable
    public Title: string;

    @observable
    public collectionStore: NodeCollectionStore;

}