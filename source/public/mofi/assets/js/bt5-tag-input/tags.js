function initTags(tagsList = []) {
    let tagElements = {};

    [].forEach.call(document.querySelectorAll('.tags-input'), function (tagDiv) {
        var SplitChars = /[,;]/;
        tagDiv.contentEditable = "true";
        
        // Placeholder setup
        tagDiv.setAttribute('data-placeholder', tagDiv.dataset.placeholder);
        tagDiv.classList.add('empty'); // Initialize as empty if no tags
        
        tagElements[`${tagDiv.id}`] = tagDiv;

        // Helper function to check if the element is empty and needs placeholder
        function checkEmpty() {
            if (tagDiv.innerText.trim() === "") {
                tagDiv.classList.add('empty');
            } else {
                tagDiv.classList.remove('empty');
            }
        }

        // Call this initially and on input changes
        checkEmpty();

        // the place users type into
        let mainInput = document.createElement('span');
        mainInput.classList.add('main-input');
        let tags = [];

        // the place we store our actual data
        let hiddenInput = document.createElement('input');
        hiddenInput.type = "hidden";
        hiddenInput.name = tagDiv.dataset.name;     

        // in case people paste a newline or bad data
        tagDiv.addEventListener('paste', function(e) {
            mainInput.innerText = tagDiv.filterTag(mainInput.innerText);
            setTimeout(checkEmpty, 0); // Check after paste
        });

        tagDiv.addEventListener('input', function (e) {
            checkEmpty();  // Check if input is empty
            let enteredTags = mainInput.innerText.split(SplitChars);
            if (enteredTags.length > 1) {
                let inputLength = mainInput.innerText.length;
                let leftovers = inputLength > 0 && mainInput.innerText.charAt(inputLength-1).match(SplitChars) == null ? enteredTags.pop() : "";

                enteredTags.forEach(function (t) {
                    let filteredTag = tagDiv.filterTag(t);
                    if (filteredTag.length > 0) {
                        tagDiv.addTag(filteredTag);
                    }
                });
                mainInput.innerText = leftovers;
            }
        });

        tagDiv.addEventListener('keydown', function (e) {
            let keyCode = e.which || e.keyCode;
            if (keyCode === 8) {  // backspace
                if (tagDiv.getCaretIndex() == 0) {
                    if (tags.length > 0) {
                        tagDiv.removeTag(tags.length - 1);
                    }
                    e.preventDefault();
                }
            } else if (keyCode === 13) {  // enter
                e.preventDefault();
                let filteredTag = tagDiv.filterTag(mainInput.innerText);
                if (filteredTag.length > 0) {
                    tagDiv.addTag(filteredTag);
                    mainInput.innerText = "";
                }
            }
        });

        tagDiv.append(mainInput);
        tagDiv.append(hiddenInput);

        // Set tag color classes
        let tagColorClass = "text-bg-secondary";
        if (tagDiv.classList.contains('tag-bg-primary')) {
            tagColorClass = "text-bg-primary";
        } else if (tagDiv.classList.contains('tag-bg-success')) {
            tagColorClass = "text-bg-success";
        } // Add more if needed

        // Handling split characters from dataset
        if (tagDiv.dataset.splitchars != null) {
            SplitChars = new RegExp(tagDiv.dataset.splitchars);
        }

        // Helper functions
        tagDiv.getCaretIndex = function() {
            let element = mainInput;
            let position = 0;
            const isSupported = typeof window.getSelection !== "undefined";
            if (isSupported) {
              const selection = window.getSelection();
              if (selection.rangeCount !== 0) {
                const range = window.getSelection().getRangeAt(0);
                const preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                position = preCaretRange.toString().length;
              }
            }
            return position;
        }

        tagDiv.addTag = function (text) {
            let tag = {
                text: text,
                element: document.createElement('span'),
            };

            tag.element.classList.add('tag');
            tag.element.classList.add('badge');
            tag.element.classList.add(tagColorClass);
            tag.element.contentEditable = "false";
            tag.element.textContent = tag.text;

            // Bootstrap X icon
            tag.element.innerHTML +=('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewbox="0 0 16 16" class="close bi bi-x-lg"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path></svg>');
            tag.element.lastChild.addEventListener('click', function () {
                tagDiv.removeTag(tags.indexOf(tag));
                checkEmpty(); // Check after tag is removed
            });

            tags.push(tag);

            tagDiv.insertBefore(tag.element, mainInput);
            tagDiv.refreshTags();
            checkEmpty();

            return tagDiv;
        };

        tagDiv.removeTag = function (index) {
            let tag = tags[index];
            tags.splice(index, 1);
            tag.element.remove();
            tagDiv.refreshTags();
            checkEmpty(); // Check after tag removal
            return tagDiv;
        };

        tagDiv.resetTags = function () {
            for(let tag of tags) {
                tagDiv.removeChild(tag.element);
            }
            tags = [];
            tagDiv.refreshTags();
            checkEmpty();
            return tagDiv;
        };

        tagDiv.refreshTags = function () {
            let tagsList = [];
            tags.forEach(function (t) {
                tagsList.push(t.text);
            });
            hiddenInput.value = tagsList.join(',');
            return tagDiv;
        };

        tagDiv.filterTag = function (tag) {
            return tag.replaceAll(/[\n\t]/g, '').trim();
        };

        tagDiv.getValue = function() {
            return hiddenInput.value;
        }

        // Load initial tags if provided
        for (let tag in tagsList) {
            tagDiv.addTag(tagsList[tag]);
        }

    });

    tagElements.reset = function () {
        for (let tagElmt in tagElements) {
            if (tagElmt == 'reset') { continue; }
            tagElements[tagElmt].resetTags();
        }
    };

    return tagElements;
}
