import React from 'react'
import style from './style.css'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import { baseUrl } from '../../config'
import { localStorage } from '../../utils/globals'

class PopupHeader extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    if (!localStorage.getItem('appkey')) {
      return (
        <span />
      )
    } else {
      return (
        <header className={style.RunrunHeader}>
          <div className={style.RunrunHeader__left}>
            <a href={`${baseUrl}/en-US/tasks`} target='_blank'>
              <img src='images/rr.svg' className={style.RunrunIcon} />
            </a>
            <span className={style.RunrunHeader__left_title}>{this.props.title}</span>
            <span>RUNRUN.IT</span>
          </div>
          <div className={style.RunrunHeader__right}>
            <a href='options.html' target='_blank'><img src='/images/gear.svg' className={style.Settings} /></a>
          </div>
        </header>
      )
    }
  }
}

PopupHeader.propTypes = {
  title: PropTypes.string.isRequired
}

export default PopupHeader
