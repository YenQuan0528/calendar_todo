import React, { useState, useEffect } from 'react'
import { IconContext } from 'react-icons'
import { BsList } from 'react-icons/bs'
import { AiTwotoneDelete } from 'react-icons/ai'

function TodoItem({
  updateTodo,
  deleteTodo,
  v,
  provided,
  snapshot,
  dragStart,
}) {
  const [newTodo, setNewTodo] = useState(v.text)
  useEffect(() => {
    updateTodo(v.id, { text: newTodo })
  }, [newTodo])
  return (
    <>
      <li
        className={`todoItemList ${snapshot.isDragging ? 'dark' : ''} ${
          dragStart ? 'itemBorder' : ''
        }`}
        key={v.id}
        {...provided.draggableProps}
        ref={provided.innerRef}
      >
        {/* 勾選完成/未完成用 */}
        <div className="itemGroup">
          <input
            type="checkbox"
            id={v.id}
            checked={v.completed}
            onChange={() => {
              // 拷貝+改變目前的這個id資料的completed
              updateTodo(v.id, { completed: !v.completed })
            }}
          />
          <input
            type="text"
            value={newTodo}
            className={`itemText ${v.completed ? 'delLine' : ''}`}
            onChange={(e) => {
              setNewTodo(e.target.value)
            }}
          />
        </div>
        <button
          className="iconBtn"
          onClick={() => {
            deleteTodo(v.id)
          }}
        >
          <IconContext.Provider
            value={{
              color: '#000',
              size: '1rem',
              className: 'deleteIcon',
            }}
          >
            <AiTwotoneDelete />
          </IconContext.Provider>
        </button>
        <div {...provided.dragHandleProps}>
          <BsList />
        </div>
      </li>
    </>
  )
}

export default TodoItem
