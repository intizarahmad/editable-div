import React from "react";
import ReactDOM from "react-dom";
import ContentEditable from "react-contenteditable";
import sanitizeHtml from "sanitize-html";
import "./styles.css";

class MyComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      html: `<p>Hello <span contenteditable="true"><span contenteditable="false">World</span></span> !</p><p>Paragraph 2</p>`,
      editable: true, 
      newData:''
    };
  }
  handleChange = evt => {
    let s = '<span contenteditable="true"><span contenteditable="false">World</span></span>';
    this.setState({ html: `${evt.target.value}` });
  };

  onTextChange =  evt => {
    let s = `<span contenteditable="true"><span contenteditable="false">{{${evt.target.value}}}</span></span>`;
    this.setState({ newData: `${s}` });
  };

  saveData = ()=>{
    const {html, newData} = this.state;
    this.setState({ html: `${html}${newData}` });
  }
  sanitizeConf = {
    allowedTags: [ "p", "span"],
    allowedAttributes: { span: ["contenteditable", "title", "onClick"] }
  };

  sanitize = () => {
    this.setState({ html: sanitizeHtml(this.state.html, this.sanitizeConf) });
  };

  toggleEditable = () => {
    this.setState({ editable: !this.state.editable });
  };

  render = () => {
    return (
      <div>
        <h3>editable contents</h3>
        <ContentEditable
          className="editable"
          tagName="pre"
          html={this.state.html} // innerHTML of the editable div
          disabled={!this.state.editable} // use true to disable edition
          onChange={this.handleChange} // handle innerHTML change
          onBlur={this.sanitize}
        />
        <h3>source</h3>
        <textarea
          className="editable"
          value={this.state.html}
          onChange={this.handleChange}
          onBlur={this.sanitize}
        />
        {/* <h3>actions</h3>
        <EditButton cmd="italic" />
        <EditButton cmd="bold" />
        <EditButton cmd="formatBlock" arg="h1" name="heading" />
        <EditButton cmd="insertHTML" arg="false" />
        <EditButton
          cmd="createLink"
          arg="https://github.com/lovasoa/react-contenteditable"
          name="hyperlink"
        />
        <button onClick={this.toggleEditable}>
          Make {this.state.editable ? "readonly" : "editable"}
        </button> */}
        <br/>
        <input type="text" name="text" onChange= {this.onTextChange} /> 
        <button onClick={this.saveData} >SaveAction</button>
      </div>
    );
  };
}

function EditButton(props) {
  console.log(props);
  return (
    <button
      key={props.cmd}
      onMouseDown={evt => {
        evt.preventDefault(); // Avoids loosing focus from the editable area
        document.execCommand(props.cmd, false, props.arg); // Send the command to the browser
      }}
    >
      {props.name || props.cmd}
    </button>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<MyComponent />, rootElement);
