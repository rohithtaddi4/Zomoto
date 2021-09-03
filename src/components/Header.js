import React from 'react';
import '../Styles/Header.css'
import Modal from 'react-modal';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        width: '300px',
        top: '25%',
        marginTop: "60px"
    },
};

class Header extends React.Component {

    constructor() {
        super();
        this.state = {
            loginmodalisopen: false,
            username: undefined,
            isloggedin: false, //did
            email: undefined,
            password: undefined,
            signupmodalisopen: false,
            Name: undefined,
            ins: undefined,
            userid: undefined,
            orderdata: [],
            ordermodalisopen: false
        }
    }
    
    responseFacebook = (response) => {
        console.log(response);
        this.setState({ isloggedin: true, username: response.name })

    }
    responseGoogle = (response) => {
        console.log(response);
        this.setState({ isloggedin: true, username: response.profileObj.name })
    }
    handletheCmodel = (state, value) => {
        this.setState({ [state]: value })
    }
    handlelogins = () => {
        this.setState({ loginmodalisopen: true, signupmodalisopen: false });
    }
    hanldeinputchange = (event, state) => {
        this.setState({ [state]: event.target.value });
    }
    handlelogin = () => { //login api
        const {email, password, ins, username, userid} = this.state; //ins is alert massage in login form
        const reqObj = {
            email,
            password
          };
        axios({
            url: 'https://afternoon-beach-40499.herokuapp.com/login',
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            data: reqObj
          }).then(response => {
              if(response.data.message == "Welcome!!!")
              {
            this.setState({ loginmodalisopen: false,isloggedin: true, username: response.data.user.Name, userid: response.data.user._id, ins: response.data.message });
            alert(response.data.message);
            this.props.history.push(`/?userid=${response.data.user._id}`);
                        
              }
              else {
                  this.setState({ ins: response.data.message})
              }
          }).catch()
    }
    handlesignups = () => {
          this.setState({signupmodalisopen: true, loginmodalisopen: false})
    }
    handleSignUp = () => {  //sinup api
        const {email, password, ins, Name} = this.state;
        const reqObj = {
            Name: Name,
            email: email,
            password: password
          };
          axios({
            url: 'https://afternoon-beach-40499.herokuapp.com/userregistartion',
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            data: reqObj
          }).then(response => {
              if(response.data.message == "Successfully created an account & Login"){
            this.setState({ ins: response.data.message, signupmodalisopen: false })
            alert(response.data.message)
              }
            else {
                this.setState({ ins: response.data.message }) 
            }
          }).catch()
    }
    showorders = () => {  //oredrs by user id api
        const { userid, orderdata } = this.state;
        axios({
            url: `https://afternoon-beach-40499.herokuapp.com/ordersByuser/${userid}`,
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
          }).then(response =>{
              this.setState({ orderdata: response.data.orders, ordermodalisopen: true })
          }).catch()
    }
    handlelogout = () => {
        this.setState({isloggedin: false});
        this.props.history.push(`/?userid=${undefined}`);
    }

    render() {
        const { loginmodalisopen,  isloggedin, orderdata, username, email,ordermodalisopen, ins, password, signupmodalisopen, Name } = this.state
        return (
            <div>
                {isloggedin ? <div> <div className="hhlogin">{username}</div> <div onClick={this.showorders} className="hhorders">MyOrders</div>
                <div onClick={this.handlelogout} className="hhlogout">Logout</div> </div> :
                    <div>
                        <div className="hlogin" onClick={this.handlelogins}> Login</div>
                        <div className="hCreate-account" onClick={this.handlesignups}>Create an account</div>
                    </div>}
                <Modal
                    isOpen={loginmodalisopen}
                    style={customStyles}>
                    <div className="glyphicon glyphicon-remove boot" onClick={() => this.handletheCmodel('loginmodalisopen', false)}></div>
                    <div className="wheading">Login</div>
                    <div>
                        <FacebookLogin
                            appId="558406985517347"
                            buttonText="Login"
                            autoLoad={false}
                            fields="name,email,picture"
                            callback={this.responseFacebook} />
                    </div>
                    <div  style={{marginLeft:"7px", marginBottom: "5px"}}>
                        <GoogleLogin
                            clientId="1026055596591-g5v65stqbekk096q3u014qnqhmod87iv.apps.googleusercontent.com"
                            buttonText={<b>Login with Google account</b>}
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>
                    <label style={{ color: "#192f60" }}>Email address</label>
                    <input type="email" class="form-control" placeholder="Enter email" value={email} onChange={(event) => this.hanldeinputchange(event, 'email')} />
                    <label style={{ color: "#192f60" }}>Password</label>
                    <input type="password" class="form-control" placeholder="Enter password" value={password} onChange={(event) => this.hanldeinputchange(event, 'password')} />
                    <div style={{color: "red"}}>{ins}</div>
                    <div id="datains" style={{display: "block", color:"#192f60", marginTop: "5px"}}>Don't have an acount?<b onClick={this.handlesignups}>Create one</b></div>
                    <button type="button" style={{display: "block"}} onClick={this.sm} class="btn btn-primary; mbt" onClick={this.handlelogin}>Submit</button>
                    
                </Modal>
                <Modal
                    isOpen={signupmodalisopen}
                    style={customStyles}>
                    <div className="glyphicon glyphicon-remove boot" onClick={() => this.handletheCmodel('signupmodalisopen', false)}></div>
                    <div className="wheading">SignUp</div>
                    <div>
                        <FacebookLogin
                            appId="558406985517347"
                            buttonText="Login"
                            autoLoad={false}
                            fields="name,email,picture"
                            callback={this.responseFacebook} />
                    </div>
                    <div style={{marginLeft:"7px"}}>
                        <GoogleLogin
                            clientId="1026055596591-g5v65stqbekk096q3u014qnqhmod87iv.apps.googleusercontent.com"
                            buttonText={<b>Login with Google account</b>}
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>
                    <label style={{ color: "#192f60" }}>Name</label>
                    <input type="email" class="form-control" placeholder="Enter Name" value={Name} onChange={(event) => this.hanldeinputchange(event, 'Name')} />
                    <label style={{ color: "#192f60" }}>Email address</label>
                    <input type="email" class="form-control" placeholder="Enter email" value={email} onChange={(event) => this.hanldeinputchange(event, 'email')} />
                    <label style={{ color: "#192f60" }}>Password</label>
                    <input type="password" class="form-control" placeholder="Enter password" value={password} onChange={(event) => this.hanldeinputchange(event, 'password')} />
                    <div style={{color: "red"}}>{ins}</div>
                    <div id="datains" style={{display: "block", color:"#192f60", marginTop: "5px"}}>Already have an acount?<b  onClick={this.handlelogins}>Login</b></div>
                    <button type="button" style={{display: "block"}} onClick={this.sm} class="btn btn-primary; mbt" onClick={this.handleSignUp}>Submit</button>
                    
                </Modal>
                <Modal
                isOpen={ordermodalisopen}
                style={customStyles} >
                    <div className="glyphicon glyphicon-remove boot" onClick={() => this.handletheCmodel('ordermodalisopen', false)}></div>
                    <div className="wheading">MyOrders</div>
                   {orderdata.map((item)=> {
                       return <div>
                       <div className="habox"> 
                       <div className="hahead">
                       {item.items}
                       </div>
                       <div className="havalue">&#8377; {item.amount}</div>
                      {/* <div className="havalue">&#8377; {item.placedOn}</div> */}
                       </div>
                       </div>
                   } )}
                </Modal>
            </div>
        )
    }
}

export default withRouter(Header);
