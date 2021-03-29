import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import FicheProduit from './FicheProduit';
import ProduitForm from './ProduitForm';
import ProduitListe from './ProduitListe';

export default class Produits extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            produits: []
        }
    }

    save = (produit)=>{
        //ajout d'un nouveau produit
        if (!produit.id) {
          fetch("http://localhost:8080/produits/create", {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(produit)
          })
          .then((data)=>data.json())
          .then((res)=>{
            this.setState({produits: this.state.produits.concat(res)})
            console.log(res)
            this.props.history.push("/produits")
          })
        }
        else{
          fetch(`http://localhost:8080/produits/edit`, {
            method: "PUT",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(produit)
          })
          .then((data)=>data.json())
          .then((res)=> {
              this.setState(
                {
                produits: this.state.produits.map((p)=> p.id === produit.id ? res : p)
                }
                )
                this.props.history.push("/produits")}
            )
          
        }
      }
      delete = (produitId)=>{//productId = 2 => products=[1,3]
        fetch(`http://localhost:8080/produits/${produitId}`, {
          method: "DELETE"
        })
        .then((data)=>{
            console.log(data);
            if (data.status === 200) {
                this.setState(
                    {produits : 
                      this.state.produits.filter((produit)=> produit.id !== produitId)})
            }
            else{
                alert("Opération échouée!")
            }
            
        })
      }
    render() {
        console.log(this.props.match);
        return (
            <React.Fragment>
                <Switch>
                    <Route path={this.props.match.path + '/create'} render={
                        (props)=> <ProduitForm {...props}  saveCallback={this.save} />
                    } />
                    <Route path={this.props.match.path + '/edit/:id'} render={
                        (props)=> <ProduitForm {...props}  saveCallback={this.save} />
                    } />
                    <Route path={this.props.match.path + '/:id'} component={FicheProduit} />
                    <Route exact path={this.props.match.path + '/'} render={
                        (props)=> <ProduitListe {...props} produits={this.state.produits} deleteCallback={this.delete}  />
                    } />
                </Switch>
                
            </React.Fragment>

        );
    }
    componentDidMount(){
        //get produits
        fetch(`http://localhost:8080/produits`, {
            method: "GET"
          })
          .then((data)=>{
              console.log(data);
              return data.json()
            })
          .then((res)=> {
            console.log(res);
            this.setState({
                produits: res
              }
              )
          })
        
    }
}