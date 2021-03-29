import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import FicheProduit from './FicheProduit';
import ProduitForm from './ProduitForm';
import ProduitListe from './ProduitListe';

export default class Produits extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            produits: [],
            produitsCount: 0,
            currentPage : 0,
            perPage: 10,
            pageCount: 1,

        }
    }
    setCurrentPage = (currentPage)=>{
      console.log(currentPage);
      this.setState({currentPage: currentPage});
      this.getProduits(currentPage, this.state.perPage);
    }
    setPerPage = (perPage)=>{
      this.setState({perPage: perPage});
      this.getProduits(this.state.currentPage, perPage);
    }
    getProduits = (pageNumber=this.state.currentPage, perPage=this.state.perPage)=>{
      fetch(`http://localhost:8080/produits?pageNumber=${pageNumber}&perPage=${perPage}`, {
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
    getProduitsCount = ()=>{
      fetch(`http://localhost:8080/produits/count`, {
            method: "GET"
          })
          .then((data)=>{
              console.log(data);
              return data.json()
            })
          .then((res)=> {
            console.log(res);
            this.setState({
              produitsCount: res.produitsCount,
              pageCount: Math.ceil(res.produitsCount / this.state.perPage)
              }
            )
          })
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
            // this.setState({produits: this.state.produits.concat(res)})
            // console.log(res)
            this.getProduitsCount();
            this.props.history.push(`/produits?currentPage=${this.state.pageCount-1}`)
            this.setCurrentPage(this.state.pageCount-1)
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
                this.props.history.push(`/produits?currentPage=${this.state.currentPage}`)}
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
                this.getProduitsCount();
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
                        (props)=> <ProduitListe {...props} 
                                        produits={this.state.produits}
                                        currentPage={this.state.currentPage} 
                                        perPage={this.state.perPage} 
                                        pageCount={this.state.pageCount} 
                                        setCurrentPage={this.setCurrentPage} 
                                        deleteCallback={this.delete}  />
                    } />
                </Switch>
                
            </React.Fragment>

        );
    }
    componentDidMount(){
        //get produits
        // fetch(`http://localhost:8080/produits`, {
        //     method: "GET"
        //   })
        //   .then((data)=>{
        //       console.log(data);
        //       return data.json()
        //     })
        //   .then((res)=> {
        //     console.log(res);
        //     this.setState({
        //         produits: res
        //       }
        //       )
        //   })
        this.getProduitsCount();
        // this.getProduits();
        
    }
}