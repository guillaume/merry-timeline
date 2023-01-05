const last = (list) => {
  return list.length > 0 ? list[list.length - 1] : null;
};

const formatHour = (time, timezone) => {
  const options = { timeStyle: "short" };
  if (timezone) {
    options.timeZone = timezone;
  }
  const formattedHour = new Date(time * 1000).toLocaleString("en-US", options);
  const [hmm, ampm] = formattedHour.split(" ");
  const [h /*, _mm*/] = hmm.split(":");
  return h + ampm.toLowerCase();
};

const isDarkText = (bgColor) => {
  var color = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
  var r = parseInt(color.substring(0, 2), 16);
  var g = parseInt(color.substring(2, 4), 16);
  var b = parseInt(color.substring(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 186;
};

const getTimelineRange = (merryData) => {
  const { min: start, max: end } = merryData.reduce(
    ({ max, min }, h) => {
      return { max: Math.max(max, h.time), min: Math.min(min, h.time) };
    },
    { min: Infinity, max: 0 }
  );

  return { start, end: end + 3600 };
};

const init = (domElement, merryData, options) => {
  const timelineWidth = options.width || domElement.offsetWidth;

  const timelineDom = document.createElement("div");
  timelineDom.className = "timeline";
  timelineDom.style.width = timelineWidth + "px";
  timelineDom.style.height = "95px";
  timelineDom.style.position = "relative";

  const stripesDom = document.createElement("div");
  stripesDom.className = "stripes";
  stripesDom.style.borderRadius = "5px";
  stripesDom.style.height = "44px";
  stripesDom.style.width = "100%";
  stripesDom.style.position = "absolute";
  stripesDom.style.overflow = "hidden";

  let currentCategory = null;
  const stripes = [];

  merryData.forEach((h, i) => {
    const category = [h.color, h.text].join("__");
    if (currentCategory === null || currentCategory !== category) {
      currentCategory = category;
      stripes.push([]);
    }
    const lastStrip = last(stripes);
    h.category = category;
    lastStrip.push(h);
  });

  let prevWidth = 0;
  stripes.forEach((stripe) => {
    const text = options?.text ? options.text(stripe) : stripe[0].text;
    const color = options?.color ? options.color(stripe) : stripe[0].color;
    const width = (stripe.length / merryData.length) * timelineWidth;
    const stripeDom = document.createElement("span");

    stripeDom.className = "stripe";
    stripeDom.style.height = "100%";
    stripeDom.style.position = "absolute";
    stripeDom.style.lineHeight = "40px";
    stripeDom.style.textAlign = "center";
    stripeDom.style.fontSize = "13px";
    stripeDom.style.fontWeight = "400";

    stripeDom.style.width = width + "px";
    stripeDom.style.left = prevWidth + "px";
    stripeDom.style.backgroundColor = color;
    const textColorBlack = isDarkText(color);
    stripeDom.style.color = textColorBlack ? "#333" : "#fff";
    stripeDom.style.textShadow = textColorBlack
      ? "1px 1px 0 rgb(255 255 255 / 50%)"
      : "1px 1px 0 rgb(0 0 0 / 50%)";

    stripeDom.style.opacity = options?.opacity ? options.opacity(stripe) : 1;
    stripeDom.title = text;

    if (width > 40) {
      stripeDom.innerText = text;
    }
    stripesDom.appendChild(stripeDom);
    prevWidth += width;
  });

  const now = options.tracker || new Date().valueOf() / 1000;
  const { start, end } = getTimelineRange(merryData);
  if (now > start && now < end) {
    const currentTimeDom = document.createElement("div");
    currentTimeDom.style.background = "rgba(255,0,0,0.5)";
    currentTimeDom.style.width = "1px";
    currentTimeDom.style.height = "100%";
    currentTimeDom.style.position = "absolute";
    const ratio = (now - start) / (end - start);
    currentTimeDom.style.left = ratio * timelineWidth + "px";

    stripesDom.appendChild(currentTimeDom);
  }
  timelineDom.appendChild(stripesDom);

  const ticksDom = document.createElement("div");
  ticksDom.className = "ticks";

  ticksDom.style.position = "absolute";
  ticksDom.style.top = "44px";
  ticksDom.style.left = 0;
  ticksDom.style.width = "100%";
  ticksDom.style.height = "10px";

  const tickSpacing = timelineWidth / merryData.length;
  let modulo = 2;
  if (tickSpacing < 12) {
    modulo = 6;
  } else if (tickSpacing < 20) {
    modulo = 4;
  } else if (tickSpacing < 25) {
    modulo = 3;
  }

  for (let i = 0; i < merryData.length; i++) {
    const tickDom = document.createElement("span");

    tickDom.className = "tick " + (i % modulo ? "odd" : "even");

    tickDom.style.position = "absolute";
    tickDom.style.borderLeft = "1px solid #999";

    tickDom.style.left = i * tickSpacing + "px";
    tickDom.style.height = i % modulo ? "8px" : "5px";
    ticksDom.appendChild(tickDom);
  }
  timelineDom.appendChild(ticksDom);

  const hoursDom = document.createElement("div");
  hoursDom.className = "hours";
  hoursDom.style.position = "absolute";
  hoursDom.style.top = "54px";
  hoursDom.style.left = "0px";
  hoursDom.style.width = "100%";
  hoursDom.style.height = "5px";
  hoursDom.style.fontWeight = 500;
  hoursDom.style.fontSize = "14px";

  for (let i = 0; i < merryData.length; i += modulo) {
    const h = merryData[i];
    const hourDom = document.createElement("span");
    hourDom.className = "hour" + (i === 0 ? " first" : "");
    hourDom.style.left = i * tickSpacing + "px";

    if (i !== 0) {
      hourDom.style.position = "absolute";
      hourDom.style.display = "inline-block";
      hourDom.style.width = "40px";
      hourDom.style.marginLeft = "-20px";
      hourDom.style.height = "5px";
      hourDom.style.textAlign = "center";
    }

    hourDom.innerText = formatHour(h.time, options.timezone);
    hoursDom.appendChild(hourDom);
  }
  timelineDom.appendChild(hoursDom);
  if (merryData.filter((m) => m.annotation).length > 0) {
    const annotationsDom = document.createElement("div");
    annotationsDom.className = "annotations";
    annotationsDom.style.position = "absolute";
    annotationsDom.style.left = "0px";
    annotationsDom.style.top = "70px";
    annotationsDom.style.width = "100%";
    annotationsDom.style.fontWeight = 300;

    for (let i = 0; i < merryData.length; i += modulo) {
      const h = merryData[i];
      if (h.annotation) {
        const annotationDom = document.createElement("span");
        annotationDom.className = "annotation" + (i === 0 ? " first" : "");
        if (i !== 0) {
          annotationDom.style.position = "absolute";
          annotationDom.style.display = "inline-block";
          annotationDom.style.width = "40px";
          annotationDom.style.marginLeft = "-20px";
          annotationDom.style.height = "5px";
          annotationDom.style.textAlign = "center";
        }
        annotationDom.style.left = i * tickSpacing + "px";
        annotationDom.innerText = h.annotation;
        annotationsDom.appendChild(annotationDom);
      }
    }
    timelineDom.appendChild(annotationsDom);
  }
  return timelineDom;
};
const timeline = (domElement, merryData, options = {}) => {
  domElement.replaceChildren(init(domElement, merryData, options));

  window.addEventListener("resize", function (_event) {
    domElement.replaceChildren(init(domElement, merryData, options));
  });
};

export default timeline;
