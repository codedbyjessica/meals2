import React from 'react';
import AddMeal from './meals/add';
import ShowMeal from './meals/show';

class Meals extends React.Component {
	render() {
		return (
            <section className="meals">
                <div className='container'>
                    <AddMeal></AddMeal>
                    <ShowMeal user={this.props.user}></ShowMeal>
                </div>
            </section>

		);
	}
}

export default Meals;
