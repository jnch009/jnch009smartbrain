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

const currentSession = 'currentSession';

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: [],
      route: 'SignIn',
      isSignedIn: false,
      userProfile: {
        id: '',
        name: '',
        email: '',
        score: 0,
        joined: '',
      },
    };
  }

  componentDidMount() {
    if (
      Date.now() <
      Date.parse(JSON.parse(localStorage.getItem(currentSession))?.exp)
    ) {
      this.setState({
        isSignedIn: true,
        route: 'home',
        userProfile: JSON.parse(localStorage.getItem(currentSession))?.data,
      });
    }
  }

  loadUser = user => {
    this.setState({
      userProfile: {
        id: user.id,
        name: user.name,
        email: user.email,
        score: user.score,
        joined: user.joined,
      },
    });
  };

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
    this.setState(
      {
        imageUrl: this.state.input,
        box: [],
      },
      () => {
        app.models
          .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
          .then(response => {
            if (response) {
              fetch('http://localhost:3000/image', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id: this.state.userProfile.id,
                }),
              })
                .then(resp => resp.json())
                .then(newProfile => {
                  this.setState({
                    userProfile: newProfile,
                  });
                });
            }
            this.displayBox(this.calculateBox(response));
          })
          .catch(err => console.log(err));
      },
    );
  };

  onRouteChange = route => {
    this.setState(
      {
        imageUrl: '',
        box: [],
      },
      () => {
        if (route === 'home') {
          this.setState({
            isSignedIn: true,
            route: route,
          });
        } else {
          localStorage.removeItem(currentSession);
          this.setState({
            isSignedIn: false,
            route: route,
          });
        }
      },
    );
  };

  render() {
    const { isSignedIn, imageUrl, route, box, userProfile } = this.state;

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
            <Rank name={userProfile.name} score={userProfile.score} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition imageUrl={imageUrl} boundingBox={box} />
          </>
        ) : route === 'SignIn' ? (
          <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        ) : (
          <Register
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}
          />
        )}
      </div>
    );
  }
}

export default App;
