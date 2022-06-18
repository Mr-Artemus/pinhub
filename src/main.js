// Getting the current URL
const url = window.location.href;
const splittedUrl = url.split("/");

// Checking if the URL is the homepage
if (splittedUrl[3] == "") {
    // Getting the sidebar DOM element
    const div = (document.getElementsByClassName("dashboard-sidebar")).item(0);
    // Check if the sidebar is load and have childrens
    if (div && div.childElementCount > 0 && div.children[1].id !== "pinned-repos") {
        // Creation the new section for the homepage
        let pinned = document.createElement("div");
        pinned.className = "mb-3 Details js-repos-container border-bottom color-border-muted";
        pinned.id = "pinned-repos";
        pinned.innerHTML = `<h2 class="f4 hide-sm hide-md mb-1 f5">Pinned Repositories</h2>Loading...`;
        pinned.style.paddingBottom = "24px";
        pinned.setAttribute("data-repository-hovercards-enabled", "");

        // check if the new element should be placed at first position
        if(div.children[0].childElementCount === 1 && div.children[0].firstElementChild.id.startsWith("details")) {            
            // Appending the new section to the homepage
            div.insertBefore(pinned, div.children[1]);
        } else {
            // Adding a simple padding on the top
            pinned.style.paddingTop = "24px";
            
            // Appending the new section to the homepage
            div.insertBefore(pinned, div.children[0]);
        }

        getPinnedRepos().then(repos => {
            // Getting the new section from the homepage
            pinned = document.getElementById("pinned-repos");
        
            // Cheking is the pinned repos section is loaded
            if (pinned) {
                // Checking if the pinned repos is empty
                if (!Array.isArray(repos) || repos.length == 0) {
                    // Setting the pinned repos section to the default text
                    pinned.innerHTML = `<h2 class="f4 hide-sm hide-md mb-1 f5">Pinned Repositories</h2>No pinned repositories`;
                } else {
                    // Creating the pinned repos list
                    let output = `<h2 class="f4 hide-sm hide-md mb-1 f5">Pinned Repositories</h2><ul class="list-style-none" data-filterable-for="dashboard-repos-filter-left" data-filterable-type="substring">`;
                    
                    // Iterate over the pinned repos
                    repos.forEach(element => {
                        output += `
                            <li class="private source no-description">
                                <div class="width-full d-flex mt-2">
                                    <a class="mr-2 d-flex flex-items-center" href="${element[1]}" data-hovercard-type="repository" data-hovercard-url="/${element[0]}/hovercard">
                                        <img src="${element[2]}" class=" avatar avatar-user avatar-small circle" alt="${element[0].split("/")[0]}" aria-label="Repository" width="16" height="16">
                                    </a>
                                    <div class="wb-break-word">
                                        <a class="color-fg-default lh-0 mb-2 markdown-title" href="${element[1]}" data-hovercard-type="repository" data-hovercard-url="/${element[0]}/hovercard">
                                            ${element[0].replace("/", "<span class=\"color-fg-muted\">/</span>")}
                                        </a>
                                    </div>
                                </div>
                            </li>`;
                    });
        
                    // Closing the list
                    output += "</ul>";
        
                    // Put the list in the pinned repos section
                    pinned.innerHTML = output;
                }
            }
        }).catch(console.error);
    }
} else {
    // Getting the repo header DOM element
    const div = document.getElementById("repository-container-header");
    
    // Checking if the repo header and the buttons are loaded
    if (div && div.firstElementChild && div.firstElementChild.lastElementChild) {
        // Getting the buttons list DOM element
        const buttonList = div.firstElementChild.lastElementChild;

        // Checking if the new button is already present
        if(buttonList.innerHTML.indexOf("btn-homepage-pin") === -1) {
            // Getting the pinned repos list to check if the repo is pinned
            getPinnedRepos().then(repos => {
                // Checking if the repo is pinned
                let repo = repos.find(element => element[0] === `${splittedUrl[3]}/${splittedUrl[4]}`);

                // Creating the new button
                let buttonElement = document.createElement("li");
                buttonElement.id = "btn-homepage-pin";

                // Setting the button content
                if(repo) {
                    buttonElement.innerHTML = `
                        <div class="float-left" data-test-selector="pin-repo-button">
                            <button title="Pin this repository on the homepage" type="submit" data-view-component="true" class="btn-sm btn btn-primary">
                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-pin mr-2">
                                    <path fill-rule="evenodd" d="M4.456.734a1.75 1.75 0 012.826.504l.613 1.327a3.081 3.081 0 002.084 1.707l2.454.584c1.332.317 1.8 1.972.832 2.94L11.06 10l3.72 3.72a.75.75 0 11-1.061 1.06L10 11.06l-2.204 2.205c-.968.968-2.623.5-2.94-.832l-.584-2.454a3.081 3.081 0 00-1.707-2.084l-1.327-.613a1.75 1.75 0 01-.504-2.826L4.456.734zM5.92 1.866a.25.25 0 00-.404-.072L1.794 5.516a.25.25 0 00.072.404l1.328.613A4.582 4.582 0 015.73 9.63l.584 2.454a.25.25 0 00.42.12l5.47-5.47a.25.25 0 00-.12-.42L9.63 5.73a4.581 4.581 0 01-3.098-2.537L5.92 1.866z"></path>
                                </svg>
                                Pinned to Homepage
                            </button>
                        </div>`;
                } else {
                    buttonElement.innerHTML = `
                        <div class="float-left" data-test-selector="pin-repo-button">
                            <button title="Pin this repository on the homepage" type="submit" data-view-component="true" class="btn-sm btn">
                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-pin mr-2">
                                    <path fill-rule="evenodd" d="M4.456.734a1.75 1.75 0 012.826.504l.613 1.327a3.081 3.081 0 002.084 1.707l2.454.584c1.332.317 1.8 1.972.832 2.94L11.06 10l3.72 3.72a.75.75 0 11-1.061 1.06L10 11.06l-2.204 2.205c-.968.968-2.623.5-2.94-.832l-.584-2.454a3.081 3.081 0 00-1.707-2.084l-1.327-.613a1.75 1.75 0 01-.504-2.826L4.456.734zM5.92 1.866a.25.25 0 00-.404-.072L1.794 5.516a.25.25 0 00.072.404l1.328.613A4.582 4.582 0 015.73 9.63l.584 2.454a.25.25 0 00.42.12l5.47-5.47a.25.25 0 00-.12-.42L9.63 5.73a4.581 4.581 0 01-3.098-2.537L5.92 1.866z"></path>
                                </svg>
                                Pin to Homepage
                            </button>
                        </div>`;
                }

                // Appending the button to the buttons list
                buttonElement = buttonList.appendChild(buttonElement);
                const button = buttonElement.firstElementChild.firstElementChild;

                // Adding the event listener to the button
                buttonElement.addEventListener("click", () => {
                    // Checking if the repo is pinned
                    if(repo) {
                        // Removing the repo from the pinned repos list
                        removePinnedRepo(repo[0]).then(() => {
                            // Update the button
                            button.classList.remove("btn-primary");
                            button.lastChild.textContent = "Pin to Homepage";

                            // Updating state of the current repo
                            repo = undefined;
                        }).catch(console.error);
                    } else {
                        // Adding the repo to the pinned repos list
                        addPinnedRepo(`${splittedUrl[3]}/${splittedUrl[4]}`, splittedUrl.slice(0,4).join("/") + ".png?size=16").then(newRepo => {
                            // Update the button
                            button.classList.add("btn-primary");
                            button.lastChild.textContent = "Pinned to Homepage";

                            // Updating state of the current repo
                            repo = newRepo;
                        }).catch(console.error);
                    }
                })
            }).catch(console.error);
        }
    }
}

