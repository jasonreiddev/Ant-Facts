import fetch from "node-fetch";
import cheerio from "cheerio";
import dotenv from "dotenv";
dotenv.config();
const date = new Date();
const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// log = misc. info = question. warn = answer.
console.log(`------------------------`);
console.info(`Happy ${weekday[date.getDay()]}!`);

await onThisDay(date);

await wordOfTheDay(date);

// Facts
fetch(`https://www.reddit.com/r/todayilearned/new.json`)
  .then((response) => response.json())
  .then(async (realData) => {
    const realFacts = realData.data.children;
    const facts = [];
    facts.push(formatFact(trimTIL(realFacts[3].data.title)));
    facts.push(formatFact(trimTIL(realFacts[4].data.title)));
    facts.push(formatFact(trimTIL(realFacts[5].data.title)));

    let fakeFact = process.env.FAKE_FACT_OVERRIDE;
    if (!fakeFact) {
      const response = await fetch(
        `https://www.reddit.com/r/FakeFacts/new.json`
      );
      const fakeData = await response.json();
      let fakeFactApiSkip = process.env.FAKE_FACT_TAKE;
      fakeFact = fakeData.data.children[fakeFactApiSkip].data.title;
    }

    facts.push(formatFact(fakeFact));

    for (var j, i = facts.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      [facts[i], facts[j]] = [facts[j], facts[i]];
    }

    console.info(`Todays facts are...`);
    facts.forEach((fact, index) => {
      console.info(`${index + 1}. ${fact}`);
    });
    console.info(`Spot the false fact!`);

    console.log(`------------------------`);
    console.warn(`Todays false fact is....`);
    console.warn(`${fakeFact}`);
    console.warn(`Well done to, these people:`);
    console.log(`------------------------`);
  });

function trimTIL(fact) {
  fact = fact.replace("Today I Learned: that ", "");
  fact = fact.replace("Today I Learned:", "");
  fact = fact.replace("TIL: that ", "");
  fact = fact.replace("TIL: ", "");
  fact = fact.replace("TIL that ", "");
  fact = fact.replace("TIL ", "");
  return fact;
}

function formatFact(fact) {
  fact = fact.charAt(0).toUpperCase() + fact.slice(1);
  return fact.replace(/\b(?=\s*$)/gm, ".");
}

async function wordOfTheDay() {
  var html = await fetch(
    "https://www.merriam-webster.com/word-of-the-day/"
  ).then(function (res) {
    return res.text();
  });
  var $ = cheerio.load(html);

  const word = $(
    ".article-header-container.wod-article-header .word-header h1"
  ).text();
  const meaning = $(".wod-definition-container > p:nth-child(2)").text();

  console.info(`Todays word of the day is ${word}! ${meaning}`);
}

async function onThisDay() {
  const response = await fetch(
    `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${date.getMonth()}/${date.getDate()}`
  );
  const onThisDayData = await response.json();
  console.info(
    `On this day in History in ${onThisDayData.selected[0].year}, ${onThisDayData.selected[0].text}`
  );
}
