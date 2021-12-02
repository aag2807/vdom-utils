const container = document.getElementById("app");

class VDOM {
  constructor(tag, props, children) {
    this.tag = tag;
    this.props = props;
    this.children = children;
  }
  //event listeners
  addEventListener(event, callback) {
    this.props[event] = callback;
  }
}

const h = (tag, props, children) => {
  return new VDOM(tag, props, children);
};

const render = (vdom, container) => {
  const dom = document.createElement(vdom.tag);
  for (let key in vdom.props) {
    dom[key] = vdom.props[key];
  }
  vdom.children.forEach((child) => {
    if (typeof child === "string") {
      dom.appendChild(document.createTextNode(child));
    } else {
      render(child, dom);
    }
  });
  container.appendChild(dom);
};

let rootVdomElement = h("div", {}, [
  h("h1", {}, ["Hello World"]),
  h("p", {}, ["This is a paragraph"]),
  h("ul", { style: { backgroundColor: "red" } }, [
    h("li", {}, ["Item 1"]),
    h("li", {}, ["Item 2"]),
    h("li", {}, ["Item 3"]),
  ]),
]);

const isVDOM = (element) => {
  return element instanceof VDOM;
};

const update = (oldNode, newNode) => {
  if (oldNode.tag !== newNode.tag) {
    const newDom = document.createElement(newNode.tag);
    for (let key in newNode.props) {
      newDom[key] = newNode.props[key];
    }
    oldNode.children.forEach((child) => {
      if (typeof child === "string") {
        newDom.appendChild(document.createTextNode(child));
      } else {
        update(oldNode, newNode);
      }
    });
    return newDom;
  }
};

//add event listeners to the vdom nodes
const addEventListeners = (element, events) => {
  for (let event in events) {
    element.addEventListener(event, events[event]);
  }
};

//create unidirectional data flow
const renderLoop = () => {
  console.log("rendering");
  render(rootVdomElement, container);
};

const style = (element, styles) => {
  for (let key in styles) {
    element.style[key] = styles[key];
  }
};

renderLoop();

/**
 *
 * diff implementation

class VDOM {
  constructor(tag, props, children) {
    this.tag = tag;
    this.props = props;
    this.children = children;
  }
  //event listeners
  addEventListener(event, callback) {
    this.props[event] = callback;
  }

  render() {
    let element = document.createElement(this.tag);
    for (let prop in this.props) {
      if (prop.startsWith("on")) {
        element.addEventListener(prop.substring(2), this.props[prop]);
      } else {
        element.setAttribute(prop, this.props[prop]);
      }
    }
    for (let child of this.children) {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child.render());
      }
    }
    return element;
  }
}

// vdom engine loop which updates dom on change
function vdomEngine(vdom, element) {
  let newElement = vdom.render();
  element.replaceWith(newElement);
  element = newElement;
  return element;
}

function render(vdom, element) {
  let newElement = vdom.render();
  element.replaceWith(newElement);
  element = newElement;
}
*/
