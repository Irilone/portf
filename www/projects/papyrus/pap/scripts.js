let globalPapersData = [];
// Example of a simple filter state; adapt based on actual criteria needed
let currentFilter = {
    type: 'all',
    value: null
};
// During page initialization

// Global state object
let columnVisibility = {
    color: false,
    comment: false
};


//Script
function populateSidebar(items) {
    // Select or create the sidebar outer container
    let sidebarOuterContainer = document.querySelector('.sidebar-outer-container');
    if (!sidebarOuterContainer) {
        sidebarOuterContainer = document.createElement('div');
        sidebarOuterContainer.className = 'sidebar-outer-container';
        document.querySelector('.sidebar').appendChild(sidebarOuterContainer);
    }

    // Select or create the sidebar items container
    let sidebarItemsContainer = sidebarOuterContainer.querySelector('.sidebar-items-container');
    if (!sidebarItemsContainer) {
        sidebarItemsContainer = document.createElement('div');
        sidebarItemsContainer.className = 'sidebar-items-container';
        sidebarOuterContainer.appendChild(sidebarItemsContainer);
    }

    const ul = document.createElement('ul'); // Create an unordered list

    items.forEach(item => {
        if (item.icon && !item.name) {
            // This is a divider
            const divider = document.createElement('li');
            divider.className = 'sidebar-divider';
            divider.style.backgroundImage = `url('${item.icon}')`;
            ul.appendChild(divider);
        } else {
            // This is a regular item
            const li = document.createElement('li');
            li.className = 'sidebar-item';

            if (item.icon) {
                const icon = document.createElement('img');
                icon.src = item.icon;
                icon.alt = `${item.name} icon`;
                icon.className = 'sidebar-icon';
                li.appendChild(icon);
            }

            if (item.name) {
                const text = document.createElement('span');
                text.textContent = item.name;
                li.appendChild(text);
            }

            ul.appendChild(li);
        }
    });

    sidebarItemsContainer.appendChild(ul); // Append the unordered list to the sidebar items container

    // Add a spacer element to push content to the top
    const spacer = document.createElement('div');
    spacer.style.flexGrow = 1;
    sidebarItemsContainer.appendChild(spacer);
}




const sidebarItems = [{
        name: "Library",
        icon: '/projects/papyrus/pap/img/icons/sidepanel/library.svg'
    },
    {
        name: 'Starred Papers',
        icon: '/projects/papyrus/pap/img/icons/sidepanel/star.svg'
    },
    {
        name: 'Archived Papers',
        icon: '/projects/papyrus/pap/img/icons/sidepanel/stack.svg'
    },
    {
        name: 'Bookmarked Papers',
        icon: '/projects/papyrus/pap/img/icons/sidepanel/bookmark.svg'
    },

    {
        icon: '/projects/papyrus/pap/img/UI/divider.svg'
    },

    {
        name: 'Collections',
        icon: '/projects/papyrus/pap/img/icons/sidepanel/folders.svg'
    },
    {
        name: 'Thesis Project',
        icon: '/projects/papyrus/pap/img/icons/sidepanel/hat.svg'
    },
    {
        name: 'Project X',
        icon: '/projects/papyrus/pap/img/icons/sidepanel/stack2.svg'
    },
    {
        name: 'Project Y',
        icon: '/projects/papyrus/pap/img/icons/sidepanel/layers.svg'
    },

    {
        icon: '/projects/papyrus/pap/img/UI/divider.svg'
    },

    {
        name: 'Recent Activity',
        icon: '/projects/papyrus/pap/img/icons/sidepanel/recent.svg'
    },
    {
        name: 'Recently read papers',
        icon: '/projects/papyrus/pap/img/icons/sidepanel/recentread.svg'
    },
    {
        name: 'Recent searches',
        icon: '/projects/papyrus/pap/img/icons/sidepanel/recentsearch.svg'
    },

    {
        icon: '/projects/papyrus/pap/img/UI/divider.svg'
    },

    {
        name: 'Types of paper',
        icon: '/projects/papyrus/pap/img/icons/sidepanel/typesofpap.svg'
    },
    {
        name: 'Experiments',
        icon: '/projects/papyrus/pap/img/icons/sidepanel/experiments.svg'
    },
    {
        name: 'Literature Review',
        icon: '/projects/papyrus/pap/img/icons/sidepanel/litrev.svg'
    },
    {
        name: 'Opinion',
        icon: '/projects/papyrus/pap/img/icons/sidepanel/opinion.svg'
    },
    {
        name: 'Theory',
        icon: '/projects/papyrus/pap/img/icons/sidepanel/theory.svg'
    },
    {
        name: 'Introduction',
        icon: '/projects/papyrus/pap/img/icons/sidepanel/intro.svg'
    },
    // ... more sidebar items



];


