import React, { Component } from "react"

export default class Book extends Component {
    state = {
        shelfOptions: ["currentlyReading", "wantToRead", "read", "none"],
        shelfName: ''
    };

    componentDidMount() {
        this.setState({ shelfName: this.props.book.shelf !== undefined ? this.props.book.shelf : "none" });
    }

    /**
     * @description Method that triggers an event when a book shelf is selected and save a value to each book selected
     * @param {object} event - Triggered event
     */
    handleChange = (event) => {
        this.setState({ shelfName: event.target.value });
        this.props.onUpdateBook(this.props.book, event.target.value);
    };

    render() {
        return (
            <div className="book">
                <div className="book-top">
                    <div className="book-cover" style={this.props.style}></div>
                    <div className="book-shelf-changer">
                        <select value={this.state.shelfName} onChange={this.handleChange}>
                            <option value="move" disabled>Move to...</option>
                            {this.state.shelfOptions.map((title, index) => (
                                <option key={"b_" + index} value={title}>{this.props.getShelfTitle(title)}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="book-title">{this.props.book.title}</div>
                <div className="book-authors">{this.props.getBookAuthors(this.props.book.authors)}</div>
            </div>
        );
    }
}