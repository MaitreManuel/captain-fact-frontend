import React from "react"
import { connect } from "react-redux"
import { translate } from 'react-i18next'

import { ErrorView } from "../Utils"
import { isAuthenticated } from "../../state/users/current_user/selectors"
import { joinCommentsChannel, leaveCommentsChannel } from '../../state/video_debate/comments/effects'
import { joinStatementsChannel, leaveStatementsChannel } from '../../state/video_debate/statements/effects'
import { joinVideoDebateChannel, leaveVideoDebateChannel } from '../../state/video_debate/effects'
import { resetVideoDebate } from '../../state/video_debate/actions'
import { ColumnVideo } from './ColumnVideo'
import { ColumnDebate } from './ColumnDebate'


@connect(state => ({
  videoErrors: state.VideoDebate.video.errors,
  authenticated: isAuthenticated(state),
}), {
  joinVideoDebateChannel, joinCommentsChannel, joinStatementsChannel,
  leaveCommentsChannel, leaveStatementsChannel, leaveVideoDebateChannel,
  resetVideoDebate
})
@translate('videoDebate')
export class VideoDebate extends React.PureComponent {
  componentDidMount() {
    // Join channels
    const { videoId } = this.props.params
    if (videoId) {
      this.props.joinVideoDebateChannel(videoId)
      this.props.joinStatementsChannel(videoId)
      this.props.joinCommentsChannel(videoId)
    }
  }

  componentWillUnmount() {
    this.props.leaveCommentsChannel()
    this.props.leaveStatementsChannel()
    this.props.leaveVideoDebateChannel()
    this.props.resetVideoDebate()
  }

  render() {
    if (this.props.videoErrors)
      return <ErrorView error={this.props.videoErrors}/>
    return (
      <div id="video-show" className="columns is-gapless">
        <ColumnVideo view={this.props.route.view}/>
        <ColumnDebate view={this.props.route.view} videoId={this.props.params.videoId}/>
      </div>
    )
  }
}
