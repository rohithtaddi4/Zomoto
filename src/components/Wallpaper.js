import React from 'react';
import '../Styles/Home.css';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

class Wallpaper extends React.Component {
    
    constructor() {
        super();
        this.state = {
            restaurants: [],
            inputtxt: '',
            suggestions: [],
            userid: undefined
        }
    }
    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const { userid } = qs;
        this.setState({userid: userid})
    };

    handleChange = (event) => {
        const locationID = event.target.value;
        sessionStorage.setItem('Location', locationID);
        axios({
            url: `http://limitless-shore-17684.herokuapp.com/restaurantsbylocation/${locationID}`,
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
          }).then(response =>{
              this.setState({ restaurants: response.data.restaurants })
          }).catch()
    }

    handletxt = (event) => {
        const input = event.target.value;
        const { restaurants } = this.state;
        let filteredrestaurants = [];
        
        if (input.length > 0) {
            filteredrestaurants = restaurants.filter(item => item.name.toLowerCase().includes(input.toLowerCase()));
        }
        this.setState(() => ({
            suggestions: filteredrestaurants,
            inputtxt: input
        }))
    
    }

    renderSuggestions = () => {
        const { suggestions } = this.state;

        if (suggestions.length === 0) {
            return null;
        }
        return (
            <ul >
                {
                    suggestions.map((item, index) => (<li key={index} onClick={() => this.selectedText(item)}>{`${item.name}, ${item.city}`}</li>))
                }
            </ul>
        );
    }
    selectedText = (restuarant) => {
        const {userid} = this.state;
        this.props.history.push(`/details?userid=${userid}&restaurantId=${restuarant}`);
    }

    handlevoice = () => {  // this is voice search which i was added inaddition to existed functionalities.
        var recognition = new window.webkitSpeechRecognition(); //this function works perfectly for chrome only 
        recognition.lang = "en-GB"; //language asigning as windows

        recognition.onresult = function (event) {   //recognition function and returning data to respective field
            document.getElementById('voice').value = event.results[0][0].transcript;
        }
        recognition.start();
    }

    render() {
        const { LocationsData } = this.props;
        const { restaurants, inputtxt, suggestions } = this.state;
        return (
            
                <div>
                    <img src="./images/zomato.png" height="380px" width="100%" />

                    <div className="logo">
                        <b>R!</b>
                    </div>

                    <div className="Find-the-best-restaurants-cafs-and-bars">Find the best restaurants, cafes, and bars</div>
                    
                    <div className="Quick-Searches">Quick Searches</div>
                    <div className="Discover">Discover restaurants by type of meal </div>
                    <div className="Location-dropdown">
                        <select className="dd" onChange={this.handleChange}>
                            <option value="0">select location  </option>
                            {LocationsData.map((item, index) => {
                                return <option key={index} value={item.location_Id}>{`${item.name}, ${item.city}`}</option>
                            })}
                        </select>
                        <div id="notebooks">
                        <input className="search" id="voice" type="text" placeholder="&#x1F50D; search for restaurants" value={inputtxt} onChange={this.handletxt} />
                        {this.renderSuggestions()}
                        </div>
                        <i class="fa fa-microphone" onClick={this.handlevoice} />
                    </div>

                </div>
                
        )
    }
}

export default withRouter(Wallpaper);
