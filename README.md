# Merry Timeline

A library for displaying hourly data. This is used for displaying precipitation forecasts at [merrysky.net](https://merrysky.net/)

<img src="https://raw.githubusercontent.com/guillaume/merry-timeline/master/docs/examples.png" alt="examples" width="600px"/>

Setup

```
npm i merry-timeline
```

Example

```
import timeline from "merry-timeline";

const data = [
  { "time": 1671080400, "color": "#333333", "text": "Sleep" },
  { "time": 1671084000, "color": "#333333", "text": "Sleep" },
  { "time": 1671087600, "color": "#333333", "text": "Sleep" },
  { "time": 1671091200, "color": "#333333", "text": "Sleep" },
  { "time": 1671094800, "color": "#333333", "text": "Sleep" },
  { "time": 1671098400, "color": "#333333", "text": "Sleep" },
  { "time": 1671102000, "color": "#b6bfcb", "text": "Drowse" },
  { "time": 1671105600, "color": "#b6bfcb", "text": "Drowse" },
  { "time": 1671109200, "color": "#FFDEAD", "text": "School" },
  { "time": 1671112800, "color": "#FFDEAD", "text": "School" },
  { "time": 1671116400, "color": "#FFDEAD", "text": "School" },
  { "time": 1671120000, "color": "#FFDEAD", "text": "School" },
  { "time": 1671123600, "color": "#E6E6FA", "text": "Lunch" },
  { "time": 1671127200, "color": "#FFDEAD", "text": "School" },
  { "time": 1671130800, "color": "#FFDEAD", "text": "School" },
  { "time": 1671134400, "color": "#FFDEAD", "text": "School" },
  { "time": 1671138000, "color": "#E6E6FA", "text": "Home" },
  { "time": 1671141600, "color": "#E6E6FA", "text": "Home" },
  { "time": 1671145200, "color": "#e4000f", "text": "🕹 Play Nintendo" },
  { "time": 1671148800, "color": "#e4000f", "text": "🕹 Play Nintendo" },
  { "time": 1671152400, "color": "#e4000f", "text": "🕹 Play Nintendo" },
  { "time": 1671156000, "color": "#e4000f", "text": "🕹 Play Nintendo" },
  { "time": 1671159600, "color": "#333333", "text": "Sleep" },
  { "time": 1671163200, "color": "#333333", "text": "Sleep" }
]


const exampleDiv = document.createElement("div");
const options = { timezone: "America/Toronto" };
timeline(exampleDiv, hourly, options);
```

Data is a list where each item contain those attributes:

- `time` : time in seconds, beginning of the hour
- `color` : background color of the stripe
- `text` : text overlay above the stripe

Browse [examples](https://guillaume.github.io/merry-timeline/examples/) for usage

## Options

- `timezone` timezone to format the timestamp at. if not provided, uses the user's timezone
- `width` fixed width of the timeline, otherwise it's responsive

## Acknowledgement

The visuals were very much inspired by [darksky](!https://darksky.net/)'s forecasting day of precipitations. Going forward, since it is shutting down, this library allows others to benefit from this timeline representation with ease and configuration.
