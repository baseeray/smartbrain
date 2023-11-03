import Navigation from './components/Navigation/navigation.jsx';
import Logo from './components/Logo/logo.jsx';
import ImageLinkForm from './components/ImageLinkForm/imagelinkform.jsx';
import FaceCount from './components/FaceCount/facecount.jsx';
import ParticlesBg from 'particles-bg';
import './App.css';
import { Component } from 'react';
import FaceRecognition from './components/FaceRecognition/facerecognition.jsx';
import SignIn from './components/SignIn/signin.jsx';
import Register from './components/Register/register.jsx';


const initState ={
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    email: '',
    id: '',
    name: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initState;
  }

  loadUser = (data) => {
    this.setState({user: {
        email: data.email,
        id: data.id,
        name: data.name,
        entries: data.entries,
        joined: data.joined
      }
    });
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.regions[0].region_info.bounding_box;
    const image = document.querySelector('#inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    if(this.state.input) {
      this.setState({imageUrl: this.state.input});
      fetch('http://localhost:1234/imageUrl/', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              input: this.state.input
            })
          })
      .then(response => response.json())
      .then((response) => {
        if(response.regions) {
          fetch('http://localhost:1234/image/', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(data => {
            this.setState({user:{
                ...this.state.user,
                entries: data.entries
            }})
          })
          .catch(console.log);
          this.setState({box: this.calculateFaceLocation(response)})
        } else {
          this.setState({box: {}})
        }
      })
      .catch(err => console.log(err));
    }
  }

  onRouteChange = (route) => {
    if(route === 'home') {
      this.setState({isSignedIn: true});
    } else if (route === 'signin') {
      this.setState(initState);
    }
    this.setState({route: route});
  }

  render() {
    return (
      <div className="">
        <ParticlesBg num = "170" type="cobweb" bg={{
          position: "fixed",
          zIndex: -1,
          top: 0,
          left: 0
        }} /> 
        <div className="nav">
          <Logo />
          <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        </div>
      { this.state.route === 'home'
        ? <div className="App">
            <FaceCount name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box}/> 
          </div>
        : (
          this.state.route === 'signin'
          ? <SignIn loadUser = {this.loadUser} onRouteChange={this.onRouteChange}/>
          : <Register loadUser = {this.loadUser} onRouteChange={this.onRouteChange}/>
        )
      }
      </div>
    );
  }
}

export default App;
