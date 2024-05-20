function requiredParam(param) {
    throw new Error(param + " es obligatorio");
}

// Constructor que crea una instancia con un título
function Categories({
    title = requiredParam("title"),
}) {
    this.title = title;
}

// Constructor que crea una instancia de Libro
function Libro({
    title = requiredParam("title"),
    author = requiredParam("author"),
    year,
    categories = [],
} = {}) {
    this.title = title;
    this.author = author;
    this.year = year;

    const private = {
        "_categories": [],
    };

    Object.defineProperty(this, "categories", {
        get() {
            return private["_categories"];
        },
        set(newCategories) {
            if (newCategories instanceof Categories) {
                private["_categories"].push(newCategories);
            } else if (typeof newCategories === 'object' && newCategories.title) {
                private["_categories"].push(new Categories(newCategories));
            } else {
                console.warn("Algun dato no es una instancia del prototipo Categories");
            }
        },
    });

    for (const categoriesIndex in categories) {
        this.categories = categories[categoriesIndex];
    }
}

// Función para guardar el libro en localStorage
function saveBookToLocalStorage(book) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
}

// Función para cargar los libros de localStorage y mostrarlos en el DOM
function loadBooksFromLocalStorage() {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = ""; // Limpiar la lista actual

    books.forEach(book => {
        const li = document.createElement("li");

        const categories = (book.categories && Array.isArray(book.categories)) ? 
            book.categories.map(cat => new Categories(cat)) : [];

        const libro = new Libro({
            title: book.title,
            author: book.author,
            year: book.year,
            categories: categories
        });

        li.textContent = `${libro.title} by ${libro.author} (${libro.year}) - Categories: ${libro.categories.map(cat => cat.title).join(", ")}`;
        bookList.appendChild(li);
    });
}

// Función para guardar una categoría en localStorage
function saveCategoryToLocalStorage(category) {
    let categories = JSON.parse(localStorage.getItem("categories")) || [];
    categories.push(category);
    localStorage.setItem("categories", JSON.stringify(categories));
}

// Función para cargar las categorías de localStorage y mostrarlas en el DOM
function loadCategoriesFromLocalStorage() {
    let categories = JSON.parse(localStorage.getItem("categories")) || [];
    const categoryList = document.getElementById("categoryList");
    categoryList.innerHTML = ""; // Limpiar la lista actual

    categories.forEach(category => {
        const li = document.createElement("li");
        li.textContent = category.title;
        categoryList.appendChild(li);
    });
}

// Manejar el envío del formulario de libros
document.getElementById("bookForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = document.getElementById("year").value;
    const categoriesInput = document.getElementById("categories").value;

    const categoriesArray = categoriesInput.split(',')
        .map(cat => cat.trim())
        .filter(cat => cat)
        .map(cat => new Categories({ title: cat }));

    const newBook = new Libro({
        title: title,
        author: author,
        year: year,
        categories: categoriesArray
    });

    saveBookToLocalStorage(newBook);
    loadBooksFromLocalStorage();
    document.getElementById("bookForm").reset();
});

// Manejar el envío del formulario de categorías
document.getElementById("categoryForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("newCategory").value;

    const newCategory = new Categories({ title: title });

    saveCategoryToLocalStorage(newCategory);
    loadCategoriesFromLocalStorage();
    document.getElementById("categoryForm").reset();
});

// Cargar libros y categorías al cargar la página
window.addEventListener("load", function() {
    loadBooksFromLocalStorage();
    loadCategoriesFromLocalStorage();
});
