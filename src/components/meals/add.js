import React from 'react';
// import firebase from '../../firebase'
import RecipeForm from './recipeForm';
import { db } from '../../firebase';
import { ref, set } from "firebase/database";

class AddMeals extends React.Component {
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
            showAddRecipeForm: false,
            showSuccessMessage: false,
            nameError: null
        }
        this.handleChange = this.handleChange.bind(this);

    }

    addRecipe(e) {
        e.preventDefault();
        const { name, ingredients, condiments, aromatics, instructions, time, tags } = this.state;
        const ingredientsArr = ingredients ? ingredients.split(',').map(item => item.trim().toLowerCase()) : ingredients;
        const condimentsArr = condiments ? condiments.split(',').map(item => item.trim().toLowerCase()) : condiments;
        const aromaticsArr = aromatics ? aromatics.split(',').map(item => item.trim().toLowerCase()) : aromatics;
        const tagsArr = tags ? tags.split(',').map(item => item.trim().toLowerCase()) : tags;
        const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        if (!name) {
            this.setState({nameError: 'Recipe name is required'})
            return null
        }

        set(ref(db, 'recipes/' + key), {
          name: name,
          instructions: instructions,
          time: time,
          ingredients: ingredientsArr,
          condiments: condimentsArr,
          aromatics: aromaticsArr,
          tags: tagsArr
        }).then(() => {
            const el_form = document.querySelector('#add-recipe');
            const el_inputs = el_form.querySelectorAll('input');
            const el_textarea = el_form.querySelectorAll('textarea');
            [].forEach.call(el_inputs, el => {
                el.value = ""
            });
            [].forEach.call(el_textarea, el => {
                el.value = ""
            });
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
            setTimeout(() => {
                this.setState({showSuccessMessage: false})
            }, 5000);
        });
    }

    handleChange(e) {
		this.setState({
            [e.target.name]: e.target.value,
            nameError: null
		});
    }

    showAddRecipeForm(value) {
        this.setState({showAddRecipeForm: value})
    }

    renderAddRecipeForm() {
        return(
            <div>
                <h2>Add Recipe</h2>
                <RecipeForm values={this.state} handleChange={e => this.handleChange(e)} onSubmit={e => this.addRecipe(e)} buttonText="Add Recipe" />
                { this.state.nameError ? <div style={{color: 'red'}}>{this.state.nameError }</div> :null }
                { this.state.showSuccessMessage ? <div>Success! Recipe added</div> : null}
                <br />
                <button onClick={() => this.showAddRecipeForm(false)}> Hide add recipe form</button>
            </div>
        )
    }

	render() {
		return (
            <div>
                <br />
                {this.state.showAddRecipeForm ? this.renderAddRecipeForm() : <button onClick={() => this.showAddRecipeForm(true)}>Add Recipe</button>}
            </div>
		);
	}
}

export default AddMeals;
