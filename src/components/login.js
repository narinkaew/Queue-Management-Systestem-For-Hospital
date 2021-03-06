import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./../css/Q.css";
import Modal from "react-responsive-modal";
import swal from "sweetalert";
import * as R from "ramda";

import FormAddAppointment from "../components/formAddAppointment";
import {
  Card,
  Icon,
  Image,
  Button,
  Form,
  Segment,
  Header,
  Grid,
  Message,
  Label,
  Input
} from "semantic-ui-react";
import axios from "./../lib/axios";
import { Link } from "react-router-dom";
import { type } from "os";

class Login extends Component {
  state = {
    HN: "",
    phoneNumber: "",
    recipient: "",
    textmessage: "",
    OTP: "",
    OTPfield: "",
    requestId: "",
    statusValidate: "",
    pin1: "",
    pin2: "",
    pin3: "",
    pin4: "",
    //modal
    open: false,
    openOTP: false,
    //validate
    errorHN: { status: false, message: "" },
    errorPhoneNumber: { status: false, message: "" },
    errorOTP: { status: false, message: "" }
  };

  input = {};

  showOTPModal = async phoneNumber => {
    const recipient = await this.cutForOTP();
    await this.setState({
      openOTP: true,
      recipient: recipient
      // OTP: OTP,
    });
    await this.sendOTP();
    // const text = await this.sendOTP()
    // await this.setState({
    //   textmessage: text,
    // })
    // console.log(this.state.textmessage)
    // await this.sendText()
  };
  //กด sign in เพื่อเช็คHNกับเบอร์ เสร็จแล้วเข้าmodal otp  ส่งotp ใส่otp เข้าระบบได้
  submit = async () => {
    var HN = await this.state.HN;
    var phoneNumber = await this.state.phoneNumber;
    var check = false;
    var checkHNform = false;

    if (checkHNform === false) {
      if (this.state.HN.match(/[0-9]{4,10}[/]{1}[0-9]{2}/)) {
        this.setState({ errorHN: { status: false, message: "" } });
        checkHNform = true;
      } else if (!this.state.HN.match(/[0-9]{4,10}[/]{1}[0-9]{2}/)) {
        this.setState({
          errorHN: { status: true, message: "HN Does not match" }
        });
      }

      //Check phone number
      if (
        this.state.phoneNumber.length <= 10 &&
        this.state.phoneNumber.match(/[0-9]{10}/) &&
        checkHNform === true
      ) {
        this.setState({ errorPhoneNumber: { status: false, message: "" } });
        check = true;
        this.showOTPModal(phoneNumber);
      } else if (
        this.state.phoneNumber.length > 10 &&
        this.state.phoneNumber.match(/[0-9]{10}/)
      ) {
        this.setState({
          errorPhoneNumber: {
            status: true,
            message: "Phone number limit 10 number"
          }
        });
      } else if (
        this.state.phoneNumber.length < 10 &&
        !this.state.phoneNumber.match(/[0-9]{10}/)
      ) {
        this.setState({
          errorPhoneNumber: {
            status: true,
            message: "Phone number does not match"
          }
        });
      }
    }
  };
  setField = (field, value) => {
    this.setState({ [field]: value });
  };

  cutForOTP = () => {
    let phone = "";
    var number = this.state.phoneNumber;
    phone = "66" + number.substr(1, 10);
    return phone;
  };
  validateOTP = async otp => {
    const check = await axios.post("/validateOTP", {
      requestId: this.state.requestId,
      code: otp
    });
    // console.log(check.data.message.status);
    if (check.data.message.status === "0") {
      //Check API
      var data = await axios.post("/checkHN", {
        HN: this.state.HN,
        phoneNumber: this.state.phoneNumber
      });
      if (data.data.length === 0) {
        this.setState({
          errorHN: { status: true, message: "HN Does not match" }
        });
      } else {
        // let dataEmp = splice(fruits.length-1)
        localStorage.setItem("getUserData", JSON.stringify(data.data[0]));
        this.props.history.push({
          pathname: "/Home",
          state: {
            HN: data.data[0].HN,
            phoneNumber: data.data[0].phonenumber
          }
        });
      }
    } else {
      // console.log("เข้า cancel");
      swal(check.data.message.error_text, {
        icon: "warning"
      });
    }
  };
  sendText = async () => {
    const recipient = this.state.recipient;
    const textmessage = this.state.textmessage;

    const resp = await axios.post("/sendText", {
      recipient: recipient,
      textmessage: textmessage
    });
  };
  sendOTP = async () => {
    const recipient = this.state.recipient;
    if (!R.isEmpty(this.state.requestId)) {
      let check = await this.cancel(this.state.requestId);
      if (check.data.message.status !== "0" || check.status === 200) {
        if (check.status === 200) {
          swal("Request Successful", {
            icon: "success"
          });
        } else if (check.data.message.status !== "0") {
          swal(check.data.message.error_text, {
            icon: "warning"
          });
        }
        return;
      }
    }
    const reqOTP = await axios.post("/requestOTP", {
      recipient: recipient
    });
    this.setState({
      requestId: reqOTP.data.requestId
    });
  };
  onChange = event => {
    // let otp = this.state.OTPfield + event.target.value
    this.setState({ ["pin" + event.target.id]: event.target.value });
    if (event.target.value.length <= event.target.maxLength) {
      if (event.target.id < 4) {
        this.input[event.target.id].focus();
      } else if (event.target.id == 4) {
        let otp =
          this.state.pin1 +
          this.state.pin2 +
          this.state.pin3 +
          event.target.value;
        this.validateOTP(otp);
      }
    }
  };

