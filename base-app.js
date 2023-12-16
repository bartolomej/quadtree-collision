export class BaseApp {

  constructor (canvas, options) {
    this._update = this._update.bind(this);

    this.canvas = canvas;
    this._init2d(options);
    this._resize();
    this.start();

    requestAnimationFrame(this._update);
  }

  _init2d (options) {
    this.ctx = null;
    try {
      this.ctx = this.canvas.getContext('2d', options);
    } catch (error) {}

    if (!this.ctx) {
      console.log('Cannot create 2d context');
    }
  }

  _update () {
    this._resize();
    this.update();
    this.render();
    requestAnimationFrame(this._update);
  }

  _resize () {
    const canvas = this.canvas;

    if (canvas.width !== canvas.clientWidth ||
      canvas.height !== canvas.clientHeight) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      this.resize();
    }
  }

  start () {
    // initialization code (including event handler binding)
  }

  update () {
    // update code (input, animations, AI ...)
  }

  render () {
    const { ctx, canvas } = this;

    // clear existing drawing on canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // begin drawing path
    ctx.beginPath();

    // render code (2d context API calls)
  }

  resize () {
    // resize code (e.g. update projection matrix)
  }

}
