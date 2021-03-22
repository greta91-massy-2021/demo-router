import React from 'react';

export default class FicheProduit extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (this.props.match.params.id)
    }
}