function copyLink() {
    const copyText = document.getElementById("sharelink");
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */
    document.execCommand("copy");
    // req.flash('success', 'Copied'   );
    // alert("Copied");
    document.getElementById('copied').style.display = "block";
}

function closebutton() {
    const close = document.getElementById("copied");
    if (close.style.display === "none") {
        close.style.display = "block";
    } else {
        close.style.display = "none";
    }
}