import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../App.jsx";
import { useNavigate } from "react-router";
import { db, storage } from "../firebase.js";
import { collection, getDocs, getFirestore, setDoc, doc, getDoc, addDoc, serverTimestamp } from "@firebase/firestore";
import { toast } from "react-toastify";
import { useMediaQuery } from 'react-responsive';

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styles from "../assets/css/pastbills.module.css";

export default function PastBills() {
  const isTablet = useMediaQuery({ query: `(min-width: 605px)` });
  const isLaptop = useMediaQuery({ query: `(min-width: 728px)` });
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [foundpast, setFoundPast] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // gets all the documents in the bills collection for the current user
      const querySnapshot = await getDocs(collection(db, "data", user.uid, "bills"));

      // maps the data from each document into an array
      const newDataPromises = querySnapshot.docs.map(async (doc) => ({ 
        ...doc.data(),
        id: doc.id,
        url: await getDownloadURL(ref(storage, `images/${doc.id}`))
      }))

      const newData = await Promise.all(newDataPromises);

      // filters out any duplicates
      setFoundPast((prevState) => {
        const uniqueData = newData.filter((obj) => {
          return !prevState.some((prevObj) => prevObj.id === obj.id);
        });
        return [...prevState, ...uniqueData];
      });
      return querySnapshot;
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("foundpast is: ", foundpast);
  }, [foundpast]);

  return (
    <div>
      <div
        id="pastbillsdiv"
        className={styles["pastbillsdiv"] + " flex flex-col items-center justify-center relative"}
      >
        {foundpast.length === 0 && (
          <div>
            <h1 className="text-base">
              You haven't submitted any bills just yet!
            </h1>
          </div>
        )}
        {foundpast.length > 0 &&
          foundpast.map((val, index) => {
            console.log("value at index is: ", val);
            return (
              <div key={index} className={isTablet ? "flex flex-row gap-x-4 justify-center cursor-pointer" : "flex flex-col gap-y-4 justify-center cursor-pointer items-center"}
                onClick={() => navigate(`/editform/${index}`, { state: val })}
              >
                <img src={val.url} alt="bill" className={isTablet ? "w-1/4 h-1/4 rounded-lg" : "w-1/2 h-1/2 rounded-lg"} />
                <div className="flex flex-col gap-y-4 text-black text-2xl">
                  <p>Name: {val.name}</p>
                  <p>Address: {val.address}</p>
                  <p>Hospital: {val.hospitalname}</p>
                  <p>Date of Service: {new Date(val.date.seconds * 1000).toLocaleString("en", {
                    weekday: "long", year: "numeric", month: "long", day: "numeric",
                  })}</p>
                  <p>Bill Amount: <span className="text-green-700">${val.amount}</span></p>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}
