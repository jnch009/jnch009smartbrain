import Clarifai from 'clarifai';
import React, { Component } from 'react';
import Particles from 'react-particles-js';

import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Logo from './Components/Logo/Logo';
import Navigation from './Components/Navigation/Navigation';
import Rank from './Components/Rank/Rank';
import Register from './Components/Register/Register';
import SignIn from './Components/SignIn/SignIn';

import './App.css';

const app = new Clarifai.App({
  apiKey: process.env.REACT_APP_CLARIFAI_API,
});

const particleOptions = {
  particles: {
    number: {
      value: 100,
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
      route: 'SignIn',
      isSignedIn: false,
    };
  }

  componentDidMount() {
    fetch('http://localhost:3000')
      .then(resp => resp.json())
      .then(console.log);
  }

  onInputChange = event => {
    this.setState({
      input: event.target.value,
    });
  };

  calculateBox = data => {
    const clarifyArray = data.outputs[0].data.regions.map(
      region => region.region_info.bounding_box,
    );
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    let boundingBoxes = clarifyArray.map(box => {
      return {
        topRow: box.top_row * height,
        leftCol: box.left_col * width,
        bottomRow: height - box.bottom_row * height,
        rightCol: width - box.right_col * width,
      };
    });
    return boundingBoxes;
  };

  displayBox = boxes => {
    this.setState({
      box: [...this.state.box, ...boxes],
    });
  };

  onButtonSubmit = () => {
    this.setState({
      imageUrl: this.state.input,
    });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => this.displayBox(this.calculateBox(response)))
      .catch(err => console.log(err));
  };

  onRouteChange = route => {
    if (route === 'home') {
      this.setState({
        isSignedIn: true,
      });
    } else {
      this.setState({
        isSignedIn: false,
      });
    }

    this.setState({
      route: route,
    });
  };

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className='App'>
        <Particles className='particles' params={particleOptions} />
        <Navigation
          onRouteChange={this.onRouteChange}
          isSignedIn={isSignedIn}
        />

        {route === 'home' ? (
          <>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition imageUrl={imageUrl} boundingBox={box} />
          </>
        ) : route === 'SignIn' ? (
          <SignIn onRouteChange={this.onRouteChange} />
        ) : (
          <Register onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
