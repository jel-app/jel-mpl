import "./hubs/webxr-bypass-hacks";
import "./hubs/utils/theme";
import "@babel/polyfill";
import "./hubs/utils/debug-log";
import { isInQuillEditor } from "./jel/utils/quill-utils";
import { homeHubForSpaceId } from "./jel/utils/membership-utils";
import { CURSOR_LOCK_STATES, getCursorLockState } from "./jel/utils/dom-utils";
import mixpanel from "mixpanel-browser";

console.log(`App version: ${process.env.BUILD_VERSION || "?"}`);

import "./assets/hubs/stylesheets/hub.scss";
import initialBatchImage from "./assets/hubs/images/warning_icon.png";

import "aframe";
import "./hubs/utils/logging";
import { patchWebGLRenderingContext } from "./hubs/utils/webgl";
patchWebGLRenderingContext();

import "three/examples/js/loaders/GLTFLoader";
import "networked-aframe/src/index";
import "shared-aframe/src/index";
import "naf-janus-adapter";
import "aframe-rounded";
import "webrtc-adapter";
import "aframe-slice9-component";
import configs from "./hubs/utils/configs";
import "./hubs/utils/threejs-positional-audio-updatematrixworld";
import "./hubs/utils/threejs-world-update";
import patchThreeAllocations from "./hubs/utils/threejs-allocation-patches";
import patchThreeNoProgramDispose from "./jel/utils/threejs-avoid-disposing-programs";
import { detectOS, detect } from "detect-browser";
import { getReticulumMeta } from "./hubs/utils/phoenix-utils";

import "./hubs/naf-dialog-adapter";

import "./hubs/components/scene-components";
import "./hubs/components/scale-in-screen-space";
import "./hubs/components/mute-mic";
import "./hubs/components/bone-mute-state-indicator";
import "./hubs/components/bone-visibility";
import "./hubs/components/fader";
import "./hubs/components/in-world-hud";
import "./hubs/components/emoji";
import "./hubs/components/virtual-gamepad-controls";
import "./hubs/components/ik-controller";
import "./hubs/components/hand-controls2";
import "./hubs/components/hoverable-visuals";
import "./hubs/components/hover-visuals";
import "./hubs/components/offset-relative-to";
import "./hubs/components/player-info";
import "./hubs/components/debug";
import "./hubs/components/hand-poses";
import "./hubs/components/hud-controller";
import "./hubs/components/freeze-controller";
import "./hubs/components/icon-button";
import "./hubs/components/text-button";
import "./hubs/components/block-button";
import "./hubs/components/mute-button";
import "./hubs/components/kick-button";
import "./hubs/components/close-vr-notice-button";
import "./hubs/components/leave-room-button";
import "./hubs/components/visible-if-permitted";
import "./hubs/components/visibility-on-content-types";
import "./hubs/components/visibility-while-frozen";
import "./hubs/components/networked-avatar";
import "./hubs/components/media-views";
import "./jel/components/media-vox";
import "./jel/components/media-text";
import "./jel/components/media-emoji";
import "./jel/components/media-stream";
import { initQuillPool } from "./jel/utils/quill-pool";
import nextTick from "./hubs/utils/next-tick";
import "./hubs/components/avatar-volume-controls";
import "./hubs/components/pinch-to-move";
import "./hubs/components/position-at-border";
import "./hubs/components/mirror-media-button";
import "./hubs/components/close-mirrored-media-button";
import "./hubs/components/drop-object-button";
import "./hubs/components/remove-networked-object-button";
import "./hubs/components/camera-focus-button";
import "./hubs/components/unmute-video-button";
import "./hubs/components/destroy-at-extreme-distances";
import "./hubs/components/visible-to-owner";
import "./hubs/components/camera-tool";
import "./hubs/components/emit-state-change";
import "./hubs/components/action-to-event";
import "./hubs/components/action-to-remove";
import "./hubs/components/emit-scene-event-on-remove";
import "./hubs/components/follow-in-fov";
import "./hubs/components/matrix-auto-update";
import "./hubs/components/clone-media-button";
import "./hubs/components/open-media-button";
import "./hubs/components/refresh-media-button";
import "./hubs/components/remix-avatar-button";
import "./hubs/components/transform-object-button";
import "./hubs/systems/scale-object";
import "./hubs/components/hover-menu";
import "./hubs/components/disable-frustum-culling";
import "./hubs/components/teleporter";
import "./hubs/components/set-active-camera";
import "./hubs/components/track-pose";
import "./hubs/components/replay";
import "./hubs/components/visibility-by-path";
import "./hubs/components/tags";
import "./hubs/components/hubs-text";
import "./hubs/components/billboard";
import "./hubs/components/periodic-full-syncs";
import "./hubs/components/inspect-button";
import "./hubs/components/set-max-resolution";
import "./hubs/components/avatar-audio-source";
import "./jel/components/pinned-to-self";
import "./jel/components/look-at-self";
import Subscriptions from "./hubs/subscriptions";

import { SOUND_QUACK, SOUND_SPECIAL_QUACK, SOUND_NOTIFICATION } from "./hubs/systems/sound-effects-system";
import ducky from "./assets/hubs/models/DuckyMesh.glb";
import { getAbsoluteHref } from "./hubs/utils/media-url-utils";

