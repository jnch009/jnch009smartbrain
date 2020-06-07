import React, { Component } from 'react';
import Particles from 'react-particles-js';

import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Logo from './Components/Logo/Logo';
import Navigation from './Components/Navigation/Navigation';
import Rank from './Components/Rank/Rank';
import Register from './Components/Register/Register';
import SignIn from './Components/SignIn/SignIn';
import Error from './Components/Error/Error';
import Profile from './Components/Profile/Profile';
import { LoadingSpinner } from './Components/LoadingSpinner/LoadingSpinner';
import { trackPromise } from 'react-promise-tracker';
import { CSSTransition } from 'react-transition-group';

import './App.css';

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

const initialState = {
  input: '',
  imageUrl: '',
  box: [],
  route: '',
  isSignedIn: false,
  userProfile: {
    id: '',
    name: '',
    email: '',
    score: 0,
    joined: '',
  },
  errorMsg: '',
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    trackPromise(
      fetch(
        `${process.env.REACT_APP_FETCH_API || 'http://localhost:3000'}/profile`,
        {
          credentials: 'include',
        }
      )
        .then(resp => resp.json())
        .then(user => {
          if (user.id) {
            this.setState({
              isSignedIn: true,
              route: 'home',
              userProfile: user,
            });
          } else {
            this.setState({
              route: 'SignIn',
            });
          }
        })
    );
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
      region => region.region_info.bounding_box
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
        trackPromise(
          fetch(
            `${
              process.env.REACT_APP_FETCH_API || 'http://localhost:3000'
            }/imageURL`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                input: this.state.input,
              }),
            }
          )
            .then(response => response.json())
            .then(response => {
              if (response.outputs) {
                fetch(
                  `${
                    process.env.REACT_APP_FETCH_API || 'http://localhost:3000'
                  }/image`,
                  {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                      id: this.state.userProfile.id,
                    }),
                  }
                )
                  .then(resp => resp.json())
                  .then(newProfile => {
                    this.setState({
                      userProfile: newProfile,
                    });
                  });
                //TODO: calculate the box first and then fetch from image
                this.displayBox(this.calculateBox(response));
              } else {
                this.setError(response);
              }
            })
            .catch(err => console.log(err))
        );
      }
    );
  };

  onRouteChange = route => {
    this.setState({
      imageUrl: '',
      input: '',
      box: [],
    });
    if (this.state.isSignedIn && (route === 'SignIn' || route === 'Register')) {
      fetch(
        `${process.env.REACT_APP_FETCH_API || 'http://localhost:3000'}/signout`,
        {
          method: 'POST',
          credentials: 'include',
        }
      )
        .then(resp => resp.json())
        .then(result => {
          this.setError(result);
          this.setState({ isSignedIn: false, route: route });
        });
    } else if (route === 'home') {
      this.setState({
        isSignedIn: true,
        route: route,
      });
    } else {
      this.setState({ ...this.state, route: route });
    }
  };

  setError = msg => {
    this.setState(
      {
        errorMsg: msg,
      },
      () => {
        setTimeout(() => this.setState({ errorMsg: '' }), 2000);
      }
    );
  };

  onKeyEnter = (e, submit) => {
    if (e.key === 'Enter') {
      submit();
    }
  };

  render() {
    const {
      isSignedIn,
      imageUrl,
      route,
      box,
      userProfile,
      errorMsg,
      input,
    } = this.state;

    const switchRoute = () => {
      switch (route) {
        case 'Profile':
          return (
            <Profile
              profile={userProfile}
              loadUser={this.loadUser}
              setError={this.setError}
            />
          );
        case 'SignIn':
          return (
            <SignIn
              onRouteChange={this.onRouteChange}
              loadUser={this.loadUser}
              setError={this.setError}
              keyEnter={this.onKeyEnter}
            />
          );
        case 'Register':
          return (
            <Register
              onRouteChange={this.onRouteChange}
              loadUser={this.loadUser}
              setError={this.setError}
              keyEnter={this.onKeyEnter}
            />
          );
        default:
          return (
            <>
              <Logo />
              <Rank name={userProfile.name} score={userProfile.score} />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
                inputField={input}
              />
              <FaceRecognition imageUrl={imageUrl} boundingBox={box} />
            </>
          );
      }
    };

    return route === '' ? (
      <LoadingSpinner route={route} />
    ) : (
      <div className='App'>
        <LoadingSpinner />
        <Particles className='particles' params={particleOptions} />
        <CSSTransition
          in={errorMsg !== ''}
          timeout={300}
          classNames='error'
          unmountOnExit
        >
          <Error>{errorMsg}</Error>
        </CSSTransition>

        <Navigation
          onRouteChange={this.onRouteChange}
          isSignedIn={isSignedIn}
        />

        {switchRoute()}
      </div>
    );
  }
}

export default App;
