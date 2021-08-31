import React from 'react';
import '../Styles/Home.css';
import Quickitem from './Quickitem';
class Quicksearch extends React.Component {
    render() {
        
        const { mealtypedata } = this.props;
        return (
            <div>

                <div className="container">
                    <div className="row">
                        {mealtypedata.map((item, index) => {
                            return <Quickitem key={index} Qsdata={item}/>
                        })}
                    </div>
                </div>
            </div>

        )

    }
}
export default Quicksearch;