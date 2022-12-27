import timeline from "../index.js";

const fetchExample = async (name) => {
  const response = await fetch(`data/${name}.json`);
  const data = await response.json();
  return data;
};

const weatherData = Object.fromEntries(
  await Promise.all(
    ["clear", "rain", "snow", "life", "work"].map(async (name) => {
      return [name, await fetchExample(name)];
    })
  )
);

const reinit = async () => {
  const domExamples = document.getElementById("timelines");
  domExamples.innerHTML = "";
  Object.keys(weatherData).forEach(async (key) => {
    const data = weatherData[key];
    const hourly = data;

    const exampleHeader = document.createElement("p");
    exampleHeader.innerText = key;

    domExamples.append(exampleHeader);
    const exampleDiv = document.createElement("div");
    domExamples.append(exampleDiv);
    timeline(exampleDiv, hourly, { timezone: "America/Toronto" });
  });
};

reinit();
