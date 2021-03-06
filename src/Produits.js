import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import FicheProduit from './FicheProduit';
import ProduitForm from './ProduitForm';
import ProduitListe from './ProduitListe';
import SearchBar from './SearchBar';
import ProduitService from './ProduitService'
import AuthService from './AuthService';

export default class Produits extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            produits: [],
            produitsCount: 0,
            currentPage : 0,
            perPage: 10,
            pageCount: 1,
            searchWord: ""

        }
    }
    setCurrentPage = (currentPage)=>{
      console.log(currentPage);
      this.setState({currentPage: currentPage});
      this.getProduits(currentPage, this.state.perPage, this.state.searchWord);
    }
    setPerPage = (perPage)=>{
      this.setState({perPage: perPage});
      this.getProduits(this.state.currentPage, perPage, this.state.searchWord);
    }
    getProduits = (pageNumber=this.state.currentPage, perPage=this.state.perPage, searchWord="")=>{
      // fetch(`http://localhost:8080/productapp/produits?pageNumber=${pageNumber}&perPage=${perPage}&searchWord=${searchWord}`, {
      //       method: "GET"
      //     })
      //     .then((data)=>{
      //         console.log(data);
      //         return data.json()
      //       })
      //     .then((res)=> {
      //       console.log(res);
      //       this.setState({
      //           produits: res
      //         }
      //         )
      //     })
      ProduitService.getProduits(pageNumber, perPage, searchWord).then((response)=>{
        console.log(response.data);
        this.setState({produits: response.data})
      }, (error)=>{
        console.log(error);
        alert("Opération échouée !")
      })
    }
    getProduitsCount = (searchWord="")=>{
      fetch(`http://localhost:8080/productapp/api/public/count?searchWord=${searchWord}`, {
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
          // fetch("http://localhost:8080/productapp/produits/create", {
          //   method: "POST",
          //   headers: {"Content-type": "application/json"},
          //   body: JSON.stringify(produit)
          // })
          // .then((data)=>data.json())
          // .then((res)=>{
          //   // this.setState({produits: this.state.produits.concat(res)})
          //   // console.log(res)
          //   this.getProduitsCount();
          //   this.props.history.push(`/produits?currentPage=${this.state.pageCount-1}&searchWord=${this.state.searchWord}`)
          //   this.setCurrentPage(this.state.pageCount-1)
          // })
          ProduitService.createProduit(produit).then((response)=>{
            console.log(response.data);
            this.getProduitsCount();
            this.props.history.push(`/ProductAppClient/produits?currentPage=${this.state.pageCount-1}&searchWord=${this.state.searchWord}`)
            this.setCurrentPage(this.state.pageCount-1)
          }, (error)=>{
            console.log(error);
            if (error.response) {
              if (error.response.status === 403) {
                alert("Accès refusé : Connectez-vous en tant qu'Employé pour créer un produit")
                this.props.history.push(`/ProductAppClient/login`)
              }
            }
          })
        }
        else{
          // fetch(`http://localhost:8080/productapp/produits/edit`, {
          //   method: "PUT",
          //   headers: {"Content-type": "application/json"},
          //   body: JSON.stringify(produit)
          // })
          // .then((data)=>data.json())
          // .then((res)=> {
          //     this.setState({
          //         produits: this.state.produits.map((p)=> p.id === produit.id ? res : p)
          //     })
          //     this.props.history.push(`/produits?currentPage=${this.state.currentPage}&searchWord=${this.state.searchWord}`)}
          //   )
          
            ProduitService.editProduit(produit).then((response)=>{
              console.log(response.data);
              const res = response.data;
              this.setState({
                produits: this.state.produits.map((p)=> p.id === produit.id ? res : p)
            })
              this.props.history.push(`/ProductAppClient/produits?currentPage=${this.state.pageCount-1}&searchWord=${this.state.searchWord}`)
              
            }, (error)=>{
              console.log(error);
              if (error.response) {
                if (error.response.status === 403) {
                  alert("Accès refusé : Connectez-vous en tant qu'Employé pour modifier un produit")
                  this.props.history.push(`/ProductAppClient/login`)
                }
              }
              else{
                alert(error.message)
              }
            })
          
        }
      }
      delete = (produitId)=>{//productId = 2 => products=[1,3]
        // fetch(`http://localhost:8080/productapp/produits/${produitId}`, {
        //   method: "DELETE"
        // })
        // .then((data)=>{
        //     console.log(data);
        //     if (data.status === 200) {
        //         this.setState(
        //             {produits : 
        //               this.state.produits.filter((produit)=> produit.id !== produitId)})
        //         this.getProduitsCount();
        //     }
        //     else{
        //         alert("Opération échouée!")
        //     }
            
        // })
        ProduitService.deleteProduit(produitId).then((response)=>{
          this.setState({produits : 
                          this.state.produits.filter((produit)=> produit.id !== produitId)})
          this.getProduitsCount();
          
        }, (error)=>{
          console.log(error);
          if (error.response) {
            if (error.response.status === 403) {
              alert("Accès refusé : Connectez-vous en tant qu'Employé pour supprimer un produit")
              this.props.history.push(`/ProductAppClient/login`)
            }
          }
          else{
            alert(error.message)
          }
        })
      }

    search = (searchWord)=>{
      this.getProduits(0, this.state.perPage, searchWord);
      this.getProduitsCount(searchWord);
      this.setState({searchWord: searchWord, currentPage: 0});
      this.props.history.push(`/ProductAppClient/produits?currentPage=${this.state.currentPage}&searchWord=${searchWord}`);    
    }
    clearSearchWord = () =>{
      this.setState({searchWord: ""});
      this.props.history.push(`/ProductAppClient/produits?currentPage=0`);    
      this.getProduits();
      this.getProduitsCount();
    }
    render() {
        console.log(this.props.match);
        const isEmploye = AuthService.isEmploye(this.props.currentUser);
        return (
            <React.Fragment>
                <div className="App-header">
                    {(isEmploye && <Link to={this.props.match.url + '/create'}>Créer un produit</Link>)}
                    <SearchBar searchCallback={this.search} annulerSearch={this.clearSearchWord}/>
                </div>
                <Switch>
                    <Route path={this.props.match.path + '/create'} render={
                        (props)=> <ProduitForm {...props}  
                                                saveCallback={this.save} />
                    } />
                    <Route path={this.props.match.path + '/edit/:id'} render={
                        (props)=> <ProduitForm {...props}  saveCallback={this.save} />
                    } />
                    <Route path={this.props.match.path + '/:id'} component={FicheProduit} />
                    <Route exact path={this.props.match.path + '/'} render={
                        (props)=> <ProduitListe {...props} 
                                        currentUser={this.props.currentUser}
                                        searchWord={this.state.searchWord}
                                        search={this.search}
                                        clearSearchWord={this.clearSearchWord}
                                        produits={this.state.produits}
                                        produitsCount={this.state.produitsCount}
                                        currentPage={this.state.currentPage} 
                                        perPage={this.state.perPage} 
                                        pageCount={this.state.pageCount} 
                                        setCurrentPage={this.setCurrentPage} 
                                        deleteCallback={this.delete}
                                        addToCart={this.props.addToCart}  />
                    } />
                </Switch>
                
            </React.Fragment>

        );
    }
    componentDidMount(){
        //get produits
        // fetch(`http://localhost:8080/productapp/produits`, {
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
        // if(this.state.searchWord !== ""){
        //   this.getProduitsCount();
        // }
        this.getProduitsCount();
        // this.getProduits();
        
    }
}