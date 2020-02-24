import React from "react";
import Ring from "ringjs";

import {
    TimeSeries,
    TimeRange,
    TimeEvent,
    Stream,
} from "pondjs";

import { Charts, ChartContainer, ChartRow, YAxis, styler, Legend, Resizable, LineChart } from "react-timeseries-charts";

const sec = 1000;
const minute = 60 * sec;
const hours = 60 * minute;
const rate = 1000;

export default class Graph extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            time: new Date(2020, 0, 1),
            events: new Ring(200),
            nextDataPoint: this.props.data[0][0],
            cursor: 1,
            done: false
        };

        console.log("Data pased into graph component: ", this.props.data[0][0]);
   
    }

    parseNextDataPoint = () => {

        //console.log(this.state.cursor, this.state.nextDataPoint);
        this.setState({
            nextDataPoint: this.props.data[this.state.cursor],
            cursor: this.state.cursor + 1 
        }); 
       
    }

    getNewEvent = t => {

        
        var te = new TimeEvent(t, parseInt(this.state.nextDataPoint));
        this.parseNextDataPoint();
        return te;

        
    };

    
    componentDidMount() {
      
        this.stream = new Stream();

        // Setup our interval to advance the time and generate raw events
        const increment = minute;

        this.interval = setInterval(() => {
            const t = new Date(this.state.time.getTime() + increment);
            const event = this.getNewEvent(t);

            // Raw events
            const newEvents = this.state.events;
            newEvents.push(event);
            this.setState({ time: t, events: newEvents });

            // Let our aggregators process the event
            this.stream.addEvent(event);
        }, rate);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        
        if(this.state.nextDataPoint === undefined)
        {
            //console.log(this.state.cursor, this.state.nextDataPoint);
            this.props.done();
            return(null);
        }

        const latestTime = `${this.state.time}`;

        const eventSeries = new TimeSeries({
            name: "raw",
            events: this.state.events.toArray()
        });

        // Timerange for the chart axis
        const initialBeginTime = new Date(2020, 0, 1);
        const timeWindow = 3 * hours;

        let beginTime;
        const endTime = new Date(this.state.time.getTime() + minute);
        if (endTime.getTime() - timeWindow < initialBeginTime.getTime()) {
            beginTime = initialBeginTime;
        } else {
            beginTime = new Date(endTime.getTime() - timeWindow);
        }
        const timeRange = new TimeRange(beginTime, endTime);

        
        const dateStyle = {
          fontSize: 12,
          color: "#AAA",
          borderWidth: 1,
          borderColor: "#F4F4F4"
        };

        const style = styler([
          { key: "sensorData", color: "steelblue", width: 1, dashed: true },
        ]);

        // Charts (after a certain amount of time, just show hourly rollup)
        const charts = (
            <Charts>
                <LineChart axis="y" series={eventSeries}  />
            </Charts>
        );

        return (
            <div>
                <div className="row">
                    <div className="col-md-4">
                        <Legend
                            type="swatch"
                            style={style}
                            categories={[
                                {
                                    key: "sensorData",
                                    label: "Sensor Data"
                                }
                            ]}
                        />
                    </div>
                    <div className="col-md-8">
                        <span style={dateStyle}>{latestTime}</span>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer timeRange={timeRange}>
                                <ChartRow height="150">
                                    <YAxis
                                        id="y"
                                        label="Sensor Readings"
                                        min={0}
                                        max={1500} // for min and max, extra analysis can be done on array before viewing.
                                        width="70"
                                        type="linear"
                                    />
                                    {charts}
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>
            </div>
        );
    }
}



//ATTEMPTED HOOKS APPROACH ... could never get it converted from a class component.
/*
function exp () {
  var ring = new Ring(200);
  for (var i=0; i<200; i++) {
    ring.push(i);
  }

  return ring;

}

function App () {
  const [time, settime] = useState(new Date(2020, 0, 1));
  const [events, setevents] = useState(() => exp());
  const [interval, setinterval] = useState();
  const [stream, setstream] = useState(new Stream());
  
  const getNewEvent = t => {
    const base = Math.sin(t.getTime() / 10000000) * 350 + 500;
    return new TimeEvent(t, parseInt(base + Math.random() * 1000, 10));
  };

  useEffect(() => {
        //
        // Setup our interval to advance the time and generate raw events
        //
        
        setstream(new Stream());

        

        const increment = minute;
        setinterval(setInterval(() => {
            const t = new Date(time.getTime() + increment);
            const event = getNewEvent(t);

            // Raw events
            setevents(events.push(event));
            settime(t);

            // Let our aggregators process the event
            setstream(stream.addEvent(event));
        }, rate));
  }, [])

  useEffect(() => {
    return () => {
      clearInterval(interval);
    }
  }, []);

  const latestTime = `${time}`;
    

    //
    // Create a TimeSeries for our raw, 5min and hourly events
    //
    console.log(events);


    const eventSeries = new TimeSeries({
        name: "raw",
        events:  events.toArray()
    });

    // Timerange for the chart axis
    const initialBeginTime = new Date(2020, 0, 1);
    const timeWindow = 3 * hours;

    let beginTime;
    const endTime = new Date(time.getTime() + minute);
    if (endTime.getTime() - timeWindow < initialBeginTime.getTime()) {
        beginTime = initialBeginTime;
    } else {
        beginTime = new Date(endTime.getTime() - timeWindow);
    }
    const timeRange = new TimeRange(beginTime, endTime);

    
    const dateStyle = {
      fontSize: 12,
      color: "#AAA",
      borderWidth: 1,
      borderColor: "#F4F4F4"
    };

    const style = styler([
      { key: "sensorData", color: "steelblue", width: 1, dashed: true },
    ]);


    // Charts (after a certain amount of time, just show hourly rollup)
    const charts = (
        <Charts>
            <LineChart axis="y" series={eventSeries}  />
        </Charts>
    );

    return(
      <div>
        <div className="row">
            <div className="col-md-4">
                <Legend
                    type="swatch"
                    style={style}
                    categories={[
                        {
                            key: "sensorData",
                            label: "Sensor Data"
                        }
                    ]}
                />
            </div>
            <div className="col-md-8">
                <span style={dateStyle}>{latestTime}</span>
            </div>
        </div>
        <hr />
        <div className="row">
            <div className="col-md-12">
                <Resizable>
                    <ChartContainer timeRange={timeRange}>
                        <ChartRow height="150">
                            <YAxis
                                id="y"
                                label="Value"
                                min={0}
                                max={1500}
                                width="70"
                                type="linear"
                            />
                            {charts}
                        </ChartRow>
                    </ChartContainer>
                </Resizable>
            </div>
        </div>
    </div>
    );
}
export default App;
*/



