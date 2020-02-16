import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "./Main.scss";
import { NodeCollectionStore } from './stores/NodeCollectionStore';
import { FreeFormCanvas } from './views/freeformcanvas/FreeFormCanvas';

/*
This is the main class. It has the main node collection that is the biggest 
node collection (what you open up to). It renders a free form canvas, using
the main node collection and the store. It also renders the "Dash Web" title.
*/

const mainNodeCollection = new NodeCollectionStore();

ReactDOM.render((
    <div>
        <h1>Dash Web</h1>
        <FreeFormCanvas store={mainNodeCollection} />
    </div>), document.getElementById('root')
);
