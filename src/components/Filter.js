import React from 'react';
import '../Styles/Filter.css';
import queryString from 'query-string';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class Filter extends React.Component {
  constructor() {
    super();
    this.state = {
      restaurants: [],
      mealType: undefined,
      Location: undefined,
      cuisine: [],
      lcost: undefined,
      hcost: undefined,
      sort: undefined,
      page: 2,
      locationdd: [],
      pageCount: [],
      mealtypeValue: undefined,
      userid: undefined
    }
  }

  componentDidMount() {
    //reding the quiery strings from url
    const qs = queryString.parse(this.props.location.search);
    const { mealType, Location, mealtypeValue, userid } = qs;  //taking user id from qs of headers
    this.setState({userid: userid})
    const reqObj = {
      mealtype: mealType,
      location: Location,
    };
    //location dd
    axios({
      url: 'https://limitless-shore-17684.herokuapp.com/locations',
      method: "GET",
      headers: { 'Content-Type': 'application/json' }
    }).then(response =>{
        this.setState({ locationdd: response.data.Locations })
    }).catch()
    //filter api call with request params
    axios({
      url: 'https://limitless-shore-17684.herokuapp.com/filter',
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      data: reqObj
    }).then(response => {
      this.setState({ restaurants: response.data.restaurants, mealType, Location, pageCount: response.data.pageCount, mealtypeValue})
    }).catch()
  }
  handlesortChange = (sort) => {
    const { mealType, Location, lcost, hcost } = this.state;
    const reqObj = {
      sort,
      mealtype: mealType,
      location: Location,
      lcost,
      hcost
    };
    axios({
      url: 'https://limitless-shore-17684.herokuapp.com/filter',
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      data: reqObj
    }).then(response => {
      this.setState({ restaurants: response.data.restaurants, sort, pageCount: response.data.pageCount })
    }).catch()

  }
  handlecostChange = (lcost, hcost) => {
    const { mealType, Location, sort } = this.state;
    const reqObj = {
      sort,
      mealtype: mealType,
      location: Location,
      lcost,
      hcost
    };
    axios({
      url: 'https://limitless-shore-17684.herokuapp.com/filter',
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      data: reqObj
    }).then(response => {
      this.setState({ restaurants: response.data.restaurants, hcost, lcost, pageCount: response.data.pageCount })
    }).catch()
  }
  handlechange = (event) =>{
    const Location = event.target.value;
    const { mealType, sort, hcost, lcost } = this.state;
    console.log(Location);
    const reqObj = {
      mealtype: mealType,
      location: Location,
      sort,
      hcost,
      lcost
    };
    axios({
      url: 'https://limitless-shore-17684.herokuapp.com/filter',
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      data: reqObj
    }).then(response => {
      this.setState({ restaurants: response.data.restaurants, Location })
    }).catch()
   }
   homenav = () => {
     this.props.history.push('/');
   }
   handlecuisinechange = (cuisineId) =>{
    const { mealType, sort, hcost, lcost, cuisine, Location } = this.state;
    const indx = cuisine.indexOf(cuisineId);
    if(indx>-1){
      cuisine.splice(indx,1)
    }else{
      cuisine.push(cuisineId)
    }
    console.log(cuisine)
    const reqObj = {
      mealtype: mealType,
      location: Location,
      cuisine,
      sort,
      hcost,
      lcost
    };
    axios({
      url: 'https://limitless-shore-17684.herokuapp.com/filter',
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      data: reqObj
    }).then(response => {
      this.setState({ restaurants: response.data.restaurants, Location, cuisine })
    }).catch()
   }
   handlepage = (page) => {
     {/*const page = item;*/}
    const { mealType, Location, sort, lcost, hcost } = this.state;
    const reqObj = {
      sort,
      mealtype: mealType,
      location: Location,
      lcost,
      hcost,
      page,
      pageCount: []
    };
    axios({
      url: 'https://limitless-shore-17684.herokuapp.com/filter',
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      data: reqObj
    }).then(response => {
      this.setState({ restaurants: response.data.restaurants, hcost, lcost, page, pageCount: response.data.pageCount })
    }).catch()
   }
   handleDetails = (restId) => {
     const { userid } = this.state;
       this.props.history.push(`/details?userid=${userid}&restaurantId=${restId}`);
   }

  render() {
    const { restaurants, locationdd, pageCount, mealtypeValue} = this.state;
    return (
      <div>
        <div className="top-block">
          <div className="logof" onClick={this.homenav}>
            <b>e!</b>
          </div>
        </div>

        <div className="heading">{mealtypeValue} Places in Mumbai</div>
        <div className="filter-left-box">
          <span className="Filters"> Filters/Sort</span>
          <span className="glyphicon glyphicon-chevron-down visiblespan" data-toggle="collapse" data-target="#filter" aria-expanded="true" aria-controls="filter">
          </span>
        </div>



        <div className="container-fluid">
          <div className="row">
            <div id="filter" className="col-lg-4 left-box collapse-show">
              <div className="Select-Location">Select Loction</div>
              <div className="Location-dropdownf">
                <select onChange={this.handlechange}>
                  <option value="0">select location</option>
                  {locationdd.map((item, index) => {
                    return <option key={index} value={item.location_Id}>{`${item.name}, ${item.city}`}</option>
                    })}
                </select>
              </div>
              <div className="Cuisine">
                Cuisine
              </div>
              <div className="sty">
                <span className="check-box" name="cuisine" onChange={()=>this.handlecuisinechange("1")}>
                  <input type="checkbox" /><span className="specials">North indian</span>
                </span>
              </div>
              <div className="sty">
                <span className="check-box" name="cuisine" onChange={()=>this.handlecuisinechange("2")}>
                  <input type="checkbox" /><span className="specials">South indian</span>
                </span>
              </div>
              <div className="sty">
                <span className="check-box" name="cuisine" onChange={()=>this.handlecuisinechange("3")}>
                  <input type="checkbox" /><span className="specials">Chinese</span>
                </span>
              </div>
              <div className="sty">
                <span className="check-box" name="cuisine" onChange={()=>this.handlecuisinechange("4")}>
                  <input type="checkbox" /><span className="specials">Fast Food</span>
                </span>
              </div>
              <div className="sty">
                <span className="check-box" name="cuisine" onChange={()=>this.handlecuisinechange("5")}>
                  <input type="checkbox" /><span className="specials">Street Food</span>
                </span>
              </div>
              <div className="costtwo">Cost For Two</div>

              <div className="sty">
                <span className="r-radio"><input type="radio" name="r" onChange={() => this.handlecostChange(1, 500)} /></span>
                <span input className="Los">Less Than ₹500</span>
              </div>
              <div className="sty">
                <span className="r-radio"><input type="radio" name="r" onChange={() => this.handlecostChange(500, 1000)} /></span>
                <span input className="Los">₹500 to ₹1000</span>
              </div>
              <div className="sty">
                <span className="r-radio"><input type="radio" name="r" onChange={() => this.handlecostChange(1000, 1500)} /></span>
                <span input className="Los">₹1000 to ₹1500</span>
              </div>
              <div className="sty">
                <span className="r-radio"><input type="radio" name="r" onChange={() => this.handlecostChange(1500, 2000)} /></span>
                <span input className="Los">₹1500 to ₹2000</span>
              </div>
              <div className="sty">
                <span className="r-radio"><input type="radio" name="r" onChange={() => this.handlecostChange(2000, 20000)} /></span>
                <span input className="Los">₹2000+</span>
              </div>
              <div className="sty">
                <span className="r-radio"><input type="radio" name="r" onChange={() => this.handlecostChange(1, 20000)} /></span>
                <span input className="Los">All</span>
              </div>
              <div className="sorted">Sort</div>
              <div className="sty1">
                <span className=" r-radio"><input type="radio" name="s" onChange={() => this.handlesortChange(1)} /></span>
                <span input className="Los">Price Low To High</span>
              </div>
              <div className="sty">
                <span className=" r-radio"><input type="radio" name="s" onChange={() => this.handlesortChange(-1)} /></span>
                <span input className="Los">Price High To Low</span>
              </div>
            </div>
            <div className="col-lg-8 rightBlock">
              {restaurants.length != 0 ? restaurants.map((item) => {
                return <div className="right-box" onClick={()=>this.handleDetails(item._id)}>
                  <div>
                    <div className="img">
                      <img className="br" src={item.image} width="108px" height="108px" />
                    </div>
                    <div className="The-Big-Chill-Cakery">{item.name}</div>
                    <div className="Fort">{item.city}</div>
                    <div className="Shop-1-Plot-D-Samruddhi-Complex-Chincholi-">{item.address}</div>
                    <div className="cft">COST FOR TWO:</div>
                    <div className="bakery">{item.cuisine.map((cuisine) => `${cuisine.name}, `)}</div>
                    <div className="last">{item.min_price}</div>
                  </div>
                  <hr />
                  <span className="CUISINES">CUISINES: </span>
                </div>
              }): <div className="NRF">No Records Found !!!</div>}

           {restaurants.length != 0 ?<div className="pagination">
             {pageCount.map((item) => {
               return <div onClick={() => this.handlepage(item)} className="page">{item}</div>
             })}
               
              </div> : null }
            </div>

          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Filter);