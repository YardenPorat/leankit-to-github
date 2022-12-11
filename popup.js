const userInput = document.querySelector('input#user');
const githubInput = document.querySelector('input#github');

chrome.storage.sync.get(['leanKitUser', 'gitHubRepo'], function ({ leanKitUser, gitHubRepo }) {
    userInput.value = leanKitUser || '';
    githubInput.value = gitHubRepo || '';
});

userInput.addEventListener('input', (e) => {
    const user = e.target.value;

    chrome.storage.sync.set({ leanKitUser: user }, function () {
        // eslint-disable-next-line no-console
        console.log('Username saved');
    });
});

githubInput.addEventListener('input', (e) => {
    const repo = e.target.value;

    chrome.storage.sync.set({ gitHubRepo: repo }, function () {
        // eslint-disable-next-line no-console
        console.log('Repo saved');
    });
});
