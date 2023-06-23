import { useState, useEffect } from "react";
import { db, auth, storage } from "../firebase";
import { getFirestore, setDoc, doc, getDoc, collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


export default function EditForm({ formdata, pagefunc, directionfunc }) {
    useEffect(() => {
        // read file in formdata.image
        // display image in #imagesdiv
        const reader = new FileReader();
        reader.onload = function (e) {
            const imagePreview = document.createElement('img');
            imagePreview.src = e.target.result;
            document.getElementById('imagesdiv').appendChild(imagePreview);
        }
        reader.readAsDataURL(formdata.image);
    }, []);
    return (
        <div id="billform" className="flex items-center relative mx-auto flex-col w-max-2 justify-start rounded-lg p-2">
            <h1 className="font-bold mb-4 text-4xl text-white">Any changes you'd like to make?</h1>
            <p className="text-white text-2xl">Patient's Name: {formdata.name}</p>
            <p className="text-white text-2xl">Patient's Address: {formdata.address}</p>
            <p className="text-white text-2xl">Patient's Hospital: {formdata.hospitalname}</p>
            <p className="text-white text-2xl">Patient's Date of Service: {formdata.date.toString()}</p>
            <p className="text-white text-2xl">Patient's Bill Amount: {formdata.amount}</p>
            <div id="imagesdiv">Bill Image:</div>
            <button className="buttons text-white"
                onClick={() => {pagefunc(0); directionfunc('prev') }}
            >
                Make Changes
            </button>
            <button
                onClick={async () => {
                    const parentDocRef = doc(db, 'data', auth.currentUser.uid);
                    try {
                        await setDoc(parentDocRef, {
                            sample: 'sample'
                            // name: formdata.name,
                            // address: formdata.address,
                            // hospitalname: formdata.hospitalname,
                            // date: formdata.date,
                            // amount: formdata.amount
                        })
                        const resultsCollectionRef = collection(parentDocRef, 'bills');
                        await addDoc(resultsCollectionRef, {
                            name: formdata.name,
                            address: formdata.address,
                            hospitalname: formdata.hospitalname,
                            date: formdata.date,
                            amount: formdata.amount,
                        })
                            .then((docRef) => {
                                // if docref exists, upload image to storage, else throw error
                                console.log(docRef);
                                if (docRef) {
                                    const storageRef = ref(storage, `images/${docRef.id}`);
                                    uploadBytes(storageRef, formdata.image)
                                        .then((snapshot) => {
                                            console.log('Uploaded a blob or file!');
                                        });
                                } else {
                                    throw new Error('docRef is null');
                                }
                            })
                            .catch((error) => {
                                console.error("Error adding document: ", error);
                            });
                    } catch (e) {
                        console.log(e);
                    }
                }}
                className="buttons text-white"
            >
                Confirm Changes
            </button>
        </div>
    )
}