document.addEventListener('DOMContentLoaded', function() {
    // Fetch the paper data from the local database.json file
    fetch('database.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(papersData => {
            globalPapersData = papersData; // Assign fetched data to globalPapersData
            populateTable(globalPapersData); // Populate the table with fetched data
            populateSidebar(sidebarItems); // Populate the sidebar with predefined items
            addSidebarClickEvents(); // Add click events to sidebar items
            // Assuming addRowClickEvent is properly defined to work with or without parameters
            addRowClickEvent(); // Attach event listeners without explicitly passing globalPapersData

            // Set initial visibility
            document.querySelector('.table-container').classList.remove('hidden');
            document.querySelector('.cards-container').classList.add('hidden');
            document.getElementById('show-color').checked = false;
            document.getElementById('show-comment').checked = false;
        })
        .catch(error => console.error('Fetch error:', error));

    setupViewToggle();




    function setupViewToggle() {
        document.getElementById('viewToggle').addEventListener('click', function() {
            toggleViewVisibility();
        });
    }

    function toggleViewVisibility() {
        const tableContainer = document.querySelector('.table-container');
        const cardsContainer = document.querySelector('.cards-container');
        const isTableVisible = !tableContainer.classList.contains('hidden');
    
        if (isTableVisible) {
            // The table is currently visible, so we'll hide it and show the cards
            tableContainer.classList.add('hidden');
            cardsContainer.classList.remove('hidden');
            console.log("Switching to cards view");
            populateCards(filterPapersBasedOnCurrentFilter()); // Use filtered data for cards
        } else {
            // The cards are currently visible, so we'll hide them and show the table
            cardsContainer.classList.add('hidden');
            tableContainer.classList.remove('hidden');
            console.log("Switching to table view");
            populateTable(filterPapersBasedOnCurrentFilter()); // Use filtered data for table
        }
    }


    document.getElementById('options-icon').addEventListener('click', function() {
        const dropdownMenu = document.getElementById('dropdown-menu');
        const iconRect = this.getBoundingClientRect(); // Get the bounding rectangle of the icon

        // Subtract 20px from the left position for the extra leftward adjustment
        dropdownMenu.style.left = `${iconRect.left - 50}px`; // Adjusted horizontal position based on the icon
        dropdownMenu.style.top = `${iconRect.bottom}px`; // Vertical position just below the icon

        dropdownMenu.classList.toggle('hidden'); // Show/hide the dropdown
    });

    // Close the dropdown if clicking outside of it
    document.addEventListener('click', (event) => {
        const dropdownMenu = document.getElementById('dropdown-menu');
        const optionsIcon = document.getElementById('options-icon');
        if (!dropdownMenu.contains(event.target) && !optionsIcon.contains(event.target)) {
            dropdownMenu.classList.add('hidden');
        }
    });

    document.getElementById('show-color').addEventListener('change', function() {
        columnVisibility.color = this.checked;
        toggleColumnVisibility('color', columnVisibility.color);
    });

    document.getElementById('show-comment').addEventListener('change', function() {
        columnVisibility.comment = this.checked;
        toggleColumnVisibility('comment', columnVisibility.comment);
    });

// Event listener for opening the citation dropdown
$('.details-panel').on('click', '#citation-button', function(event) {
    const $dropdown = $('#dropdown-citation-menu');
    const rect = $(this).offset();
    const top = rect.top + $(this).outerHeight();
    const left = rect.left;

    $dropdown.css({ top: top + 'px', left: left + 'px' }).toggleClass('hidden');
    event.stopPropagation(); // Prevent event from bubbling up to higher DOM elements
});

// Ensure the dropdown menu is created and appended only once
if ($('#dropdown-citation-menu').length === 0) {
    const dropdownCitationMenuHtml = `
        <div id="dropdown-citation-menu" class="dropdown-citation-content hidden">
            <ul>
                <li data-style="APA">APA</li>
                <li data-style="MLA">MLA</li>
            </ul>
        </div>
    `;
    $('body').append(dropdownCitationMenuHtml);
}

// Event listener for citation menu item clicks
$(document).on('click', '#dropdown-citation-menu li', function() {
    // Access the paperId stored on the details panel
    const paperId = $('.details-panel').attr('data-paper-id');

    if (paperId) {
        const paper = globalPapersData.find(p => p.id === paperId);

        if (paper) {
            const style = $(this).data('style');
            const citationText = generateCitation(paper, style);
            navigator.clipboard.writeText(citationText).then(() => {
            }).catch(err => {
                console.error('Error copying citation: ', err);
            });
        } else {
            console.error('Paper data not found for ID:', paperId);
        }
    } else {
        console.error('No paper ID found for citation generation.');
    }

    $('#dropdown-citation-menu').addClass('hidden'); // Hide dropdown after selection
});

// Function to generate the citation based on the selected style
function generateCitation(paper, style) {
    if (style === 'APA') {
        return `${paper.author} (${paper.year}). ${paper.title}. ${paper.source}. ${paper.doi}`;
    } else if (style === 'MLA') {
        return `${paper.author}. "${paper.title}." ${paper.source}, ${paper.year}. ${paper.doi}`;
    }
    return '';
}

// Global click listener to hide the dropdown
$(document).on('click', function() {
    $('#dropdown-citation-menu').addClass('hidden');
});

    function addRowClickEvent() {
        // Combine the selection of table rows and cards into a single NodeList using querySelectorAll
        const clickableElements = document.querySelectorAll('table tbody tr, .paper-card');

        clickableElements.forEach((element) => {
            // Attach single click event listener
            element.addEventListener('click', function() {
                const paperId = this.getAttribute('data-paper-id'); // Get paper ID from data attribute
                // Find the correct paper object based on paperId
                const paper = globalPapersData.find(p => p.id === paperId);
                if (paper) {
                    populateDetailsPanel(paper);
                    storeRecentlyViewedPaper(paper.id);
                }
            });

            // Attach double click event listener
            element.addEventListener('dblclick', function() {
                const paperId = this.getAttribute('data-paper-id');
                const paper = globalPapersData.find(p => p.id === paperId);
                if (paper) {
                    // Open the paper in a new tab on double click
                    const paperHtmlUrl = `papers/${paper.id}.html`;
                    location.href = paperHtmlUrl;
                }
            });
            
        });
    }

    // Helper function to sanitize the title to be used as a folder name (if necessary)
    function sanitizeTitle(title) {
        // Implement the sanitization logic here, for example:
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }




    function populateTable(globalPapersData) {
        const tbody = document.querySelector('table tbody');
        tbody.innerHTML = ''; // Clear existing rows

        globalPapersData.forEach(paper => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-paper-id', paper.id); // Store paper ID in a data attribute

            // Create a cell for the title, author, and year
            tr.innerHTML = `
            <td>${paper.title}</td>
            <td>${paper.author}</td>
            <td>${paper.year}</td>
        `;

            // Color input for changing the color of the circle without affecting the row color
            const colorInputCell = document.createElement('td');
            colorInputCell.classList.add('color-column'); // Assign class for color column
            const colorPickerContainer = document.createElement('div');
            colorPickerContainer.className = 'color-picker-container';

            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.className = 'color-input';
            colorInput.value = paper.label.color || '#ffffff'; // Default color or paper's label color
            console.log(paper.label.color);




            colorPickerContainer.appendChild(colorInput);
            colorInputCell.appendChild(colorPickerContainer);
            tr.appendChild(colorInputCell);

            // Text input for comments
            const commentInputCell = document.createElement('td');
            commentInputCell.classList.add('comment-column'); // Assign class for comment column
            const commentInput = document.createElement('input');
            commentInput.type = 'text';
            commentInput.placeholder = 'Add comment...';
            commentInput.className = 'comment-input';
            commentInput.value = paper.label.comments || ''; // Use existing comment if available

            // Here's the critical part: update globalPapersData when the comment changes
            commentInput.onchange = function() {
                paper.label.comments = commentInput.value; // Update the paper object in the globalPapersData array
            };
            console.log(paper.label.comments);
            commentInputCell.appendChild(commentInput);
            tr.appendChild(commentInputCell);

            // Add a cell for the options column with a non-breaking space
            const optionsCell = document.createElement('td');
            optionsCell.innerHTML = '&nbsp;'; // Non-breaking space
            optionsCell.classList.add('options-column'); // Optional: for targeting with CSS if needed
            tr.appendChild(optionsCell);
            // Inside your populateTable function, for each comment input setup:

            colorInput.addEventListener('input', function() {
                const paperId = this.closest('tr').getAttribute('data-paper-id');
                const paper = globalPapersData.find(p => p.id === paperId);
                if (paper) {
                    paper.label.color = this.value; // Update the paper object with the new color
                    colorPickerContainer.style.backgroundColor = this.value; // Optionally update the UI immediately
                    console.log(`Color updated for paper ${paperId}: ${this.value}`);
                }
            });
            storeRecentlyViewedPaper(paper.id); // Store the viewed paper ID


            commentInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault(); // Prevent the default action to stop from submitting a form if it's part of one
                    this.blur(); // Triggers the blur event, which we'll use to save the comment
                }
            });

            commentInput.addEventListener('blur', function() {
                const paperId = this.closest('tr').getAttribute('data-paper-id'); // Assuming each row has a data-paper-id attribute
                const paper = globalPapersData.find(p => p.id === paperId);
                if (paper) {
                    paper.label.comments = this.value; // Update the globalPapersData with the new comment
                    console.log(`Comment updated for paper ${paperId}: ${this.value}`);
                }
                // Optionally, you can save globalPapersData to local storage or server to persist changes



            });


            tbody.appendChild(tr);
        });
        // Reattach event listeners to all rows
        toggleColumnVisibility('color', columnVisibility.color);
        toggleColumnVisibility('comment', columnVisibility.comment);
        addRowClickEvent();
        console.log('Populating table with data:', globalPapersData);
    }




    function populateCards(globalPapersData) {
        console.log('populateCards called with papers:', globalPapersData);
        const cardsContainer = document.querySelector('.cards-container');
        cardsContainer.innerHTML = ''; // Clear existing cards

        globalPapersData.forEach(paper => {
            const card = document.createElement('div');
            card.className = 'paper-card';
            card.setAttribute('data-paper-id', paper.id); // Ensure each card has a data-paper-id attribute


            // Function to process the author string
            function processAuthorString(authorString) {
                let finalAuthor = authorString;
                // Check for multiple authors separated by commas
                if (authorString.includes(',')) {
                    const authors = authorString.split(',');
                    if (authors.length > 1) {
                        finalAuthor = authors[0].trim() + ' et al.';
                    }
                }
                // Check for multiple authors separated by " and "
                else if (authorString.toLowerCase().includes(' and ')) {
                    const authors = authorString.split(' and ');
                    if (authors.length > 1) {
                        finalAuthor = authors[0].trim() + '...';
                    }
                }
                return finalAuthor;
            }

            let displayedAuthor = processAuthorString(paper.author);
            const titleClass = paper.figures && paper.figures.length > 0 ? 'paper-title-with-figures' : 'paper-title-no-figures';
            const abstractClass = paper.figures && paper.figures.length > 0 ? 'paper-abstract-with-figures' : 'paper-abstract-no-figures';



            card.innerHTML = `
        ${paper.figures && paper.figures.length > 0 ? `<img src="${paper.figures[0]}" alt="Figure for ${paper.title}" class="paper-figure">` : ''}
        <div class="${titleClass}">${paper.title}</div>
        <div class="paper-author" title="${paper.author.replace(/,/g, ', ')}">${displayedAuthor}</div>
        <div class="paper-year">${paper.year}</div>
        <div class="${abstractClass}">${paper.abstract}</div>
        <!-- Add more paper details here -->
    `;
            // Optional: Add event listeners to cards for interactions
            cardsContainer.appendChild(card);
            console.log('Populating cards with papers:', globalPapersData);
        });
        addRowClickEvent();
        addSidebarClickEvents();

    }


    function toggleColumnVisibility(column, isVisible) {
        const columnCells = document.querySelectorAll(`.${column}-column`);
        columnCells.forEach(cell => {
            if (isVisible) {
                cell.classList.add('visible');
            } else {
                cell.classList.remove('visible');
            }
        });
    }

    // Function to add click event listeners to sidebar items
    function addSidebarClickEvents() {
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', event => handleSidebarClick(event));
          // populateTable(globalPapersData); // This will now also reattach click events
           //populateCards(globalPapersData); // This will now also reattach click events

        });
    }

    // Handle click events on sidebar items
    function handleSidebarClick(event) {
        const itemName = event.target.textContent.trim();

        switch (itemName) {
            case "Library":
                currentFilter = {
                    type: 'all',
                    value: 'True'
                };
                break;
            case 'Starred Papers':
                currentFilter = {
                    type: 'starred',
                    value: 'True'
                };
                break;
            case 'Archived Papers':
                currentFilter = {
                    type: 'archived',
                    value: 'True'
                };
                break;
            case 'Bookmarked Papers':
                currentFilter = {
                    type: 'bookmarked',
                    value: 'True'
                };
                break;
            case 'Thesis Project':
                currentFilter = {
                    type: 'thesis',
                    value: 'True'
                };
                break;
            case 'Project X':
                currentFilter = {
                    type: 'project-x',
                    value: 'True'
                };
                break;
            case 'Project Y':
                currentFilter = {
                    type: 'project-y',
                    value: 'True'
                };
                break;
            case 'Recently read papers':
                const recentlyViewedPapers = getRecentlyViewedPapers(globalPapersData);
                fetchRecentlyViewedPapers();
                addRowClickEvent(); // Reattach event listeners to the new rows
                return; // Prevent applyCurrentFilterAndPopulate from being called in this case

        }
    // Apply the filter and update the UI
    populateViewBasedOnCurrentFilter();
    //applyCurrentFilterAndPopulate();
    }

    function fetchRecentlyViewedPapers() {
        // Assuming getRecentlyViewedPapers is a function that returns an array of paper IDs
        const recentlyViewedPapers = getRecentlyViewedPapers(globalPapersData);
        currentFilter = { type: 'recentlyViewed', value: null }; // Set an appropriate filter if needed
        populateTable(recentlyViewedPapers); // Update the table with recently viewed papers
        addRowClickEvent(); // Reattach event listeners to the new table rows
    }

    function applyCurrentFilterAndPopulate() {
        console.log("Applying filter:", currentFilter);

        let papersToShow = currentFilter.type === 'all' ? globalPapersData : globalPapersData.filter(paper => paper[currentFilter.type] === currentFilter.value);

        console.log("Papers to show after filter:", papersToShow.length);

        populateTable(papersToShow);
        addRowClickEvent(papersToShow);
    }

    function populateViewBasedOnCurrentFilter() {
        const isTableVisible = !document.querySelector('.table-container').classList.contains('hidden');
        const isCardsVisible = !document.querySelector('.cards-container').classList.contains('hidden');
    
        let papersToShow = filterPapersBasedOnCurrentFilter();
    
        if (isTableVisible) {
            populateTable(papersToShow);
        } else if (isCardsVisible) {
            populateCards(papersToShow);
        }
    
        addRowClickEvent(); // Ensure event listeners are reattached regardless of the view
    }
    
    function filterPapersBasedOnCurrentFilter() {
        if (currentFilter.type === 'all') {
            return globalPapersData;
        } else if (currentFilter.type === 'recentlyViewed') {
            // Implement logic to filter recently viewed papers
            return getRecentlyViewedPapers(); // This needs to be defined properly
        } else {
            return globalPapersData.filter(paper => paper[currentFilter.type] === currentFilter.value);
        }
    }

    // Adjusting the fetch part in "Recently read papers" to ensure consistency
    // if (itemName === 'Recently read papers') {
    // Assuming you have a way to obtain recently viewed papers IDs
    //     let recentlyViewedPaperIds = getRecentlyViewedPaperIds(); // This function needs to be defined
    //     let recentlyViewedPapers = globalPapersData.filter(paper => recentlyViewedPaperIds.includes(paper.id));
    //     currentFilter = {type: 'recentlyViewed', value: 'True'};
    //     applyCurrentFilterAndPopulate(recentlyViewedPapers); // Apply and show recently viewed papers
    // }


    // Function to populate the details panel with the selected paper's information
    function populateDetailsPanel(paper) {
                // When a paper is selected
$('table tbody tr, .paper-card').click(function() {
    const paperId = $(this).data('id'); // Assuming each paper item has a data-id attribute
    $('.details-panel').data('paper-id', paperId); // Store the selected paper ID in the details panel
    // Your code to populate the details panel goes here
});
        const mainContent = document.querySelector('.main-content');
        const detailsPanel = document.querySelector('.details-panel');
        mainContent.classList.toggle('selected', !!paper);
        detailsPanel.classList.toggle('selected', !!paper);
        detailsPanel.setAttribute('data-paper-id', paper.id); // Store the current paper ID
        detailsPanel.innerHTML = '';



        if (paper) {
            const textContentDiv = document.createElement('div');
            textContentDiv.className = 'text-content';


            // Create a container for author and year
            const authorYearContainer = document.createElement('div');
            authorYearContainer.className = 'author-year-container';

            const authorSpan = document.createElement('span');
            authorSpan.className = 'author';
            authorSpan.textContent = paper.author;

            const yearSpan = document.createElement('span');
            yearSpan.className = 'year';
            yearSpan.textContent = paper.year;

            // Append author and year to the container
            authorYearContainer.appendChild(authorSpan);
            authorYearContainer.appendChild(yearSpan);
// Assuming generateCitation is a function that takes a paper object and a citation style,
// and returns a citation string.
function generateCitation(paper, style) {
    if (style === "APA") {
        return `${paper.author} (${paper.year}). ${paper.title}. ${paper.source}.`;
    } else if (style === "MLA") {
        return `${paper.author}. "${paper.title}." ${paper.source}, ${paper.year}.`;
    }
    // Add more styles as needed
}

function populateDetailsPanel(paper) {
    // Your existing setup code here...

    // Clear existing citation menu items to avoid duplications
    const dropdownCitationMenu = document.getElementById('dropdown-citation-menu');
    dropdownCitationMenu.innerHTML = '';

    // Dynamically create new menu items
    const citationStyles = ['APA', 'MLA']; // Extend this list as needed
    const ul = document.createElement('ul');
    citationStyles.forEach(style => {
        const li = document.createElement('li');
        li.textContent = style;
        li.setAttribute('data-style', style);
        li.addEventListener('click', () => {
            const citationText = generateCitation(paper, style);
            navigator.clipboard.writeText(citationText).then(() => {
                alert('Citation copied to clipboard');
            }, (err) => {
                console.error('Error copying citation: ', err);
            });
        });
        ul.appendChild(li);
    });
    dropdownCitationMenu.appendChild(ul);

    // Your existing code to append dropdownCitationMenu to the DOM or adjust its visibility...
}

            // Construct the inner HTML of the text content
            textContentDiv.innerHTML = `
            <h2>${paper.title}</h2><br>
        `;
// Ensure the citation button is created and appended
const citationButton = document.createElement('button');
citationButton.id = 'citation-button';
citationButton.innerHTML = `<img src="img/icons/export.webp" alt="Export">`;
citationButton.className = 'citation-button';
textContentDiv.appendChild(citationButton); // Assuming textContentDiv is already appended to the DOM


            textContentDiv.appendChild(authorYearContainer);
            textContentDiv.innerHTML += `<br><strong>Abstract:</strong> ${paper.abstract}`;

            const detailsContainerDiv = document.createElement('div');
            detailsContainerDiv.className = 'details-container';
            detailsContainerDiv.appendChild(textContentDiv);
            detailsPanel.appendChild(detailsContainerDiv);

            // Label for the active figure, positioned above the figure
            const figureLabelContainer = document.createElement('div');
            figureLabelContainer.className = 'figure-label-container';
            const figureLabel = document.createElement('p');
            // Initially set to the first figure's label or a placeholder
            figureLabel.textContent = 'Figure 1'; // Example initialization
            figureLabelContainer.appendChild(figureLabel);
            detailsContainerDiv.appendChild(figureLabelContainer);


            // After appending figureLabelContainer to the detailsContainerDiv

            // Hide the figureLabelContainer if there are no figures
            if (!paper.figures || paper.figures.length === 0) {
                figureLabelContainer.style.display = 'none';
            }

            // Active figure container
            const activeFigureContainer = document.createElement('div');
            activeFigureContainer.className = 'active-figure-container';
            detailsContainerDiv.appendChild(activeFigureContainer);

                        // Hide the figureLabelContainer if there are no figures
                        if (!paper.figures || paper.figures.length === 0) {
                            activeFigureContainer.style.display = 'none';
                        }

            // Set the first image as the active figure
            const activeFigure = document.createElement('img');
            activeFigure.src = paper.figures[0];
            activeFigure.className = 'active-figure';
            activeFigure.alt = ' ';
            activeFigureContainer.appendChild(activeFigure);

                        // Hide the figureLabelContainer if there are no figures
                        if (!paper.figures || paper.figures.length === 0) {
                            activeFigure.style.display = 'none';
                        }
            // Thumbnails container
            const thumbnailsContainer = document.createElement('div');
            thumbnailsContainer.className = 'thumbnails-container';
            detailsContainerDiv.appendChild(thumbnailsContainer);

            // Create thumbnails with labels
            paper.figures.forEach((fig, index) => {
                const thumbnailContainer = document.createElement('div');
                thumbnailContainer.className = 'thumbnail-container';
                thumbnailContainer.style.position = 'relative'; // Ensure the position is relative for absolute positioning of labels

                const thumb = document.createElement('img');
                thumb.src = fig;
                thumb.className = 'thumbnail';
                thumb.alt = `Figure ${index + 1}`;
                thumbnailContainer.appendChild(thumb);

                // Extract figure name from the filename for the thumbnail label
                const figureNameThumb = fig.substring(fig.lastIndexOf('/') + 1, fig.lastIndexOf('.')).replace(/_/g, ' ').replace(/fig/gi, 'fig ');
                const label = document.createElement('div');
                label.className = 'thumbnail-label';
                label.textContent = figureNameThumb; // Use the extracted figure name as the label
                thumbnailContainer.appendChild(label);

                thumbnailsContainer.appendChild(thumbnailContainer);

                thumb.addEventListener('click', () => {
                    // Update the active figure source and alt text on click
                    activeFigure.src = fig;
                    activeFigure.alt = `Active Figure ${index + 1}`;

                    // Extract the base figure number and subfigure part from the filename
                    // Assuming the filename format is something like "fig3a.jpg"
                    const baseFigureNumber = index + 1; // The base figure number
                    const subfigurePart = fig.match(/([a-zA-Z]+)\./) ? fig.match(/([a-zA-Z]+)\./)[1] : '';
                    const fullFigureLabel = fig.substring(fig.lastIndexOf('/') + 1, fig.lastIndexOf('.')).replace(/_/g, ' ').replace(/fig/gi, 'Figure ');

                    // Set the active figure label to include the base figure number and any subfigure part
                    const activeFigureLabel = ` ${fullFigureLabel}`;
                    figureLabel.textContent = activeFigureLabel; // Apply the updated label text

                    // Reset the 'active' class on all thumbnails and mark the clicked one as active
                    thumbnailsContainer.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                });
                // Correctly initialize column visibility based on the global state
                toggleColumnVisibility('color', columnVisibility.color);
                toggleColumnVisibility('comment', columnVisibility.comment);

                // Setup event listeners for toggles
                document.getElementById('show-color').addEventListener('change', function() {
                    toggleColumnVisibility('color', this.checked);
                });

                document.getElementById('show-comment').addEventListener('change', function() {
                    toggleColumnVisibility('comment', this.checked);
                });

                function generateCitation(paper, style) {
                    let citationText;
                    if (style === 'APA') {
                        citationText = `${paper.author} (${paper.year}). ${paper.title}. Retrieved from ${paper.url}`;
                    } else if (style === 'MLA') {
                        citationText = `${paper.author}. "${paper.title}." ${paper.source}, ${paper.year}, ${paper.url}.`;
                    } else {
                        citationText = '';
                    }
                    console.log(citationText); // Debugging line
                    return citationText;
                    
                }
                


            });
            
        }

        
    }
    // Function to setup the carousel
    function setupCarousel() {
        const figuresContainer = document.querySelector('.figures-container');
        if (!figuresContainer) return;

        const thumbnails = figuresContainer.querySelectorAll('.thumbnail');
        const activeFigure = figuresContainer.querySelector('.active-figure');

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                if (activeFigure) {
                    activeFigure.src = thumb.src;
                    activeFigure.alt = thumb.alt;
                }
            });
            
        });




    }
});
// Ensure the DOM is fully loaded before executing any code
document.addEventListener('DOMContentLoaded', function() {
    // Prevent the default context menu using regular JavaScript
    document.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        console.log('DOMContentLoaded event triggered');
    });

    // Ensure the DOM is fully loaded before executing any code
    $(document).ready(function() {
        // Prevent the default context menu using regular JavaScript
        $(document).on('contextmenu', function(event) {
            event.preventDefault(); // Prevent the default context menu
            console.log('Right-click detected on document'); // Debugging line
        });

        // Show the custom context menu on right-click for table rows
        $(document).on('contextmenu', 'table tbody tr', function(event) {
            event.preventDefault(); // Prevent the default context menu
            console.log('Right-click detected on table row'); // Debugging line

            // Use getAttribute to retrieve the paper ID
            const paperId = this.getAttribute('data-paper-id');
            console.log('Right-click detected, paper ID:', paperId);

            if (paperId) {
                const menuTop = event.pageY;
                const menuLeft = event.pageX;

                // Show the custom context menu and store the paper ID
                $('#customContextMenu')
                    .css({
                        top: menuTop,
                        left: menuLeft
                    })
                    .data('targetId', paperId)
                    .show();

                console.log('Custom context menu shown for ID:', paperId);
            }
        });

        // Show the custom context menu on right-click for paper cards
        $(document).on('contextmenu', '.paper-card', function(event) {
            event.preventDefault(); // Prevent the default context menu
            console.log('Right-click detected on paper card'); // Debugging line

            // Calculate the position of the context menu
            const top = event.pageY;
            const left = event.pageX;
            const paperId = $(this).data('paper-id');

            $('#customContextMenu')
                .css({
                    top,
                    left
                })
                .data('targetId', paperId) // Store the ID of the clicked paper/card
                .show();

            console.log('Custom context menu shown for ID:', paperId);
            console.log('Custom context menu shown for ID:', $('#customContextMenu').data('targetId'));
        });
        // Hide the custom context menu on click outside using jQuery
        $(document).on('click', function(event) {
            if (!$(event.target).closest('#customContextMenu').length) {
                $('#customContextMenu').hide();
            }
        });




        // Handle "Star" menu item click
        $('#addStar').on('click', function() {
            const targetId = $('#customContextMenu').data('targetId');
            const paper = globalPapersData.find(p => p.id === targetId);
            if (paper) {
                // Ensure the starred status is correctly toggled between "True" and "False" strings
                paper.starred = paper.starred === "True" ? "False" : "True";
                console.log(`Starred status toggled for paper with ID: ${targetId}. Starred: ${paper.starred}`);
            }

            $('#customContextMenu').hide(); // Hide the context menu
        });

        // Handle "Bookmark" menu item click
        $('#addBookmark').on('click', function() {
            const targetId = $('#customContextMenu').data('targetId');
            const paper = globalPapersData.find(p => p.id === targetId);
            if (paper) {
                // Ensure the starred status is correctly toggled between "True" and "False" strings
                paper.bookmarked = paper.bookmarked === "True" ? "False" : "True";
                console.log(`Bookmarked status toggled for paper with ID: ${targetId}. Bookmarked: ${paper.bookmarked}`);
            }

            $('#customContextMenu').hide(); // Hide the context menu
        });

        $('#addArchive').on('click', function() {
            const targetId = $('#customContextMenu').data('targetId');
            const paper = globalPapersData.find(p => p.id === targetId);
            if (paper) {
                // Ensure the starred status is correctly toggled between "True" and "False" strings
                paper.archived = paper.archived === "True" ? "False" : "True";
                console.log(`Archived status toggled for paper with ID: ${targetId}. Archived: ${paper.archived}`);
            }

            $('#customContextMenu').hide(); // Hide the context menu
        });

        $('#addThesis').on('click', function() {
            const targetId = $('#customContextMenu').data('targetId');
            const paper = globalPapersData.find(p => p.id === targetId);
            if (paper) {
                // Ensure the starred status is correctly toggled between "True" and "False" strings
                paper.thesis = paper.thesis === "True" ? "False" : "True";
                console.log(`Thesis status toggled for paper with ID: ${targetId}. Thesis: ${paper.thesis}`);
            }

            $('#customContextMenu').hide(); // Hide the context menu
        });

    });
    


});




