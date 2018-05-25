'use strict';
const store = (function() {

  const addBookmarks = function (newBookmark) {
    if (!newBookmark.rating) {
      newBookmark.rating = 1;
    } 
    this.bookmarks.push(newBookmark);
  };

  const setError = function (err) {
    this.error = err;
  };

  const deleteBookmark = function(id) {
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
  };
  

  const addIdToShowMoreArray = function(id) {
    store.showMore.push(id);
  };

  const removeIdFromShowMoreArray = function(id) {
    const idIndex = store.showMore.indexOf(id);
    store.showMore.splice(idIndex, 1);
  };

  const editBookmark = function (id, newItem) {
    this.bookmarks = this.bookmarks.map(bookmark => 
    {if (bookmark.id === id) {
      return Object.assign(bookmark, newItem);
    }
    });
  };

  
  return {
    bookmarks: [],
    error: null,
    showMore: [''],
    addBookmarks,
    setError,
    deleteBookmark,
    filterRating: 1,
    addIdToShowMoreArray,
    removeIdFromShowMoreArray,
    editBookmark,
  
    

  };

}());