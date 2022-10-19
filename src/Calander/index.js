import FullCalendar from '@fullcalendar/react'
import daygridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useState, useEffect } from 'react'
import '../style/clander.scss'
import Todo from './Todo/Todo'
import { IconContext } from 'react-icons'
import { GrAdd } from 'react-icons/gr'
import { MdDeleteForever } from 'react-icons/md'
import date from 'date-and-time'
const Index = () => {
  const [events, setEvents] = useState([])
  const [addWindow, setAddWindow] = useState(false)
  const [editWindow, setEditWindow] = useState(false)
  const [info, setInfo] = useState({})
  const [todos, setTodos] = useState([])
  useEffect(() => {
    if (localStorage.getItem('clanderEventTodo') === null) {
      return
    }
    setEvents(JSON.parse(localStorage.getItem('clanderEventTodo')))
  }, [])
  useEffect(() => {
    localStorage.setItem('clanderEventTodo', JSON.stringify(events))
  }, [events, todos])
  const handleSelect = (info) => {
    setAddWindow(true)
    setInfo(info)
  }

  const eventClick = (info) => {
    setAddWindow(true)
    setEditWindow(true)
    setInfo(info)
  }
  const eventChange = (info) => {
    const { event } = info
    const valueObject = {
      date: event.startStr,
    }
    const newEvent = events.map((v) => {
      return event.id === v.id ? { ...v, ...valueObject } : { ...v }
    })
    setEvents(newEvent)
  }

  useEffect(() => {
    const { event } = info
    setTodos([])
    if (editWindow === false) {
      return
    }
    const [todo] = events.filter((v) => {
      return v.id === event.id
    })
    setTodos(todo.todos)
  }, [editWindow])

  function delEvent(info) {
    const { event } = info
    const newEvent = events.filter((v2, i2) => {
      return event.id !== v2.id
    })
    setEvents(newEvent)
  }
  //eventContent 自定義樣式及 onClick
  const EventItem = ({ info }) => {
    const { event } = info
    return (
      <div className="event">
        <p className="title" onClick={() => eventClick(info)}>
          {event.title}
        </p>
        <i className="deleteGroup" onClick={() => delEvent(info)}>
          <IconContext.Provider
            value={{
              color: '#000',
              size: '1rem',
              className: 'deleteIcon',
            }}
          >
            <MdDeleteForever />
          </IconContext.Provider>
        </i>
      </div>
    )
  }
  return (
    <div className="container">
      <FullCalendar
        editable
        selectable
        // select={handleSelect}
        locale="zh-tw"
        events={events}
        eventContent={(info) => <EventItem info={info} />}
        // eventClick={eventClick}
        eventChange={eventChange}
        plugins={[daygridPlugin, interactionPlugin]}
        headerToolbar={{
          start: 'prevYear nextYear',
          center: 'title',
          end: 'prev today next',
        }}
        buttonText={{
          today: '今天',
        }}
        views={{
          dayGridMonth: {
            dayCellContent(item) {
              const now = new Date()
              let today = date.format(now, 'YYYY/MM/DD')
              let itemDate = date.format(item.date, 'YYYY/MM/DD')
              return (
                <>
                  <button
                    className="addEvent"
                    onClick={() => {
                      handleSelect(item)
                    }}
                  >
                    <GrAdd />
                  </button>
                  <label className={itemDate === today ? 'today' : ''}>
                    {item.date.getDate()}
                  </label>
                </>
              )
            },
            dayHeaderContent(item) {
              return (
                <p
                  style={{
                    color:
                      item.text === '週六' || item.text === '週日'
                        ? 'red'
                        : null,
                  }}
                >
                  {item.text}
                </p>
              )
            },
          },
        }}
      />
      {addWindow ? (
        <Todo
          events={events}
          setEvents={setEvents}
          info={info}
          setPopWindow={setAddWindow}
          todos={todos}
          setTodos={setTodos}
          editWindow={editWindow}
          setEditWindow={setEditWindow}
        />
      ) : (
        ''
      )}
    </div>
  )
}

export default Index
