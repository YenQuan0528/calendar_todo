import React, { useState } from 'react'
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd'

const Test = () => {
  const [items, setItems] = useState(['A', 'B', 'C'])
  const onDragEnd = (result) => {
    const { source, destination } = result

    // 如果目的地都沒變就跳出
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    // 製作新的 items
    const newItems = [...items]

    // 把兩個索引的值對調，相當於 [a, b] = [b, a]
    ;[newItems[source.index], newItems[destination.index]] = [
      newItems[destination.index],
      newItems[source.index],
    ]

    // 設定新的 items
    setItems(newItems)
  }
  return (
    <div className="border w-80 mx-auto mt-2 p-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <h1 className="border-b mb-4 pb-2 text-4xl">Todo</h1>
        <main>
          <Droppable droppableId="drop-id">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {items.map((item, i) => (
                  <div key={item}>
                    <Draggable draggableId={item} index={i}>
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className="mt-4 p-2 border rounded-sm"
                        >
                          {item}
                        </div>
                      )}
                    </Draggable>
                  </div>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </main>
      </DragDropContext>
    </div>
  )
}

export default Test
