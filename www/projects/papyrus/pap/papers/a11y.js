

    
    //Aid Toggler
    $(".js-aid").on("click", function (e) {
        event.stopPropagation();

        var $this = $(this);
        var aid = $this.attr("data-aid")

        $(".js-aid").removeClass("on");
        $this.addClass("on");
        $("html").removeClass(function (index, className) {
            return (className.match(/(^|\s)aid--\S+/g) || []).join(' ');
        }).addClass(aid);

        e.preventDefault();
    });


    // Dropdown Toggler
    $(".dropdown-toggler").on("click", function (e) {
        event.stopPropagation();

        var $this = $(this);

        if ($this.parent().hasClass("on")) {
            $this.parent().removeClass("on");
        } else {
            $(".dropdown.on").removeClass("on");
            $this.parent().addClass("on");
        }

        e.preventDefault();
    });

    $(window).click(function () {
        $(".dropdown.on").removeClass("on");
    });

    $(".js-toc-toggle").on("click", function (e) {
        $(".paper__nav").addClass("on");
        e.preventDefault();
    });

    $(".paper__nav").on("click", function () {
        $(".paper__nav").removeClass("on");
    });

    $("input[name='file']").change(
        function () {
            $("button[name='uploadButton']").attr('disabled', !$(this).val());
            $("button[name='uploadButton']").attr('aria-disabled', !$(this).val());
        }
    );

    $("form").on("submit", function () {
        $("button[name='uploadButton']").attr("disabled", true);
        $("button[name='uploadButton']").attr("aria-disabled", true);
        $("button[name='uploadButton']").html("Processing...");
    });


window.addEventListener("hashchange", function () {
    window.scrollTo(window.scrollX, window.scrollY - 100);
});

function goBack() {
    window.history.back();
  }
  

    // Prevent the default context menu and show the custom context menu
    $(document).on('contextmenu', function(e) {
        e.preventDefault(); // Prevent default right-click menu

        $('#customContextMenu').css({
            display: 'block',
            left: e.pageX + 'px',
            top: e.pageY + 'px'
        });
    });

    // Hide custom context menu if the click is outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('#customContextMenu').length) {
            $('#customContextMenu').hide();
        }
    });

    // Highlight text functionality
    $(document).on('click', '#highlightText', function() {
        let selection = window.getSelection();
        if (!selection.isCollapsed) {
            let range = selection.getRangeAt(0);
            let span = document.createElement('span');
            $(span).addClass('text-highlight').css('backgroundColor', 'yellow');
            range.surroundContents(span);

            // Deselect text and hide menu
            selection.removeAllRanges();
            $('#customContextMenu').hide();
        }
    });

    $(document).ready(function () {
        var rightClickX, rightClickY;
    
        $(document).on('contextmenu', function(e) {
            e.preventDefault(); // Prevent default context menu
    
            rightClickX = e.pageX;
            rightClickY = e.pageY;
    
            // Assuming you already have logic to show custom context menu
            // Add here if needed
        });
    
        // Assuming 'Add Comment' option triggers this
        $(document).on('click', '#addComment', function() {
            // Remove existing input if any
            $('.comment-input-form').remove();
    
            // Create and append a floating input form
            var inputForm = $('<div class="comment-input-form" style="position: absolute; left:' + rightClickX + 'px; top:' + rightClickY + 'px;"><input type="text" id="floatingCommentInput" placeholder="Enter your comment..."><button id="submitFloatingComment">Submit</button></div>');
            $('#dynamicContentArea').append(inputForm);
            $('#floatingCommentInput').focus(); // Focus on the input field immediately
        });

            // Handler for "Add Comment" option from the custom context menu
    $(document).on('click', '#addComment', function() {
        // Hide the custom context menu
        $('#customContextMenu').css('display', 'none');

        // Remove existing input form if it exists
        $('.comment-input-form').remove();

        // Create and append a floating input form for the comment
        var inputForm = $('<div class="comment-input-form" style="position: absolute; left:' + rightClickX + 'px; top:' + rightClickY + 'px;"><input type="text" id="floatingCommentInput" placeholder="Enter your comment..."><button id="submitFloatingComment">Submit</button></div>');
        $('#dynamicContentArea').append(inputForm);

        // Automatically focus on the new input
        $('#floatingCommentInput').focus();
    });
    
        // Handle submission of the floating comment input
        $(document).on('click', '#submitFloatingComment', function() {
            var commentText = $('#floatingCommentInput').val().trim();
            if (commentText) {
                // Create and display the comment
                var newComment = $('<div class="comment">' + commentText + '</div>').css({
                    position: 'absolute',
                    left: rightClickX + 'px',
                    top: rightClickY + 'px'
                });
    
                $('#dynamicContentArea').append(newComment);
                $('.comment-input-form').remove(); // Remove the input form after submission
            }
        });
    });
    

    // Double-click to remove highlight
    $(document).on('dblclick', '.text-highlight', function() {
        let $span = $(this);
        $span.replaceWith($span.text()); // Replace span with its text, effectively removing the highlight
    });

    $(document).on('click', '#addSticker', function(e) {
        e.preventDefault(); // Prevent the menu from closing
    
        // Create a placeholder sticker at the click position
        var placeholderSticker = $('<div></div>').addClass('sticker placeholder').css({
            position: 'absolute',
            left: $('#customContextMenu').css('left'),
            top: $('#customContextMenu').css('top'),
            width: '50px',
            height: '50px',
            backgroundColor: 'rgba(0,0,0,0.1)', // Semi-transparent for placeholder
            borderRadius: '50%',
            border: '2px dashed #ccc' // Dashed border for the placeholder
        }).appendTo('body');
    
        // Dynamically create a color input and trigger it
        var colorInput = $('<input type="color" id="stickerColorPicker" style="display:none;">').appendTo('body');
        colorInput.on('change', function() {
            // Update the placeholder sticker with the selected color
            placeholderSticker.css({
                backgroundColor: $(this).val(),
                border: 'none' // Remove dashed border when color is selected
            }).removeClass('placeholder'); // Optionally remove placeholder class
    
            $('#customContextMenu').hide(); // Hide the menu
            $(this).remove(); // Remove the color input after selection
        });
    
        colorInput.trigger('click'); // Open the color picker dialog
    });
            
    function toggleNav() {
        console.log('Toggling .paper__nav visibility');
        $('.paper__nav').toggleClass('off');
    }
    
    $(document).ready(function () {
        console.log('Document ready, attaching event handler');
        $('.nav-toggle-btn').on('click', function(e) {
            e.preventDefault();
            console.log('Toggle button clicked');
            toggleNav();
        });
    });