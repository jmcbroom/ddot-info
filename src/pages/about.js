import React from "react";
import TopNav from '../components/TopNav';
import Layout from '../components/Layout';
import BusStop from '../components/BusStop';
import { Divider } from '@material-ui/core'
import {DirectionsBus, Schedule, NearMe, PictureAsPdf, SpeakerPhone} from '@material-ui/icons'

import {Link} from 'gatsby'

const About = () => {
  const tdStyle = {
    borderBottom: '1px solid #ccc',
    textAlign: 'center',
    padding: '.5em'
  }
  
  const tdRightStyle = {
    borderBottom: '1px solid #ccc',
    borderLeft: '1px solid #ccc',
    paddingLeft: '.5em'
  }
  return (
    <Layout className="pageGrid">
      <TopNav />
      <div style={{ padding: '1em 2em', background: 'white' }}>
      <h1 style={{ fontWeight: 400 }}>About</h1>
      <p>This app helps bus riders find schedules and real-time arrival information for all DDOT routes and bus stops.</p>
      <p>You can browse routes, look up a bus stop, or find service near your current location.</p>
      
      <Divider />
      <h2 style={{ fontWeight: 400 }}>Key features</h2>
      <ul>
        <li style={{ paddingBottom: '.5em' }}><strong>Bookmarkable pages:</strong> Each route and bus stop has a unique URL that looks like ../route/(number) or ../stop/(stop ID) so that you can navigate directly to the info you need</li>
        <li style={{ paddingBottom: '.5em' }}><strong>Location awareness:</strong> Find bus stops and routes within a 5-10 minute walk of your current location on the <Link to="/nearby">../nearby</Link> page. Your web browser will prompt to know your location, and you must allow it to use this feature</li>
        <li><strong>Time awareness:</strong> Features like the bus schedule display service information based on the current time and day of the week, so if you open this page on a Tuesday you'll see the Weekday schedule by default</li>
      </ul>
      <Divider />
      <h2 style={{ fontWeight: 400 }}>Symbology</h2>
      <table style={{ borderCollapse: 'collapse', marginBottom: '1em' }}>
        <tbody>
          <tr>
            <td style={tdStyle}><strong>Icon</strong></td>
            <td style={tdRightStyle}><strong>Description</strong></td>
          </tr>
          <tr>
            <td style={tdStyle}><SpeakerPhone /></td>
            <td style={tdRightStyle}>Predicted time of departure based on a bus' Automatic Vehicle Location (AVL), as available</td>
          </tr>
          <tr>
            <td style={tdStyle}><Schedule /></td>
            <td style={tdRightStyle}>Scheduled time of departure based on the printed schedule</td>
          </tr>
          <tr>
            <td style={tdStyle}><DirectionsBus /></td>
            <td style={tdRightStyle}>Active buses on a route; zoom in on the map to see more details about that bus</td>
          </tr>
          <tr>
            <td style={tdStyle}><BusStop /></td>
            <td style={tdRightStyle}>Bus stops; the active stop will be yellow</td>
          </tr>
          <tr>
            <td style={tdStyle}><NearMe /></td>
            <td style={tdRightStyle}>Find service nearby your current location</td>
          </tr>
          <tr>
            <td style={tdStyle}><PictureAsPdf /></td>
            <td style={tdRightStyle}>Download the current route schedule as a PDF</td>
          </tr>
          <tr>
            <td style={tdStyle}><div style={{ height: '25px', width: '25px', backgroundColor: '#004445', margin: 'auto', border: '1px solid #004445', borderRadius: 99  }}></div></td>
            <td style={tdRightStyle}>ConnectTen routes with 24/7 service and improved frequency</td>
          </tr>
          <tr>
            <td style={tdStyle}><div style={{ height: '20px', width: '50px', backgroundColor: '#44aa42', margin: 'auto' }}></div></td>
            <td style={tdRightStyle}>Downtown routes</td>
          </tr>
          <tr>
            <td style={tdStyle}><div style={{ height: '20px', width: '50px', backgroundColor: '#0079c2', margin: 'auto' }}></div></td>
            <td style={tdRightStyle}>Eastbound/Westbound routes</td>
          </tr>
          <tr>
            <td style={tdStyle}><div style={{ height: '20px', width: '50px', backgroundColor: '#9b5ba5', margin: 'auto' }}></div></td>
            <td style={tdRightStyle}>Northbound/Southbound routes</td>
          </tr>
          <tr>
            <td style={{ ...tdStyle, borderBottom: 'none' }}><div style={{ height: '20px', width: '50px', backgroundColor: '#d07c32', margin: 'auto' }}></div></td>
            <td style={{ ...tdRightStyle, borderBottom: 'none' }}>Special routes</td>
          </tr>
        </tbody>
      </table>

      <Divider />
      <h2 style={{ fontWeight: 400 }}>FAQ</h2>
      <h4>Where does the data come from?</h4>
      <p>This app uses DDOT's GTFS data (available <a href="https://data.detroitmi.gov/Transportation/DDOT-GTFS-file/y62d-bvsz">here</a>; learn more about the GTFS format <a href="https://developers.google.com/transit/gtfs/">here</a>) and the <a href="http://developer.onebusaway.org/modules/onebusaway-application-modules/1.1.14/api/where/index.html">OneBusAway API.</a></p>
      <p>You can access Detroit's endpoint at this URL: https://ddot-beta.herokuapp.com/api/api/where - you'll need to add the <b>key</b> parameter with a value of <b>beta</b>.</p>

      <h4>How accurate are real-time predictions?</h4>
      <p>The real-time data, indicated by the speaker phone icon, are generated using a bus' Automatic Vehicle Location (AVL). Currently, about 75% of DDOT buses are outfitted with AVL technology. As DDOT undergoes a technology upgrade in the coming months, all buses will be outfitted with AVL technology and existing AVL will be improved.</p>
      <p>Based on our experience, it's not uncommon for the real-time prediction to be 1-3 minutes off in either direction, so give yourself a few extra minutes.</p>
      <p>Knowing that the real-time data isn't 100% accurate or available 100% of the time, we display route- and stop-specific data from the fixed schedule (indicated by the clock icon) in addition to the real-time arrival information so that you always have a full picture.</p>
      <h4>What about trip-planning?</h4>
      <p>This app does not currently support trip planning. Trip planning means asking something like, "I am here and want to go there, which bus(es) should I get on?"</p>
      <p>We may build trip planning in a future iteration, but our current goal is to explain DDOT service. Trip planning will require a more regional scope.</p>
      <p>DDOT recommends downloading <a href="https://transitapp.com/">Transit App</a> from your app store for trip planning. Transit App utilizes the same data sources as this app, but also incorporates transit data from SMART, QLine, People Mover, MoGo bike-share docks and ride-sharing.</p>
      <Divider />
      <h2 style={{ fontWeight: 400 }}>Feedback</h2>
      <p>This app is developed by the <a href="https://cityofdetroit.github.io/iet" target="_blank" rel="noopener noreferrer">Innovation and Emerging Technology</a> team at the city of Detroit in partnership with DDOT. Our code is on <a href="https://github.com/CityOfDetroit/route-explorer" target="_blank" rel="noopener noreferrer">Github</a>.</p>
      <p>Find a bug or have an idea for the project team? Leave a note on our <a href="https://app.smartsheet.com/b/form/28665a43770d48b5bbdfe35f3b7b45ac">feedback form</a>, reach out by <a href="mailto:iet@detroitmi.gov">email</a> or leave us a <a href="https://github.com/CityOfDetroit/route-explorer/issues" target="_blank" rel="noopener noreferrer">Github Issue</a>.</p>
    </div>  
    </Layout>
  );
}

export default About;