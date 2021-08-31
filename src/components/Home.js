import React from 'react';
import axios from 'axios';
import Wallpaper from './Wallpaper';
import Quicksearch from './Quicksearch';

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      locations: [],
      mealtype: []
    }
  }

componentDidMount () {
  sessionStorage.clear('Location');{/* */}
  axios({
    url: 'https://warm-atoll-35409.herokuapp.com/locations',
    method: "GET",
    headers: { 'Content-Type': 'application/json' }
  }).then(response =>{
      this.setState({ locations: response.data.Locations })
  }).catch()

  axios({
    url: 'https://warm-atoll-35409.herokuapp.com/mealtypes',
    method: "GET",
    headers: { 'Content-Type': 'application/json' }
  }).then(response => {
      this.setState({ mealtype: response.data.mealtypes })
  }).catch()
}

render() {
  const { locations, mealtype} = this.state;
  return (
    <div>
      <Wallpaper LocationsData = {locations}/>
      <Quicksearch mealtypedata = {mealtype}/>
    </div>
  )
}
}

export default Home;
