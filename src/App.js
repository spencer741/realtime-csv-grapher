


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
        <>
          <Graph data={csvdata} done={handleDone}/>
          <Graph data={csvdata} done={handleDone}/>
          <Graph data={csvdata} done={handleDone}/>
          </>
        : null }
    </div>
  );
}

export default App;