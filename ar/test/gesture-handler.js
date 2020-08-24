/* global AFRAME, THREE */

AFRAME.registerComponent("clear-selected", {
  init: function () {
    this.handleClick = this.handleClick.bind(this);
    this.handleVisible = this.handleVisible.bind(this);

    this.el.setAttribute("visible", false);

    this.el.addEventListener("click", this.handleClick);
    this.el.sceneEl.addEventListener("setselected", this.handleVisible);
  },

  handleClick: function () {
    this.el.emit("clearselected");
    this.el.setAttribute("visible", false);
  },

  handleVisible: function () {
    this.el.setAttribute("visible", true);
  },
});

AFRAME.registerComponent("gesture-handler", {
  schema: {
    selected: { default: false },
    // enable selected if not entity is selected
    // enabled: { default: true },
    rotationFactor: { default: 5 },
    minScale: { default: 0.3 },
    maxScale: { default: 8 },
  },

  init: function () {
    this.handleClick = this.handleClick.bind(this);
    this.handleScale = this.handleScale.bind(this);
    this.handleRotation = this.handleRotation.bind(this);
    this.handleSetSelected = this.handleSetSelected.bind(this);
    this.handleClearSelected = this.handleClearSelected.bind(this);

    this.isVisible = true;
    this.initialScale = this.el.object3D.scale.clone();
    this.scaleFactor = 1;

    this.el.addEventListener("click", this.handleClick);
    this.el.sceneEl.addEventListener("setselected", this.handleSetSelected);
  },

  update: function () {
    if (this.data.selected) {
      this.el.sceneEl.addEventListener("onefingermove", this.handleRotation);
      this.el.sceneEl.addEventListener("twofingermove", this.handleScale);

      // this.el.removeEventListener("click", this.handleClick);
    } else {
      // this.el.addEventListener("click", this.handleClick);
      this.el.sceneEl.removeEventListener("onefingermove", this.handleRotation);
      this.el.sceneEl.removeEventListener("twofingermove", this.handleScale);
    }
  },

  remove: function () {
    this.el.sceneEl.removeEventListener("onefingermove", this.handleRotation);
    this.el.sceneEl.removeEventListener("twofingermove", this.handleScale);
  },

  handleClick: function () {
    this.el.setAttribute("gesture-handler", { selected: true });
    console.log(this.el.getAttribute("gesture-handler"));
    this.el.emit("setselected");
  },

  handleSetSelected: function () {
    this.el.removeEventListener("click", this.handleClick);
    this.el.sceneEl.addEventListener("clearselected", this.handleClearSelected);
  },

  handleClearSelected: function () {
    this.el.setAttribute("gesture-handler", { selected: false });
    this.el.addEventListener("click", this.handleClick);
    this.el.sceneEl.removeEventListener(
      "clearselected",
      this.handleClearSelected
    );
  },

  handleRotation: function (event) {
    this.el.object3D.rotation.y +=
      event.detail.positionChange.x * this.data.rotationFactor;
    this.el.object3D.rotation.x +=
      event.detail.positionChange.y * this.data.rotationFactor;
  },

  handleScale: function (event) {
    this.scaleFactor *=
      1 + event.detail.spreadChange / event.detail.startSpread;

    this.scaleFactor = Math.min(
      Math.max(this.scaleFactor, this.data.minScale),
      this.data.maxScale
    );

    this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x;
    this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y;
    this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z;
  },
});
