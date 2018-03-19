import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import 'moment-duration-format'
import _ from 'lodash'

import style from './style.css'
import request from '../AuthInterceptor'
import LoadingIcon from '../LoadingIcon'
import PopupHeader from '../PopupHeader'
import PopupNav from '../PopupNav'
import TaskDetail from '../TaskDetail'

const baseUrl = 'https://runrun.it'

class ClosedTasksPage extends React.Component {
  constructor(props) {
    super(props)
    
    this.setState({
      tasks: undefined,
      taskExpanded: undefined
    })
    
    _.bindAll('handleTaskDetailToggle', 'handleGetList', 'handleReopen', 'isCurrentTask')
  }

  isCurrentTask(task) {
    return this.state.taskExpanded === task.id
  }

  componentDidMount() {
    this.handleGetList()
  }

  handleGetList() {
    if (localStorage.getItem("user")) {
      const { id } = JSON.parse(localStorage.getItem("user"))
      request.get(`${baseUrl}/api/v1.0/tasks`, {
        params: {
          responsible_id: id,
          is_closed: true,
          limit: 10
        }
      })
      .then(({ data }) => this.setState({ tasks: data }))
    }
  }

  handleReopen(id) {
    request.post(`${baseUrl}/api/v1.0/tasks/${id}/reopen`)
      .then(response => this.handleGetList())
  }

  handleTaskDetailToggle(id) {
    this.setState({
      taskExpanded: this.state.taskExpanded === id ? undefined : id
    })
  }

  render() {
    const timer = seconds => moment.duration(seconds, 'seconds').format('HH:mm', { trim:false })

    const tasks = (() => {
      if(!localStorage.getItem("appkey"))
        return (
          <li className="text-center">
            Welcome to Runrun.it Task Manager!<br />
            Click <a href="options.html" target="_blank">here</a> to set up your Runrun.it account.
          </li>
        )
      else if(this.state.tasks === undefined)
        return (
          <li className="text-center"><LoadingIcon visible={true} /></li>
        )
      else if(this.state.tasks instanceof Array && this.state.tasks.length === 0)
        return (
          <li className="text-center">
            You don't have closed tasks at the moment.
          </li>
        )
      else
        return this.state.tasks.map((task, index) => (
          <li key={index} className="list-group-item">
            <a href={`${baseUrl}/tasks/${task.id}`} target="_blank">
              {task.id} - {task.title}
            </a>
            <div className="text-size-sm pb-1">
              {task.client_name} > {task.project_name} - {task.type_name} 
              <button  type="button" className="btn btn-secondary btn-xs" onClick={this.handleTaskDetailToggle(task.id)}> 
                <span 
                  data-glyph="{this.isCurrentTask() ? 'minus' : 'plus'}" 
                  className="oi" />
              </button>
              {this.isCurrentTask() ? <TaskDetail task={task} /> : ""}
            </div>
            <div>
              <button type="button" className={`btn btn-${(task.current_estimate_seconds != 0 && task.time_worked > task.current_estimate_seconds)?'danger':'info'} btn-sm nohover`}>
                <span data-glyph="timer" className="oi"></span> 
                  {timer(task.time_worked)} 
                  {task.current_estimate_seconds ? `/ ${timer(task.current_estimate_seconds)}` : ""}
              </button> 
              <button type="button" 
                className="btn btn-sm btn-primary" 
                onClick={this.handleReopen(task.id)}>
                REOPEN
              </button>
            </div>
          </li>
        ))
    })()

    return (
      <div>
        <div>
          <PopupHeader title="Tasks" />
          <PopupNav />
        </div>
        <div className="text-center text-secondary text-size-sm">
          * last ten tasks completed.
        </div>
        <ul className={`list-group ${style.ClosedTasksPage}`}>
          {tasks}
        </ul>
      </div>
    )

  }
}

export default ClosedTasksPage