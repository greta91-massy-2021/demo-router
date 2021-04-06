import React from 'react';
import AuthService from './AuthService';

export default class ProduitForm extends React.Component{
    constructor(props){
        super(props);
        this.state={
            produit: {
                id: null,
                nom: "",
                categorie:{
                    id: 1,
                    nom: ""
                } 
            },
            categories : []
        }
    }
    cancel = (evt)=>{
        evt.preventDefault();
        this.props.history.push("/produits")
    }
    save = (evt)=>{
        evt.preventDefault();
        this.props.saveCallback(this.state.produit);
        console.log(this.state.produit);
    }
    handleChange = (event) =>{
        if (event.target.name === "categorie") {
            this.setState((state)=>{
                state.produit.categorie.id = event.target.value;
                let index = event.nativeEvent.target.selectedIndex;
                state.produit.categorie.nom = event.nativeEvent.target[index].text;;
            })
        }
        else{
            this.setState((state)=>state.produit[event.target.name] = event.target.value)
        }
    }
    render(){
        const edit = !!this.props.match.params.id;
        const produit = this.state.produit || {};
        return (
            <form>
                <div style={edit ? {} : {display:'none'}}>
                    id : <input name="id" 
                            readOnly 
                            value={produit.id ? produit.id : 0} />
                </div>
                <div>
                    nom : <input name="nom" 
                            value={produit.nom} onChange={this.handleChange}/>
                </div>
                <div >

                </div>
                <div>
                    categorie : <select name="categorie" id="" onChange={this.handleChange} defaultValue={produit.categorie.id || ""}>
                        {this.state.categories.map(cat=> {
                            // const selected = cat.id === produit.categorie.id ? {selected : "selected"} : {};
                            return <option 
                                        key={cat.id} 
                                        value={cat.id} 
                                        // {...selected}
                                        >{cat.nom}</option>
                        })}
                    </select>
                </div>
                <div>
                    <button onClick={this.save}>{edit ? "Modifier":"Créer"}</button>
                    <button onClick={this.cancel}>Annuler</button>
                </div>
                
            </form>
        )
    }

    componentDidMount(){
        // vérifier l'autorisation
        const currUser = AuthService.getCurrentUser();
        const isEmploye = AuthService.isEmploye(currUser);
        if (!isEmploye) {
            this.props.history.push("/access_denied")
        }
        const id=this.props.match.params.id;
        if (id) {
            fetch(`http://localhost:8080/produits/${id}`, {
            method: "GET"
          })
          .then((data)=>{
              console.log(data);
              return data.json()
            })
          .then((res)=> {
            console.log(res);
            this.setState({
                produit: res
              }
              )
          })
        }
        //get categories
        fetch(`http://localhost:8080/categories`, {
            method: "GET"
          })
          .then((data)=>{
              console.log(data);
              return data.json()
            })
          .then((res)=> {
            console.log(res);
            this.setState({
                categories: res,
              }
              )
          })
        
    }
}
