import { observer } from "mobx-react";
import { NodeCollectionStore } from "../../stores/NodeCollectionStore";
import "./FreeFormCanvas.scss";
import { NodeContainer } from "./NodeContainer";
import React = require("react");
import { StaticTextNodeStore } from "../../stores/StaticTextNodeStore";
import { ImageNodeStore } from "../../stores/ImageNodeStore";
import { VideoNodeStore } from "../../stores/VideoNodeStore";
import { PdfNodeStore } from "../../stores/PdfNodeStore";
import { WebNodeStore } from "../../stores/WebNodeStore";
import { RichTextNodeStore } from "../../stores/RichTextNodeStore";
import { CollectionNodeStore } from "../../stores/CollectionNodeStore";
import { InkNodeStore } from "../../stores/InkNodeStore";
import { LinkContainer } from "./LinkContainer";
import { NodeStore } from "../../stores/NodeStore";
import { action } from "mobx";

/*
This class renders the freeform canvas. The freeform canvas is 
the base of the entire screen and of each collection. It is what 
the user scrolls through and what the nodes are displayed on. 
It includes method to deal with movement, different views of 
the collections, zooming, and adding and removing nodes.
*/

//it stores all the nodes that it has in a node store collection
interface IProps {
    store: NodeCollectionStore
}


@observer
export class FreeFormCanvas extends React.Component<IProps> {

    //boolean that indicates if the pointer is down
    private _isPointerDown: boolean;

    /*
    x and y coordinates stored for grid view. They are stored as class
    variables because they need to be accessed when a new node is added
    in grid view (which is in a different method)
    */
    private xCoordinate: number = -201;
    private yCoordinate: number = 100;

    /*
    These arrays of x and y values are used to store the nodes' original 
    location in the freeform view. They are stored when the view is 
    switched to something other than freeform and they are accessed
    when it is switched back to freeform
    */
    private xValues: number[] = [];
    private yValues: number [] = [];

    /*
    The x values of each type of array in stack view. These are
    stored as class variables because they need to be accessed
    when a new node is added in stack view (which is in a 
    different method)
    */
    private plainX: number;
    private imageX: number;
    private videoX: number;
    private pdfX: number;
    private webX: number;
    private richX: number;
    private collectionX: number;
    private inkX: number;

    /*
    These are the booleans that indicate if a node of each type is 
    currently in the collection. This is useful for stack view to see what
    the x coordinates of each type of node should be because they should 
    all be in a row with no gaps in between. These are
    stored as class variables because they need to be accessed
    when a new node is added in stack view (which is in a 
    different method)
    */
    private containsPlain: boolean = false;
    private containsImage: boolean = false;
    private containsVideo: boolean = false;
    private containsPdf: boolean = false;
    private containsWeb: boolean = false;
    private containsRich: boolean = false;
    private containsCollection: boolean = false;
    private containsInk: boolean = false;

    /*
    These are the Y values of the last node of each type in stack view. 
    These are stored as class variables because they need to be accessed
    when a new node is added in stack view (which is in a different method)
    */
    private plainY: number = 100;
    private imageY: number = 100;
    private videoY: number = 100;
    private pdfY: number = 100;
    private webY: number = 100;
    private richY: number = 100;
    private collectionY: number = 100;
    private inkY: number = 100;

    /*
    This variable represents the x coordinate of the last
    stack in stack view. It is useful to keep as a class variable, because
    if a new node is added and it should create a new stack because
    there are no nodes of that type on the screen, it should be accessed
    in the method to set that node's location.
    */
    private stackX: number = 120;

    /*
    This is a class variable to store the new node when a 
    new node is added. It is useful as a class variable because
    that node is accessed in many methods (with setting it's location
    in different views).
    */
    private node: NodeStore;

