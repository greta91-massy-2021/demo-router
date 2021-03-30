import logo from './logo.svg';
import './App.css';
import {Link, Route, Switch} from 'react-router-dom';
import Produits from './Produits';
import Categories from './Categories';
import Login from './Login';
import React from 'react';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      currentUser : {}
    }
  }

  setCurrentUser = (user)=>{
    console.log(user);
    this.setState({currentUser: user})
  }
  render(){
    return (
      <div className="App">
        <header className="App-header">
          <Link to="/produits?currentPage=0">Produits</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/login">Se connecter</Link>
        </header>
        <main>
          <Route path="/produits" render={(props)=> <Produits {...props} currentUser={this.state.currentUser} />}/>
          <Route path="/categories" component={Categories}/>
          <Route path="/login" render={(props)=> <Login {...props} setCurrentUser={this.setCurrentUser} />}/>
        </main>
      </div>
    );
  }
  componentDidMount(){
    this.setState({currentUser : localStorage.getItem("user") || {}})
  }
}

export default App;
