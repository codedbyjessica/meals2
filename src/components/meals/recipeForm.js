// expection:
// handleChange
// onSubmit
// values

import React from 'react';

class RecipeForm extends React.Component {
    renderFieldSet(name, displayName, key, value) {
        return (
            <fieldset key={key}>
                <label htmlFor={name}>{displayName}: </label>
                <input type="text" name={name} onChange={e => this.props.handleChange(e)} value={value || ""} />
            </fieldset>
        )
    }
    
    render() {
        const FIELDS = [
            {name: 'name', displayName: 'Recipe Name'},
            {name: 'ingredients', displayName: 'Main Ingredients (separated by commas)'},
            {name: 'aromatics', displayName: 'Aromatics (separated by commas)'},
            {name: 'condiments', displayName: 'Condiments (separated by commas)'},
            {name: 'instructions', displayName: 'Instructions'},
            {name: 'time', displayName: 'Time'},
            {name: 'tags', displayName: 'Tags (separated by commas'},
        ]
        const values = this.props.values || {}

        if (!this.props.values) {
            return;
        }
        return (
            <form id="add-recipe" onSubmit={e => this.props.onSubmit(e)} noValidate>
                {FIELDS.map((f, i) => this.renderFieldSet(f.name, f.displayName, i, values[f.name]))}
                <button className="btn-submit" type='submit'>{this.props.buttonText || 'Add recipe'}</button>
            </form>
        )
    }
}

export default RecipeForm;
