import ReactQuill from '../../..//node_modules/react-quill';
import React = require('react');
import "./Editor.scss";
import "../../..//node_modules/react-quill/dist/quill.snow.css";

/* 
Simple editor component that takes placeholder text as a prop 
Imported from the web.
*/

export default class Editor extends React.Component {
    static modules: { toolbar: (string[] | ({ 'header': string; 'font'?: undefined; } | { 'font': any[]; 'header'?: undefined; })[] | { size: any[]; }[] | ({ 'list': string; 'indent'?: undefined; } | { 'indent': string; 'list'?: undefined; })[])[]; clipboard: { }; };
    static formats: string[];
    static propTypes: { placeholder: any; };
    
    render () {
      return (
        <div>
          <ReactQuill 
            theme='snow'
            modules={Editor.modules}
            formats={Editor.formats}
            placeholder= 'type here'
           />
         </div>
       )
    }
  }
  
  Editor.modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    }
  }
 
  Editor.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]