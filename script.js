/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  document.getElementById("coffee_counter").innerText = coffeeQty;
}

function clickCoffee(data) {
  data.coffee++;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  producers.forEach((producer) => {
    if (coffeeCount >= producer.price / 2) {
      producer.unlocked = true;
    }
  });
}

function getUnlockedProducers(data) {
  producerArray = data.producers.slice();
  return producerArray.filter((element) => element.unlocked);
}

function makeDisplayNameFromId(id) {
  let titleCaseString = "";
  titleCaseString += id[0].toUpperCase();
  for (let i = 1; i < id.length; i++) {
    if (id[i] === "_") {
      titleCaseString += " ";
      i++;
      titleCaseString += id[i].toUpperCase();
      continue;
    }
    titleCaseString += id[i];
  }
  return titleCaseString;
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "producer";
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  unlockProducers(data.producers, data.coffee);
  const producerContainer = document.getElementById("producer_container");
  const arrayOfProducers = getUnlockedProducers(data);
  deleteAllChildNodes(producerContainer);
  for (let producer of arrayOfProducers) {
    producerContainer.appendChild(makeProducerDiv(producer));
  }
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  for (let producer of data.producers) {
    if (producer.id === producerId) {
      return producer;
    }
  }
}

function canAffordProducer(data, producerId) {
  let currentProducer = getProducerById(data, producerId);
  if (data.coffee >= currentProducer.price) {
    return true;
  }
  return false;
}

function updateCPSView(cps) {
  const cpsElement = document.getElementById("cps");
  cpsElement.innerText = cps;
}

function updatePrice(oldPrice) {
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  if (canAffordProducer(data, producerId)) {
    const currentProducer = getProducerById(data, producerId);
    currentProducer.qty++;
    data.coffee -= currentProducer.price;
    currentProducer.price = updatePrice(currentProducer.price);
    data.totalCPS += currentProducer.cps;
    return true;
  }
  return false;
}

function buyButtonClick(event, data) {
  if (event.target.tagName === "BUTTON") {
    const producerId = event.target.id.slice(4);
    if (attemptToBuyProducer(data, producerId)) {
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);
    } else {
      window.alert("Not enough coffee!");
    }
  }
}

function tick(data) {
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
  updateCPSView(data.totalCPS);
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === "undefined") {
  // Get starting data from the window object
  // (This comes from data.js)
  console.log(JSON.parse(localStorage.getItem("data")), window.data);
  let data;
  if (
    JSON.parse(localStorage.getItem("data")) !== window.data &&
    JSON.parse(localStorage.getItem("data"))
  ) {
    data = JSON.parse(localStorage.getItem("data"));
  } else {
    data = window.data;
  }

  console.log(JSON.parse(localStorage.getItem("data")), window.data);
  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById("big_coffee");
  bigCoffee.addEventListener("click", () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById("producer_container");
  producerContainer.addEventListener("click", (event) => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
  setInterval(() => localStorage.setItem("data", JSON.stringify(data)), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}
