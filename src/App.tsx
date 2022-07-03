import React, { ChangeEvent, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as ImageAnnotator from 'image-annotator';
import { getPixelData, getTagValue } from 'image-annotator';

function App() {
  console.log({ImageAnnotator});
  const [dataset, setDataset] = useState<any>(null);
  const [url, setUrl] = useState<any>(null);
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      alert('No file uploaded');
      return;
    }

    const file = event.target.files[0];
    ImageAnnotator.readFile(file).then((data) => setDataset(data))
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
    const pixelData = getPixelData(dataset);
    console.log({pixelData});
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
    displayImage(pixelData, context, rows, columns);


    // Array(rows).fill(0).forEach((_, i) => {
    //   Array(columns).fill(0).forEach((__, j: number) => {
    //     console.log({i, j, value: pixelData[rows * i + j]})
    //     context.fillStyle = pixelData[rows * i + j];
    //     context.fillRect(j, i, 1, 1);
    //   })
    // });
  }, [dataset])
  // useEffect(() => {
  //   const pixelData = convertPixelData(dataset);
  //   console.log('dataset changed', {dataset});
  //   const canvas = document.getElementById('dicom-canvas') as HTMLCanvasElement;
  //   if (!canvas || !pixelData) {
  //     return;
  //   }
  //
  //   // const blob = new Blob([new Uint8Array(pixelData)], {type: "image/jpeg"})
  //   // setUrl(URL.createObjectURL(blob));
  //   // console.log({pixelData, canvas, clamped: new Uint8ClampedArray(pixelData)})
  //   //
  //   const ctx = canvas.getContext('2d');
  //   if (!ctx) {
  //     return;
  //   }
  //   //
  //   const imageData = new ImageData(new Uint8ClampedArray(pixelData), 512, 512);
  //   ctx.putImageData(imageData, 0, 0)
  //   // const id = ctx.createImageData(512, 512);
  //   // id.data.set(new Uint8ClampedArray(pixelData))
  //   // ctx.putImageData(id, 0, 0)
  // }, [dataset])

  return (
    <div className="App">
      <div>
        <input type={'file'} onChange={handleFileChange} className={'file-input'}/>
        <div>
          <canvas id={'dicom-canvas'} style={{height: '512px', width: '512px'}}>xd</canvas>
        </div>
        {url && <img src={url} />}
      </div>
    </div>
  );
}

export default App;