    /*
    This method is called when the pointer is down. It adds event 
    listeners for the onPointerUp and onPointerMove methods which
    is useful for knowing that the screen should be moved.
    */
    onPointerDown = (e: React.PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();

        this._isPointerDown = true;

        document.removeEventListener("pointermove", this.onPointerMove);
        document.addEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);
        document.addEventListener("pointerup", this.onPointerUp);
    }

    /*
    This method is called when the pointer is up. It removes event 
    listeners for the onPointerDown and onPointerMove methods which
    is useful for knowing that the screen should not be able to be moved.
    */
    onPointerUp = (e: PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this._isPointerDown = false;
        document.removeEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);
    }

    /*
    This method is used when the pointer is down and is moving. It moves
    the canvas by the amount that the mouse moves and also stores
    the amount that the mouse moves. That value is called on in the link
    class for scaling and movement.
    */
    onPointerMove = (e: PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        if (!this._isPointerDown) {
            return;
        }
        this.props.store.X += e.movementX;
        this.props.store.xAdjustment += e.movementX;
        this.props.store.Y += e.movementY;
        this.props.store.yAdjustment += e.movementY;
    }

    /*
    This method changes the locations of all the nodes to be put in a grid.
    It stores the nodes' previous coordinates if the last collection view
    was free form. Then it calls on methods to change the x and y coordinates 
    of each node. Finally it changes the booleans in each node indicating 
    collection views to indicate that it is in grid view.
    */
    GridView = (): void => {
        //allows it to store values from the last view if it was freeform
        let storeValues: boolean = false;
        if (this.props.store.collectionView == "freeform"){
            storeValues = true;
        }
        //if it's not already grid view, it changes it to grid view
        if (this.props.store.collectionView != "grid"){
            this.props.store.collectionView = "grid";

            //resets the grid view coordinates
            this.xCoordinate = -201;
            this.yCoordinate = 100;

            this.props.store.Nodes.forEach(element => {
                if (storeValues){
                    this.xValues.push(element.X);
                    this.yValues.push(element.Y);
                }
                this.gridX();
                this.gridY();
                element.X = this.xCoordinate;
                element.Y = this.yCoordinate;
                element.freeForm = false;
                element.gridView = true;
                element.stack = false;
            });
        }
    }

    /*
    This method generates the x coordinate of the next node in the 
    grid. It adds three in a row and once the row is up, it brings
    it back to the left.
    */
    gridX = (): void => {
        if (this.xCoordinate < 720){
            this.xCoordinate = this.xCoordinate + 320;
        } else {
            this.xCoordinate = 120;
        }
    }

    /*
    This method generates the y coordinate of the next node in the grid.
    It keeps it the same unless the x coordinate was brought back to the
    left; in that case, it adds to it and makes a new row.
    */
    gridY = (): void => {
        if (this.xCoordinate == 120){
           this.yCoordinate = this.yCoordinate + 320;
        } 
    }

    /*
    This method changes the locations of all the nodes to go back to freeform.
    It first changes the collection view to be free form if it wasn't already. 
    Then it pops the original x and y values of each node and sets the node's
    location to be that. Finally it changes the booleans in each node indicating 
    collection views to indicate that it is in freeform.
    */
    freeFormView = (): void => {
        if (this.props.store.collectionView != "freeform"){
            this.props.store.collectionView = "freeform";
            this.props.store.Nodes.forEach(element => {
                element.X = this.xValues.pop();
                element.Y = this.yValues.pop();
                element.freeForm = true;
                element.gridView = false;
                element.stack = false;
            });
        }
    }

    /*
    This method changes the locations of all the nodes to be put in a grid.
    It stores the nodes' previous coordinates if the last collection view
    was free form. Then it resets the stack location variables. Then in a loop
    through all nodes, calls on a method to change their location for stack view. 
    Finally it changes the booleans in each node indicating collection views to 
    indicate that it is in grid view.
    */
    StackView = (): void => {
        let storeValues: boolean = false;
        if (this.props.store.collectionView == "freeform"){
            storeValues = true;
        }
        if (this.props.store.collectionView != "stack"){
            this.props.store.collectionView = "stack";
            this.plainY = 100;
            this.imageY = 100;
            this.videoY = 100;
            this.webY = 100;
            this.inkY = 100;
            this.collectionY = 100;
            this.pdfY = 100;
            this.richY = 100;
            this.props.store.Nodes.forEach(element => {
                if (storeValues){
                    this.xValues.push(element.X);
                    this.yValues.push(element.Y);
                }
                this.setStackLocation(element);
                element.freeForm = false;
                element.gridView = false;
                element.stack = true;
            })
        }
    }

    /*
    This method sets the location of nodes in stack view. It takes in
    the node whose location it is trying to set. First it finds the 
    element's type and (using an if statement) it changes it's location
    based on that type. The code for each type is in the same format; if
    a node of that type has been not been created, it creates a new stack
    for it and adjusts class variables accordingly. If not, it just sets
    it's y location and x location according to the variables of that type's
    stack and then adjusts the y variable.
    */
    setStackLocation = (element): void => {
        if (element.type == "plain text"){
            if (!this.containsPlain){
                this.containsPlain = true;
                this.plainX = this.stackX;
                this.stackX += 320;
            }
            element.X = this.plainX;
            element.Y = this.plainY;
            this.plainY += 100;
        } else if (element.type == "image"){
            if (!this.containsImage){
                this.containsImage = true;
                this.imageX = this.stackX;
                this.stackX += 320;
            } 
            element.X = this.imageX;
            element.Y = this.imageY;
            this.imageY += 100;
        } else if (element.type == "video"){
            if (!this.containsVideo){
                this.containsVideo = true;
                this.videoX = this.stackX;
                this.stackX += 320;
            } 
            element.X = this.videoX;
            element.Y = this.videoY;
            this.videoY += 100;
        } else if (element.type == "pdf"){
            if (!this.containsPdf){
                this.containsPdf = true;
                this.pdfX = this.stackX;
                this.stackX += 320;
            } 
            element.X = this.pdfX;
            element.Y = this.pdfY;
            this.pdfY += 100;
        } else if (element.type == "web"){
            if (!this.containsWeb){
                this.containsWeb = true
                this.webX = this.stackX;;
                this.stackX += 320;
            } 
            element.X = this.webX;
            element.Y = this.webY;
            this.webY += 100;
        } else if (element.type == "rich text"){
            if (!this.containsRich){
                this.containsRich = true;
                this.richX = this.stackX;
                this.stackX += 320;
            } 
            element.X = this.richX;
            element.Y = this.richY;
            this.richY += 100;
        } else if (element.type == "collection"){
            if (!this.containsCollection){
                this.containsCollection = true;
                this.collectionX = this.stackX;
                this.stackX += 320;
            } 
            element.X = this.collectionX;
            element.Y = this.collectionY;
            this.collectionY += 100;
        } else if (element.type == "ink"){
            if (!this.containsInk){
                this.containsInk = true;
                this.inkX = this.stackX;
                this.stackX += 320;
            } 
            element.X = this.inkX;
            element.Y = this.inkY;
            this.inkY += 100;
        }
    }

    /*
    This method is called whenever a node is created. It randomly sets the X
    coordinate as constrained by a set maximum value.
    */
    setX = (): number => {
        let maxX = 1000;
        return Math.random()*maxX;
    }

    /*
    This method is called whenever a node is created. It randomly sets the Y
    coordinate as constrained by a set maximum value.
    */
    setY = (): number => {
        let maxY = 500;
        return Math.random()*maxY;
    }


    /*
    These methods are called when their respective buttons are pressed. They 
    create the type of node that is indicated in the button. They set the value
    of the class variable "node" to be a new NodeStore of that type of node and
    set it's class variables accordingly. Then it calls a method to set the location
    of the new node according to what type of collection view it is in.
    */
    addTextNode = (): void => {
        this.node = new StaticTextNodeStore({ X: this.setX(), Y: this.setY(), 
            Title: "Text Node Title", 
            Text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?", 
            parentCollectionStore: this.props.store, type: "plain text" });
        this.setNewNodeLocation();
    }
    addImageNode = (): void => {
        this.node = new ImageNodeStore({ X: this.setX(), 
            Y: this.setY(), Title: "Image Title", 
        Url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg", 
        parentCollectionStore: this.props.store,  type: "image" });
        this.setNewNodeLocation();
    }
    addVideoNode = (): void => {
        this.node = new VideoNodeStore({ X: this.setX(), Y: this.setY(), 
            Title: "Video Title", Url: "http://cs.brown.edu/people/peichman/downloads/cted.mp4", 
            parentCollectionStore: this.props.store,  type: "video"});
        this.setNewNodeLocation();
    }
    addPdfNode = (): void => {
        this.node = new PdfNodeStore({ X: this.setX(), Y: this.setY(), 
            Title: "PDF Title", Url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", 
            parentCollectionStore: this.props.store,  type: "pdf"  });
        this.setNewNodeLocation();
    }
    addWebNode = (): void => {
        this.node = new WebNodeStore({ X: this.setX(), Y: this.setY(), 
            Title: "Web Title", Url: "https://en.wikipedia.org/wiki/Fruit_preserves", 
            parentCollectionStore: this.props.store,  type: "web"  });
        this.setNewNodeLocation();
    }

    addRichTextNode = (): void => {
        this.node = new RichTextNodeStore({ X: this.setX(), Y: this.setY(), 
            Title: "Text Title", parentCollectionStore: this.props.store,  type: "rich text" });
        this.setNewNodeLocation();
    }
    addCollectionNode = (): void => {
        this.node = new CollectionNodeStore({ X: this.setX(), 
            Y: this.setY(), Title: "Collection Title", 
            collectionStore: new NodeCollectionStore,
            parentCollectionStore: this.props.store,  type: "collection" });

        this.setNewNodeLocation();
    }
    addInkNode = (): void => {
        this.node = new InkNodeStore({ X: this.setX(), Y: this.setY(), 
            Title: "Ink Title", parentCollectionStore: this.props.store,  type: "ink" });
        this.setNewNodeLocation();
    }

    /*
    This method sets the location of the new node according to what view
    the collection is currently in. Regardless of which view it is in, it
    always changes the booleans of the node to reflect which view it is.
    */
    setNewNodeLocation = (): void => {
        //in freeform view, it changes nothing but the booleans
        if (this.props.store.collectionView == "freeform"){
            this.node.freeForm = true;
            this.node.gridView = false;
            this.node.stack = false;

        /*
        in grid view, it changes the booleans and calls on grid X to change
        the coordinates. it also stores the original random coordinates in
        the arrray containing coordinates to be used in freeform view. 
        */
        } else if (this.props.store.collectionView == "grid"){
            this.node.gridView = true;
            this.node.freeForm = false;
            this.node.stack = false;
            this.xValues.push(this.xCoordinate);
            this.yValues.push(this.yCoordinate);
            this.gridX();
            this.node.X = this.xCoordinate;
            this.gridY();
            this.node.Y = this.yCoordinate;

        /*
        in stack view, it changes the boolean values and then stores the
        original random coordinates in the arrays containing coordinates
        to be used in freeform view. finally it calls on the method to
        set the stack location.
        */
        } else if (this.props.store.collectionView == "stack"){
            this.node.gridView = false;
            this.node.freeForm = false;
            this.node.stack = true;
            this.xValues.push(this.node.X);
            this.yValues.push(this.node.Y);
            this.setStackLocation(this.node);
        }

        //adds the node and resets it's value
        this.props.store.AddNode(this.node);
        this.node = null;
    }
    
    /*
    This method renders the actual freeform canvas itself. It sets the event listener
    for onPointerDown to be the method previously written. Then it renders
    all the buttons to change the node views and sets their click to call their
    corresponding functions above. Then it renders the buttons to add all the different
    kinds of nodes and sets their click to call the corresponding functions above. The
    last buttons it adds are those to zoom and and out and those buttons change the 
    scale stored in the node collection store. Finally it renders the link container 
    (all the links) and the node container (all the nodes).
    */
    render() {
        let store = this.props.store;
        return (
            <div className="freeformcanvas-container" onPointerDown={this.onPointerDown}
            >
            
            <button onClick={() => this.freeFormView()} 
                className="btn"> Free Form </button>

            <button onClick={() => this.GridView()} 
                className="btn"> Grid View </button>

            <button onClick={() => this.StackView()} 
                className="btn"> Stack View </button>
            <br/>
            <br/>
            <button onClick={() => this.addTextNode()} 
                className="btn"> Plain Text Node </button>
            <br/>
            <button onClick={() => this.addImageNode()} 
                className="btn"> Image Node </button>
            <br/>
            <button onClick={() => this.addVideoNode()} 
                className="btn"> Video Node </button>
            <br/>
            <button onClick={() => this.addPdfNode()} 
                className="btn"> Pdf Node </button>
            <br/>
            <button onClick={() => this.addWebNode()} 
                className="btn"> Web Node </button>
            <br/>
            <button onClick={() => this.addRichTextNode()} 
                className="btn"> Rich Text Node </button>
            <br/>
            <button onClick={() => this.addCollectionNode()} 
                className="btn"> Collection Node </button>
            <br/>
            <button onClick={() => this.addInkNode()} 
                className="btn"> Ink Node </button>
            <br/>
            <br/>
            <button onClick={() => this.props.store.Scale = this.props.store.Scale + 0.1} 
                className="btn"> Zoom In </button>
            <br/>
            <button onClick={() => this.props.store.Scale = this.props.store.Scale - 0.1} 
                className="btn"> Zoom Out </button>

                <div className="freeformcanvas" style={{ transform: store.Transform }}>
                    <LinkContainer store = {store} />
                    <NodeContainer store={store} />
                </div>
            </div>
        );
    }
}