  cancel = async requestId => {
    // cancelOTP
    const check = await axios.post("/cancelOTP", {
      requestId: requestId
    });
    this.setState({
      requestId: ""
    });
    // console.log(check);
    return check;
  };

  render() {
    return (
      <div>
        <center>
          <Grid.Column style={{ maxWidth: "450px" }}>
            <Segment
              color="teal"
              style={{ marginLeft: "5%", marginRight: "5%" }}
            >
              <Form onSubmit={this.submit}>
                <Input
                  action={{ color: "teal", icon: "user" }}
                  actionPosition="left"
                  fluid
                  // label="HN"
                  name="HN"
                  placeholder="HN"
                  // type="text"
                  required
                  value={this.state.HN}
                  onChange={(e, { value }) => this.setState({ HN: value })}
                />

                <Message negative hidden={!this.state.errorHN.status}>
                  {this.state.errorHN.message}
                </Message>
                <br />
                <Input
                  action={{ color: "teal", icon: "phone" }}
                  actionPosition="left"
                  fluid
                  // label="Phone number"
                  name="Phone number"
                  placeholder="Phone number"
                  type="number"
                  required
                  value={this.state.phoneNumber}
                  onChange={(e, { value }) =>
                    this.setState({ phoneNumber: value })
                  }
                />
                <Message negative hidden={!this.state.errorPhoneNumber.status}>
                  {this.state.errorPhoneNumber.message}
                </Message>
                <br />
                <Button color="teal" type="submit" style={{ width: "100%" }}>
                  Sign in
                </Button>
              </Form>
            </Segment>

            <Modal
              center
              styles={{
                modal: { width: 400, top: "40%", borderRadius: "10px" }
              }}
              open={this.state.openOTP}
              onClose={() => {
                this.setState({
                  openOTP: false,
                  OTPfield: ""
                });
              }}
            >
              <center>
                <Form name="OTP" style={{ marginTop: "5%" }}>
                  <label>Please fill your OTP</label>
                  <Form.Group
                    style={{
                      marginLeft: "12%",
                      marginTop: "2%"
                    }}
                  >
                    <Grid.Column>
                      <Form.Field style={{ paddingRight: 15 }}>
                        <input
                          className="OTP"
                          width={2}
                          style={{ width: 50 }}
                          maxLength={1}
                          id="1"
                          autoFocus
                          ref={input => (this.input["0"] = input)}
                          type="number"
                          onChange={this.onChange}
                          value={this.state.pin1}
                        />
                      </Form.Field>
                    </Grid.Column>
                    <Grid.Column>
                      <Form.Field style={{ paddingRight: 15 }}>
                        <input
                          className="OTP"
                          width={2}
                          style={{ width: 50 }}
                          maxLength={1}
                          id="2"
                          ref={input => (this.input["1"] = input)}
                          type="number"
                          onChange={this.onChange}
                          value={this.state.pin2}
                        />
                      </Form.Field>
                    </Grid.Column>
                    <Grid.Column>
                      <Form.Field style={{ paddingRight: 15 }}>
                        <input
                          className="OTP"
                          width={2}
                          style={{ width: 50 }}
                          maxLength={1}
                          id="3"
                          ref={input => (this.input["2"] = input)}
                          type="number"
                          onChange={this.onChange}
                          value={this.state.pin3}
                        />
                      </Form.Field>
                    </Grid.Column>
                    <Grid.Column>
                      <Form.Field style={{ paddingRight: 15 }}>
                        <input
                          className="OTP"
                          width={2}
                          style={{ width: 50 }}
                          maxLength={1}
                          id="4"
                          ref={input => (this.input["3"] = input)}
                          type="number"
                          onChange={this.onChange}
                          value={this.state.pin4}
                        />
                      </Form.Field>
                    </Grid.Column>
                  </Form.Group>
                  <Button
                    style={{ marginTop: "2.5%" }}
                    color="teal"
                    basic
                    size="small"
                    type="submit"
                    onClick={() => this.sendOTP()}
                  >
                    Request New OTP
                  </Button>
                </Form>
              </center>
              {/* <Label onClick={() => this.sendOTP()}>Request OTP Again</Label> */}
            </Modal>
          </Grid.Column>
        </center>
      </div>
    );
  }
}

export default withRouter(Login);
