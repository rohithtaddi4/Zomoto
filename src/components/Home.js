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
    url: 'https://cors-anywhere.herokuapp.com/https://safe-taiga-51745.herokuapp.com/locations',
    method: "GET",
    headers: { 'Content-Type': 'text/plain' }
  }).then(response =>{
      this.setState({ locations: response.data.Locations })
  }).catch()

  axios({
    url: 'https://safe-taiga-51745.herokuapp.com/mealtypes',
    method: "GET",
    headers: { 'Content-Type': 'text/plain' }
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