function getPinnedRepos() {
    return new Promise(function(resolve, reject) {
        if(typeof(browser) !== "undefined" && browser.storage) {
            // Getting the pinned repos from the browser storage
            browser.storage.local.get("pinnedRepos").then(function(repos) {
                // return the pinned repos
                resolve(repos.pinnedRepos || []);
            }).catch(reject);
            
        } else if(typeof(chrome) !== "undefined" && chrome.storage) {
            // Getting the pinned repos from the chrome storage
            chrome.storage.local.get("pinnedRepos", function(repos) {
                // Pass any observed errors down the promise chain.
                if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
                
                // return the pinned repos
                resolve(repos.pinnedRepos || []);
            });
        }
    });
}

function addPinnedRepo(repo, image) {
    return new Promise(function(resolve, reject) {
        // Getting the pinned repos from the browser storage
        getPinnedRepos().then(repos => {
            // Adding the repo to the pinned repos list
            repos.push([repo, "https://github.com/" + repo, image]);

            // Saving the pinned repos to the browser storage
            if(typeof(browser) !== "undefined" && browser.storage) {
                // Saving the pinned repos to the browser storage
                browser.storage.local.set({pinnedRepos: repos.sort((a, b) => {
                    a = a[0].toLowerCase();
                    b = b[0].toLowerCase();
                    if (a > b) return 1;
                    if (b > a) return -1;
                    return 0;
                })}).then(function() {
                    // resolving the promise
                    resolve(repos[repos.length - 1]);
                }).catch(reject);
            } else if(typeof(chrome) !== "undefined" && chrome.storage) {
                // Saving the pinned repos to the chrome storage
                chrome.storage.local.set({pinnedRepos: repos.sort((a, b) => {
                    a = a[0].toLowerCase();
                    b = b[0].toLowerCase();
                    if (a > b) return 1;
                    if (b > a) return -1;
                    return 0;
                })}, function() {
                    // Pass any observed errors down the promise chain.
                    if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
                    
                    // resolving the promise
                    resolve(repos[repos.length - 1]);
                });
            }
        }).catch(reject);
    });
}

function removePinnedRepo(repo) {
    return new Promise(function(resolve, reject) {
        // Getting the pinned repos from the browser storage
        getPinnedRepos().then(repos => {
            // Removing the repo from the pinned repos list
            repos = repos.filter(el => el[0] !== repo);

            // Saving the pinned repos to the browser storage
            if(typeof(browser) !== "undefined" && browser.storage) {
                // Saving the pinned repos to the browser storage
                browser.storage.local.set({pinnedRepos: repos}).then(function() {
                    // resolving the promise
                    resolve();
                }).catch(reject);
            } else if(typeof(chrome) !== "undefined" && chrome.storage) {
                // Saving the pinned repos to the chrome storage
                chrome.storage.local.set({pinnedRepos: repos}, function() {
                    // Pass any observed errors down the promise chain.
                    if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);

                    // resolving the promise
                    resolve();
                });
            }
        }).catch(reject);
    });
}