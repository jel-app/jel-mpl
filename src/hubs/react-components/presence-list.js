import configs from "../utils/configs";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import classNames from "classnames";

import rootStyles from "../../assets/hubs/stylesheets/ui-root.scss";
import styles from "../../assets/hubs/stylesheets/presence-list.scss";
import maskEmail from "../utils/mask-email";
import StateLink from "./state-link.js";
import { WithHoverSound } from "./wrap-with-audio";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons/faPencilAlt";
import { faDesktop } from "@fortawesome/free-solid-svg-icons/faDesktop";
import { faVideo } from "@fortawesome/free-solid-svg-icons/faVideo";
import hmdIcon from "../../assets/hubs/images/hmd-icon.svgi";
import { faMobileAlt } from "@fortawesome/free-solid-svg-icons/faMobileAlt";
import { pushHistoryPath, withSlug } from "../utils/history";
import { hasReticulumServer } from "../utils/phoenix-utils";
import { InlineSVG } from "./svgi";
import { faVolumeMute } from "@fortawesome/free-solid-svg-icons/faVolumeMute";
import { faVolumeOff } from "@fortawesome/free-solid-svg-icons/faVolumeOff";
import { faVolumeUp } from "@fortawesome/free-solid-svg-icons/faVolumeUp";

const MIC_PRESENCE_UPDATE_FREQUENCY = 500;

function getPresenceIcon(ctx) {
  if (ctx && ctx.hmd) {
    return <InlineSVG src={hmdIcon} />;
  } else if (ctx && ctx.mobile) {
    return <FontAwesomeIcon icon={faMobileAlt} />;
  } else {
    return <FontAwesomeIcon icon={faDesktop} />;
  }
}

function getMicrophonePresenceIcon(microphonePresence) {
  if (microphonePresence.muted) {
    return <FontAwesomeIcon icon={faVolumeMute} />;
  } else if (microphonePresence.talking) {
    return <FontAwesomeIcon icon={faVolumeUp} />;
  } else {
    return <FontAwesomeIcon icon={faVolumeOff} />;
  }
}

export function navigateToClientInfo(history, clientId) {
  const currentParams = new URLSearchParams(history.location.search);

  if (hasReticulumServer() && document.location.host !== configs.RETICULUM_SERVER) {
    currentParams.set("client_id", clientId);
    pushHistoryPath(history, history.location.pathname, currentParams.toString());
  } else {
    pushHistoryPath(history, withSlug(history.location, `/clients/${clientId}`), currentParams.toString());
  }
}

export default class PresenceList extends Component {
  static propTypes = {
    hubChannel: PropTypes.object,
    hubPresences: PropTypes.object,
    spacePresences: PropTypes.object,
    history: PropTypes.object,
    sessionId: PropTypes.string,
    signedIn: PropTypes.bool,
    email: PropTypes.string,
    onSignIn: PropTypes.func,
    onSignOut: PropTypes.func,
    expanded: PropTypes.bool,
    onExpand: PropTypes.func
  };

  updateMicrophoneState = () => {
    if (this.props.expanded) {
      const microphonePresences = new Map();
      this.setState({ microphonePresences });
    }
    this.timeout = setTimeout(this.updateMicrophoneState, MIC_PRESENCE_UPDATE_FREQUENCY);
  };

  navigateToClientInfo = clientId => {
    navigateToClientInfo(this.props.history, clientId);
  };

  mute = clientId => {
    this.props.hubChannel.mute(clientId);
  };

  muteAll = () => {
    const presences = this.props.hubPresences;
    for (const [clientId, presence] of Object.entries(presences)) {
      if (clientId !== this.props.sessionId) {
        const meta = presence.metas[0];
        if (meta.presence === "room" && meta.roles && !meta.roles.owner) {
          this.mute(clientId);
        }
      }
    }
  };

