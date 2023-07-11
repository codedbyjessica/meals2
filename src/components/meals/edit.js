import React from 'react';
import RecipeForm from './recipeForm';
import { db } from '../../firebase';
import { update, ref } from 'firebase/database';

class EditMeals extends React.Component {
	constructor() {
		super();
		this.state = {
            name: null,
            ingredients: null,
            condiments: null,
            aromatics: null,
            instructions: null,
            time: null,
            tags: null,
            key: null,
            showSuccessMessage: false,
            nameError: null
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        if (this.props.recipeToEdit) {
            this.getState();
        }
    }

    componentDidUpdate(prevProps) {
        if ( this.props.recipeToEdit && (!this.state.name || JSON.stringify(this.props.recipeToEdit) !== JSON.stringify(prevProps.recipeToEdit)) ) {
            this.getState();
        }
    }

    getState() {
        const { name, ingredients, condiments, aromatics, instructions, time, tags, key } = this.props.recipeToEdit;
        this.setState({
            name: name || null, 
            ingredients: ingredients ? ingredients.join(', ') : null, 
            condiments: condiments ? condiments.join(', ') : null, 
            aromatics: aromatics ? aromatics.join(', ') : null, 
            instructions: instructions || null, 
            time: time || null, 
            tags: tags ? tags.join(', ') : null, 
            key})
    }

    updateRecipe(e) {
        e.preventDefault();
        const { name, ingredients, condiments, aromatics, instructions, time, tags, key } = this.state;
        console.log('name', name)
        console.log('ingredients', ingredients)

        const ingredientsArr = ingredients ? ingredients.split(',').map(item => item.trim().toLowerCase()) : ingredients;
        const condimentsArr = condiments ? condiments.split(',').map(item => item.trim().toLowerCase()) : condiments;
        const aromaticsArr = aromatics ? aromatics.split(',').map(item => item.trim().toLowerCase()) : aromatics;
        const tagsArr = tags ? tags.split(',').map(item => item.trim().toLowerCase()) : tags;

        if (!name) {
            this.setState({nameError: 'Recipe name is required'})
            return null
        }

        update(ref(db, 'recipes/' + key), {
            name: name,
            instructions: instructions,
            time: time,
            ingredients: ingredientsArr,
            condiments: condimentsArr,
            aromatics: aromaticsArr,
            tags: tagsArr
        })
        .then(() => {
            this.setState({
                name: null,
                ingredients: null,
                condiments: null,
                aromatics: null,
                instructions: null,
                time: null,
                tags: null,
                showSuccessMessage: true
            })
        });
    }

    handleChange(e) {
		this.setState({
            [e.target.name]: e.target.value,
            nameError: null
		});
    }

    renderAddRecipeForm() {
        if (!this.state.name) {
            return;
        }
        return(
            <div>
                <h2>Edit Recipe {this.props.recipeToEdit.name}</h2>
                <div className="modal-scroll">
                    <RecipeForm values={this.state} handleChange={e => this.handleChange(e)} onSubmit={e => this.updateRecipe(e)} buttonText='Update Recipe' />
                </div>
                { this.state.nameError ? <div style={{color: 'red'}}>{this.state.nameError }</div> :null }
            </div>
        )
    }

	render() {
		return (
            <div className="modal">
                <div className="modal-content" >
                    <button className="modal-exit" onClick={() => this.props.closeModal() }>x</button>
                    {this.state.showSuccessMessage ? <div> Success! Recipe updated!</div> : this.renderAddRecipeForm()}
                </div>
                <div className="modal-overlay"></div>
            </div>
		);
	}
}

export default EditMeals;
