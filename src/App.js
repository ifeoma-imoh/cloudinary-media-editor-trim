import "./App.css";
import { cloudName, uploadPreset } from "./cloudinary/cloudinaryConfig";
import { useState } from "react";

function App() {
  const [dur, setDur] = useState(5)
  function editVideo(publicId) {
    
    /* eslint-disable */
    const myEditor = cloudinary.mediaEditor();
    myEditor.update({
      cloudName: cloudName,
      publicIds: [
        {
          publicId: publicId,
          resourceType: "video",
        },
      ],
      video: {
        steps: ["trim"],
        trim: {
          startOffset: 0,
          endOffset: dur,
          maxDuration: 10,
          minDuration: 4
        },
      },
    });
    myEditor.show();
    myEditor.on("export", function (data) {
      console.log(data);
      window.open(data.assets[0].downloadUrl);
    });
  }

  const handleUpload = async (e) => {
    const clUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    const res = await fetch(clUrl, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    const publicId = data.public_id;
    const duration = data.duration
    editVideo(publicId);
    setDur(duration)
  };

  return (
    <div className="App">
      <input type="file" accept="video/*" onChange={handleUpload} />
    </div>
  );
}

export default App;
