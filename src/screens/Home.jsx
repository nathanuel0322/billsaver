import React, { useState, useEffect, useRef, useContext } from "react";
import Typed from "typed.js";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import PastBills from "./PastBills";
import { auth, db } from "../firebase";
import { getFirestore, setDoc, doc, getDoc, collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../assets/css/home.css";

export default function Home() {
  const isLaptop = useMediaQuery({ query: `(min-width: 728px)` });
  const isMobile = useMediaQuery({ query: `(max-width: 654px)` });

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const el = useRef(null);
  const typed = useRef(null);

  useEffect(() => {
    if (!isMobile) {
      const options = {
        strings: ["Bill Saver"],
        typeSpeed: 45,
        backSpeed: 45,
        loop: true,
      };

      typed.current = new Typed(el.current, options);

      return () => {
        typed.current.destroy();
      };
    }

    async function getData() {
      // get all documents in firestore and print their id's
      await getDocs(collection(db, "data", auth.currentUser.uid, "bills")).then((querySnapshot) => {
        console.log("querySnapshot:", querySnapshot);
        querySnapshot.forEach((doc) => {
          console.log("id:", doc.id);
        });
      });
    }
    getData();
  }, []);

  return (
    <div id="homeouterdiv">
      {/* Top right buttons in Home */}
      <button id="signoutbutton" className="buttons" onClick={() => logout()}>
        Sign Out
      </button>
      {/* Show static title if mobile, and typedjs title if not */}
      {isMobile ? (
        <p>Bill Saver</p>
      ) : (
        // house the typedjs so text and cursor aren't on top of each other
        <div id="typedjsdiv" className="flex flex-row items-center justify-center">
          <span id="typedvote" className="" ref={el} />
        </div>
      )}
      <PastBills />
      <button
        id="newformbutton"
        className="buttons mb-6"
        onClick={() => navigate("/form")}
      >
        Add a New Bill
      </button>
    </div>
  );
}