import ReactDOM from "react-dom";
import React from "react";
import { Router, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import { clearHistoryState } from "./hubs/utils/history";
import JelUI from "./jel/react-components/jel-ui";
import AccountChannel from "./jel/utils/account-channel";
import AuthChannel from "./hubs/utils/auth-channel";
import DynaChannel from "./jel/utils/dyna-channel";
import SpaceChannel from "./hubs/utils/space-channel";
import HubChannel from "./hubs/utils/hub-channel";
import LinkChannel from "./hubs/utils/link-channel";
import Matrix from "./jel/utils/matrix";
import AtomMetadata, { ATOM_TYPES } from "./jel/utils/atom-metadata";
import { joinSpace, joinHub } from "./hubs/utils/jel-init";
import { connectToReticulum } from "./hubs/utils/phoenix-utils";
import { disableiOSZoom } from "./hubs/utils/disable-ios-zoom";
import { getHubIdFromHistory, getSpaceIdFromHistory, navigateToHubUrl } from "./jel/utils/jel-url-utils";
import { handleExitTo2DInterstitial, exit2DInterstitialAndEnterVR } from "./hubs/utils/vr-interstitial";
import { getAvatarSrc } from "./hubs/utils/avatar-utils.js";
import SceneEntryManager from "./hubs/scene-entry-manager";

import "./hubs/systems/nav";
import "./hubs/systems/frame-scheduler";
import "./hubs/systems/personal-space-bubble";
import "./hubs/systems/app-mode";
import "./hubs/systems/permissions";
import "./hubs/systems/exit-on-blur";
import "./hubs/systems/idle-detector";
import "./hubs/systems/camera-tools";
import "./hubs/systems/userinput/userinput";
import "./hubs/systems/userinput/userinput-debug";
import "./hubs/systems/ui-hotkeys";
import "./hubs/systems/tips";
import "./hubs/systems/interactions";
import "./jel/systems/effects-system";
import "./hubs/systems/hubs-systems";
import "./hubs/systems/capture-system";
import "./hubs/systems/listed-media";
import "./hubs/systems/linked-media";
import "./hubs/systems/camera-rotator-system";
import "./jel/systems/media-presence-system";
import "./jel/systems/wrapped-entity-system";
import { registerWrappedEntityPositionNormalizers } from "./jel/systems/wrapped-entity-system";
import { isInEditableField } from "./jel/utils/dom-utils";
import { resetTemplate } from "./jel/utils/template-utils";

import "./hubs/gltf-component-mappings";

import { App } from "./App";
import { platformUnsupported } from "./hubs/support";

window.APP = new App();
const store = window.APP.store;
const subscriptions = new Subscriptions(store);
window.APP.subscriptions = subscriptions;

store.update({ preferences: { shouldPromptForRefresh: undefined } });

const history = createBrowserHistory();
const accountChannel = new AccountChannel(store);
const authChannel = new AuthChannel(store);
const dynaChannel = new DynaChannel(store);
const spaceChannel = new SpaceChannel(store);
const hubChannel = new HubChannel(store);
const linkChannel = new LinkChannel(store);
const spaceMetadata = new AtomMetadata(ATOM_TYPES.SPACE);
const hubMetadata = new AtomMetadata(ATOM_TYPES.HUB);
const matrix = new Matrix(store, spaceMetadata, hubMetadata);

window.APP.history = history;
window.APP.accountChannel = accountChannel;
window.APP.dynaChannel = dynaChannel;
window.APP.spaceChannel = spaceChannel;
window.APP.hubChannel = hubChannel;
window.APP.authChannel = authChannel;
window.APP.linkChannel = linkChannel;
window.APP.hubMetadata = hubMetadata;
window.APP.spaceMetadata = spaceMetadata;
window.APP.matrix = matrix;

store.addEventListener("profilechanged", spaceChannel.sendProfileUpdate.bind(hubChannel));

const qs = new URLSearchParams(location.search);

const isMobile = AFRAME.utils.device.isMobile();
const isMobileVR = AFRAME.utils.device.isMobileVR();

THREE.Object3D.DefaultMatrixAutoUpdate = false;
window.APP.materialQuality =
  window.APP.store.state.preferences.materialQualitySetting === "low"
    ? "low"
    : window.APP.store.state.preferences.materialQualitySetting === "high"
      ? "high"
      : isMobile || isMobileVR
        ? "low"
        : "high";

import "./hubs/components/owned-object-limiter";
import "./hubs/components/owned-object-cleanup-timeout";
import "./hubs/components/set-unowned-body-kinematic";
import "./hubs/components/scalable-when-grabbed";
import "./hubs/components/networked-counter";
import "./hubs/components/event-repeater";
import "./hubs/components/set-yxz-order";

import "./hubs/components/cursor-controller";

import "./hubs/components/nav-mesh-helper";

import "./hubs/components/tools/pen";
import "./hubs/components/tools/pen-laser";
import "./hubs/components/tools/networked-drawing";
import "./hubs/components/tools/drawing-manager";

import "./hubs/components/body-helper";
import "./hubs/components/shape-helper";

import registerNetworkSchemas from "./hubs/network-schemas";
import registerTelemetry from "./hubs/telemetry";
import { warmSerializeElement } from "./hubs/utils/serialize-element";

import { getAvailableVREntryTypes, VR_DEVICE_AVAILABILITY, ONLY_SCREEN_AVAILABLE } from "./hubs/utils/vr-caps-detect";
import detectConcurrentLoad from "./hubs/utils/concurrent-load-detector";

import qsTruthy from "./hubs/utils/qs_truthy";

const PHOENIX_RELIABLE_NAF = "phx-reliable";
NAF.options.firstSyncSource = PHOENIX_RELIABLE_NAF;
NAF.options.syncSource = PHOENIX_RELIABLE_NAF;

const isBotMode = qsTruthy("bot");
const isTelemetryDisabled = qsTruthy("disable_telemetry");
const isDebug = qsTruthy("debug");
const disablePausing = qsTruthy("no_pause") || isBotMode;
const skipNeon = qsTruthy("skip_neon");
const skipPanels = qsTruthy("skip_panels");

if (isBotMode) {
  const token = qs.get("credentials_token");
  const email = qs.get("credentials_email") || "nobody@nowhere.com";

  if (token) {
    store.update({ credentials: { token, email } });
  }
}

if (!isBotMode && !isTelemetryDisabled) {
  registerTelemetry();

  // Can't do this in the other file otherwise get a mixpanel error
  if (configs.MIXPANEL_TOKEN) {
    mixpanel.init(configs.MIXPANEL_TOKEN, { batch_requests: true });

    if (store.credentialsAccountId) {
      // Perform a simple hash to track the account in mixpanel to increase user privacy
      const accountId = store.credentialsAccountId;

      let hash = 0;

      for (let i = 0; i < accountId.length; i++) {
        const chr = accountId.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
      }

      hash = Math.abs(hash);
      mixpanel.identify(`${hash}`);
    }
  }
} else {
  mixpanel.track = function() {};
}

registerWrappedEntityPositionNormalizers();

disableiOSZoom();
detectConcurrentLoad();

// TODO JEL do we need lobby camera?
/*function setupLobbyCamera() {
  const camera = document.getElementById("scene-preview-node");
  const previewCamera = document.getElementById("environment-scene").object3D.getObjectByName("scene-preview-camera");

  if (previewCamera) {
    camera.object3D.position.copy(previewCamera.position);
    camera.object3D.rotation.copy(previewCamera.rotation);
    camera.object3D.rotation.reorder("YXZ");
  } else {
    const cameraPos = camera.object3D.position;
    camera.object3D.position.set(cameraPos.x, 2.5, cameraPos.z);
  }

  camera.object3D.matrixNeedsUpdate = true;

  camera.removeAttribute("scene-preview-camera");
  camera.setAttribute("scene-preview-camera", "positionOnly: true; duration: 60");
}*/

let uiProps = {};
let jelUIProps = {};

// when loading the client as a "default room" on the homepage, use MemoryHistory since exposing all the client paths at the root is undesirable

const qsVREntryType = qs.get("vr_entry_type");

let performConditionalSignIn;

function mountUI(/*props = {}*/) {
  //const scene = document.querySelector("a-scene");
  //const disableAutoExitOnIdle =
  //  qsTruthy("allow_idle") || (process.env.NODE_ENV === "development" && !qs.get("idle_timeout"));
  //const isCursorHoldingPen =
  //  scene &&
  //  (scene.systems.userinput.activeSets.includes(userinputSets.rightCursorHoldingPen) ||
  //    scene.systems.userinput.activeSets.includes(userinputSets.leftCursorHoldingPen));
  //const hasActiveCamera = scene && !!scene.systems["camera-tools"].getMyCamera();
  //const forcedVREntryType = qsVREntryType;
  //ReactDOM.render(
  //  <Router history={history}>
  //    <Route
  //      render={routeProps => (
  //        <UIRoot
  //          {...{
  //            scene,
  //            isBotMode,
  //            disableAutoExitOnIdle,
  //            forcedVREntryType,
  //            store,
  //            mediaSearchStore,
  //            isCursorHoldingPen,
  //            hasActiveCamera,
  //            performConditionalSignIn,
  //            ...props,
  //            ...routeProps
  //          }}
  //        />
  //      )}
  //    />
  //  </Router>,
  //  document.getElementById("ui-root")
  //);
}

function remountUI(props) {
  uiProps = { ...uiProps, ...props };
  mountUI(uiProps);
}

function mountJelUI(props = {}) {
  if (isBotMode) return;

  const scene = document.querySelector("a-scene");

  ReactDOM.render(
    <Router history={history}>
      <Route
        render={routeProps => (
          <JelUI
            {...{
              scene,
              store,
              subscriptions,
              history: routeProps.history,
              ...props
            }}
          />
        )}
      />
    </Router>,
    document.getElementById("jel-ui")
  );
}

function remountJelUI(props) {
  jelUIProps = { ...jelUIProps, ...props };
  mountJelUI(jelUIProps);
}

window.remountJelUI = remountJelUI;

function setupPerformConditionalSignin(entryManager) {
  entryManager.performConditionalSignIn = performConditionalSignIn = async (
    predicate,
    action,
    messageId,
    onFailure
  ) => {
    if (predicate()) return action();

    const scene = document.querySelector("a-scene");
    const signInContinueTextId = scene.is("vr-mode") ? "entry.return-to-vr" : "dialog.close";

    await handleExitTo2DInterstitial(true, () => remountUI({ showSignInDialog: false }));

    remountUI({
      showSignInDialog: true,
      signInMessageId: `sign-in.${messageId}`,
      signInCompleteMessageId: `sign-in.${messageId}-complete`,
      signInContinueTextId,
      onContinueAfterSignIn: async () => {
        remountUI({ showSignInDialog: false });
        let actionError = null;
        if (predicate()) {
          try {
            await action();
          } catch (e) {
            actionError = e;
          }
        } else {
          actionError = new Error("Predicate failed post sign-in");
        }

        if (actionError && onFailure) onFailure(actionError);
        exit2DInterstitialAndEnterVR();
      }
    });
  };

  remountUI({ performConditionalSignIn });
}

async function runBotMode(scene, entryManager) {
  const noop = () => {};
  scene.renderer = { setAnimationLoop: noop, render: noop };

  while (!NAF.connection.isConnected()) await nextTick();
  while (!SAF.connection.isConnected()) await nextTick();
  entryManager.enterSceneWhenLoaded(false);
}

function initPhysicsThreeAndCursor(scene) {
  const physicsSystem = scene.systems["hubs-systems"].physicsSystem;
  physicsSystem.setDebug(isDebug || physicsSystem.debug);
  const renderer = AFRAME.scenes[0].renderer;

  patchThreeAllocations(renderer);
  patchThreeNoProgramDispose(renderer);
}

async function initAvatar() {
  // If the stored avatar doesn't have a valid src, reset to a legacy avatar.
  const avatarSrc = await getAvatarSrc(store.state.profile.avatarId);
  if (!avatarSrc) {
    await store.resetToRandomDefaultAvatar();
  }

  return avatarSrc;
}

async function checkPrerequisites() {
  if (platformUnsupported()) return false;

  const detectedOS = detectOS(navigator.userAgent);

  const browser = detect();
  // HACK - it seems if we don't initialize the mic track up-front, voices can drop out on iOS
  // safari when initializing it later.
  if (["iOS", "Mac OS"].includes(detectedOS) && ["safari", "ios"].includes(browser.name)) {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      remountUI({ showSafariMicDialog: true });
      return;
    }
  }

  if (qs.get("required_version") && process.env.BUILD_VERSION) {
    const buildNumber = process.env.BUILD_VERSION.split(" ", 1)[0]; // e.g. "123 (abcd5678)"

    if (qs.get("required_version") !== buildNumber) {
      remountUI({ roomUnavailableReason: "version_mismatch" });
      setTimeout(() => document.location.reload(), 5000);
      return false;
    }
  }

  getReticulumMeta().then(reticulumMeta => {
    console.log(`Reticulum @ ${reticulumMeta.phx_host}: v${reticulumMeta.version} on ${reticulumMeta.pool}`);

    if (
      qs.get("required_ret_version") &&
      (qs.get("required_ret_version") !== reticulumMeta.version || qs.get("required_ret_pool") !== reticulumMeta.pool)
    ) {
      remountUI({ roomUnavailableReason: "version_mismatch" });
      setTimeout(() => document.location.reload(), 5000);
      return false;
    }
  });

  return true;
}