function storeRecentlyViewedPaper(paperId) {
    let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    if (!recentlyViewed.includes(paperId)) {
        recentlyViewed.unshift(paperId); // Add to the beginning of the array
        if (recentlyViewed.length > 10) { // Limit to 10 papers
            recentlyViewed.pop(); // Remove the oldest paper
        }
        localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
        console.log('Stored recently viewed paper ID:', paperId);
        console.log('Updated recently viewed list:', recentlyViewed);
    }
}

function getRecentlyViewedPapers(globalPapersData) {
    let recentlyViewedIds = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    console.log('Recently viewed paper IDs:', recentlyViewedIds);
    console.log('Filtered recently viewed papers:', globalPapersData.filter(paper => recentlyViewedIds.includes(paper.id)));
    return globalPapersData.filter(paper => recentlyViewedIds.includes(paper.id.toString()));}

// Ensure that this setupCarousel function is called every time the details panel is updated


// Event listener for the search bar
document.querySelector('.search-container input').addEventListener('input', function(e) {
    filterTable(e.target.value);
});

function filterTable(query) {
    const rows = document.querySelectorAll('table tbody tr');
    const cards = document.querySelectorAll('.paper-card');
    const searchTerm = query.toLowerCase();

    rows.forEach(row => {
        const paperId = row.getAttribute('data-paper-id');
        const paper = globalPapersData.find(p => p.id === paperId);



        if (paper) {
            // Create an array of paper attributes to search within
            const searchContent = [
                paper.title,
                paper.author,
                paper.year,
                paper.abstract, // Include abstract if you want to search within it
                paper.label.comments, // Assuming each paper object has a comments property
            ].join(' ').toLowerCase();

            // Specific logic for sidebar item searches
            // Check for sidebar item searches and specific project or status attributes
            if (searchTerm === 'starred' && paper.starred === "True") {
                row.style.display = '';
            } else if (searchTerm === 'bookmarked' && paper.bookmarked === "True") {
                row.style.display = '';
            } else if (searchTerm === 'archived' && paper.archived === "True") {
                row.style.display = '';
            } else if (searchTerm === 'thesis' && paper.thesis === "True") {
                row.style.display = '';
            } else if (searchTerm === 'project-x' && paper['project-x'] === "True") {
                row.style.display = '';
            } else if (searchTerm === 'project-y' && paper['project-y'] === "True") {
                row.style.display = '';
            } else if (searchContent.includes(searchTerm)) {
                // Show rows that match the search term in text content
                row.style.display = '';
            } else {
                // Hide rows that do not match the search term
                row.style.display = 'none';
            }
        }
    });

    cards.forEach(card => {
        const paperId = card.getAttribute('data-paper-id');
        const paper = globalPapersData.find(p => p.id === paperId);

        if (paper) {
            // Create an array of paper attributes to search within
            const searchContent = [
                paper.title,
                paper.author,
                paper.year,
                paper.abstract, // Include abstract if you want to search within it
                paper.label.comments, // Assuming each paper object has a comments property
            ].join(' ').toLowerCase();

            // Specific logic for sidebar item searches
            // Check for sidebar item searches and specific project or status attributes
            if (searchTerm === 'starred' && paper.starred === "True") {
                card.style.display = '';
            } else if (searchTerm === 'bookmarked' && paper.bookmarked === "True") {
                card.style.display = '';
            } else if (searchTerm === 'archived' && paper.archived === "True") {
                card.style.display = '';
            } else if (searchTerm === 'thesis' && paper.thesis === "True") {
                card.style.display = '';
            } else if (searchTerm === 'project-x' && paper['project-x'] === "True") {
                card.style.display = '';
            } else if (searchTerm === 'project-y' && paper['project-y'] === "True") {
                card.style.display = '';
            } else if (searchContent.includes(searchTerm)) {
                // Show rows that match the search term in text content
                card.style.display = '';
            } else {
                // Hide rows that do not match the search term
                card.style.display = 'none';
            }

        }
    });







}