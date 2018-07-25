import React, { Component } from 'react'
import Book from './Book'
import ProtoTypes from "prop-types"
import { Link } from 'react-router-dom'

export default class BooksList extends Component {
    state = {
        query: '',
        books: []
    };

    /**
     * @description Method that triggers an event when a character is typed, save the input value and search a book passing the value typed
     * @param {object} event - Triggered event
     */
    handleChange = (query) => {
        this.setState({ query });
        // this.setState({ books: this.props.onSearchBooks(query) });

        // var x = 5;
        this.props.onSearchBooks(query).then((books) => {
            this.setState({ books })
        })
    };

    render() {
        const { query, books } = this.state;

        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link to="/" className="close-search">Close</Link>
                    <div className="search-books-input-wrapper">
                        <input type="text" placeholder="Search by title or author" value={query} onChange={(event) => this.handleChange(event.target.value)} />
                    </div>
                </div>
                <div className="search-books-results">
                    <ol className="books-grid">
                        {(books !== undefined && books.length > 0) && books.map((book) => (
                            <li key={book.id}>
                                <Book
                                    book={book}
                                    getBookAuthors={this.props.getBookAuthors}
                                    getShelfTitle={this.props.getShelfTitle}
                                    onUpdateBook={this.props.onUpdateBook}
                                    style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks !== undefined && book.imageLinks.smallThumbnail})` }} />
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        );
    }
}

BooksList.protoTypes = {
    book: ProtoTypes.object,
    getBookAuthors: ProtoTypes.func,
    getShelfTitle: ProtoTypes.func,
    onUpdateBook: ProtoTypes.func,
    style: ProtoTypes.object
}