function hideCanvas() {
  const canvas = document.querySelector(".a-canvas");
  canvas.classList.add("a-hidden");
}

function initBatching() {
  // HACK - Trigger initial batch preparation with an invisible object
  document
    .querySelector("a-scene")
    .querySelector("#batch-prep")
    .setAttribute("media-image", { batch: true, src: initialBatchImage, contentType: "image/png" });
}

function addGlobalEventListeners(scene, entryManager, matrix) {
  scene.addEventListener("scene_selected_media_layer_changed", ({ detail: { selectedMediaLayer } }) => {
    remountJelUI({ selectedMediaLayer });
  });

  scene.addEventListener("preferred_mic_changed", e => {
    const deviceId = e.detail;
    scene.systems["hubs-systems"].mediaStreamSystem.updatePreferredMicDevice(deviceId);
  });

  scene.addEventListener("scene_media_selected", e => {
    const sceneInfo = e.detail;

    performConditionalSignIn(
      () => hubChannel.can("update_hub_meta"),
      () => hubChannel.updateScene(sceneInfo),
      "change-scene"
    );
  });

  // Fired when the user chooses a create action from the create action menu
  scene.addEventListener("create_action_exec", e => {
    const createAction = e.detail;
    let uploadAccept;

    switch (createAction) {
      case "duck":
        scene.emit("add_media", getAbsoluteHref(location.href, ducky));

        if (Math.random() < 0.01) {
          scene.systems["hubs-systems"].soundEffectsSystem.playSoundOneShot(SOUND_SPECIAL_QUACK);
        } else {
          scene.systems["hubs-systems"].soundEffectsSystem.playSoundOneShot(SOUND_QUACK);
        }
        break;
      case "page":
        scene.emit("add_media_text", "page");
        break;
      case "label":
        scene.emit("add_media_text", "label");
        break;
      case "banner":
        scene.emit("add_media_text", "banner");
        break;
      case "vox_new":
        scene.emit("add_media_vox", "");
        break;
      case "voxmoji":
        scene.emit("action_show_emoji_picker", "");
        break;
      case "screen":
        scene.emit("action_share_screen", "");
        break;
      case "video_embed":
      case "image_embed":
      case "pdf_embed":
      case "model_embed":
        scene.emit("action_show_create_embed", createAction.replace("_embed", ""));
        break;
      case "image_upload":
        uploadAccept = "image/*";
        break;
      case "video_upload":
        uploadAccept = "video/*";
        break;
      case "pdf_upload":
        uploadAccept = "application/pdf";
        break;
      case "model_upload":
        uploadAccept = ".glb,.vox";
        break;
    }

    if (uploadAccept) {
      const el = document.querySelector("#file-upload-input");
      el.accept = uploadAccept;
      el.click();
    }
  });

  scene.addEventListener("cursor-lock-state-changed", () => {
    const uiAnimationSystem = scene.systems["hubs-systems"].uiAnimationSystem;

    const cursorLockState = getCursorLockState();
    const panelsCollapsed = uiAnimationSystem.isCollapsingOrCollapsed();

    // Do not affect panels when in ephemeral locking states
    const locked = cursorLockState === CURSOR_LOCK_STATES.LOCKED_PERSISTENT;
    const unlocked = cursorLockState === CURSOR_LOCK_STATES.UNLOCKED_PERSISTENT;

    if (!isInQuillEditor() && !isInEditableField() && ((panelsCollapsed && unlocked) || (!panelsCollapsed && locked))) {
      uiAnimationSystem[panelsCollapsed ? "expandSidePanels" : "collapseSidePanels"]();
    }
  });

  scene.addEventListener("action_focus_chat", () => {
    const chatFocusTarget = document.querySelector(".chat-focus-target");
    chatFocusTarget && chatFocusTarget.focus();
  });

  scene.addEventListener("tips_changed", e => {
    remountUI({ activeTips: e.detail });
  });

  scene.addEventListener("leave_room_requested", () => {
    entryManager.exitScene("left");
    remountUI({ roomUnavailableReason: "left" });
  });

  scene.addEventListener("camera_toggled", () => remountUI({}));

  scene.addEventListener("camera_removed", () => remountUI({}));

  scene.addEventListener("hub_closed", () => {
    scene.exitVR();
    entryManager.exitScene("closed");
    remountUI({ roomUnavailableReason: "closed" });
  });

  scene.addEventListener("action_camera_recording_started", () => spaceChannel.beginRecording());
  scene.addEventListener("action_camera_recording_ended", () => spaceChannel.endRecording());

  scene.addEventListener("action_selected_media_result_entry", e => {
    const { entry, selectAction } = e.detail;
    if ((entry.type !== "scene_listing" && entry.type !== "scene") || selectAction !== "use") return;
    if (!hubChannel.can("update_hub_meta")) return;

    hubChannel.updateScene(entry.url);
  });

  // Handle request for user gesture
  scene.addEventListener("2d-interstitial-gesture-required", () => {
    remountUI({
      showInterstitialPrompt: true,
      onInterstitialPromptClicked: () => {
        remountUI({ showInterstitialPrompt: false, onInterstitialPromptClicked: null });
        scene.emit("2d-interstitial-gesture-complete");
      }
    });
  });

  ["#jel-ui", "#jel-popup-root"].forEach(selector => {
    const el = document.querySelector(selector);
    el.addEventListener("mouseover", () => scene.addState("pointer-exited"));
    el.addEventListener("mouseout", () => scene.removeState("pointer-exited"));
  });

  // The app starts in low quality mode so loading screen runs OK, boost quality once loading is complete.
  // The auto detail system will then lower the quality again if needed.
  let performedInitialQualityBoost = false;

  scene.addEventListener("terrain_chunk_loading_complete", () => {
    if (!performedInitialQualityBoost && !isBotMode) {
      performedInitialQualityBoost = true;

      let setToHighDetail = true;

      if (window.APP.store.state.settings.defaultDetailLevel) {
        const now = Math.floor(new Date() / 1000.0);

        if (window.APP.store.state.settings.defaultDetailLevelUntilSeconds > 1700000000) {
          // TODO Bug workaround, remove after 4/1/21
          window.APP.store.update({ settings: { defaultDetailLevelUntilSeconds: Math.floor(new Date() / 1000) } });
        }

        // The default detail level has an expiration date, for cases where the user has
        // re-configured their machine properly to use the GPU, etc.
        const applyUntil = window.APP.store.state.settings.defaultDetailLevelUntilSeconds;
        const shouldApplyDefaultDetailLevel = now < applyUntil;

        if (shouldApplyDefaultDetailLevel) {
          window.APP.detailLevel = window.APP.store.state.settings.defaultDetailLevel;
          setToHighDetail = false;
        }
      }

      // If not overridden, set the detail level to high and assume auto quality system will handle it.
      if (setToHighDetail) {
        window.APP.detailLevel = 0;
        scene.renderer.setPixelRatio(window.devicePixelRatio);
      }

      mixpanel.track("Event First World Load Complete", {});
    }

    SYSTEMS.atmosphereSystem.enableAmbience();
    SYSTEMS.autoQualitySystem.startTracking();
  });

  scene.addEventListener("action_reset_objects", () => {
    const hubId = hubChannel.hubId;
    const metadata = hubMetadata.getMetadata(hubId);
    if (!metadata || !metadata.template || !metadata.template.name) return;

    resetTemplate(metadata.template.name);
  });

  matrix.addEventListener("left_room_for_hub", ({ detail: { hubId } }) => {
    // If the matrix server kicked us from a room for the current hub, navigate
    // to the home hub for now.
    if (hubChannel.hubId === hubId) {
      const spaceId = spaceChannel.spaceId;
      const homeHub = homeHubForSpaceId(spaceId, accountChannel.memberships);
      navigateToHubUrl(history, homeHub.url);
    }
  });
}

