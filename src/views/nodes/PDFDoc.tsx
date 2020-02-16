import { Document, Page } from 'react-pdf';
import React = require('react');
import { pdfjs } from 'react-pdf';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
 
/*
This is the class that actually renders the pdf class. Some of it
is imported from the web. It has buttons to advance pages and go
back. It then shows the pdf and what page it's on.
*/
interface MyProps {
  url: string;
}

@observer
export class Viewer extends React.Component<MyProps> {

  @observable public pageNumber : number;

  constructor(props: Readonly<MyProps>){
    super(props);
    this.pageNumber = 1;
  }

  componentDidMount(){
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  }

  goToPrevPage = () => {
    if ((this.pageNumber - 1) != 0){
      this.pageNumber -= 1;
    }
  }

  goToNextPage = () => {
    this.pageNumber += 1;
  }

  render() {
    return (
      <div>
        <p> Page = {this.pageNumber} </p>
        <nav>
          <button className = "btn" onClick = {this.goToPrevPage}> Previous </button>
          <button className = "btn" onClick = {this.goToNextPage}> Next </button>
        </nav>
        <Document
          file= {this.props.url}
        >
        <Page pageNumber = {this.pageNumber}/>
        </Document>
      </div>
    );
  }
}