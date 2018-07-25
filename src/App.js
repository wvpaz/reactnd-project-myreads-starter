import React, { Component } from 'react'
import * as BooksAPI from './BooksAPI'
import BookShelf from "./BookShelf"
import BooksList from './BooksList';
import { Link, Route } from 'react-router-dom'
import PropTypes from "prop-types"
import './App.css'

export default class BooksApp extends Component {
  state = {
    books: [],
    shelfs: [],
    query: ''
  };


  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books });
    })
  }

  /**
   * @description It's a method that organize all books in yours respective shelfs
   * @param {...object} books - All books returned by getAll() method from BooksAPI
   * @returns {...object} Shelfs with books
   */
  createBookShelfs = (books) => {
    let shelfs = [];

    books.forEach((book) => {
      let index = shelfs.map((obj) => { return obj.key }).indexOf(book.shelf);

      if (index >= 0) {
        shelfs[index].values.push(book);
      }
      else {
        shelfs.push({ key: book.shelf, values: [book] });
      }
    });

    return shelfs;
  }

  /**
   * @description It's a method that concat all authors name inside authors array
   * @param {...string} authors - Author's name array of a book
   * @returns {string} All authors name concatenated
   */
  getBookAuthors = (arrAuthors) => {
    let authors = "";

    if (arrAuthors !== undefined && arrAuthors !== null && arrAuthors.length > 0) {
      arrAuthors.forEach((author) => {
        if (authors.length === 0) {
          authors += author;
        }
        else {
          authors += (", " + author);
        }
      });
    }

    return authors;
  }

  /**
   * @description This method parses a camel case shelf key name to a shelf name with spaces (e.g. wantToRead ==> Want To Read)
   * @param {string} key - Shelf's key name
   * @returns {string} Shelf's key name with spaces
   */
  getShelfTitle = (key) => {
    let title = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => { return str.toUpperCase(); });
    return title;
  };

  /**
   * @description Method that search books passing a query
   * @param {string} query - Part of a book or author name
   * @returns {string} Promise with a list of books found
   */
  searchBooks = (query) => {
    return BooksAPI.search(query).then((books) => {
      if (books !== undefined && books.length > 0) {
        this.state.books.forEach(element => {
          let aux = books.filter((b) => b.id === element.id);

          if (aux.length > 0) {
            aux[0].shelf = element.shelf;
          }
        });
        return books;
      }
    });
  };

  /**
   * @description This method updates the book's shelf
   * @param {object} newBook - Object containing a book that will be changed from shelf
   * @param {string} newShelf - The shelf's key name
   */
  updateBook = (newBook, newShelf) => {
    if (newShelf !== undefined && newShelf !== "") {
      BooksAPI.update(newBook, newShelf).then((bookIds) => {
        let booksCopy = this.deepCopy(this.state.books);
        let bookCopy = booksCopy.find((b) => (b.id === newBook.id));

        if (bookCopy === undefined) {
          bookCopy = this.deepCopy(newBook);
          booksCopy.push(bookCopy);
        }

        bookCopy.shelf = newShelf;

        let bookShelfs = [];
        let shelfKeys = Object.keys(bookIds);
        shelfKeys.forEach((bookId) => {
          bookShelfs = bookShelfs.concat(booksCopy.filter((b) => (bookIds[bookId].includes(b.id))))
        });

        this.setState({ books: this.deepCopy(bookShelfs) });
      });
    }
  };

  /**
   * @description This realize an object copy
   * @param {string} obj - Object that will be copied
   * @return {object} Returns a new object copied from original object
   */
  deepCopy(obj) {
    if (obj !== undefined && obj !== null) {
      return JSON.parse(JSON.stringify(obj));
    }

    return null;
  }

  render() {
    let shelfs = this.createBookShelfs(this.state.books);

    return (
      <div className="app">
        <Route exact path="/" render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                {shelfs.map((shelf, index) => (
                  <BookShelf
                    key={'bs_' + index}
                    bookShelfs={shelf}
                    getBookAuthors={this.getBookAuthors}
                    getShelfTitle={this.getShelfTitle}
                    onUpdateBook={this.updateBook} />))}
              </div>
            </div>
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
          </div>
        )} />
        <Route path="/search" render={() => (
          <BooksList
            onSearchBooks={this.searchBooks}
            getBookAuthors={this.getBookAuthors}
            getShelfTitle={this.getShelfTitle}
            onUpdateBook={this.updateBook} />
        )} />
      </div>
    )
  }
}

BooksApp.propTypes = {
  key: PropTypes.string.isRequired,
  bookShelfs: PropTypes.array,
  onSearchBooks: PropTypes.func,
  getBookAuthors: PropTypes.func,
  getShelfTitle: PropTypes.func,
  onUpdateBook: PropTypes.func
}