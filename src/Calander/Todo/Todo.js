import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import TodoItem from './TodoItem'
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd'
const AddTodo = ({
  info,
  setEvents,
  events,
  setPopWindow,
  todos,
  setTodos,
  editWindow,
  setEditWindow,
}) => {
  const { event } = info
  // 文字輸入框用state
  const [inputValue, setInputValue] = useState('')
  const [titleValue, setTitleValue] = useState(event ? event.title : '')
  const [dragStart, setDragStart] = useState(false)

  //新增Event
  function add() {
    const year = `${info.date.getFullYear()}`
    const month =
      info.date.getMonth() < 9
        ? `0${info.date.getMonth() + 1}`
        : `${info.date.getMonth() + 1}`
    const day =
      info.date.getDate() < 10
        ? `0${info.date.getDate()}`
        : `${info.date.getDate()}`
    const date = `${year}-${month}-${day}`
    setEvents([
      ...events,
      {
        date: date,
        title: titleValue ? titleValue : 'Untitled',
        id: uuidv4(),
        todos: todos,
      },
    ])
  }
  //編輯Event
  function edit() {
    const valueObject = {
      title: titleValue ? titleValue : 'Untitled',
      todos: todos,
    }
    const newEvent = events.map((v) => {
      return event.id === v.id ? { ...v, ...valueObject } : { ...v }
    })
    setEvents(newEvent)
  }

  function exit() {
    editWindow ? edit() : add()
    setPopWindow(false)
    setEditWindow(false)
    setTodos([])
  }

  // 新增todo
  const addTodo = (e) => {
    // 如果沒輸入值，就中止之後的程式執行
    if (inputValue === '') return
    if ((e.type === 'keydown' && e.key === 'Enter') || e.type === 'click') {
      const newObj = {
        id: uuidv4(),
        text: inputValue,
        completed: false,
      }
      setTodos([...todos, newObj])

      // 清空原本的文字輸入框
      setInputValue('')
    }
  }

  // 刪除todo
  const deleteTodo = (id) => {
    // 刪除這個id的資料 相當於 回傳一個新的陣列不包含此id的資料
    const newTodos = todos.filter((v2, i2) => {
      return id !== v2.id
    })
    setTodos(newTodos)
  }

  // 更新todo
  const updateTodo = (id, valueObject) => {
    const newTodos = todos.map((v2, i2) => {
      return id === v2.id ? { ...v2, ...valueObject } : { ...v2 }
    })
    setTodos(newTodos)
  }
  const onDragEnd = (result) => {
    const { source, destination } = result
    if (!destination) return
    if (destination.index === source.index) return
    let newTodos = [...todos]
    let add = newTodos[source.index]
    newTodos.splice(source.index, 1)
    newTodos.splice(destination.index, 0, add)
    setTodos(newTodos)
    setDragStart(false)
  }
  return (
    <>
      <DragDropContext
        onDragEnd={onDragEnd}
        onDragStart={() => setDragStart(true)}
      >
        <div className="mask" onClick={exit}></div>
        <div className="inner">
          <div></div>
          <div className="color-block"></div>
          <input
            type="text"
            name="title"
            id="title"
            className="title-input"
            value={titleValue}
            onChange={(e) => {
              setTitleValue(e.target.value)
            }}
            placeholder="Untitled"
          />
          <input
            type="text"
            className="addTodoItem"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
            }}
            onKeyDown={addTodo}
            placeholder="add todo"
          />
          <Droppable droppableId="drop-id">
            {(provided) => (
              <ul
                className="todoItem"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {todos.map((v, i) => (
                  <Draggable key={v.id} draggableId={v.id} index={i}>
                    {(provided, snapshot) => (
                      <TodoItem
                        snapshot={snapshot}
                        provided={provided}
                        key={v.id}
                        updateTodo={updateTodo}
                        deleteTodo={deleteTodo}
                        v={v}
                        dragStart={dragStart}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </>
  )
}

export default AddTodo
