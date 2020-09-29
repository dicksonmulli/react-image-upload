import React, {useState, useEffect, useCallback} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import {useDropzone} from 'react-dropzone';

const UserProfiles =() => {

  const [userProfiles, setUserProfiles] = useState([])

  const fetchUserProfiles = () => {
    axios.get("http://localhost:8080/api/v1/user-profile").then(res => {
      console.log(res)
      setUserProfiles(res.data);
    }).then(error => {
      console.log(error)
    })
  }
  
  useEffect(() => {
    fetchUserProfiles();
  }, []
  )

  return userProfiles.map((userProfile, index) => {
    return (
      <div key = {index}>
        <div className="profile-picture">
          {userProfile.userProfileId ? (
            <img 
              src = {`http://localhost:8080/api/v1/user-profile/${userProfile.userProfileId}/image/download`}
              alt = "userProfile"
              />
          ): null}
        </div>
        <br/>
        <br/>
        <h2>{userProfile.username}</h2>
        <p>{userProfile.userProfileId}</p>
        <div >
          <Dropzone {...userProfile}/>
        </div>
        <br/>
      </div>
    )
  })
};

function Dropzone({userProfileId}) {
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files here
    const file = acceptedFiles[0];
    console.log(file);

    const formData = new FormData();
    formData.append("file", file);

    axios.post(`http://localhost:8080/api/v1/user-profile/${userProfileId}/image/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(() => {
      console.log("File uploaded successfully")
    }).catch(err => {
      console.log(err)
    })

  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}
function App() {
  return (
    <div className="App">
      <UserProfiles />
    </div>
  );
}

export default App;
