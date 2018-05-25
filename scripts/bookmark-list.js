'use strict';
/* global api store */

const bookmarkList = (function() {

  function handleEditItemButton() {
    $('.js-bookmark-list').on('click', ('.js-bookmark-edit'), event => {
      event.preventDefault();
      const id = getIdFromElement(event.currentTarget);
      const newName = $('.js-bookmark-title').val();
      const newDesc = $('.js-bookmark-description').val();
      const newItem = {title: newName, desc: newDesc};

      api.editBookmark(id, newItem, 
        (editedBookmark) => {
          store.editBookmark(id, editedBookmark);
          render();
        },
        (err) => {
          $('.error-container').html('There seems to be a problem with the server.  Please try again.');
          console.log(err);
          store.setError(err);
          render();
        });
    });
  }

  function handleFilterSelector() {
    $('.js-filter-by-min-rating').on('change', function() {
      const ratingValue = $('.js-filter-by-min-rating option:selected').text();
      store.filterRating = ratingValue;
      render();
    });
  }

  function filterBookmarksByRating(bookmarksArray,rating) {
    return bookmarksArray.filter(bookmark => {
      return bookmark.rating >= rating;
    });
  }


  //delete bookmark when delete button is clicked
  function handleDeleteButton() {
    $('.js-bookmark-list').on('click', ('.js-bookmark-delete'), event => {
      event.preventDefault();
      const id = getIdFromElement(event.currentTarget);

      api.deleteBookmark(id, function() {
        store.deleteBookmark(id);
        render();
      });
    });
  }
  
  //find bookmark info by its id
  function getIdFromElement(element) {
    return $(element)
      .closest('.bookmark')
      .data('item-id');
  }

  function getBookmarkInfoFromId(id) {
    return store.bookmarks.find(bookmark => bookmark.id === id);
  }

  //toggles between showing or hiding description and url of bookmark
  // when 'show more' checkbox is checked
  
  function handleShowMoreCheckbox() {
    $('.js-bookmark-list').on('click', '.js-show-more-checkbox', (event) => {
      const id = getIdFromElement(event.currentTarget);
      store.addIdToShowMoreArray(id);
      render();
      
    });
  }

  function handleShowLessCheckbox() {
    $('.js-bookmark-list').on('click', '.js-show-less-checkbox', (event) => {
      const id = getIdFromElement(event.currentTarget);
      getBookmarkInfoFromId(id);
      store.removeIdFromShowMoreArray(id);
      render();
    });
  }
  
  //renders the page
  const generateBookmarkElement = function(bookmark) {
   
    let htmlElement = '';
    
    if (store.showMore.includes(bookmark.id)) {
      htmlElement += `<li class="bookmark" data-item-id="${bookmark.id}">
      <input name="title" value="${bookmark.title}" class="bookmark-title js-bookmark-title"></input>
      <input name="description" class="bookmark-description js-bookmark-description" value="${bookmark.desc}"></input>
      <a href="${bookmark.url}">Visit Website</a>
      <span class="rating-info">Rating: ${bookmark.rating}</span><br>
    <form class="item-edit-form">
      <div class="bookmark-controls">
        <label for="show-less-checkbox">Show less</label>
        <input type="checkbox" name="show-less-checkbox" class="js-show-less-checkbox show-less-checkbox"><br>
        </button>
        <button class="js-bookmark-delete bookmark-delete">
          <span class="button-label">Delete</span>
        </button>
        <button class="js-bookmark-edit bookmark-edit">
        <span class="button-label">Save Edit</span>
      </button>
      </div>
  </li>`;
    } else {
      htmlElement += `<li class="bookmark" data-item-id="${bookmark.id}">
      <p class="title">${bookmark.title}</p>
      <span class="rating-info">Rating: ${bookmark.rating}</span><br>
    <form class="item-edit-form">
      <div class="bookmark-controls">
        <label for="show-more-checkbox">Show More</label>
        <input type="checkbox" name="show-more-checkbox" class="js-show-more-checkbox show-more-check-box"><br>
        </button>
        <button class="js-bookmark-delete bookmark-delete">
          <span class="button-label">Delete</span>
        </button>
      </div>
  </li>`;
    }

    return htmlElement;
  };
  


  function generateBookmarkString(array) {
    return array.map(bookmark => generateBookmarkElement(bookmark)).join('');
  }

  function render() {
    let bookmarkArray = store.bookmarks;
    let bookmarkString = '';
    if( store.filterRating !== 1) {
      const ratingNum = parseInt(store.filterRating, 10);
      const filteredArray = filterBookmarksByRating(bookmarkArray, ratingNum);
      bookmarkString += generateBookmarkString(filteredArray);
    } else {
      bookmarkString += generateBookmarkString(bookmarkArray);
    }
    $('.js-bookmark-list').html(bookmarkString);

    console.log('render ran');
  }

  //validates new bookmark entries and adds them to the database
  function formValidation() {
    return ($('.js-title-entry').val() && $('.js-url-entry').val());
  }


  function handleNewBookmarkSubmit() {
    $('#js-add-item-form').submit(function(event) {
      event.preventDefault();
      if (!formValidation(this)) {
        $('.error-container').html('Please enter a valid Title and a valid Web Address');
      } else {
        $('.error-container').html('');
        const formData = new FormData(this);
        const formDataObject = {};
        formData.forEach(function(value, name) {
          formDataObject[name] = value;
        });
        api.createBookmark(formDataObject, 
          (newBookmark) => {
            store.addBookmarks(newBookmark);
            render();
          },
          (err) => {
            $('.error-container').html('There seems to be a problem with the server.  Please try again.');
            console.log(err);
            store.setError(err);
            render();
          }
        );
      }
    });
  }

  function bindEventListeners() {
    //calls all event listeners on the page when it loads
    handleNewBookmarkSubmit();
    handleDeleteButton();
    handleShowMoreCheckbox();
    handleShowLessCheckbox();
    handleFilterSelector();
    handleEditItemButton();

  }

  return{
    render,
    bindEventListeners,
    filterBookmarksByRating,
  };

}());