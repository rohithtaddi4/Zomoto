import React from 'react';
import '../Styles/Details.css';
import queryString from 'query-string';
import axios from 'axios';
import Modal from 'react-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';


const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      width: '420px',
      top: '25%',
      marginTop: "60px"
    },
  };
  const diffStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'DarkOrange',
      width: '620px',
      top: '25%',
      marginTop: "130px"
    },
  };

class Details extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurant : {},
            itemsmodalIsOpen: false,
            restaurantId: undefined,
            items:[],
            subTotal: 0,
            gallerymodalIsOpen: false,
            paymentmodalIsOpen: false,
            name: undefined,
            address: undefined,
            email: undefined,
            contact: undefined,
            userid: undefined,
            orederdata: undefined
        }
    }
    componentDidMount() {
      const qs = queryString.parse(this.props.location.search);
      const { restaurantId, userid } = qs;
      this.setState({userid: userid});
      console.log(userid)

      axios({
        url: `https://afternoon-beach-40499.herokuapp.com/restaurantdetails/${restaurantId}`,
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
      }).then(response => {
        this.setState({ restaurant : response.data.restaurants, restaurantId })
      }).catch()
    }
    handleorders = () => {
        const { restaurantId } = this.state;
        axios({
            url: `https://afternoon-beach-40499.herokuapp.com/menuItems/${restaurantId}`,
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
          }).then(response => {
            this.setState({ items : response.data.items, itemsmodalIsOpen: true, subTotal: 0 })
          }).catch()
    }
    handletheCmodel = (state, value) => {
      this.setState({[state]: value})
    }
    additem = (index, operation ) => {
      let total = 0;
      const Items = [...this.state.items];
      const Item = Items[index];
 
      if (operation == 'add'){
        Item.qty = Item.qty + 1;
        console.log(Item.qty)
      }
      else {
        Item.qty = Item.qty - 1;
      }
      Items[index] = Item;
      Items.map((item) => {
        total += item.qty * item.price;
      })
      this.setState({ items: Items, subTotal: total})
    }

    handleGallery = () => {
      this.setState({gallerymodalIsOpen : true})
    }
    handlepay = () => {
      this.setState({paymentmodalIsOpen : true, itemsmodalIsOpen: false})
      const { userid, subTotal, items} = this.state;
      const reqObj = {
        placedByUserID: userid,
        amount: subTotal,
        items: items.map((item)=> item.name),
      };
      axios({
        url: 'https://afternoon-beach-40499.herokuapp.com/orders',
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        data: reqObj
      }).then(response => {
        this.setState({ orederdata: response.data })
      }).catch()
    }
    hanldeinputvhange = (event, state) => {
      this.setState({ [state]: event.target.value });
    }
  isDate(val) {
      // Cross realm comptatible
      return Object.prototype.toString.call(val) === '[object Date]'
  }

  isObj = (val) => {
      return typeof val === 'object'
  }

  stringifyValue = (val) => {
      if (this.isObj(val) && !this.isDate(val)) {
          return JSON.stringify(val)
      } else {
          return val
      }
  }

  buildForm = ({ action, params }) => {
      const form = document.createElement('form')
      form.setAttribute('method', 'post')
      form.setAttribute('action', action)

      Object.keys(params).forEach(key => {
          const input = document.createElement('input')
          input.setAttribute('type', 'hidden')
          input.setAttribute('name', key)
          input.setAttribute('value', this.stringifyValue(params[key]))
          form.appendChild(input)
      })

      return form
  }

  post = (details) => {
      const form = this.buildForm(details)
      document.body.appendChild(form)
      form.submit()
      form.remove()
  }

  getData = (data) => {
      return fetch(`https://afternoon-beach-40499.herokuapp.com/payment`, {
          method: "POST",
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
      }).then(response => response.json()).catch(err => console.log(err))
  }

  handlepayments = () => {
      const { email, subTotal, userid, orederdata } = this.state;
      this.getData({ amount: subTotal, email }).then(response => {
          var information = {
              action: "https://securegw-stage.paytm.in/order/process",
              params: response
          }
          this.post(information)
      })
  }
