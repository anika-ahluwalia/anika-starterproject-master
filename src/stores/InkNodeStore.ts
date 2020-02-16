import { observable } from "mobx";
import { NodeStore } from "./NodeStore";
import { NodeCollectionStore } from "./NodeCollectionStore";


/*
The class that stores the ink nodes' meaningful attributes. 
This class extends the NodeStore class, and thus also has all the 
variables that are declared in the NodeStore class.
Ink nodes need a title.
This value is observable because its values can be read and changed
in different classes.
This class also includes some variables that are needed to make 
the imported canvas function.
*/
export class InkNodeStore extends NodeStore {

    constructor(initializer: Partial<InkNodeStore>) {
        super();
        Object.assign(this, initializer);
    }

    @observable
    public Title: string;

    //these are the variables required to make react-canvas-draw work
    onChange: null;
    loadTimeOffset: 5;
    lazyRadius: 20;
    brushRadius: 10;
    brushColor: "#444";
    catenaryColor: "#0a0302";
    gridColor: "rgba(150,150,150,0.17)";
    hideGrid: false;
    canvasWidth: 300;
    canvasHeight: 300;
    disabled: false;
    imgSrc: "";
    saveData: null;
    immediateLoading: false;
    hideInterface: false;
}