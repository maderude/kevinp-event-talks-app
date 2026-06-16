document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refresh-btn');
    const releasesList = document.getElementById('releases-list');

    // Fetch releases and update UI
    async function fetchReleases() {
        // Show loading state
        refreshBtn.classList.add('loading');
        releasesList.innerHTML = `
            <div class="state-container">
                <div class="spinner" style="display: inline-block; width: 40px; height: 40px; border-width: 3px;"></div>
                <p>Fetching latest BigQuery release notes...</p>
            </div>
        `;

        try {
            const response = await fetch('/api/releases');
            const result = await response.json();

            if (result.success && result.data.length > 0) {
                renderReleases(result.data);
            } else {
                renderError(result.error || 'No release notes found.');
            }
        } catch (error) {
            renderError('Unable to load release notes. Please check your network connection.');
        } finally {
            refreshBtn.classList.remove('loading');
        }
    }

    // Render release cards
    function renderReleases(releases) {
        releasesList.innerHTML = '';
        
        releases.forEach(release => {
            const card = document.createElement('div');
            card.className = 'release-card';

            // Extract plain text for tweeting (truncate if necessary)
            const plainText = stripHtml(release.content);
            const truncatedText = plainText.length > 180 ? plainText.substring(0, 180) + '...' : plainText;
            const tweetText = `BigQuery Release - ${release.title}: ${truncatedText}`;
            
            card.innerHTML = `
                <div class="release-meta">
                    <span class="release-date">${release.date}</span>
                </div>
                <h2 class="release-title">${release.title}</h2>
                <div class="release-body">${release.content}</div>
                <div class="card-actions">
                    <button class="btn-tweet" data-tweet-text="${encodeURIComponent(tweetText)}" data-link="${encodeURIComponent(release.link || window.location.href)}">
                        <svg viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        Tweet
                    </button>
                </div>
            `;
            releasesList.appendChild(card);
        });

        // Add event listeners to Tweet buttons
        document.querySelectorAll('.btn-tweet').forEach(button => {
            button.addEventListener('click', (e) => {
                const target = e.currentTarget;
                const text = target.getAttribute('data-tweet-text');
                const url = target.getAttribute('data-link');
                const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                
                // Open standard small popup window
                window.open(twitterUrl, 'twitter-share', 'width=550,height=350,personalbar=0,toolbar=0,scrollbars=1,resizable=1');
            });
        });
    }

    // Render error state
    function renderError(message) {
        releasesList.innerHTML = `
            <div class="state-container">
                <p style="color: #ef4444;">⚠️ ${message}</p>
                <button class="btn" style="margin: 1.5rem auto 0; background: #ef4444;" onclick="location.reload()">Try Again</button>
            </div>
        `;
    }

    // Helper to strip HTML for the tweet payload
    function stripHtml(htmlStr) {
        const doc = new DOMParser().parseFromString(htmlStr, 'text/html');
        return doc.body.textContent || "";
    }

    // Initial load
    refreshBtn.addEventListener('click', fetchReleases);
    fetchReleases();
});
