/* global AFRAME */
const COLLISION_LAYERS = require("../constants").COLLISION_LAYERS;
import { isSynchronized, isMine } from "../../jel/utils/ownership-utils";

AFRAME.registerComponent("floaty-object", {
  schema: {
    // Make the object locked/kinematic upon load
    autoLockOnLoad: { default: false },

    // Make the object kinematic immediately upon release
    autoLockOnRelease: { default: false },

    // On release, modify the gravity based upon gravitySpeedLimit. If less than this, let the object float
    // otherwise apply releaseGravity.
    modifyGravityOnRelease: { default: false },

    // Gravity to apply if object is thrown at a speed greated than speed limit.
    releaseGravity: { default: -2 },

    // If true, the degree to which angular rotation is allowed when floating is reduced (useful for 2d media)
    reduceAngularFloat: { default: false },

    // Velocity speed limit under which gravity will not be added if modifyGravityOnRelease is true
    gravitySpeedLimit: { default: 1.85 } // Set to 0 to never apply gravity
  },

  init() {
    this.onGrab = this.onGrab.bind(this);
    this.onRelease = this.onRelease.bind(this);
    this.preGrabCollsionFilterMask = null;
  },

  tick() {
    if (!this.bodyHelper) {
      this.bodyHelper = this.el.components["body-helper"];
    }

    const interaction = AFRAME.scenes[0].systems.interaction;
    const isHeld = interaction && interaction.isHeld(this.el);
    if (isHeld && !this.wasHeld) {
      this.onGrab();
    }
    if (this.wasHeld && !isHeld) {
      this.onRelease();
    }

    if (!isHeld && this._makeStaticWhenAtRest) {
      const physicsSystem = this.el.sceneEl.systems["hubs-systems"].physicsSystem;
      const objectIsMine = isSynchronized(this.el) && isMine(this.el);
      const linearThreshold = this.bodyHelper.data.linearSleepingThreshold;
      const angularThreshold = this.bodyHelper.data.angularSleepingThreshold;
      const uuid = this.bodyHelper.uuid;
      const isAtRest =
        physicsSystem.bodyInitialized(uuid) &&
        physicsSystem.getLinearVelocity(uuid) < linearThreshold &&
        physicsSystem.getAngularVelocity(uuid) < angularThreshold;

      if (isAtRest && objectIsMine) {
        this.el.setAttribute("body-helper", { type: "kinematic" });
      }

      if (isAtRest || !objectIsMine) {
        this._makeStaticWhenAtRest = false;
      }
    }

    this.wasHeld = isHeld;
  },

  play() {
    // We do this in play instead of in init because otherwise isMine fails
    if (this.hasBeenHereBefore) return;
    this.hasBeenHereBefore = true;
    if (this.data.autoLockOnLoad) {
      this.el.setAttribute("body-helper", {
        gravity: { x: 0, y: 0, z: 0 }
      });
      this.setLocked(true);
    }
  },

  setLocked(locked) {
    if (isSynchronized(this.el) && !isMine(this.el)) return;

    this.locked = locked;
    this.el.setAttribute("body-helper", { type: locked ? "kinematic" : "dynamic" });
  },

  onRelease() {
    if (this.data.modifyGravityOnRelease) {
      const uuid = this.bodyHelper.uuid;
      const physicsSystem = this.el.sceneEl.systems["hubs-systems"].physicsSystem;
      if (
        this.data.gravitySpeedLimit === 0 ||
        (physicsSystem.bodyInitialized(uuid) && physicsSystem.getLinearVelocity(uuid) < this.data.gravitySpeedLimit)
      ) {
        this.el.setAttribute("body-helper", {
          gravity: { x: 0, y: 0, z: 0 },
          angularDamping: this.data.reduceAngularFloat ? 0.98 : 0.5,
          linearDamping: 0.95,
          linearSleepingThreshold: 0.1,
          angularSleepingThreshold: 0.1,
          collisionFilterMask: this.preGrabCollsionFilterMask
        });

        this._makeStaticWhenAtRest = true;
      } else {
        this.el.setAttribute("body-helper", {
          gravity: { x: 0, y: this.data.releaseGravity, z: 0 },
          angularDamping: 0.01,
          linearDamping: 0.01,
          linearSleepingThreshold: 1.6,
          angularSleepingThreshold: 2.5,
          collisionFilterMask: this.preGrabCollsionFilterMask
        });
      }
    } else {
      this.el.setAttribute("body-helper", {
        collisionFilterMask: this.preGrabCollsionFilterMask,
        gravity: { x: 0, y: -9.8, z: 0 }
      });
    }

    const characterController = this.el.sceneEl.systems["hubs-systems"].characterController;

    // Lock on release if auto lock is true or if we were moving, which would undesirably throw the object.
    if (this.data.autoLockOnRelease || characterController.movedThisFrame) {
      this.setLocked(true);
    }
  },

  onGrab() {
    this.preGrabCollsionFilterMask = this.el.components["body-helper"].data.collisionFilterMask;

    this.el.setAttribute("body-helper", {
      gravity: { x: 0, y: 0, z: 0 },
      collisionFilterMask: COLLISION_LAYERS.HANDS
    });
    this.setLocked(false);
  },

  remove() {
    if (this.stuckTo) {
      const stuckTo = this.stuckTo;
      delete this.stuckTo;
      stuckTo._unstickObject();
    }
  }
});
