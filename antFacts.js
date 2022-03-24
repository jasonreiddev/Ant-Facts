import fetch from "node-fetch";

fetch("https://www.reddit.com/r/todayilearned/new.json")
  .then((response) => response.json())
  .then(async (realData) => {
    const realFacts = realData.data.children;
    const facts = [];
    facts.push(trimTIL(realFacts[0].data.title));
    facts.push(trimTIL(realFacts[1].data.title));
    facts.push(trimTIL(realFacts[2].data.title));

    const response = await fetch("https://www.reddit.com/r/FakeFacts/new.json");
    const fakeData = await response.json();
    const fakeFact = fakeData.data.children[0].data.title;
    facts.push(fakeFact);

    for (var j, i = facts.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      [facts[i], facts[j]] = [facts[j], facts[i]];
    }

    console.log("Todays facts are...");
    facts.forEach((fact, index) => {
      console.log(`${index + 1}. ${fact}`);
    });
    console.log("Spot the false fact!");

    console.warn(
      `The fake fact is: ${facts.findIndex((rank) => rank === fakeFact) + 1}`
    );
  });

function trimTIL(fact) {
  fact = fact.replace("TIL: that ", "");
  fact = fact.replace("TIL: ", "");
  fact = fact.replace("TIL that ", "");
  fact = fact.replace("TIL ", "");
  fact = fact.charAt(0).toUpperCase() + fact.slice(1);
  return fact;
}