// Attempts to pause a-frame scene and rendering if tabbed away or maximized and window is blurred
function setupGameEnginePausing(scene) {
  const physics = scene.systems["hubs-systems"].physicsSystem;
  const autoQuality = scene.systems["hubs-systems"].autoQualitySystem;
  let disableAmbienceTimeout = null;

  const webglLoseContextExtension = scene.renderer.getContext().getExtension("WEBGL_lose_context");

  const apply = hidden => {
    if (document.visibilityState === "hidden" || hidden) {
      if (document.visibilityState === "visible") {
        scene.pause();

        // THREE bug - if this clock is not stopped we end up lerping audio listener positions over a long duration
        // because getDelta() returns a large value on resume.
        scene.audioListener && scene.audioListener._clock.stop();
        scene.renderer.animation.stop();
        SYSTEMS.externalCameraSystem.stopRendering();
      }

      document.body.classList.add("paused");
      autoQuality.stopTracking();
      physics.updateSimulationRate(1000.0 / 15.0);
      accountChannel.setInactive();
      clearTimeout(disableAmbienceTimeout);

      disableAmbienceTimeout = setTimeout(() => {
        SYSTEMS.atmosphereSystem.disableAmbience();
      }, 15000);
    } else {
      if (!scene.is("off")) {
        if (document.visibilityState === "visible") {
          // Hacky. On some platforms GL context needs to be explicitly restored. So do it.
          // This really shouldn't be necessary :P
          if (
            (!scene.renderer.getContext() || scene.renderer.getContext().isContextLost()) &&
            webglLoseContextExtension
          ) {
            webglLoseContextExtension.restoreContext();
          }

          scene.audioListener && scene.audioListener._clock.start();
          scene.play();
          scene.renderer.animation.start();
          SYSTEMS.externalCameraSystem.startRendering();
          autoQuality.startTracking();
        }

        clearTimeout(disableAmbienceTimeout);
        document.body.classList.remove("paused");
        physics.updateSimulationRate(1000.0 / 90.0);
        accountChannel.setActive();
        SYSTEMS.atmosphereSystem.enableAmbience();
      }
    }
  };

  // Need a timeout since tabbing in browser causes blur then focus rapidly
  let windowBlurredTimeout = null;

  if (!disablePausing) {
    document.addEventListener("visibilitychange", () => apply());

    window.addEventListener("blur", () => {
      // When setting up bridge, bridge iframe can steal focus
      if (SYSTEMS.videoBridgeSystem.isSettingUpBridge) return;

      // May be an iframe, don't pause in that case
      if (document.activeElement.contentWindow && document.activeElement.contentWindow.document.hasFocus()) {
        return;
      }

      const disableBlurHandlerOnceIfVisible = window.APP.disableBlurHandlerOnceIfVisible;
      window.APP.disableBlurHandlerOnceIfVisible = false;

      if (disableBlurHandlerOnceIfVisible && document.visibilityState === "visible") {
        // HACK needed to deal with browser stealing window focus occasionally eg screen share nag
        clearTimeout(windowBlurredTimeout);
        return;
      }

      windowBlurredTimeout = setTimeout(() => {
        apply(true);
      }, 500);
    });

    window.addEventListener("focus", () => {
      clearTimeout(windowBlurredTimeout);
      apply(false);
    });
  }

  scene.addEventListener("stateadded", ({ detail }) => {
    if (detail === "off") {
      apply(true);
    }
  });

  scene.addEventListener("stateremoved", ({ detail }) => {
    if (detail === "off") {
      apply(false);
    }
  });
}

