/* global AFRAME, THREE */

AFRAME.registerComponent("gesture-handler", {
  schema: {
    enabled: { default: true },
    rotationFactor: { default: 5 },
    minScale: { default: 0.3 },
    maxScale: { default: 8 },
  },

  init: function () {
    this.handleMove = this.handleMove.bind(this);
    this.handleTwoFingerMove = this.handleTwoFingerMove.bind(this);
    this.handleScale = this.handleScale.bind(this);
    this.handleRotation = this.handleRotation.bind(this);

    this.isVisible = true;
    this.initialScale = this.el.object3D.scale.clone();
    this.scaleFactor = 1;
  },

  update: function () {
    if (this.data.enabled) {
      this.el.sceneEl.addEventListener("onefingermove", this.handleMove);
      this.el.sceneEl.addEventListener(
        "twofingermove",
        this.handleTwoFingerMove
      );
    } else {
      this.el.sceneEl.removeEventListener("onefingermove", this.handleMove);
      this.el.sceneEl.removeEventListener(
        "twofingermove",
        this.handleTwoFingerMove
      );
    }
  },

  remove: function () {
    this.el.sceneEl.removeEventListener("onefingermove", this.handleMove);
    this.el.sceneEl.removeEventListener(
      "twofingermove",
      this.handleTwoFingerMove
    );
  },

  handleMove: function (event) {
    this.el.object3D.position.y -= event.detail.positionChange.y * 1.5;
    this.el.object3D.position.x += event.detail.positionChange.x * 1.5;
  },

  handleTwoFingerMove: function (event) {
    const { current, previous } = event.detail.touchesChange;

    const finger1ClientXChange = current[0].clientX - previous[0].clientX;
    const finger1ClientYChange = current[0].clientY - previous[0].clientY;
    const finger2ClientXChange = current[1].clientX - previous[1].clientX;
    const finger2ClientYChange = current[1].clientY - previous[1].clientY;

    if (
      finger1ClientXChange * finger2ClientXChange <= 0 &&
      finger1ClientYChange * finger2ClientYChange <= 0
    ) {
      this.handleScale(event);
    } else {
      this.handleRotation(event);
    }
  },

  handleRotation: function (event) {
    if (this.isVisible) {
      this.el.object3D.rotation.y +=
        event.detail.positionChange.x * this.data.rotationFactor;
      this.el.object3D.rotation.x +=
        event.detail.positionChange.y * this.data.rotationFactor;
    }
  },

  handleScale: function (event) {
    if (this.isVisible) {
      this.scaleFactor *=
        1 + event.detail.spreadChange / event.detail.startSpread;

      this.scaleFactor = Math.min(
        Math.max(this.scaleFactor, this.data.minScale),
        this.data.maxScale
      );

      this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x;
      this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y;
      this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z;
    }
  },
});
