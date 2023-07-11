import React from 'react';
import { db } from '../../firebase';
import { ref, onValue } from "firebase/database";
import DeleteRecipe from './delete';
import EditMeals from './edit';
import AddMeal from './add';

class Meals extends React.Component {
	constructor() {
		super();
		this.state = {
            allRecipes: null,
            recipes: null,
            tags: null,
            selectedTags: [],
            showDeleteConfirm: null,
            showEditRecipe: null
        }
    }

    componentDidMount() {
        const recipes = ref(db, 'recipes/');

        onValue(recipes, (snapshot) => {
            const data = snapshot.val();
            const recipeKeys = Object.keys(data);
            const recipes = recipeKeys.map(key => {
                const recipe =  data[key];
                recipe.key = key
                return recipe
            })

            if (recipes) {
                const uniqueTags = [];
                recipes.forEach(recipe => {
                    if (recipe.tags) {
                        return recipe.tags.forEach(tag => {
                            if (!uniqueTags.includes(tag)) {
                                uniqueTags.push(tag)
                            }
                        })
                    }
                })

                const dynamicSort = property => {
                    var sortOrder = 1;
                    if(property[0] === "-") {
                        sortOrder = -1;
                        property = property.substr(1);
                    }
                    return (a,b) => {
                        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                        return result * sortOrder;
                    }
                }

                const orderedRecipes = recipes.sort(dynamicSort('name'));
                this.setState({ recipes, allRecipes: orderedRecipes, tags: uniqueTags });
            }
        });
    }
    
    componentWillUnmount() {
		// const dbRef = db.ref();
        // dbRef.off('value', () => {});
    }

    handleDelete(recipe) {
        this.setState({showDeleteConfirm: recipe})
    }

    handleEdit(recipe) {
        this.setState({showEditRecipe: recipe})
    }

    renderItem(item, i) {
        return <li key={i}>{item}</li>
    }
    
    renderRecipe(recipe) { 
        return (
            <div className={"meal-card" + (this.props.user ? " show-controls" : "")}>
                <h3>{recipe.name}</h3>
                {recipe.ingredients ? <div><strong>Ingredients: </strong> <ul>{recipe.ingredients.map((item, i) => this.renderItem(item, i))}</ul></div> : null}
                {recipe.aromatics ? <div><strong>Aromatics: </strong> <ul>{recipe.aromatics.map((item, i) => this.renderItem(item, i))}</ul></div> : null}
                {recipe.condiments ? <div><strong>Condiments: </strong> <ul>{recipe.condiments.map((item, i) => this.renderItem(item,i))}</ul></div> : null}
                {recipe.instructions ? <p><strong>Notes/Instructions: </strong><br/> {recipe.instructions}</p> : null}
                {recipe.time ? <p><strong>Time: </strong> {recipe.time}</p> : null}
                {recipe.tags ? <div className="tags"><strong>Tags: </strong> <div style={{margin: '0 -5px'}}>{recipe.tags.map((tag, i) => <span key={i}>{tag}</span>)}</div></div> : null}
                {this.props.user ? <div className="meal-card-controls">
                    <button onClick={() => this.handleEdit(recipe)}>Edit</button>
                    <button onClick={() => this.handleDelete(recipe)}>Delete</button>
                </div> : null}
            </div>
        )
    }

    sortRecipes(e, tag) {
        e.preventDefault();
        const selectedTags = this.state.selectedTags;
        if (selectedTags.includes(tag)) {
            const index = selectedTags.indexOf(tag);
            selectedTags.splice(index, 1);
        } else {
            selectedTags.push(tag);
        }

        const recipes = this.state.allRecipes;
        const filteredRecipes = recipes.filter(r => {
            return selectedTags.every( val => r.tags && r.tags.indexOf(val) !== -1 )
        })

        this.setState({recipes: filteredRecipes, selectedTags})
    }

    resetSortRecipes(e){
        e.preventDefault();
        this.setState({recipes: this.state.allRecipes, selectedTags: []})
    }

	render() {
        const tags = this.state.tags ? this.state.tags.map(t => t.toLowerCase()).sort() : [];
        if (this.state.recipes) {
            return (

                <section className="meals">
                    <div className='container'>
                        <div>
                            {this.props.user && <AddMeal user={this.props.user} onAddComplete={() => this.setState({recipes: this.state.allRecipes, selectedTags: []})} ></AddMeal>}
                            <h2>Recipes ({this.state.recipes.length})</h2>
                            <div className="meals-tags">
                                {tags.sort().map( (tag, i) => (
                                    <button key={i} className={this.state.selectedTags.includes(tag) ? 'selected' : ""} onClick={(e) => this.sortRecipes(e, tag)}>{tag}</button>
                                ) )} 
                                <button className="reset" onClick={e => this.resetSortRecipes(e)}>Reset</button>
                            </div>
                            {this.state.recipes.length === 0 ? 
                            <div className='meals-none'>
                                {this.state.selectedTags.length > 0 ? <div>No matching recipes <br /><br /> <button className="reset" onClick={e => this.resetSortRecipes(e)}>Reset</button></div> : "No recipes available"}
                            </div> 
                            : 
                            <div className="meals-wrapper">
                                {this.state.recipes.map( (recipe, i)  => (
                                    <React.Fragment key={i}>{this.renderRecipe(recipe)}</React.Fragment>
                                ))}
                            </div>}

                            {this.state.showEditRecipe ? <EditMeals recipeToEdit={this.state.showEditRecipe} closeModal={() => this.setState({showEditRecipe: null, recipes: this.state.allRecipes, selectedTags: []})} /> : null}

                            {this.state.showDeleteConfirm ? <DeleteRecipe recipeToDelete={this.state.showDeleteConfirm} closeModal={() => this.setState({showDeleteConfirm: null, recipes: this.state.allRecipes, selectedTags: []})} />  : null}

                        </div>
                    </div>
                </section>



    
            );
        } else {
            return null
        }
	}
}

export default Meals;