function setupSidePanelLayout(scene) {
  const handleSidebarResizerDrag = (selector, cssVars, isLeft, min, max, xToWidth, storeCallback) => {
    document.querySelector(selector).addEventListener("mousedown", () => {
      const handleMove = e => {
        const w = Math.min(max, Math.max(min, xToWidth(e.clientX)));

        for (let i = 0; i < cssVars.length; i++) {
          document.documentElement.style.setProperty(`--${cssVars[i]}`, `${w}px`);
        }

        SYSTEMS.uiAnimationSystem.applySceneSize(isLeft ? w : null, !isLeft ? w : null, true);
        SYSTEMS.uiAnimationSystem.setTargetSceneSizes();
        scene.resize();

        storeCallback(w);
        e.preventDefault();
      };

      document.addEventListener("mousemove", handleMove);

      document.addEventListener(
        "mouseup",
        () => {
          scene.emit("animated_resize_complete");
          document.removeEventListener("mousemove", handleMove);
        },
        { once: true }
      );
    });
  };

  if (skipPanels) {
    for (const id of ["#nav-drag-target", "#presence-drag-target"]) {
      const el = document.querySelector(id);
      el.parentNode.removeChild(el);
    }
  } else {
    handleSidebarResizerDrag(
      "#nav-drag-target",
      ["nav-width"],
      true,
      400,
      600,
      x => x,
      w => store.update({ uiState: { navPanelWidth: w } })
    );

    handleSidebarResizerDrag(
      "#presence-drag-target",
      ["presence-width"],
      false,
      220,
      300,
      x => window.innerWidth - x,
      w => store.update({ uiState: { presencePanelWidth: w } })
    );
  }
}

