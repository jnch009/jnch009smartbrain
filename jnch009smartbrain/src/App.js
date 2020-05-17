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

const currentSession = 'currentSession';
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
  loading: true,
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    console.log(process.env.REACT_APP_FETCH_API);
    fetch(`${process.env.REACT_APP_FETCH_API}/`, {
      credentials: 'include',
    })
      .then(resp => resp.json())
      .then(user => {
        if (user.id) {
          this.setState({
            isSignedIn: true,
            route: 'home',
            userProfile: user,
            loading: false,
          });
        } else {
          this.setState({
            route: 'SignIn',
            loading: false,
          });
        }
      });
  }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   if (prevState.input !== this.state.input) {
  //     if (this.compareExpDate()) {
  //       this.setState({
  //         isSignedIn: true,
  //         route: 'home',
  //         userProfile: JSON.parse(localStorage.getItem(currentSession))?.data,
  //       });
  //     } else {
  //       localStorage.removeItem(currentSession);
  //       this.setState({
  //         isSignedIn: false,
  //         route: 'SignIn',
  //       });
  //     }
  //   }
  // }

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
        fetch(`${process.env.REACT_APP_FETCH_API}/imageURL`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: this.state.input,
          }),
        })
          .then(response => response.json())
          .then(response => {
            if (response.outputs) {
              fetch(`${process.env.REACT_APP_FETCH_API}/image`, {
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
              this.displayBox(this.calculateBox(response));
            } else {
              this.setError(response);
            }
          })
          .catch(err => console.log(err));
      },
    );
  };

  onRouteChange = route => {
    if (route === 'home') {
      this.setState({
        isSignedIn: true,
        route: route,
      });
    } else {
      this.setState({ ...initialState, loading: false, route: route });
    }
  };

  setError = msg => {
    this.setState(
      {
        errorMsg: msg,
      },
      () => {
        setTimeout(() => this.setState({ errorMsg: '' }), 2000);
      },
    );
  };

  render() {
    const {
      isSignedIn,
      imageUrl,
      route,
      box,
      userProfile,
      errorMsg,
      loading,
    } = this.state;

    return loading ? (
      <span className='centeringUnknown'>
        <h1>LOADING</h1>
      </span>
    ) : (
      <div className='App'>
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
          <SignIn
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}
            setError={this.setError}
          />
        ) : (
          <Register
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}
            setError={this.setError}
          />
        )}
      </div>
    );
  }
}

export default App;
