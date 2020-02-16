import { observable } from "mobx";
import { NodeStore } from "./NodeStore";
import { NodeCollectionStore } from "./NodeCollectionStore";

/*
The class that stores the video nodes' meaningful attributes. 
This class extends the NodeStore class, and thus also has all the 
variables that are declared in the NodeStore class.
Video nodes have a title and a URL.
Those values are observable because their values can be read and changed
in different classes.
*/
export class VideoNodeStore extends NodeStore {

    constructor(initializer: Partial<VideoNodeStore>) {
        super();
        Object.assign(this, initializer);
    }

    @observable
    public Title: string;

    @observable
    public Url: string;
}