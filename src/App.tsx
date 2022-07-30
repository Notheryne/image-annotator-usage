import React, { ChangeEvent, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {readFile, getPixelData, getTagValue} from 'image-annotator';

function App() {
  const [dataset, setDataset] = useState<any>(null);
  const [url, setUrl] = useState<any>(null);
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.time('Start file handling')
    if (!event.target.files) {
      alert('No file uploaded');
      return;
    }

    const file = event.target.files[0];
    readFile(file).then((data) => setDataset(data))
    console.timeEnd('Start file handling')
  }

  const displayImage = (pixelData: string[], context: any, rows: number, columns: number) => {
    for (let i = 0; i < rows; i++) {
      // const row = pixelData.slice(i * rows, i * rows + rows);
      // const filtered = row.filter((i) => i !== '#000000');
      // debugger;
      for (let j = 0; j < columns; j += 1) {
        const fillStyle = pixelData[rows * i + j];

        context.fillStyle = fillStyle;
        context.fillRect(j, i, 1, 1);
      }
    }
  }

  useEffect(() => {
    console.time('Start pixel data handling');
    const pixelData = getPixelData(dataset);
    console.log({pixelData, dataset});
    if (!pixelData || !dataset) {
      console.log('no px or data')
      return;
    }
    const canvas = document.getElementById('dicom-canvas') as HTMLCanvasElement;
    console.log({canvas})
    if (!canvas) {
      return;
    }

    const pixelDataSlice = pixelData.slice(160000, 170000);
    const rows = getTagValue(dataset, 'Rows')!.value;
    const columns = getTagValue(dataset, 'Columns')!.value;
    canvas.width = rows;
    canvas.height = columns;

    const context = canvas!.getContext('2d');

    console.log({rows, columns, pixelData, l: pixelData.length, maxL: rows * columns});
    console.timeEnd('Start pixel data handling')

    displayImage(pixelData, context, rows, columns);
  }, [dataset])

  return (
    <div className="App">
      <div>
        <input type={'file'} onChange={handleFileChange} className={'file-input'}/>
        <div>
          <canvas id={'dicom-canvas'} style={{height: '512px', width: '512px'}}>xd</canvas>
        </div>
      </div>
    </div>
  );
}

export default App;
