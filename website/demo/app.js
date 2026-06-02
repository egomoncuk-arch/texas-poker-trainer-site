const hands = [
  {
    playerCards: ["A♠", "K♠"],
    communityCards: ["Q♠", "J♠", "4♦"],
    situation: "У вас две старшие карты, натсовое флеш-дро и дро на бродвей-стрит на флопе.",
    recommended: "Играть",
    explanation: "Сильные дро с несколькими путями усиления — хороший учебный пример для продолжения против виртуального дилера.",
    value: "+72% тренировочной уверенности"
  },
  {
    playerCards: ["7♣", "2♦"],
    communityCards: ["K♥", "J♠", "9♣"],
    situation: "Вы не попали в доску со слабой несвязанной стартовой рукой и без значимого дро.",
    recommended: "Пас",
    explanation: "Низкая рука без пары и полезного дро — дисциплинированный пас в этом упрощённом сценарии.",
    value: "-64% тренировочной ценности при игре"
  },
  {
    playerCards: ["10♥", "10♣"],
    communityCards: ["10♦", "6♠", "2♥"],
    situation: "На сухой доске вы собрали сет и тренируете решение на добор ценности.",
    recommended: "Играть",
    explanation: "Сет — готовая сильная комбинация с высоким потенциалом на вскрытии, поэтому тренажёр рекомендует продолжать.",
    value: "+88% тренировочной уверенности"
  },
  {
    playerCards: ["A♦", "5♦"],
    communityCards: ["K♦", "8♦", "3♣"],
    situation: "У вас натсовое флеш-дро с одной старшей картой, но готовой пары пока нет.",
    recommended: "Играть",
    explanation: "Натсовое флеш-дро подходит для продолжения в тренировке, когда урок сфокусирован на эквити дро.",
    value: "+54% тренировочной уверенности"
  },
  {
    playerCards: ["9♠", "4♥"],
    communityCards: ["A♣", "K♠", "8♦"],
    situation: "Доска с высокими картами, а у вас нет пары, старших карт и реалистичного дро.",
    recommended: "Пас",
    explanation: "Это простой пример контроля риска: не стоит тянуть слабую руку с низким эквити в тренировке на виртуальных фишках.",
    value: "-58% тренировочной ценности при игре"
  }
];

let currentHandIndex = 0;
let matchedChoices = 0;

const trainerCard = document.querySelector(".trainer-card");
const completionCard = document.querySelector("#completion");
const progressLabel = document.querySelector("#hand-progress");
const scoreLabel = document.querySelector("#score-label");
const playerCards = document.querySelector("#player-cards");
const communityCards = document.querySelector("#community-cards");
const situationTitle = document.querySelector("#hand-title");
const situationText = document.querySelector("#situation-text");
const choiceButtons = document.querySelector("#choice-buttons");
const feedback = document.querySelector("#feedback");
const nextButton = document.querySelector("#next-hand");
const completionScore = document.querySelector("#completion-score");

function isRedCard(card) {
  return card.includes("♥") || card.includes("♦");
}

function splitCard(card) {
  const suit = card.slice(-1);
  const rank = card.slice(0, -1);

  return { rank, suit };
}

function createCardElement(card) {
  const { rank, suit } = splitCard(card);
  const cardElement = document.createElement("span");
  const rankElement = document.createElement("span");
  const suitElement = document.createElement("span");
  const cornerElement = document.createElement("span");

  cardElement.className = `card${isRedCard(card) ? " red" : ""}`;
  cardElement.setAttribute("aria-label", card);
  rankElement.className = "card-rank";
  rankElement.textContent = rank;
  suitElement.className = "card-suit";
  suitElement.textContent = suit;
  cornerElement.className = "card-corner";
  cornerElement.textContent = `${rank}${suit}`;

  cardElement.append(rankElement, suitElement, cornerElement);

  return cardElement;
}

function renderCards(container, cards) {
  container.replaceChildren(...cards.map(createCardElement));
}

function getMatchLabel(count) {
  if (count === 1) {
    return "1 совпадение";
  }

  if (count > 1 && count < 5) {
    return `${count} совпадения`;
  }

  return `${count} совпадений`;
}

function createFeedbackRow(label, value) {
  const term = document.createElement("dt");
  const definition = document.createElement("dd");

  term.textContent = label;
  definition.textContent = value;

  return [term, definition];
}

function renderHand() {
  const hand = hands[currentHandIndex];

  progressLabel.textContent = `Раздача ${currentHandIndex + 1} из ${hands.length}`;
  scoreLabel.textContent = getMatchLabel(matchedChoices);
  situationTitle.textContent = `Раздача ${currentHandIndex + 1}: решение на флопе`;
  situationText.textContent = hand.situation;
  renderCards(playerCards, hand.playerCards);
  renderCards(communityCards, hand.communityCards);

  feedback.hidden = true;
  feedback.replaceChildren();
  nextButton.hidden = true;
  choiceButtons.hidden = false;
}

function showFeedback(choice) {
  const hand = hands[currentHandIndex];
  const matched = choice === hand.recommended;
  const title = document.createElement("h3");
  const resultList = document.createElement("dl");
  const explanation = document.createElement("p");
  const value = document.createElement("p");
  const valueLabel = document.createTextNode("EV/оценка: ");
  const valueStrong = document.createElement("strong");

  if (matched) {
    matchedChoices += 1;
  }

  scoreLabel.textContent = getMatchLabel(matchedChoices);
  choiceButtons.hidden = true;
  feedback.hidden = false;
  feedback.replaceChildren();

  title.className = matched ? "matched" : "missed";
  title.textContent = matched ? "Верно: совпадает с рекомендацией" : "Разбор: лучше выбрать иначе";
  resultList.append(
    ...createFeedbackRow("Ваш ход", choice),
    ...createFeedbackRow("Тренажёр", hand.recommended)
  );
  explanation.textContent = hand.explanation;
  valueStrong.textContent = hand.value;
  value.append(valueLabel, valueStrong);

  feedback.append(title, resultList, explanation, value);
  nextButton.textContent = currentHandIndex === hands.length - 1 ? "Завершить демо" : "Следующая раздача";
  nextButton.hidden = false;
}

function showCompletion() {
  trainerCard.hidden = true;
  completionCard.hidden = false;
  completionScore.textContent = `Вы совпали с ${matchedChoices} из ${hands.length} рекомендованных тренировочных решений.`;
}

choiceButtons.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-choice]");

  if (!button) {
    return;
  }

  showFeedback(button.dataset.choice);
});

nextButton.addEventListener("click", () => {
  currentHandIndex += 1;

  if (currentHandIndex >= hands.length) {
    showCompletion();
    return;
  }

  renderHand();
});

renderHand();
