class App {
  constructor(container) {
    //create new Canvas element
    this.layer = new Layer(container);
    console.log(this.layer);
  }
}

class Layer {
  constructor(container) {
    //create new Canvas element
    this.canvas = document.createElement('canvas');
    //get access to 2d drawing tools
    this.context = this.canvas.getContext(`2d`);
    // put Canvas to Container
    container.appendChild(this.canvas);

    this.fitToContainer(this.canvas);
    document.addEventListener(`resize`, () => this.fitToContainer);
  }
  // fit Canvas size to container
  fitToContainer(cnv) {
    cnv.width = cnv.offsetWidth;
    cnv.height = cnv.offsetHeight;
    console.log(cnv.width);
  }
}

onload = () => {
  new App(document.body);
};
