
/*
  Most warnings are due to slightly out-dated dependencies (UNSAFE warnings) https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html
  Other warnings are setInterval Violations (which isn't more than a chrome suggestion). https://stackoverflow.com/questions/42218699/javascript-chrome-violation-violation-handler-took-83ms-of-runtime/44824402#44824402\n 
  There is currently another error after component Graph unmounting where code is still executing.
  Other things can be cleaned up with resetting the fileuploader (This would require a pull request to be opened with react-csv-reader )
  -Spencer
  */

import React, {useState} from "react";
import CSVReader from "react-csv-reader";
import "./index.css";
import Graph from "./graph.js";

const papaparseOptions = {
  header: false,
  dynamicTyping: true,
  skipEmptyLines: true,
  transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
};

function App(){

  const [csvloaded, setcsvloaded] = useState(false);
  const [csvdata, setcsvdata] = useState([]);
  const [renderchild, setrenderchild] = useState(true);

  const handleFileUpload = (data,filename) => {
  
    console.log("File Loaded");
    console.log(data, filename);
    setcsvdata(data);
    if(data.length !== 0)
    {
      setcsvloaded(true);
    }
    else
    {
      alert("There is no data in this file. Try Again.");
    }
  }

  const handleDone = () => {
      setrenderchild(false);
  }
  
  if(renderchild === false)
  {
    setcsvloaded(false);
    setrenderchild(true);
    setcsvdata([]);
  }
  
  return(
    <div className="container">
      <CSVReader
        cssClass="react-csv-input"
        label={"Select CSV"}
        onFileLoaded={handleFileUpload}
        parserOptions={papaparseOptions}
      />
      <p>and then open the console</p>
        {csvloaded && renderchild ? 
          <Graph data={csvdata} done={handleDone}/>
        : null }
    </div>
  );
}

export default App;