This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# realtime-csv-grapher

## App.js
  Most warnings are due to slightly out-dated dependencies ([UNSAFE](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html) warnings) 
  Other warnings are setInterval Violations (which isn't more than a chrome [suggestion](https://stackoverflow.com/questions/42218699/javascript-chrome-violation-violation-handler-took-83ms-of-runtime/44824402#44824402)). 
  There is currently another error after component Graph unmounting where code is still executing.
  Other things can be cleaned up with resetting the fileuploader (This would likely require a pull request to be opened with [react-csv-reader](https://github.com/nzambello/react-csv-reader))
  
## graph.js
  If multiple data points are used on the same timeline, pond.js [pipelines](https://esnet-pondjs.appspot.com/#/pipeline) can be used to aggregate multiple data points.
  Alter the parseNextDataPoint function to specify your own parsing function. 
  
### This will be generalized for prop usage in the future as I update this repo.

