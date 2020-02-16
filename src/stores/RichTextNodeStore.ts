import { observable } from "mobx";
import { NodeStore } from "./NodeStore";
import { NodeCollectionStore } from "./NodeCollectionStore";

/*
The class that stores the rich text nodes' meaningful attributes. 
This class extends the NodeStore class, and thus also has all the 
variables that are declared in the NodeStore class.
Rich text nodes only have a title.
Those values are observable because their values can be read and changed
in different classes.
*/
export class RichTextNodeStore extends NodeStore {

    constructor(initializer: Partial<RichTextNodeStore>) {
        super();
        Object.assign(this, initializer);
    }

    @observable
    public Title: string;
}