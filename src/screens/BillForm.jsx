import React, { useState, forwardRef } from "react";
import { toast } from "react-toastify";
import { hospitals } from "../data/finalhospitals.js";
import { useTransition, animated } from 'react-spring';
import ReactDatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import EditForm from "./EditForm.jsx";
import "react-datepicker/dist/react-datepicker.css";
import "../assets/css/billform.css";

export const BillForm = ({ setFormData }) => {
  const [suggestedValues, setSuggestedValues] = useState([]);
  const [hospitalclicked, setHospitalclicked] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [dataobj, setDataobj] = useState({
    name: "",
    address: "",
    hospitalname: "",
    date: "",
    amount: "",
    image: "",
  });
  const pages = [0, 1, 2]

  const [transitionDirection, setTransitionDirection] = useState('next');

  const transitions = useTransition(currentPage, {
    from: { opacity: 0, transform: transitionDirection === 'next' ? 'translate3d(100%,0,0)' : 'translate3d(-100%,0,0)'},
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: { opacity: 0, transform: transitionDirection === 'next' ? 'translate3d(-100%,0,0)' : 'translate3d(100%,0,0)' },
  })

  const handleHospitals = async (event) => {
    const value = event.target.value;
    setDataobj({ ...dataobj, hospitalname: value });
    setHospitalclicked(false);

    const data = filterHospitals(value);
    setSuggestedValues(data);
  };

  const filterHospitals = (input) => {
    if (input.toLowerCase() !== "") {
      let filteredStocks = hospitals.filter((hospital) => {
        return hospital.toLowerCase().includes(input);
      });
      return filteredStocks;
    } else {
      return [];
    }
  };

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <button
      type="button"
      id="datepick"
      className="my-3 text-center w-full rounded-lg bg-white"
      onClick={onClick}
      ref={ref}
      style={{color: value ? "black" : "#9ca3af" }}
    >
      {value ? value : "Date of Service"}
    </button>
  ));

  const getStartDate = () => {
    const today = new Date();
    return today.setDate(today.getDate() - 1);
  };

  const submitfunc = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    toast.success("Checking history and calculating portfolio.", {
      position: toast.POSITION.TOP_CENTER,
      theme: "colored",
    });
    setFormData({
      ...dataobj,
      start: new Date(dataobj.start).toISOString().substring(0, 10),
      finish: new Date(dataobj.finish).toISOString().substring(0, 10),
    });
  };

  const validateForm = () => {
    const errorMessages = [];
    if (dataobj.name === 0 || !dataobj.name) {
      errorMessages.push("Please enter the patient's name.")
    }

    if (dataobj.address === "" || !dataobj.address) {
      errorMessages.push("Please enter the patient's address.")
    }

    if (dataobj.hospitalname === "" || !dataobj.hospitalname) {
      errorMessages.push("Please enter the patient's hospital.")
    }
    if (dataobj.date === "") {
      errorMessages.push("Please enter a date of service.")
    }
    if (dataobj.amount === "") {
      errorMessages.push("Please enter the amount of the bill.")
    }

    if (dataobj.image === "") {
      errorMessages.push("Please upload an image of the bill.")
    } else if (dataobj.image.size > 1000000) {
      errorMessages.push("Please upload an image smaller than 1MB.")
    }

    if (errorMessages.length > 0) {
      errorMessages.forEach((errorMessage) => {
        toast.error(errorMessage, {
          position: toast.POSITION.TOP_CENTER,
          theme: "colored",
        });
      });
  
      return false;
    }
  
    return true;
  };

  return (
    <div id="billparentdiv" className='flex flex-row items-center justify-center text-black absolute top-1/2 left-1/2 w-screen'>
      <button id="backtohomebutton" className="buttons" onClick={() => navigate('/')}>
        Back to Home
      </button>
      {transitions((style, item) => (
          <animated.div style={style} className='absolute w-screen'>
            {pages[item] === 0 && (
              <div id="billform"
                className="flex items-center relative mx-auto flex-col w-max-2 justify-start rounded-lg p-2"
                onSubmit={(e) => submitfunc(e)}
              >
                <h1 className="font-bold mb-4 text-6xl text-white">Bill Form</h1>
                <input
                  id="patientname"
                  type="text"
                  placeholder="Patient's Name"
                  value={dataobj.name}
                  onChange={(event) => setDataobj({ ...dataobj, name: event.target.value })}
                />
                <input
                  id="patientaddress"
                  type="text"
                  placeholder="Patient's Address"
                  value={dataobj.address}
                  onChange={(event) => setDataobj({ ...dataobj, address: event.target.value })}
                />
                <input
                  id="patienthospital"
                  className="my-3 text-center w-full rounded-lg"
                  type="text"
                  placeholder="Patient's Hospital"
                  value={dataobj.hospitalname}
                  onChange={handleHospitals}
                />
                {dataobj.hospitalname.length !== 0 && !hospitalclicked && suggestedValues.length !== 0 &&
                  <ul className="max-h-96 w-80 overflow-y-scroll drop-shadow-md rounded-m p-2" style={{transition: 'all 0.3s ease-in-out'}}>
                    {suggestedValues.map((value, index) => (
                      <li className="hospitaloptions bg-blue-50 text-m p-1 rounded-md text-center" key={index} style={{ width: '85%', margin: '1vh auto'}}>
                        <button className="font-medium gradientText text-center bg-blue-50"
                          onClick={() => {setDataobj({ ...dataobj, hospitalname: value }); setHospitalclicked(true)}}
                        >
                          {value}
                        </button>
                      </li>
                    ))}
                  </ul>
                }
                <ReactDatePicker
                  className="w-10"
                  selected={dataobj.date}
                  onChange={(date) => {console.log("date:", date); setDataobj({ ...dataobj, date })}}
                  customInput={<CustomInput />}
                  popperPlacement="bottom"
                  maxDate={getStartDate()}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
                <input
                  id="billamount"
                  type="number"
                  placeholder="Bill Amount"
                  value={dataobj.amount}
                  onChange={(event) => setDataobj({ ...dataobj, amount: event.target.value })}
                />
                <button
                  id="fileclicker"
                  className="my-3 text-center rounded-lg bg-white"
                  onClick={() => document.getElementById("billimage").click()}
                  style={{ color: dataobj.image ? "black" : "#9ca3af" }}
                >
                  {dataobj.image ? dataobj.image.name : "Upload Bill Image"}
                </button>
                <input
                  type="file"
                  id="billimage"
                  accept="image/*"
                  onChange={(event) => {
                    document.getElementById('imagesdiv').innerHTML = '';
                    const file = event.target.files[0];
                    const reader = new FileReader();
                    reader.onload = function (e) {
                      const imagePreview = document.createElement('img');
                      imagePreview.src = e.target.result;
                      document.getElementById('imagesdiv').appendChild(imagePreview);
                    }
                    reader.readAsDataURL(file);
                    setDataobj({ ...dataobj, image: file });
                  }}
                  style={{ display: "none" }}
                />
                <div id="imagesdiv"></div>
                <button
                  onClick={() => {
                    if (validateForm()) {
                      setCurrentPage(1);
                      setTransitionDirection('next')
                    }
                  }}
                  className="buttons text-white"
                >
                  Continue
                </button>
              </div>
            )}
            {pages[item] === 1 && (
              <EditForm formdata={dataobj} pagefunc={setCurrentPage} directionfunc={setTransitionDirection} />
            )}
          </animated.div>
      ))}
    </div>
  );
};
