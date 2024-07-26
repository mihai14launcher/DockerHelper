// Blocare DevTools
document.addEventListener('keydown', function(event) {
    if ((event.ctrlKey && event.shiftKey && event.key === 'I') || event.key === 'F12') {
        event.preventDefault();
        alert('DevTools is disabled on this site.');
        return false;
    }
});

document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

// Blocare descărcare și creare fișier fals
document.addEventListener('click', function(event) {
    if (event.target.tagName === 'A' && event.target.getAttribute('download') !== null) {
        event.preventDefault();
        alert('Downloading is disabled on this site.');
        createFakeFile();
        return false;
    }
});

function createFakeFile() {
    const fakeFileContent = "Nice try!";
    const blob = new Blob([fakeFileContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'nice-try-f##k-your-mom.nothing';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Detectează încercările de descărcare a site-ului
const originalFetch = window.fetch;
window.fetch = function() {
    return originalFetch.apply(this, arguments).then(response => {
        if (response.url.includes('download')) {
            createFakeFile();
            throw new Error('Downloading is disabled on this site.');
        }
        return response;
    });
};

const originalXhrOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function() {
    this.addEventListener('readystatechange', function() {
        if (this.readyState === 4 && this.responseURL.includes('download')) {
            createFakeFile();
            throw new Error('Downloading is disabled on this site.');
        }
    });
    originalXhrOpen.apply(this, arguments);
};
