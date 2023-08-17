import React, { useState } from "react";
import {
  FaPlaneArrival,
  FaPlaneDeparture,
  FaMale,
  FaChild,
  FaCalendarAlt,
} from "react-icons/fa";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useForm } from "react-hook-form";

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
  };
  const handleArrivalDateChange = (date) => {
    setArrivalDate(date);
    setValue("arrivalDate", date);
  };

  const onSubmit = (data) => alert(JSON.stringify(data));
  return (
    <React.Fragment>
      <section>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white w-auto h-auto pb-10 mt-5 mx-5 px-5 rounded-lg sm:w-full md:w-4/5 md:mx-auto lg:w-2/5 lg:mx-auto">
            {/* Header Part */}
            <div className="h-24 flex justify-center items-center shadow ">
              <p className="uppercase font-bold text-4xl text-center">
                flight booking app
              </p>
            </div>

            {/* Body Part */}
            <div>
              <div className="grid justify-center space-y-5 bg-indigo-50 pb-10">
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
                      <select
                        className={`w-full h-16 text-2xl pl-20 rounded-lg ${
                          errors.departure &&
                          " focus:border-red-500 focus:ring-red-500 border-red-500"
                        }`}
                        {...register("departure", {
                          required: {
                            value: true,
                            message: "Departure is required",
                          },
                        })}
                      >
                        <option value="" selected disabled hidden>
                          --Select Airport--
                        </option>
                        <option value="ENIA">
                          {" "}
                          England Newcastle International Airport
                        </option>
                        <option value="INIA">
                          {" "}
                          Italy Naples International Airport
                        </option>
                        <option value="MMA"> Malaysia Mulu Airport</option>
                        <option value="KMA"> Kenya Malindi Airport</option>
                      </select>
                      <FaPlaneDeparture className="text-4xl absolute left-5 top-10 " />
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

                {/* Arrival Part */}
                <div>
                  <div>
                    <div className="relative ml-5 mr-5">
                      <p className="font-bold text-xl uppercase">flying to</p>
                      <select
                        className={`w-full h-16 text-2xl pl-20 rounded-lg ${
                          errors.arrival &&
                          " focus:border-red-500 focus:ring-red-500 border-red-500"
                        }`}
                        {...register("arrival", {
                          required: {
                            value: true,
                            message: "Arrival is required",
                          },
                        })}
                      >
                        <option value="" selected disabled hidden>
                          --Select Airport--
                        </option>
                        <option value="ENIA">
                          {" "}
                          England Newcastle International Airport
                        </option>
                        <option value="INIA">
                          {" "}
                          Italy Naples International Airport
                        </option>
                        <option value="MMA"> Malaysia Mulu Airport</option>
                        <option value="KMA"> Kenya Malindi Airport</option>
                      </select>
                      <FaPlaneArrival className="text-4xl absolute left-5 top-10 " />
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
                  {tripType === "round trip" ? (
                    <div>
                      <div>
                        <div className="relative ml-5">
                          <p className="font-bold text-xl uppercase">
                            departure date
                          </p>
                          <DatePicker
                            className={`w-full h-12 text-xl pl-15 rounded-lg ${
                              errors.departureDate &&
                              "focus:border-red-500 focus:ring-red-500 border-red-500"
                            }`}
                            selected={departureDate} 
                            onChange={handleDepartureDateChange}
                          />
                          <FaCalendarAlt className="text-2xl absolute left-40 top-10 " />

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
                  ) : (
                    <div>
                      <div>
                        <div className="relative ml-24">
                          <p className="font-bold text-xl uppercase">
                            departure date
                          </p>
                          <DatePicker
                            className={`w-full h-12 text-xl pl-15 rounded-lg ${
                              errors.departureDate &&
                              "focus:border-red-500 focus:ring-red-500 border-red-500"
                            }`}
                            selected={departureDate} 
                            onChange={handleDepartureDateChange} 
                          />
                          <FaCalendarAlt className="text-2xl absolute left-52 top-10 " />

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
                  )}

                  {/* Return section */}
                  {tripType === "round trip" && (
                    <div>
                      <div>
                        <div className="relative mr-5">
                          <p className="font-bold text-xl uppercase">
                            return date
                          </p>
                          <DatePicker
                            className={`w-full h-12 text-xl pl-15 rounded-lg ${
                              errors.returnDate &&
                              "focus:border-red-500 focus:ring-red-500 border-red-500"
                            }`}
                            selected={arrivalDate}
                            onChange={handleArrivalDateChange}
                          />
                          <FaCalendarAlt className="text-2xl absolute left-40 top-10 " />

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
                  )}
                </div>

                {/* Passenger Part */}
                <div className="flex space-x-2">
                  {/* Adult Section */}
                  <div className="w-full">
                    <div>
                      <div className="relative ml-5">
                        <p className="font-bold text-xl uppercase">
                          {" "}
                          adults (18+)
                        </p>
                        <select
                          className="w-full h-12 rounded-lg text-2xl pl-20"
                          {...register("adult", {
                            required: {
                              value: true,
                              message: "Trip type is required",
                            },
                          })}
                        >
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                        <FaMale className="text-2xl absolute left-5 top-10 " />
                      </div>
                      {/* <div>Error</div> */}
                    </div>
                  </div>

                  {/* Children Section */}
                  <div className="w-full">
                    <div>
                      <div className="relative mr-5">
                        <p className="font-bold text-xl uppercase">
                          {" "}
                          children (0-17)
                        </p>
                        <select
                          className="w-full h-12 rounded-lg text-2xl pl-20"
                          {...register("children", {
                            required: {
                              value: true,
                              message: "Trip type is required",
                            },
                          })}
                        >
                          <option>0</option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                        <FaChild className="text-2xl absolute left-5 top-10 " />
                      </div>
                      {/* <div>Error</div> */}
                    </div>
                  </div>
                </div>

                {/* Class & Price Part */}
                <div className="flex space-x-2">
                  {/* Class Section */}
                  <div className="w-full">
                    <div>
                      <div className="ml-5">
                        <p className="font-bold text-xl uppercase"> class</p>
                        <select
                          className="w-full h-12 rounded-lg text-2xl "
                          {...register("class", {
                            required: {
                              value: true,
                              message: "Trip type is required",
                            },
                          })}
                        >
                          <option>Economy</option>
                          <option>Business</option>
                        </select>
                      </div>
                      {/* <div>Error</div> */}
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="w-full">
                    <div>
                      <div className="mr-5">
                        <p className="font-bold text-xl uppercase"> price</p>
                        <select
                          className="w-full h-12 rounded-lg text-2xl "
                          {...register("price", {
                            required: {
                              value: true,
                              message: "Trip type is required",
                            },
                          })}
                        >
                          <option>All Prices</option>
                          <option>$ 1000</option>
                          <option>$ 2000</option>
                          <option>$ 3000</option>
                          <option>$ 4000</option>
                          <option>$ 5000</option>
                        </select>
                      </div>
                      {/* <div>Error</div> */}
                    </div>
                  </div>
                </div>

                {/* BUtton section */}
                <div>
                  <input
                    type="submit"
                    value="Find flight"
                    className="w-full h-16 font-bold text-3xl uppercase rounded-lg bg-green-100 hover:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </React.Fragment>
  );
}

export default FlightSearch;
