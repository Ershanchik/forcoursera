'use strict';

const recommendationForm = document.getElementById('recommendation-form');
const recommendationList = document.getElementById('recommendations-list');
const popupBackdrop = document.getElementById('popup-backdrop');
const popupClose = document.getElementById('popup-close');
const recommendationText = document.getElementById('recommendation-text');
const recommendationName = document.getElementById('recommendation-name');

// Create elements instead of using innerHTML for user-provided text.
function addRecommendation(message, author = 'Portfolio visitor') {
  const card = document.createElement('blockquote');
  card.className = 'recommendation-card';
  const quote = document.createElement('span');
  quote.className = 'quote-mark';
  quote.setAttribute('aria-hidden', 'true');
  quote.textContent = '“';
  const paragraph = document.createElement('p');
  paragraph.textContent = message;
  const footer = document.createElement('footer');
  footer.textContent = `— ${author}`;
  card.append(quote, paragraph, footer);
  recommendationList.appendChild(card);
}

function showPopup() {
  popupBackdrop.hidden = false;
  popupClose.focus();
}

function hidePopup() {
  popupBackdrop.hidden = true;
  recommendationText.focus();
}

// Restore recommendations added during earlier visits to this browser.
let savedRecommendations = [];
try {
  const saved = JSON.parse(localStorage.getItem('portfolioRecommendations') || '[]');
  if (Array.isArray(saved)) {
    savedRecommendations = saved.filter(item => item && typeof item.message === 'string' && typeof item.author === 'string');
    savedRecommendations.forEach(item => addRecommendation(item.message, item.author));
  }
} catch (error) {
  console.warn('Saved recommendations could not be loaded.');
}

recommendationForm.addEventListener('submit', event => {
  event.preventDefault();
  const message = recommendationText.value.trim();
  const author = recommendationName.value.trim() || 'Portfolio visitor';

  // Do not add a recommendation or display a popup for invalid input.
  if (message.length < 5 || message.length > 500 || author.length > 60) {
    recommendationText.setCustomValidity('Please enter a recommendation between 5 and 500 characters.');
    recommendationText.reportValidity();
    return;
  }
  recommendationText.setCustomValidity('');
  addRecommendation(message, author);
  savedRecommendations.push({ message, author });
  try { localStorage.setItem('portfolioRecommendations', JSON.stringify(savedRecommendations)); }
  catch (error) { console.warn('Recommendation saved on page only.'); }
  recommendationForm.reset();
  showPopup(); // Only shown after a valid, successfully added recommendation.
});

recommendationText.addEventListener('input', () => recommendationText.setCustomValidity(''));
popupClose.addEventListener('click', hidePopup);
popupBackdrop.addEventListener('click', event => {
  if (event.target === popupBackdrop) hidePopup();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !popupBackdrop.hidden) hidePopup();
});