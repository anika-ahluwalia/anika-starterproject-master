import { observable } from "mobx";
import { NodeStore } from "./NodeStore";
import { NodeCollectionStore } from "./NodeCollectionStore";

/*
The class that stores the web nodes' meaningful attributes. 
This class extends the NodeStore class, and thus also has all the 
variables that are declared in the NodeStore class.
Web nodes have a title and a URL.
Those values are observable because their values can be read and changed
in different classes.
*/
export class WebNodeStore extends NodeStore {

    constructor(initializer: Partial<WebNodeStore>) {
        super();
        Object.assign(this, initializer);
    }

    @observable
    public Url: string;

    @observable
    public Title: string;
}