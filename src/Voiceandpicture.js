import "./assets/css/global.css";
import "./assets/css/main.css";
import "./assets/css/binds.css";
import plug from "../src/assets/images/plug.png";

import { useEffect, useState, useCallback } from "react";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import { faMicrophoneAlt } from "@fortawesome/fontawesome-free-solid";
import { faStopCircle } from "@fortawesome/fontawesome-free-solid";
import { faTimesCircle } from "@fortawesome/fontawesome-free-solid";
import { faPencilAlt } from "@fortawesome/fontawesome-free-solid";
import { getFirestore } from "firebase/firestore";
import Button from "./components/Button/Button";
import TextField from "./components/TextField/TextField";
import Image from "./components/Image/Image";
import config from "./config";
import StopWatch from "./components/StopWatch/StopWatch";
import { collection, addDoc, doc } from "firebase/firestore";
import { initializeApp } from "firebase/app";

import {
  query,
  where,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// npm install -g firebase-tools

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChkia3Zh8Er_ou96iGUS8kem1DL3Ce32s",
  authDomain: "drawai-79e59.firebaseapp.com",
  databaseURL:
    "https://drawai-79e59-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "drawai-79e59",
  storageBucket: "drawai-79e59.appspot.com",
  messagingSenderId: "660383025669",
  appId: "1:660383025669:web:3742690dfa077a73676a6c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const Voiceandpicture = () => {
  const [recordState, setRecordState] = useState(null);
  const [loadingTranscription, setLoadingTranscription] = useState(false);
  const [textField, setTextField] = useState("Here will be your promt..");
  const [recording, setRecording] = useState(false);
  const [recordingText, setRecordingText] = useState("Rec");
  const [loadingImage, setLoadingImage] = useState(false);
  const [image, setImage] = useState(plug);

  const startRecording = () => {
    setRecording(true);
    setRecordState(RecordState.START);
  };

  const stopRecording = () => {
    setRecording(false);
    setRecordState(RecordState.STOP);
  };

  const resultOfRecording = (audioData) => {
    console.log(audioData);
    getTranscriptionOfAudio(audioData.blob);
  };

  useEffect(() => {
    if (recording) {
      setRecordingText("Recording...");
    } else {
      setRecordingText("Rec");
    }
  }, [recording]);

  useEffect(() => {
    if (loadingTranscription) {
      setTextField("Loading...");
    }
  }, [loadingTranscription]);

  // async function getImageFromDalle() {
  // 	setLoadingImage(true);
  // 	const response = await openai.createImage({
  // 		prompt: textField,
  // 		n: 1,
  // 		size: "1024x1024",
  // 	});

  // 	setImage(response.data.data[0].url);
  // }

  async function getImageFromDalle() {
    setLoadingImage(true);
    const myPrompt = textField;
    const response = await fetch(
      "https://us-central1-samaibackend.cloudfunctions.net/happyAI/pictures",
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ myPrompt }),
      }
    );

    const result = await response.json();
    setImage(result.data[0].url);
    try {
      const docRef = await addDoc(collection(db, "picture"), {
        url: result.data[0].url,
        prompt: myPrompt,
        timestamp: new Date(),
        timestamp2: Timestamp.fromDate(new Date()),
      });

      await updateDoc(doc(db, "current", "9AKh5RicP7cOmqNxOkeH"), {
        url: result.data[0].url,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  const loadedImage = () => {
    setLoadingImage(false);
  };

  const cleanAllFields = () => {
    setTextField("Here will be your promt..");
    setImage(plug);
  };

  async function getTranscriptionOfAudio(audioFile) {
    setLoadingTranscription(true);
    const response = await fetch(
      "https://api-inference.huggingface.co/models/openai/whisper-tiny.en",
      {
        headers: {
          Authorization: `Bearer ${config.huggingface_api_token}`,
        },
        method: "POST",
        body: audioFile,
      }
    );
    const result = await response.json();
    console.log(result);

    if (result.error) {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/wav2vec2-base-960h",
        {
          headers: {
            Authorization: `Bearer ${config.huggingface_api_token}`,
          },
          method: "POST",
          body: audioFile,
        }
      );
      const result = await response.json();
      console.log(result);

      console.log("we dont have picture");
      setTextField(result.text);
    } else {
      setTextField(result.text);
    }
    setTextField(result.text);
  }

  return (
    <section className="main">
      <div className="container container-bordered">
        <div className="row mb-30 main-content">
          <div className="col-50 content-text">
            <h1 className="accent-color mb-30">
              Tell us what you want to draw
            </h1>
            <div className="row ai-flexstart gap-15 action-panel">
              <div className="col-50 action-btns">
                <div className="btn-group fd-c">
                  <Button icon={faMicrophoneAlt} onClick={startRecording}>
                    {recordingText}
                    {recording && <StopWatch />}
                  </Button>
                  <Button
                    icon={faStopCircle}
                    onClick={stopRecording}
                    disabled={recording ? false : true}
                  >
                    Translate to text
                  </Button>
                  <Button icon={faTimesCircle} onClick={cleanAllFields}>
                    Clean all
                  </Button>
                </div>
              </div>
              <div className="col-50 instruction">
                <h2 className="mb-10">Instruction</h2>
                <ul>
                  <li>1) press Rec and tell what you want to draw</li>
                  <li>2) press "Translate to text"</li>
                  <li>3) press "Draw"</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-50 fd-c content-image">
            <AudioReactRecorder
              state={recordState}
              onStop={resultOfRecording}
            ></AudioReactRecorder>
            <Image
              src={image}
              loadingImage={loadingImage}
              onLoad={loadedImage}
            />
          </div>
        </div>
        <div className="row fd-c gap-50">
          <div className="col-100">
            <TextField>{textField}</TextField>
          </div>
          <div className="col-50 ai-c">
            <Button icon={faPencilAlt} onClick={getImageFromDalle}>
              Draw
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Voiceandpicture;
