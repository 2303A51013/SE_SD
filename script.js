
const bookForm = document.getElementById('book-form');
const bookList = document.getElementById('book-list');
const searchInput = document.getElementById('search-input');

class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    static displayBooks() {
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><button class="delete-btn">Delete</button></td>
        `;
        bookList.appendChild(row);
    }

    static deleteBook(target) {
        if (target.classList.contains('delete-btn')) {
            target.parentElement.parentElement.remove();
        }
    }

    static clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        const updatedBooks = books.filter((book) => book.isbn !== isbn);
        localStorage.setItem('books', JSON.stringify(updatedBooks));
    }
}

document.addEventListener('DOMContentLoaded', UI.displayBooks);

bookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;
    
    if (title === '' || author === '' || isbn === '') {
        alert('Please fill in all fields');
        return;
    }

    const book = new Book(title, author, isbn);

    UI.addBookToList(book);

    Store.addBook(book);
    
    UI.clearFields();
});

bookList.addEventListener('click', (e) => {

    UI.deleteBook(e.target);

    const isbn = e.target.parentElement.previousElementSibling.textContent;

    Store.removeBook(isbn);
});

searchInput.addEventListener('keyup', () => {
    const term = searchInput.value.toLowerCase();
    const rows = bookList.getElementsByTagName('tr');

    Array.from(rows).forEach((row) => {
        const title = row.children[0].textContent.toLowerCase();
        const author = row.children[1].textContent.toLowerCase();
        const isbn = row.children[2].textContent.toLowerCase();

        if (title.includes(term) || author.includes(term) || isbn.includes(term)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});