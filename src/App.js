import Clarifai from 'clarifai';
import React, { Component } from 'react';
import Particles from 'react-particles-js';

import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Logo from './Components/Logo/Logo';
import Navigation from './Components/Navigation/Navigation';
import Rank from './Components/Rank/Rank';

import './App.css';

const app = new Clarifai.App({
  apiKey: '9b014e8445eb40d38ff90555f7921d23',
});

const particleOptions = {
  particles: {
    number: {
      value: 200,
      density: {
        enable: true,
        area: 800,
      },
    },
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: 'repulse',
      },
    },
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: [],
    };
  }

  onInputChange = (event) => {
    this.setState({
      input: event.target.value,
    });
  };

  calculateBox = (data) => {
    const clarifyArray = data.outputs[0].data.regions.map(region => region.region_info.bounding_box);
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    
    let boundingBoxes = clarifyArray.map(box => {
      return ({
        topRow: box.top_row * height,
        leftCol: box.left_col * width,
        bottomRow: height - (box.bottom_row * height),
        rightCol: width - (box.right_col * width)
      })
    });
    return boundingBoxes;
  };

  displayBox = (boxes) => {
    console.log(boxes);
    this.setState({
      box: [...this.state.box,...boxes],
    }, () => {
        console.log(this.state.box);
    });
  };

  onButtonSubmit = () => {
    this.setState({
      imageUrl: this.state.input,
    });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) => this.displayBox(this.calculateBox(response)))
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <div className='App'>
        <Particles className='particles' params={particleOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition
          imageUrl={this.state.imageUrl}
          boundingBox={this.state.box}
        />
      </div>
    );
  }
}

export default App;