function setupVREventHandlers(scene, availableVREntryTypesPromise) {
  const handleEarlyVRMode = () => {
    // If VR headset is activated, refreshing page will fire vrdisplayactivate
    // which puts A-Frame in VR mode, so exit VR mode whenever it is attempted
    // to be entered and we haven't entered the room yet.
    if (scene.is("vr-mode") && !scene.is("vr-entered") && !isMobileVR) {
      console.log("Pre-emptively exiting VR mode.");
      scene.exitVR();
      return true;
    }

    return false;
  };

  scene.addEventListener("enter-vr", () => {
    if (handleEarlyVRMode()) return true;

    if (isMobileVR) {
      // Optimization, stop drawing UI if not visible
      remountUI({ hide: true });
    }

    document.body.classList.add("vr-mode");

    availableVREntryTypesPromise.then(availableVREntryTypes => {
      // Don't stretch canvas on cardboard, since that's drawing the actual VR view :)
      if ((!isMobile && !isMobileVR) || availableVREntryTypes.cardboard !== VR_DEVICE_AVAILABILITY.yes) {
        document.body.classList.add("vr-mode-stretch");
      }
    });
  });

  handleEarlyVRMode();

  // HACK A-Frame 0.9.0 seems to fail to wire up vrdisplaypresentchange early enough
  // to catch presentation state changes and recognize that an HMD is presenting on startup.
  window.addEventListener(
    "vrdisplaypresentchange",
    () => {
      if (scene.is("vr-entered")) return;
      if (scene.is("vr-mode")) return;

      const device = AFRAME.utils.device.getVRDisplay();

      if (device && device.isPresenting) {
        if (!scene.is("vr-mode")) {
          console.warn("Hit A-Frame bug where VR display is presenting but A-Frame has not entered VR mode.");
          scene.enterVR();
        }
      }
    },
    { once: true }
  );

  scene.addEventListener("exit-vr", () => {
    document.body.classList.remove("vr-mode");
    document.body.classList.remove("vr-mode-stretch");

    remountUI({ hide: false });

    // HACK: Oculus browser pauses videos when exiting VR mode, so we need to resume them after a timeout.
    if (/OculusBrowser/i.test(window.navigator.userAgent)) {
      document.querySelectorAll("[media-video]").forEach(m => {
        const videoComponent = m.components["media-video"];

        if (videoComponent) {
          videoComponent._ignorePauseStateChanges = true;

          setTimeout(() => {
            const video = videoComponent.video;

            if (video && video.paused && !videoComponent.data.videoPaused) {
              video.play();
            }

            videoComponent._ignorePauseStateChanges = false;
          }, 1000);
        }
      });
    }
  });
}

