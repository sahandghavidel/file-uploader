import "./App.css";
import { PickerOverlay } from "filestack-react";
import { useState, useEffect } from "react";

function App() {
  const [showPicker, setShowPicker] = useState(false);
  const [uploadHistory, setUploadHistory] = useState([]);

  // Load upload history from local storage on component mount
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("uploadHistory")) || [];
    setUploadHistory(history);
  }, []);

  function handleClick() {
    setShowPicker((prevState) => !prevState);
  }

  function handleDelete(handle) {
    const updatedHistory = uploadHistory.filter(
      (upload) => upload.handle !== handle
    );
    localStorage.setItem("uploadHistory", JSON.stringify(updatedHistory));
    setUploadHistory(updatedHistory);
  }

  function handleUploadDone(res) {
    // Save upload handle to local storage
    const updatedHistory = [...uploadHistory];
    res.filesUploaded.map((file) => {
      const newUpload = {
        handle: file.handle,
        fileName: file.filename,
        timestamp: new Date().toLocaleString(),
      };
      updatedHistory.push(newUpload);
    });
    localStorage.setItem("uploadHistory", JSON.stringify(updatedHistory));
    setUploadHistory(updatedHistory);
    setShowPicker(false);
  }

  return (
    <div className="App">
      <h1 className="App-logo-text">File Uploader</h1>
      <p>Upload your files here</p>
      <button className="upload-button" onClick={handleClick}>
        Upload
      </button>
      <div className="upload-history">
        <h3>Upload history:</h3>
        {uploadHistory.length === 0 && <p>No files have been uploaded yet</p>}
        <ul>
          {uploadHistory.map((upload) => (
            <li key={upload.handle}>
              <span>{upload.fileName}</span>
              <span>{upload.timestamp}</span>
              <button
                className="upload-history-button"
                onClick={() =>
                  window.open(
                    `https://cdn.filestackcontent.com/${upload.handle}`
                  )
                }
              >
                View
              </button>
              <button
                className="delete-history-button"
                onClick={() => handleDelete(upload.handle)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      {showPicker && (
        <PickerOverlay
          apikey={process.env.REACT_APP_FILESTACK_API_KEY}
          onUploadDone={(res) => {
            console.log(res);
            handleUploadDone(res);
          }}
        />
      )}
    </div>
  );
}

export default App;
