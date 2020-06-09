// grab everything that i need
const body = document.body;
const input = document.querySelector("input[type=text]");
const overlay = document.querySelector(".overlay");
const bookmarksList = document.querySelector(".bookmarks-list");
const bookmarkForm = document.querySelector(".bookmark-form");
const bookmarkInput = bookmarkForm.querySelector("input[type=text]");
const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
const apiUrl = "https://opengraph.io/api/1.0/site";
const appId = "99218c70-7007-4b84-8a61-0d3ceb7e2ded";

// all functions
fillBookmarksList(bookmarks);

function showFloater() {
  body.classList.add("show-floater");
}

function closeFloater() {
  if (body.classList.contains("show-floater")) {
    body.classList.remove("show-floater");
  }
}

function createBookmark(event) {
  event.preventDefault(); // Prevent loading on click enter button

  if (!bookmarkInput.value) {
    alert("We need url");
    return;
  }

  const url = encodeURIComponent(bookmarkInput.value);
  console.log(url);
  fetch(`${apiUrl}/${url}?app_id=${appId}`)
    .then((response) => response.json())
    .then((data) => {
      const bookmark = {
        title: data.hybridGraph.title,
        image: data.hybridGraph.image,
        link: data.hybridGraph.url,
        description: data.hybridGraph.description,
      };

      bookmarks.push(bookmark);
      // add a new bookmark to the bookmarks-list
      fillBookmarksList(bookmarks);
      // save that bookmarks list to localstorage
      storeBookmarks(bookmarks);

      bookmarkForm.reset(); // clear the typing text from input
    })
    .catch(() => {
      alert("There was a problem getting info!");
    });

  //   const title = bookmarkInput.value;
  //   const bookmark = document.createElement("a");
  //   bookmark.className = "bookmark";
  //   bookmark.innerText = title;
  //   bookmark.href = "#";
  //   bookmark.target = "_blank";
  //   bookmarksList.appendChild(bookmark);
}

function fillBookmarksList(bookmarks = []) {
  const bookmarksHtml = bookmarks
    .map((bookmark, i) => {
      return `
        <a href="${bookmark.link}" class="bookmark" data-id="${i}" target="_blank">
            <div class="img" style="background-image:url('${bookmark.image}')"></div>
            <div class="text">
                <h2 class="title">${bookmark.title}</h2>
                <p class="description">${bookmark.description}</p>
            </div>
            <i class="im im-x-mark-circle-o"></i>
        </a>`;
    })
    .join("");

  bookmarksList.innerHTML = bookmarksHtml;
}

function removeBookmark(event) {
  if (!event.target.matches(".im")) {
    return;
  } else {
    console.log(event.target.parentElement);
    const link = event.target.parentElement;
    link.setAttribute("href", "#");
    link.setAttribute("target", "_self");
  }

  // fine the index
  const index = event.target.parentNode.dataset.id;
  // remove from the bookmarks using splice
  bookmarks.splice(index, 1);
  // fill the list
  fillBookmarksList(bookmarks);
  // store back to localstorage
  storeBookmarks(bookmarks);
}

function storeBookmarks(bookmarks = []) {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

// all eventlistener
input.addEventListener("focusin", showFloater);
// input.addEventListener("focusout", closeFloater);
overlay.addEventListener("click", closeFloater);
bookmarkForm.addEventListener("submit", createBookmark);
bookmarksList.addEventListener("click", removeBookmark);