  domForPresence = ([sessionId, hubData]) => {
    const hubMeta = hubData.metas[hubData.metas.length - 1];
    const spacePresence = this.props.spacePresences[sessionId];
    const spaceMetas = spacePresence && spacePresence.metas;
    if (!spacePresence || !spaceMetas || spaceMetas.length === 0) return <div />;

    const { context, profile, streaming, recording, presence } = spaceMetas[spaceMetas.length - 1];
    const icon = streaming || recording ? <FontAwesomeIcon icon={faVideo} /> : getPresenceIcon(context);
    const isEntering = context && context.entering;
    const isOwner = hubMeta.roles && hubMeta.roles.owner;
    const messageId = isEntering ? "presence.entering" : `presence.in_${presence}`;
    const badge = isOwner && (
      <span className={styles.moderatorBadge} title="Moderator">
        &#x2605;
      </span>
    );
    const microphonePresence =
      this.state && this.state.microphonePresences && this.state.microphonePresences.get(sessionId);
    const micState = microphonePresence && presence === "room" ? getMicrophonePresenceIcon(microphonePresence) : "";
    const canMuteUsers = this.props.hubChannel.can("mute_users");
    const isMe = sessionId === this.props.sessionId;
    const muted = microphonePresence && microphonePresence.muted;
    const canMuteIndividual = canMuteUsers && !isMe && microphonePresence && !microphonePresence.muted;

    return (
      <WithHoverSound key={sessionId}>
        <div className={styles.row}>
          <div className={styles.icon}>
            <i>{icon}</i>
          </div>
          <div
            className={classNames({
              [styles.iconRed]: muted,
              [styles.icon]: !muted,
              [styles.iconButton]: canMuteIndividual
            })}
            onClick={() => (canMuteUsers ? this.mute(sessionId) : null)}
          >
            <i>{micState}</i>
          </div>
          <div
            className={classNames({
              [styles.listItem]: true
            })}
          >
            {sessionId === this.props.sessionId ? (
              <StateLink className={styles.self} stateKey="overlay" stateValue="profile" history={this.props.history}>
                {profile && profile.displayName}
                {badge}
                <i>
                  <FontAwesomeIcon icon={faPencilAlt} />
                </i>
              </StateLink>
            ) : (
              <div>
                {
                  <button className={styles.clientLink} onClick={() => this.navigateToClientInfo(sessionId)}>
                    {profile && profile.displayName}
                  </button>
                }
                {badge}
              </div>
            )}
          </div>
          <div className={styles.presence}>
            <FormattedMessage id={messageId} />
          </div>
        </div>
      </WithHoverSound>
    );
  };

  componentDidMount() {
    this.updateMicrophoneState();
    document.querySelector(".a-canvas").addEventListener(
      "mouseup",
      () => {
        this.props.onExpand(false);
      },
      { once: true }
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  renderExpandedList() {
    const hubMeta = this.props.hubPresences[this.props.sessionId].metas[0];
    const owner = hubMeta.roles && hubMeta.roles.owner;
    const muteAll = owner && (
      <div className={styles.muteAll}>
        <button title="Mute All" onClick={this.muteAll} className={styles.muteButton}>
          <FormattedMessage id="presence.mute_all" />
        </button>
      </div>
    );

    return (
      <div className={styles.presenceList}>
        <div className={styles.attachPoint} />
        <div className={styles.contents}>
          {muteAll}
          <div className={styles.rows}>
            {Object.entries(this.props.hubPresences || {})
              .filter(([k]) => k === this.props.sessionId)
              .map(this.domForPresence)}
            {Object.entries(this.props.hubPresences || {})
              .filter(([k]) => k !== this.props.sessionId)
              .map(this.domForPresence)}
          </div>
          <div className={styles.signIn}>
            {this.props.signedIn ? (
              <div>
                <span>
                  <FormattedMessage id="sign-in.as" /> {maskEmail(this.props.email)}
                </span>{" "}
                <a onClick={this.props.onSignOut}>
                  <FormattedMessage id="sign-in.out" />
                </a>
              </div>
            ) : (
              <a onClick={this.props.onSignIn}>
                <FormattedMessage id="sign-in.in" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const occupantCount = this.props.hubPresences ? Object.entries(this.props.hubPresences).length : 0;
    return (
      <div>
        <button
          title="Members"
          aria-label={`Toggle list of ${occupantCount} member${occupantCount === 1 ? "" : "s"}`}
          onClick={() => {
            this.props.onExpand(!this.props.expanded);
          }}
          className={classNames({
            [rootStyles.presenceListButton]: true,
            [rootStyles.presenceInfoSelected]: this.props.expanded
          })}
        >
          <FontAwesomeIcon icon={faUsers} />
          <span className={rootStyles.occupantCount}>{occupantCount}</span>
        </button>
        {this.props.expanded && this.renderExpandedList()}
      </div>
    );
  }
}
