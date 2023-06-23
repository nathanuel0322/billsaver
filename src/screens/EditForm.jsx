import { useState, useEffect } from "react";
import { db, auth, storage } from "../firebase";
import { getFirestore, setDoc, doc, getDoc, collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


export default function EditForm({ formdata, pagefunc, directionfunc }) {
    const navigate = useNavigate();
    useEffect(() => {
        // if imagesdiv only has one child, add
        if (document.getElementById('imagesdiv2').children.length === 1) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imagePreview = document.createElement('img');
                imagePreview.src = e.target.result;
                document.getElementById('imagesdiv2').appendChild(imagePreview);
            }
            reader.readAsDataURL(formdata.image);
        }
    }, []);
    return (
        <div id="billform" className="flex items-center relative mx-auto flex-col w-max-2 justify-start rounded-lg p-2">
            <h1 className="font-bold mb-4 text-4xl text-white">Any changes you'd like to make?</h1>
            <p className="text-white text-2xl">Patient's Name: <span style={{color: 'greenyellow'}} className="text-2xl font-semibold underline">{formdata.name}</span></p>
            <p className="text-white text-2xl">Patient's Address: <span style={{color: 'greenyellow'}} className="text-2xl font-semibold underline">{formdata.address}</span></p>
            <p className="text-white text-2xl">Patient's Hospital: <span style={{color: 'greenyellow'}} className="text-2xl font-semibold underline">{formdata.hospitalname}</span></p>
            <p className="text-white text-2xl">Patient's Date of Service:&nbsp;
                <span style={{color: 'greenyellow'}} className="text-2xl font-semibold underline">{new Date(formdata.date).toLocaleString("en", {
                    weekday: "long", year: "numeric", month: "long", day: "numeric",
                  })}
                </span>
            </p>
            <p className="text-white text-2xl">Patient's Bill Amount: <span  style={{color: 'greenyellow'}} className="text-2xl font-semibold underline">{formdata.amount}</span></p>
            <div id="imagesdiv2"><span>Bill Image:</span></div>
            <button className="buttons text-white"
                onClick={() => {pagefunc(0); directionfunc('prev') }}
            >
                Make Changes
            </button>
            <button
                onClick={async () => {
                    const parentDocRef = doc(db, 'data', auth.currentUser.uid);
                    try {
                        await setDoc(parentDocRef, {sample: 'sample'})
                        const resultsCollectionRef = collection(parentDocRef, 'bills');
                        await addDoc(resultsCollectionRef, {
                            name: formdata.name,
                            address: formdata.address,
                            hospitalname: formdata.hospitalname,
                            date: formdata.date,
                            amount: formdata.amount,
                        })
                            .then(async (docRef) => {
                                // if docref exists, upload image to storage, else throw error
                                console.log(docRef);
                                if (docRef) {
                                    const storageRef = ref(storage, `images/${docRef.id}`);
                                    await uploadBytes(storageRef, formdata.image)
                                        .then((snapshot) => {
                                            toast.success('Bill successfully uploaded!');
                                            navigate('/')
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                            toast.error('Error uploading bill!');
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