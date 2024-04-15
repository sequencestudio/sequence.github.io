// React
import React, {Component} from "react";
import Form from 'react-bootstrap/Form';
import Switch from "react-switch";

// Styles
import * as styles from "../../pages/styles/leaderboards.module.css";

class LocationSwitch extends Component {
  constructor(props) {
      super(props);
      this.state = {
        bk_isActive: true,
        atl_isActive: true,
        dc_isActive: true,
      };
      this.checkAtlSwitch = this.checkAtlSwitch.bind(this);
      this.checkBkSwitch = this.checkBkSwitch.bind(this);
      this.checkDcSwitch = this.checkDcSwitch.bind(this);
  }

  checkAtlSwitch() {
    this.setState({
      ...this.state, 
      atl_isActive: !this.state.atl_isActive,
    });
  }

  checkBkSwitch() {
    this.setState({
      ...this.state, 
      bk_isActive: !this.state.bk_isActive,
    });
  }

  checkDcSwitch() {
    this.setState({
      ...this.state, 
      dc_isActive: !this.state.dc_isActive,
    });
  }

  render() {
    return (
    <div className={styles.locations_switch__container}>
      <div className={styles.bk__container}>
        <Form.Check
          type="switch"
          id="bk-switch"
          checked={this.state.bk_isActive}
          label="Brooklyn"
          value="Brooklyn"
          onClick={(e)=>{
            this.props._toggleLocation(e); 
            this.checkBkSwitch();
          }}
        />
      </div>
      <div className={styles.atl__container}>
        <Form.Check
          type="switch"
          id="atl-switch"
          checked={this.state.atl_isActive}
          label="Atlanta"
          value="Atlanta"
          onClick={(e)=>{
            this.props._toggleLocation(e); 
            this.checkAtlSwitch();
          }}
        />
      </div>
      <div className={styles.dc__container}>
        <Form.Check
          type="switch"
          id="dc-switch"
          checked={this.state.dc_isActive}
          label="DC"
          value="DC"
          onClick={(e)=>{
            this.props._toggleLocation(e); 
            this.checkDcSwitch();
          }}
        />
      </div>
    </div>
  );
  }
  
} 

export default LocationSwitch;