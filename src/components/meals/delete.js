import React from 'react';
import { db } from '../../firebase';
import { ref, remove } from 'firebase/database';

class DeleteRecipe extends React.Component {

    handleRemoveFromDb(key) {
        this.props.closeModal()
        remove(ref(db, '/recipes/' + key))
    }

    render() {
        const recipe = this.props.recipeToDelete;
        return (
            <div className="modal">
                <div className="modal-content" style={{textAlign: 'center'}}>
                <div style={{marginBottom: '20px'}}>Are you sure you wish to delete<br/><strong>{recipe.name}</strong>?</div>
                <button style={{marginRight: '20px'}} onClick={() => this.handleRemoveFromDb(recipe.key) }>Confirm</button>
                <button onClick={() => this.props.closeModal() }>Cancel</button>
                </div>
                <div className="modal-overlay"></div>
            </div>
        )
    }
}

export default DeleteRecipe;
