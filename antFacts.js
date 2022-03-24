import fetch from "node-fetch";

fetch("https://www.reddit.com/r/todayilearned/new.json")
  .then((response) => response.json())
  .then(async (fakeData) => {
    const fakeFacts = fakeData.data.children;
    const facts = [];
    facts.push(trimTIL(fakeFacts[0].data.title));
    facts.push(trimTIL(fakeFacts[1].data.title));
    facts.push(trimTIL(fakeFacts[2].data.title));

    const response = await fetch("https://www.reddit.com/r/FakeFacts/new.json");
    const realData = await response.json();
    facts.push(realData.data.children[0].data.title);

    for (var j, i = facts.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      [facts[i], facts[j]] = [facts[j], facts[i]];
    }

    console.log("Todays facts are...");
    facts.forEach((fact, index) => {
      console.log(`${index + 1}. ${fact}`);
    });
  });

function trimTIL(fact) {
  fact = fact.replace("TIL: that ", "");
  fact = fact.replace("TIL: ", "");
  fact = fact.replace("TIL that ", "");
  fact = fact.replace("TIL ", "");
  fact = fact.charAt(0).toUpperCase() + fact.slice(1);
  return fact;
}
