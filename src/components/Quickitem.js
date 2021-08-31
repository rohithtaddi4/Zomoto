import React from 'react';
import '../Styles/Home.css';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

class Quickitem extends React.Component {

    constructor () {
    super ();
    this.state = {
        userid: undefined
    }
    }

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const { userid } = qs;
        this.setState({userid: userid})
    };
    Navigate = (mealtypeID, mealtypeValue) => {
        const {userid} = this.state;
        const locationId = sessionStorage.getItem('Location')
        if(locationId) {
            this.props.history.push(`/filter?userid=${userid}$mealType=${mealtypeID}&Location=${locationId}`);
        }
        else {
        this.props.history.push(`/filter?userid=${userid}&mealType=${mealtypeID}&mealtypeValue=${mealtypeValue}`);
        }
    }

    render() {
        const {Qsdata} = this.props;
        return (
            <div>
                <div key={Qsdata.meal_type} onClick={() => this.Navigate(Qsdata.meal_type, Qsdata.name )} className="col-lg-4 col-md-6 col-sm-12 item">
                    <img src={`./${Qsdata.image}`} height="100%" width="45%" className = "ro" />
                    <div className="Breakfast">{Qsdata.name}</div>
                    <div className="box">
                        <span className="content">{Qsdata.description}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Quickitem);