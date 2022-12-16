const LINK_CLASS = 'github-link';

function start() {
    if (window.location.hostname === 'core3.leankit.com') {
        window.addEventListener('load', addButtons);
    }
}

const BUTTONS = [
    { text: 'Add links', action: addGithubLinks },
    { text: 'Focus', action: focusOnTitle },
];
const addButtons = () => {
    for (const { text, action } of BUTTONS) {
        const buttonElement = document.createElement('button');
        buttonElement.innerText = text;
        buttonElement.onclick = action;
        document.querySelector('.toolbar-wellContainer').appendChild(buttonElement);
    }
};

function focusOnTitle() {
    chrome.storage.sync.get(
        ['leanKitUser'],
        function ({ leanKitUser = 'PROCESSING --> EXECUTION' }) {
            const selector = `[title*="${leanKitUser}"]`;

            const sprint = document.querySelector(selector);

            if (!sprint) {
                alert(`Could not find ${leanKitUser} in the board`);
                return;
            }

            sprint.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
    );
}

function addGithubLinks() {
    document.querySelectorAll(`.${LINK_CLASS}`).forEach((el) => el.remove());

    const cards = Array.from(document.querySelectorAll('div.card-text'));
    if (!cards.length) {
        return;
    }

    chrome.storage.sync.get(['gitHubRepo'], function ({ gitHubRepo }) {
        if (!gitHubRepo) {
            return;
        }
        for (const card of cards) {
            const matches = card.textContent?.match(/#\d\d\d\d\d*/g);

            if (!matches || !matches.length) {
                continue;
            }

            for (const match of matches) {
                const githubLink = document.createElement('a');
                githubLink.innerText = match;
                githubLink.href = `https://github.com/${gitHubRepo}/issues/${match.slice(1)}`;
                githubLink.target = '_blank';
                githubLink.classList.add(
                    'cardIcons-icon',
                    'cardIcons-icon--cardSize',
                    'is-maxWidth',
                    'github-link'
                );

                githubLink.addEventListener('mousedown', (e) => {
                    e.stopPropagation();
                });
                githubLink.onmouseover = (e) => {
                    e.target.style.color = 'red';
                };
                githubLink.onmouseleave = (e) => {
                    e.target.style.color = 'white';
                };
                githubLink.style.backgroundColor = 'darkblue';

                let cardIcons = card.parentElement.parentElement.querySelector('.cardIcons');
                if (!cardIcons) {
                    cardIcons = document.createElement('div');
                    cardIcons.classList.add('cardIcons');
                    card.closest('.card-background').appendChild(cardIcons);
                }
                cardIcons.appendChild(githubLink);
            }
        }
    });
}

new MutationObserver((mutationList) => {
    if (
        mutationList.some((m) => {
            return (
                m.addedNodes.length > 0 &&
                Array.from(m.addedNodes).some((node) =>
                    node.classList?.contains('laneCardContainer-card')
                )
            );
        })
    ) {
        addGithubLinks();
    }
}).observe(document, { subtree: true, childList: true });

start();
