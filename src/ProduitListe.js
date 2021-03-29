import React from 'react';
import { Link } from 'react-router-dom';

export default class ProduitListe extends React.Component {
    constructor(props) {
        super(props);
        console.log(props.produits);
    }
    render() {
        return (
            <React.Fragment>
                <Link to={this.props.match.url + '/create'}>Créer un produit</Link>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>nom</th>
                            <th>cat id</th>
                            <th>cat nom</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.produits.map((p) => {
                            return (<tr key={p.id}> 
                                <td>{p.id}</td>
                                <td>{p.nom}</td>
                                <td>{p.categorie.id}</td>
                                <td>{p.categorie.nom}</td>
                                <td>
                                    <Link to={this.props.match.url + '/'+p.id}>Afficher</Link>
                                    <Link to={this.props.match.url + '/edit/'+p.id}>Modifier</Link>
                                    <button onClick={() => this.props.deleteCallback(p.id)}>Supprimer</button>
                                </td>
                            </tr>)
                        })}
                    </tbody>
                </table>
            </React.Fragment>

        )
    }
}