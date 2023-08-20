import React, { useState, useEffect } from "react";
import {
  FaPlaneArrival,
  FaPlaneDeparture,
  FaCalendarAlt,
} from "react-icons/fa";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useForm } from "react-hook-form";

import Select from "react-select";

import _ from "lodash";

function FlightSearch() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const [departureDate, setDepartureDate] = useState(new Date());
  const [arrivalDate, setArrivalDate] = useState(new Date());
  const tripType = watch("tripType");

  const handleDepartureDateChange = (date) => {
    setDepartureDate(date); // Add the new date
    setValue("departureDate", date); // Update date in form
    console.log("Selected Departure Date:", date);
  };
  const handleArrivalDateChange = (date) => {
    setArrivalDate(date);
    setValue("arrivalDate", date);
  };

  const handleDepartureCountryChange = (selectedOption) => {
    setDepartureCountry(selectedOption);
    setValue("departure", selectedOption?.value);
    setShowFilteredFlights(false); // Reset filtered flights
    setLoading(false); // Reset loading state
  };

  const handleArrivalCountryChange = (selectedOption) => {
    setArrivalCountry(selectedOption);
    setValue("arrival", selectedOption?.value);
    setShowFilteredFlights(false); // Reset filtered flights
    setLoading(false); // Reset loading state
  };

  const onSubmit = (data) => {
    alert(JSON.stringify(data));
    setShowFilteredFlights(true);
    setFlightDates(filteredFlights);
  };

  const [flights, setFlights] = useState([]); // A state is defined to store aircraft information

  const [departureCountry, setDepartureCountry] = useState(null); // Seçili havalimanı bilgisi
  const [arrivalCountry, setArrivalCountry] = useState(null); // Seçili varış havalimanı bilgisi
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [flightDates, setFlightDates] = useState([]);

  const [showFilteredFlights, setShowFilteredFlights] = useState(false);

  const [sortingCriteria, setSortingCriteria] = useState("departureDate");
  const sortFlights = (flights) => {
    switch (sortingCriteria) {
      case "departureDate":
        console.log("Sorting by departure date");
        return _.sortBy(flights, "airportDepartureDate");
      case "arrivalDate":
        console.log("Sorting by arrival date");
        return _.sortBy(flights, "airportArrivalDate");
      case "flightDuration":
        console.log("Sorting by flight duration");
        return _.sortBy(flights, (flight) => {
          const departureTime = new Date(flight.airportDepartureDate).getTime();
          const arrivalTime = new Date(flight.airportArrivalDate).getTime();
          return arrivalTime - departureTime;
        });
      case "airportPrice":
        console.log("Sorting by airport price");
        return _.sortBy(flights, "airportPrice");
      default:
        return flights;
    }
  };
  const [loadingFlights, setLoadingFlights] = useState(true);

  const uniqueDepartureCountries = [
    ...new Set(flights.map((flight) => flight.airportDepartureName)),
  ];
  const uniqueArrivalCountries = [
    ...new Set(flights.map((flight) => flight.airportArrivalName)),
  ];

  const departureOptions = uniqueDepartureCountries.map((country) => ({
    value: country,
    label: country,
  }));
  const arrivalOptions = uniqueArrivalCountries.map((country) => ({
    value: country,
    label: country,
  }));

  const [loading, setLoading] = useState(false); // Add loading state
  const [showLoading, setShowLoading] = useState(false); // Add a state for showing loading state

  const handleFindFlights = () => {
    if (!loading) {
      // Only allow triggering if not already loading
      setLoading(true); // Start loading
      setShowLoading(true); // Show loading state

      setTimeout(() => {
        setShowLoading(false); // Hide loading state
        setLoading(false); // Finish loading
        setShowFilteredFlights(true); // Set the state to indicate that filtered flights are available
      }, 2000); // 2 seconds delay
    }
  };

  const fetchFlightsData = () => {
    const url = new URL("https://64e1d933ab003735881875c2.mockapi.io/flights");
    url.searchParams.append("completed", false);
    url.searchParams.append("page", 1);
    url.searchParams.append("limit", 40);

    fetch(url, {
      method: "GET",
      headers: { "content-type": "application/json" },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Network response was not ok");
      })
      .then((data) => {
        // Format the data and set the flights state
        const formattedFlights = data.map((flight) => ({
          id: flight.id,
          airportDepartureName: flight.departureCountry,
          airportArrivalName: flight.arrivalCountry,
          airportDepartureDate: flight.departureDate,
          airportArrivalDate: flight.arrivalDate,
          airportEmptySeat: flight.emptySeat,
          airportSeatClass: flight.seatClass,
          airportPrice: flight.price,
          airportReturnDate: flight.returnDate,
        }));
        console.log("Fetched flights:", formattedFlights);
        setFlights(formattedFlights);
        setLoadingFlights(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  useEffect(() => {
    // Fetch data when the component mounts
    fetchFlightsData();
  }, []);

  useEffect(() => {
    if (showFilteredFlights) {
      // Only filter and display when showFilteredFlights is true
      // Filter flights based on departure and arrival countries
      if (departureCountry && arrivalCountry) {
        const filteredFlights = flights.filter((flight) => {
          return (
            flight.airportDepartureName === departureCountry.label &&
            flight.airportArrivalName === arrivalCountry.label
          );
        });

        // Set the filtered flights directly to the state
        setFilteredFlights(filteredFlights);
        console.log("Filtered flights:", filteredFlights);

        if (filteredFlights.length > 0) {
          const dates = filteredFlights.map((flight) => ({
            departureDate: flight.departureDate,
            arrivalDate: flight.arrivalDate,
          }));
          setFlightDates(dates);
        } else {
          setFlightDates([]);
        }
      } else {
        setFilteredFlights([]);
        setFlightDates([]);
      }
    }
  }, [showFilteredFlights, departureCountry, arrivalCountry]);

  const sortedFlights = sortFlights(filteredFlights);
  console.log("Sorted flights:", sortedFlights);
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
    return formattedDate;
  }
  function isSameLocalDay(date1, date2) {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const formattedDate1 = new Date(date1).toLocaleDateString(
      undefined,
      options
    );
    const formattedDate2 = new Date(date2).toLocaleDateString(
      undefined,
      options
    );

    return formattedDate1 === formattedDate2;
  }

  return (
    <React.Fragment>
      <section className="bg-gray-300 min-h-screen flex justify-center items-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-gray-50 w-auto h-auto pb-10 mt-5 mx-5 px-5 rounded-lg sm:w-full md:w-4/5 md:mx-auto lg:w-2/5 lg:mx-auto">
            {/* Header Part */}
            <div className="h-24 flex justify-center items-center shadow ">
              <p className="uppercase font-bold text-4xl text-center">
                flight booking app
              </p>
            </div>

            {/* Body Part */}
            <div>
              <div className="grid justify-center space-y-5 bg-blue-200 pb-10">
                <div>
                  <div className="flex justify-center space-x-8 mt-5">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        className={`w-6 h-6 ${
                          errors.tripType &&
                          " focus:border-red-500 focus:ring-red-500 border-red-500"
                        }`}
                        value="round trip"
                        {...register("tripType", {
                          required: {
                            value: true,
                            message: "Trip type is required",
                          },
                        })}
                      />
                      <p className="text-xl font-bold uppercase">Round trip</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        className={`w-6 h-6 ${
                          errors.tripType &&
                          " focus:border-red-500 focus:ring-red-500 border-red-500"
                        }`}
                        value="one way"
                        {...register("tripType", {
                          required: {
                            value: true,
                            message: "Trip type is required",
                          },
                        })}
                      />
                      <p className="text-xl font-bold uppercase">one way</p>
                    </div>
                  </div>
                  <div>
                    {errors.tripType && (
                      <span className="text-sm text-red-500">
                        {errors.tripType.message}
                      </span>
                    )}
                  </div>
                </div>
                {/* Departure Part */}
                <div>
                  <div>
                    <div className="relative ml-5 mr-5">
                      <p className="font-bold text-xl uppercase">flying from</p>
                      <Select
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            borderColor: state.isFocused ? "grey" : "black",
                          }),
                        }}
                        className={`w-full h-16 text-2xl pl-20 rounded-lg `}
                        value={departureCountry}
                        onChange={handleDepartureCountryChange}
                        options={departureOptions}
                      />
                      <FaPlaneDeparture className="text-4xl absolute left-5 top-8 " />
                    </div>
                    <div>
                      {errors.departure && (
                        <span className="text-sm text-red-500">
                          {errors.departure.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <div className="relative ml-5 mr-5">
                      <p className="font-bold text-lg uppercase">flying to</p>
                      <Select
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            borderColor: state.isFocused ? "grey" : "black",
                          }),
                        }}
                        className={`w-full h-16 text-2xl pl-20 rounded-lg `}
                        value={arrivalCountry}
                        onChange={handleArrivalCountryChange}
                        options={arrivalOptions}
                      />
                      <FaPlaneArrival className="text-4xl absolute left-5 top-8 " />
                    </div>
                    <div>
                      {errors.arrival && (
                        <span className="text-sm text-red-500">
                          {errors.arrival.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Date Part */}
                <div className="flex space-x-2">
                  {/* Departure section */}
                  <div>
                    <div>
                      <div className="relative ml-5">
                        <p className="font-bold text-lg uppercase">
                          departure date
                        </p>
                        <DatePicker
                          dateFormat="dd/MM/yyyy"
                          className={`w-full h-12 text-xl pl-15 rounded-lg`}
                          selected={departureDate}
                          onChange={handleDepartureDateChange}
                          isClearable
                          placeholderText="Cleared!"
                        />
                        <FaCalendarAlt className="text-2xl absolute left-36 top-10 " />

                        {errors.departureDate && (
                          <span className="text-red-500">
                            {errors.departureDate.message}
                          </span>
                        )}
                      </div>
                      <div>
                        {errors.departureDate && (
                          <span className="text-sm text-red-500">
                            {errors.departureDate.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Return section */}
                  <div>
                    <div>
                      <div className="relative mr-5">
                        <p className="font-bold text-lg uppercase">
                          return date
                        </p>
                        <DatePicker
                          className={`w-full h-12 text-xl pl-15 rounded-lg `}
                          dateFormat="dd/MM/yyyy"
                          selected={arrivalDate}
                          onChange={handleArrivalDateChange}
                          disabled={tripType === "one way"} // Disable when "one way" is selected
                          isClearable
                          placeholderText="Cleared!"
                        />
                        <FaCalendarAlt className="text-2xl absolute left-36 top-10 " />
                        {tripType === "one way" && (
                          <div className="flex justify-center space-x-4 text-red-500">
                            <p className="text-xl font-bold">
                              need to be round trip
                            </p>
                          </div>
                        )}

                        {errors.returnDate && (
                          <span className="text-red-500">
                            {errors.returnDate.message}
                          </span>
                        )}
                      </div>
                      <div>
                        {errors.returnDate && (
                          <span className="text-sm text-red-500">
                            {errors.returnDate.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Button Section */}
                <div>
                  <input
                    type="button"
                    value="Find Flights"
                    className="w-full h-16 font-bold text-3xl uppercase rounded-lg bg-green-200 hover:bg-white"
                    onClick={handleFindFlights}
                  />
                  {loading && (
                    <div className="mt-3 text-center text-xl text-green-50 font-bold">
                      Loading...
                    </div>
                  )}
                </div>

                {showFilteredFlights && !loading && (
                  <div>
                    {/* Sorting Dropdown */}

                    <div className="mt-4">
                      <label htmlFor="sorting" className="font-bold text-lg">
                        Sort by:
                      </label>
                      <select
                        className="ml-2 border rounded px-2 py-1"
                        style={{ width: "150px" }}
                        value={sortingCriteria}
                        onChange={(e) => setSortingCriteria(e.target.value)}
                      >
                        <option value="departureDate">Departure Time</option>
                        <option value="arrivalDate">Arrival Time</option>
                        <option value="flightDuration">Flight Duration</option>
                        <option value="airportPrice">Price</option>
                      </select>
                    </div>

                    {/* Filtered Flights Container */}
                    {showFilteredFlights && (
                      <div className="mt-5 bg-white p-4 rounded-lg shadow-md">
                        <p className="font-bold text-xl uppercase mb-3">
                          Filtered Flights:
                        </p>
                        <ul className="space-y-2">
                          {sortedFlights.map((flight) => {
                            const flightDepartureDate = new Date(
                              flight.airportDepartureDate
                            );
                            const selectedDepartureDate = new Date(
                              departureDate
                            );
                            const isRoundTrip = tripType === "round trip"; // Check if round trip is selected

                            if (
                              isSameLocalDay(
                                flightDepartureDate,
                                selectedDepartureDate
                              )
                            ) {
                              return (
                                <li key={flight.id} className="border-b py-2">
                                  <p className="text-lg">
                                    Departure Number: {flight.id}
                                  </p>
                                  <p className="text-lg">
                                    Departure Airport:{" "}
                                    {flight.airportDepartureName}
                                  </p>
                                  <p className="text-lg">
                                    Arrival Airport: {flight.airportArrivalName}
                                  </p>
                                  <p className="text-lg">
                                    Departure Date:{" "}
                                    {formatDate(flight.airportDepartureDate)}
                                  </p>
                                  <p className="text-lg">
                                    Arrival Date:{" "}
                                    {formatDate(flight.airportArrivalDate)}
                                  </p>
                                  {isRoundTrip && (
                                    <p className="text-lg">
                                      Return Date:{" "}
                                      {formatDate(flight.airportReturnDate)}
                                    </p>
                                  )}
                                  <p className="text-lg">
                                    Empty Seat: {flight.airportEmptySeat}
                                  </p>
                                  <p className="text-lg">
                                    Seat Class: {flight.airportSeatClass}
                                  </p>
                                  <p className="text-lg">
                                    Price: {flight.airportPrice}
                                  </p>
                                </li>
                              );
                            }

                            return null;
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </section>
    </React.Fragment>
  );
}

export default FlightSearch;
