import React, { Component } from 'react';
import Particles from 'react-particles-js';
import { createHashHistory } from 'history';

import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Logo from './Components/Logo/Logo';
import Navigation from './Components/Navigation/Navigation';
import Rank from './Components/Rank/Rank';
import Register from './Components/Register/Register';
import SignIn from './Components/SignIn/SignIn';
import Error from './Components/Error/Error';
import Profile from './Components/Profile/Profile';
import InvalidRoute from './Components/InvalidRoute/InvalidRoute';
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

const history = createHashHistory();

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    history.listen((location, action) => {
      //TODO: need to add some logic here, most likely I will be extracting the below code into another function
      let parsedURL =
        location.pathname === '/' ||
        location.pathname[location.pathname.length - 1] !== '/'
          ? location.pathname
          : location.pathname.slice(0, location.pathname.length - 1);

      console.log(parsedURL);

      if (action !== 'REPLACE') {
        this.handleHistory(parsedURL);
      }
    });

    trackPromise(
      fetch(
        `${process.env.REACT_APP_FETCH_API || 'http://localhost:3000'}/profile`,
        {
          credentials: 'include',
        }
      )
        .then(resp => resp.json())
        .then(user => {
          if (user?.id) {
            this.loadUser(user);
          } else {
            this.clearUser(history.location.pathname);
          }
        })
        .then(() => {
          let path = history.location.pathname;
          this.handleHistory(path);
        })
        .catch(err => this.setError(err))
    );
  }

  handleHistory = path => {
    if (this.state.isSignedIn) {
      switch (path) {
        case '/SignIn':
        case '/Register':
          this.setState(
            {
              route: '/',
              userProfile: this.state.userProfile,
            },
            () => {
              history.replace('/');
            }
          );
          break;
        case '/SignOut':
          fetch(
            `${
              process.env.REACT_APP_FETCH_API || 'http://localhost:3000'
            }/signout`,
            {
              method: 'POST',
              credentials: 'include',
            }
          )
            .then(resp => resp.json())
            .then(result => {
              this.setState({ ...initialState, route: '/SignIn' });
              // TODO: change this to a success box
              this.setError(result);
            })
            .then(() => {
              history.replace('/SignIn');
            });
          break;
        default:
          this.setState(
            {
              route: path,
            },
            () => {
              history.replace(path);
            }
          );
      }
    } else {
      switch (path) {
        case '/SignIn':
        case '/Register':
          this.setState({ route: path }, () => {
            history.replace(path);
          });
          break;
        case '/Profile':
        case '/Profile/Edit':
        case '/Profile/PasswordChange':
        case '/Profile/Delete':
        case '/':
        case '/SignOut':
          this.setState({ route: '/SignIn' }, () => {
            history.replace('/SignIn');
          });
          break;
        default:
          this.setState({ route: path }, () => {
            history.replace(path);
          });
          break;
      }
    }
  };

  loadUser = user => {
    this.setState({
      userProfile: {
        id: user.id,
        name: user.name,
        email: user.email,
        score: user.score,
        joined: user.joined,
      },
      isSignedIn: true,
      route: `${history.location.pathname}`,
    });
  };

  clearUser = URLRoute => {
    this.setState({
      ...initialState,
      route:
        URLRoute === '/SignIn' || URLRoute === '/Register'
          ? URLRoute
          : '/SignIn',
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

  onRouteChange = route => {
    this.setState({
      route,
    });
  };

  switchRoute = () => {
    const { imageUrl, box, userProfile, input, route } = this.state;

    switch (route) {
      case '/Profile':
      case '/Profile/Edit':
      case '/Profile/PasswordChange':
      case '/Profile/Delete':
        return (
          <Profile
            profile={userProfile}
            route={route}
            history={history}
            loadUser={this.loadUser}
            setError={this.setError}
            keyEnter={this.onKeyEnter}
            clearUser={this.clearUser}
          />
        );
      case '/SignIn':
      case '/SignOut':
        return (
          <SignIn
            loadUser={this.loadUser}
            setError={this.setError}
            keyEnter={this.onKeyEnter}
            history={history}
          />
        );
      case '/Register':
        return (
          <Register
            loadUser={this.loadUser}
            setError={this.setError}
            keyEnter={this.onKeyEnter}
            history={history}
          />
        );
      case '/':
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
      default:
        return <InvalidRoute history={history} />;
    }
  };

  render() {
    const { isSignedIn, route, errorMsg } = this.state;

    return (
      <div className='App'>
        <Particles className='particles' params={particleOptions} />
        {route === '' ? (
          <LoadingSpinner route={route} />
        ) : (
          <div className='App'>
            {/* TODO: error needs to be changed to generic prompt (DRY) */}
            <CSSTransition
              in={errorMsg !== ''}
              timeout={300}
              classNames='error'
              unmountOnExit
            >
              <Error>{errorMsg}</Error>
            </CSSTransition>
            <Navigation
              history={history}
              onRouteChange={this.onRouteChange}
              isSignedIn={isSignedIn}
            />
            {this.switchRoute()}
          </div>
        )}
      </div>
    );
  }
}

export default App;
