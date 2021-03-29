import React from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

export default class ProduitListe extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        
    }

    handlePageClick = ({selected}) =>{
        console.log(selected);
        this.props.setCurrentPage(selected);
        this.props.history.push(this.props.match.url + "?currentPage="+selected)
    }
    render() {
        return (
            <React.Fragment>
                <Link to={this.props.match.url + '/create'}>Créer un produit</Link>
                <ReactPaginate
                    previousLabel={"← Previous"}
                    nextLabel={"Next →"}
                    initialSelected={this.props.currentPage}
                    forcePage={this.props.currentPage}
                    pageCount={this.props.pageCount}
                    onPageChange={this.handlePageClick}
                    containerClassName={"pagination"}
                    previousLinkClassName={"pagination__link"}
                    nextLinkClassName={"pagination__link"}
                    disabledClassName={"pagination__link--disabled"}
                    activeClassName={"pagination__link--active"}
                    
                />
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
    componentDidMount(){
        console.log();
        let search = this.props.location.search;
        search = search.trim();
        search = search.split("=");
        let currPage = 0;
        if(search.length === 2){
            currPage = search[0].indexOf("currentPage") >= 0 ? search[1] : 0;
        }
        console.log(currPage);
        this.props.setCurrentPage(parseInt(currPage));
        this.props.history.push(this.props.match.url + "?currentPage="+currPage)
    }
}