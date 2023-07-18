
const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKS_APPS';

function generatedId() {
  return +new Date();
}

function generateBookObject(id, tittle, author, year, isCompleted) {
  return {
    id,
    tittle,
    author,
    year,
    isCompleted
  }
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
 
  return -1;
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const textTitle = document.createElement('h5');
  textTitle.innerText = bookObject.tittle;
 
  const textAuthor = document.createElement('h6');
  textAuthor.innerText = bookObject.author;

  const textYear = document.createElement('h6');
  textYear.innerText = bookObject.year;
 
  const img = document.createElement('img')
  img.setAttribute('src', './asset/cup-coffee-near-opened-book.jpg')


  const textContainer = document.createElement('div');
  textContainer.classList.add('bookdesc');
  textContainer.append(img, textTitle, textAuthor, textYear );

  const container = document.createElement('div');
  container.classList.add('card1');
  container.append(textContainer);
  container.setAttribute('id', `book-${bookObject.id}`);

  if (bookObject.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
 
    undoButton.addEventListener('click', function () {
      undoBookFromCompleted(bookObject.id);
    });
 
    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
 
    trashButton.addEventListener('click', function () {
      removeBookFromCompleted(bookObject.id);
    });
 
    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    
    checkButton.addEventListener('click', function () {
      addBookToCompleted(bookObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
 
    trashButton.addEventListener('click', function () {
      removeBookFromCompleted(bookObject.id);
    });
    
    container.append(checkButton,trashButton);
  }
 
  return container;
 
}

function addBook() {
  const tittleBook = document.getElementById('tittle').value;
  const authorBook = document.getElementById('author').value;
  const yearBook = document.getElementById('date').value;
 
  const generatedID = generatedId();
  const bookObject = generateBookObject(generatedID, tittleBook, authorBook, yearBook, false);
  books.push(bookObject);
 
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function addBookToCompleted (bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();

}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
 
  if (bookTarget === -1) return;
 
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });

    if (isStorageExist()) {
      loadDataFromStorage();
    }

  });

  
  document.addEventListener(RENDER_EVENT, function () {
    console.log(books);
  });

  document.addEventListener(RENDER_EVENT, function () {
    const undreadBOOK = document.getElementById('undread');
    undreadBOOK.innerHTML = '';

    const finishBook = document.getElementById('Finish');
    finishBook.innerHTML = '';
   
    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      if (!bookItem.isCompleted)
      undreadBOOK.append(bookElement);
      else 
      finishBook.append(bookElement)
      
    }
  });
  
document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});


const cariBuku = document.getElementById('cari')
cariBuku.addEventListener('keyup', pencarianBuku);

function pencarianBuku(e){
  const cariBuku = e.target.value.toLowerCase();
  let bookItem = document.querySelectorAll('.card1')

  bookItem.forEach((item) =>{
    const isiItem = item.firstChild.textContent.toLowerCase();

    if(isiItem.indexOf(cariBuku) != -1) {
      item.setAttribute('style', 'display: block;');
    } else{
      item.setAttribute('style', 'display: none;');
    }
  })
}

  const clearAllBook = document.getElementById('clear')
  clearAllBook.addEventListener('click', function () {
   removeAllBook();
  });

  function removeAllBook(){
    location.reload();
    localStorage.clear();   
    alert('All Books Clear');
  
  }
   
  

