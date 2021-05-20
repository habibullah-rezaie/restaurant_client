import React, { useContext, useState } from "react";
import GlobalState from "../../../GlobalState";

export const OrderFilter = () => {
  const state = useContext(GlobalState);

  const [zipCode, setZipCode] = state.ordersAPI.orderZipCode;
  const [phoneNumber, setPhoneNumber] = state.ordersAPI.ordererPhoneNumber;
  const [startDate, setStartDate] = state.ordersAPI.orderStartDate;
  const [endDate, setEndDate] = state.ordersAPI.orderEndDate;
  const [isDone, setIsDone] = state.ordersAPI.orderIsDone;
  const [, setPage] = state.ordersAPI.ordersPage;

  // Fields with possible error
  const [postalCodeErr, setPostalCodeErr] = useState("");
  const [phoneNoErr, setPhoneNoErr] = useState("");

  // component states itself
  const [toggleForm, setToggleForm] = useState(false);

  // Handle postalCode change
  const handlePostalCodeChange = (e) => {
    const postalCode = e.target.value;

    if (
      (postalCode.length !== 0 && postalCode.length < 5) ||
      postalCode.length > 5
    ) {
      setPostalCodeErr("Postal Codes are 5 characters long.");
    } else {
      setPostalCodeErr("");
    }

    setZipCode(postalCode);
  };

  // Handle phoneNumber change
  const handlePhoneNumberChange = (e) => {
    const phoneNo = e.target.value;

    // If in Germeny local
    if (phoneNo.length === 0) {
      setPhoneNoErr("");
    } else if (
      !/^(\+49)?0?[1|3]([0|5][0-45-9]\d|6([23]|0\d?)|7([0-57-9]|6\d))\d{7}$/.test(
        phoneNo
      )
    ) {
      setPhoneNoErr("Invalid phone number.");
    } else {
      setPhoneNoErr("");
    }

    setPhoneNumber(phoneNo);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!phoneNoErr && !postalCodeErr) {
      setPage(1);
      setEndDate(filters.endDate);
      setStartDate(filters.startDate);
      setZipCode(filters.zipCode);
      setPhoneNumber(filters.phoneNumber);
      setIsDone(filters.isDone);
      setToggleForm(!toggleForm);
    }
  };

  return (
    <div style={{ border: "none", width: "100%" }}>
      {!toggleForm && (
        <button onClick={() => setToggleForm(!toggleForm)}>Filter</button>
      )}
      {toggleForm && (
        <form onSubmit={handleSubmit}>
          <fieldset
            style={{
              border: "none",
              appearance: "none",
            }}
            className="order-filter__filterItem">
            <legend>Order Properties</legend>

            <div className="err">{postalCodeErr}</div>

            <label htmlFor="postal-code-input">Postal Code</label>
            <input
              type="text"
              id="postal-code-input"
              value={zipCode}
              onChange={handlePostalCodeChange}
            />

            <div>
              <label htmlFor="delivery-status">Delivery Status</label>
              <div
                className=""
                style={{ display: "flex", alignItems: "center" }}>
                <input
                  style={{ marginRight: ".2rem" }}
                  type="radio"
                  name="delivery-status"
                  id="deliveryStatusPending"
                  value={false}
                  isChecked={isDone === false}
                  onChange={(e) => setIsDone(!e.target.value)}
                />
                <label htmlFor="deliveryStatusPending">Pending</label>
              </div>

              <div
                className=""
                style={{ display: "flex", alignItems: "center" }}>
                <input
                  style={{ marginRight: ".2rem" }}
                  type="radio"
                  name="delivery-status"
                  id="deliveryStatusDeliverd"
                  value={true}
                  isChecked={isDone === true}
                  onChange={(e) => setIsDone(!!e.target.value)}
                />
                <label htmlFor="deliveryStatusDeliverd">Deliverd</label>
              </div>

              <div
                className=""
                style={{ display: "flex", alignItems: "center" }}>
                <input
                  style={{ marginRight: ".2rem" }}
                  type="radio"
                  name="delivery-status"
                  id="deliveryStatusBoth"
                  value={""}
                  isChecked={isDone === ""}
                  onChange={(e) => setIsDone(e.target.value)}
                />
                <label htmlFor="deliveryStatusBoth">both</label>
              </div>
            </div>
          </fieldset>

          {/* FIXME: AFTER datepicker, and moment install  */}
          {/* <div className="order-filter__filterItem">
          <h4>Start Date</h4>
          <input
          type="Date"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          />
        </div> */}
          {/* <div className="order-filter__filterItem">
          <h4>End Date</h4>
          <input
          type="date"
          value={phoneNumber}
            onChange={handlePhoneNumberChange}
            />
          </div> */}

          <fieldset
            className="order-filter__filterItem"
            style={{
              border: "none",
              appearance: "none",
            }}>
            <legend>Orderer Properties</legend>
            <div className="">
              <label htmlFor="phone-number-input">Phone Number</label>
              <input
                type="text"
                id="phone-number-input"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
              />
              <div className="err">
                <p>{phoneNoErr}</p>
              </div>
            </div>
          </fieldset>

          <fieldset
            style={{
              border: "none",
              appearance: "none",
            }}>
            <button type="submit">Ok</button>
          </fieldset>
        </form>
      )}
    </div>
  );
};