async function setupUIBasedUponVRTypes(availableVREntryTypesPromise) {
  const availableVREntryTypes = await availableVREntryTypesPromise;

  if (isMobileVR) {
    remountUI({ availableVREntryTypes, forcedVREntryType: "vr", checkingForDeviceAvailability: false });

    if (/Oculus/.test(navigator.userAgent) && "getVRDisplays" in navigator) {
      // HACK - The polyfill reports Cardboard as the primary VR display on startup out ahead of
      // Oculus Go on Oculus Browser 5.5.0 beta. This display is cached by A-Frame,
      // so we need to resolve that and get the real VRDisplay before entering as well.
      const displays = await navigator.getVRDisplays();
      const vrDisplay = displays.length && displays[0];
      AFRAME.utils.device.getVRDisplay = () => vrDisplay;
    }
  } else {
    const hasVREntryDevice =
      availableVREntryTypes.cardboard !== VR_DEVICE_AVAILABILITY.no ||
      availableVREntryTypes.generic !== VR_DEVICE_AVAILABILITY.no ||
      availableVREntryTypes.daydream !== VR_DEVICE_AVAILABILITY.no;

    remountUI({
      availableVREntryTypes,
      forcedVREntryType: qsVREntryType || (!hasVREntryDevice ? "2d" : null),
      checkingForDeviceAvailability: false
    });
  }
}

function startBotModeIfNecessary(scene, entryManager) {
  if (isBotMode) {
    const onTerrainLoaded = () => {
      // Replace renderer with a noop renderer to reduce bot resource usage.
      runBotMode(scene, entryManager);

      scene.addEventListener("terrain_chunk_loading_complete", onTerrainLoaded);
    };

    scene.addEventListener("terrain_chunk_loading_complete", onTerrainLoaded);
  }
}

async function createSocket(entryManager) {
  let isReloading = false;
  window.addEventListener("beforeunload", () => (isReloading = true));

  const socket = await connectToReticulum(isDebug);

  socket.onClose(e => {
    // We don't currently have an easy way to distinguish between being kicked (server closes socket)
    // and a variety of other network issues that seem to produce the 1000 closure code, but the
    // latter are probably more common. Either way, we just tell the user they got disconnected.
    const NORMAL_CLOSURE = 1000;

    if (e.code === NORMAL_CLOSURE && !isReloading) {
      entryManager.exitScene();
      remountUI({ roomUnavailableReason: "disconnected" });
    }
  });

  return socket;
}

