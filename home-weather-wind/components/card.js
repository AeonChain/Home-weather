import { Component } from 'react';

export default class Card extends Component {
	render() {
		// bg-gray-800 border-gray-700
		const colors = {
			bg: this.props.secondaryCard ? "bg-gray-700" : "bg-gray-800",
			border: this.props.secondaryCard ? "border-gray-600" : "border-gray-700",

		};
		const compositeClasses = this.props.className + " " + colors.bg + " " + colors.border + " w-96 self-start justify-self-center block rounded-lg border shadow-md  text-white";
		return <div className={compositeClasses}>
			{this.props.children}
		</div>;
	};
}