import React, { ChangeEvent } from 'react';
import logo from './logo.svg';
import './App.css';
import * as ImageAnnotator from 'image-annotator';

function App() {
  console.log({ImageAnnotator});
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      alert('No file uploaded');
      return;
    }
    const file = event.target.files[0];
    ImageAnnotator.readFile(file);
  }
  return (
    <div className="App">
      <div>
        <input type={'file'} onChange={handleFileChange} className={'file-input'}/>
      </div>
    </div>
  );
}

export default App;