async function start() {
  if (!(await checkPrerequisites())) return;
  mixpanel.track("Startup Start", {});

  const scene = document.querySelector("a-scene");
  const canvas = document.querySelector(".a-canvas");
  scene.renderer.setPixelRatio(1); // Start with low pixel ratio, quality adjustment system will raise

  canvas.setAttribute("tabindex", 0); // Make it so canvas can be focused

  if (navigator.serviceWorker) {
    try {
      navigator.serviceWorker
        .register("/jel.service.js")
        .then(() => {
          navigator.serviceWorker.ready
            .then(registration => {
              subscriptions.setRegistration(registration);
              navigator.serviceWorker.addEventListener("message", event => {
                if (event.data.action === "play_notification_sound") {
                  SYSTEMS.soundEffectsSystem.playSoundOneShot(SOUND_NOTIFICATION);
                }
              });
            })
            .catch(e => console.error(e));
        })
        .catch(e => console.error(e));
    } catch (e) {
      subscriptions.setRegistrationFailed();
    }
  } else {
    subscriptions.setRegistrationFailed();
  }

  const entryManager = new SceneEntryManager(spaceChannel, hubChannel, authChannel, history);

  hideCanvas();

  setupPerformConditionalSignin(entryManager);
  await store.initDefaults();

  warmSerializeElement();
  const quillPoolPromise = initQuillPool();

  window.APP.scene = scene;

  let focusCanvasTimeout = null;

  // Focus canvas if we mouse over it and aren't in an input field
  // Delay the focus change unless we're focused on the body, which means nothing
  // was focused.
  canvas.addEventListener("mouseover", () => {
    if (!isInEditableField()) {
      clearTimeout(focusCanvasTimeout);
      focusCanvasTimeout = setTimeout(() => {
        if (!isInEditableField()) {
          canvas.focus();
        }
      }, document.activeElement === document.body ? 0 : 3000);
    }
  });

  canvas.addEventListener("mouseout", () => {
    clearTimeout(focusCanvasTimeout);
    canvas.blur();
  });

  canvas.focus();

  scene.renderer.debug.checkShaderErrors = false;

  initBatching();

  if (scene.hasLoaded) {
    initPhysicsThreeAndCursor(scene);
  } else {
    scene.addEventListener("loaded", () => initPhysicsThreeAndCursor(scene), { once: true });
  }

  await initAvatar();

  addGlobalEventListeners(scene, entryManager, matrix);
  setupSidePanelLayout(scene);
  setupGameEnginePausing(scene);

  window.dispatchEvent(new CustomEvent("hub_channel_ready"));

  remountUI({ availableVREntryTypes: ONLY_SCREEN_AVAILABLE, checkingForDeviceAvailability: true });
  const availableVREntryTypesPromise = getAvailableVREntryTypes();

  registerNetworkSchemas();

  remountUI({
    authChannel,
    spaceChannel,
    hubChannel,
    linkChannel,
    exitScene: reason => {
      entryManager.exitScene();

      if (reason) {
        remountUI({ roomUnavailableReason: reason });
      }
    },
    initialIsSubscribed: false,
    activeTips: scene.systems.tips.activeTips
  });

  setupVREventHandlers(scene, availableVREntryTypesPromise);
  setupUIBasedUponVRTypes(availableVREntryTypesPromise); // Note no await here, to avoid blocking
  startBotModeIfNecessary(scene, entryManager);
  clearHistoryState(history);

  const socket = await createSocket(entryManager);

  spaceChannel.addEventListener("permissions_updated", ({ detail: { permsToken } }) => {
    const assignJoinToken = () => NAF.connection.adapter.setSpaceJoinToken(permsToken);

    if (NAF.connection.adapter) {
      assignJoinToken();
    } else {
      scene.addEventListener("adapter-ready", assignJoinToken, { once: true });
    }

    const assignCollectionToken = () => SAF.connection.adapter.setCollectionPermsToken(permsToken);

    if (SAF.connection.adapter) {
      assignCollectionToken();
    } else {
      scene.addEventListener("shared-adapter-ready", assignCollectionToken, { once: true });
    }

    remountJelUI({ spaceCan: spaceChannel.can.bind(spaceChannel) });
  });

  hubChannel.addEventListener("permissions_updated", ({ detail: { permsToken } }) => {
    const assignJoinToken = () => NAF.connection.adapter.setHubJoinToken(permsToken);

    if (NAF.connection.adapter) {
      assignJoinToken();
    } else {
      scene.addEventListener("adapter-ready", assignJoinToken, { once: true });
    }

    const assignDocToken = () => SAF.connection.adapter.setDocPermsToken(hubChannel.hubId, permsToken);

    if (SAF.connection.adapter) {
      assignDocToken();
    } else {
      scene.addEventListener("shared-adapter-ready", assignDocToken, { once: true });
    }

    const hubCan = hubMetadata.can.bind(hubMetadata);
    remountJelUI({ hubCan });

    // Switch off building mode if we cannot spawn media
    if (!hubCan("spawn_and_move_media", hubChannel.hubId)) {
      if (SYSTEMS.builderSystem.enabled) {
        SYSTEMS.builderSystem.toggle();
        SYSTEMS.launcherSystem.toggle();
      }
    }
  });

  scene.addEventListener("adapter-ready", () => NAF.connection.adapter.setClientId(socket.params().session_id));

  authChannel.setSocket(socket);

  remountUI({
    onLoaded: () => store.executeOnLoadActions(scene),
    onMediaSearchResultEntrySelected: (entry, selectAction) =>
      scene.emit("action_selected_media_result_entry", { entry, selectAction }),
    onMediaSearchCancelled: entry => scene.emit("action_media_search_cancelled", entry),
    onAvatarSaved: entry => scene.emit("action_avatar_saved", entry)
  });

  let nextSpaceToJoin;
  let nextHubToJoin;
  let joinSpacePromise;
  let joinHubPromise;

  const { token } = store.state.credentials;
  let membershipsPromise;
  let isInitialAccountChannelJoin = true;

  if (token) {
    console.log(`Logged into account ${store.credentialsAccountId}`);

    const accountPhxChannel = socket.channel(`account:${store.credentialsAccountId}`, { auth_token: token });

    membershipsPromise = new Promise((res, rej) => {
      accountPhxChannel
        .join()
        .receive("ok", async accountInfo => {
          const { session_id: sessionId, subscriptions: existingSubscriptions } = accountInfo;
          accountChannel.syncAccountInfo(accountInfo);

          remountJelUI({
            memberships: accountChannel.memberships,
            hubSettings: accountChannel.hubSettings
          });

          if (isInitialAccountChannelJoin) {
            if (!skipNeon) {
              // Initialize connection to matrix homeserver.
              await matrix.init(
                scene,
                subscriptions,
                sessionId,
                accountInfo.matrix_homeserver,
                accountInfo.matrix_token,
                accountInfo.matrix_user_id
              );
              remountJelUI({ roomForHubCan: matrix.roomForHubCan.bind(matrix) });
            }

            isInitialAccountChannelJoin = false;
          }

          subscriptions.handleExistingSubscriptions(existingSubscriptions);

          res(accountChannel.memberships);
        })
        .receive("error", res => {
          console.error(res);
          rej();
        });
    });
    accountChannel.bind(accountPhxChannel);
  } else {
    membershipsPromise = Promise.resolve([]);
  }

  const performJoin = async () => {
    // Handle rapid history changes, only join last one.
    const spaceId = getSpaceIdFromHistory(history);
    const hubId = getHubIdFromHistory(history);

    nextSpaceToJoin = spaceId;
    nextHubToJoin = hubId;

    if (joinSpacePromise) await joinSpacePromise;
    joinSpacePromise = null;

    if (joinHubPromise) await joinHubPromise;
    joinHubPromise = null;

    if (spaceChannel.spaceId !== spaceId && nextSpaceToJoin === spaceId) {
      joinSpacePromise = joinSpace(
        socket,
        history,
        subscriptions,
        entryManager,
        remountUI,
        remountJelUI,
        membershipsPromise
      );
      await joinSpacePromise;
    }

    if (joinHubPromise) await joinHubPromise;
    joinHubPromise = null;

    if (hubChannel.hubId !== hubId && nextHubToJoin === hubId) {
      joinHubPromise = joinHub(scene, socket, history, entryManager, remountUI, remountJelUI);
      await joinHubPromise;
    }
  };

  await quillPoolPromise;

  history.listen(performJoin);
  mixpanel.track("Startup Joining", {});
  await performJoin();
  mixpanel.track("Startup Joined", {});

  entryManager.enterScene(false);
}

document.addEventListener("DOMContentLoaded", start);