render () {
    const { restaurant, itemsmodalIsOpen, gallerymodalIsOpen, userid, name, email, address, contact, paymentmodalIsOpen, items, subTotal} = this.state;
    return (
    <div>
       <div className="top-block">
          <div className="logof" onClick={this.homenav}>
            <b>e!</b>
          </div>
          </div>
          <div className="placer">
          <div>
        <img src="./images/zomato.png" alt="No Image, Sorry for the Inconvinience" width="100%" height="360px" />
        <button className="dbutton" onClick = {this.handleGallery}>Click to see Image Gallery</button>
    </div>
    <div className="Dheading">{restaurant.name}</div>
    <button className="Dbtn-order" onClick={this.handleorders}>Place Online Order</button>

    <div className="tabs">
        <div className="tab">
            <input type="radio" id="tab-1" name="tab-group-1" checked />
            <label for="tab-1">Overview</label>

            <div className="cantent">
                <div className="about">About this place</div>
                <div className="dhead">Cuisine</div>
                <div className="dvalue">{restaurant && restaurant.cuisine && restaurant.cuisine.map(item => `${item.name},`)}</div>
                <div className="dhead">Average Cost</div>
                <div className="dvalue">&#8377; {restaurant.min_price} for two people(approx)</div>
            </div>
        </div>

        <div className="tab">
            <input type="radio" id="tab-2" name="tab-group-1" />
            <label for="tab-2">Contact</label>

            <div className="cantent">
                <div className="dhead">Phone Number</div>
                <div className="dvalue"></div>
                <div className="dhead">{restaurant.name}</div>
                <div className="dvalue">{restaurant.city}</div>
            </div>
        </div>
        </div>
    </div>
    <Modal
        isOpen={itemsmodalIsOpen}
        style={customStyles}
       >
    <div>
            <div className="glyphicon glyphicon-remove boot" onClick={() => this.handletheCmodel('itemsmodalIsOpen', false)}></div>
            <div className="Mheading">{restaurant.name}</div>
       {items.map((item, index)=> { 
        return <div>
            
            <div className="Mbox"> <div className="mgreen"></div> 
            <div className="mhead">
            {item.name}
            </div>
            <div className="dvalue">&#8377; {item.price}</div>
            <div className="mdes">{item.description}</div>
            <div><img className="mimg" src="./images/1st.png" width="75px" height="75px" border-ra/>
            <div className="postonb">
           {item.qty === 0 ? <div className="plus"> <button className="btnA" onClick={() => this.additem(index, 'add')}>Add</button></div> :
           <div>
            <div className="plus"> <button className="btns" onClick={() => this.additem(index, 'add')}>+</button></div>
            <div className="plus"> <button className="btnsA">{item.qty}</button></div>
            <div className="plus"> <button className="btns" onClick={() => this.additem(index, 'sub')}>-</button></div> </div> }
            </div>
            </div>

            </div>
           
            </div>
            
       })}
        <div className="mtotal">
              <div className="Subtotal">Subtotal     : </div>
              <div className="mSubtotal">&#8377; {subTotal}</div>
              <button type="button" onClick={this.handlepay} class="btn btn-primary; mbt">Pay Now</button>
            </div>
    </div>
      </Modal>

      <Modal
        isOpen={gallerymodalIsOpen}
        style={diffStyles}>
          <div>
          <div className="glyphicon glyphicon-remove boot" onClick={() => this.handletheCmodel('gallerymodalIsOpen', false)}></div>
           <Carousel
           showThumbs = {false}>
       <div>
           <img src="./images/zomato.png" />
       </div>
       <div>
           <img src="./images/1st.png" />
       </div>
       <div>
           <img src="./images/second.png" />
       </div>
   </Carousel>
   </div>
   </Modal>
   <Modal
    isOpen={paymentmodalIsOpen}
    style={customStyles}>
      <div>
      <div className="glyphicon glyphicon-remove boot" onClick={() => this.handletheCmodel('paymentmodalIsOpen', false)}></div>
      { userid == "undefined" ? <div className="Pheading">Please login to Proceed</div> : 
      <div>
      <div className="Pheading">{restaurant.name}</div>
      <div>
      <label style={{ color:"#192f60" }}>Name</label>
      <input type="text" class="form-control"  placeholder="Enter Name" value={name} onChange={(event)=> this.hanldeinputvhange(event, 'name' )} />
      <label style={{ color:"#192f60" }}>Email address</label>
      <input type="email" class="form-control"  placeholder="Enter email" value={email} onChange={(event)=> this.hanldeinputvhange(event, 'email' )}/>
      <label style={{ color:"#192f60" }}>Contact number</label>
      <input type="telephone" class="form-control"  placeholder="Enter Contact number" value={contact} onChange={(event)=> this.hanldeinputvhange(event, 'contact' )} />
      <label style={{ color:"#192f60" }}>Address</label>
      <input type="address" class="form-control"  placeholder="Enter Address" style={{ height: "50px"}} value={address} onChange={(event)=> this.hanldeinputvhange(event, 'address' )}/>
      <button type="button" onClick={this.sm} class="btn btn-primary; mbt" onClick={this.handlepayments}>Proceed</button>
      </div>
      </div> }
      </div>

   </Modal>
    </div>
    )
}
}
export default Details;
