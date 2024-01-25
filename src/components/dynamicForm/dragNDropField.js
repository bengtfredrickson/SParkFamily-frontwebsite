import React, { useState } from "react";
import MyEditor from "./Editor";
import { RiDragMove2Line } from "react-icons/ri";
// import "./App.css";

const DragNDropField = () => {
  const [items, setItems] = useState([
    // { id: 1, name: 'Kristina Zasiadko', image: 'https://media.geeksforgeeks.org/wp-content/uploads/20230816223829/geeksgforgeeks-logo-1.png' },
    // { id: 2, name: 'John Doe', image: 'https://media.geeksforgeeks.org/wp-content/uploads/20230721212159/gfg-logo.jpeg' },
    // { id: 3, name: 'Jane Smith', image: 'https://media.geeksforgeeks.org/wp-content/uploads/20230909123918/GeeksforGeeks-Wide-logo-black.png' },
    { id: 1, name: "My Editor", editor: <MyEditor /> },
    { id: 2, name: "My Editor", editor: <div> test</div> },
    { id: 3, name: "My Editor", editor: <MyEditor /> },
  ]);
  const [draggingItem, setDraggingItem] = useState(null);
  //   const [newItemName, setNewItemName] = useState("");
  //   const [newItemImage, setNewItemImage] = useState("");

  const handleDragStart = (e, item) => {
    setDraggingItem(item);
    e.dataTransfer.setData("text/plain", "");
  };

  const handleDragEnd = () => {
    setDraggingItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetItem) => {
    if (!draggingItem) return;

    const currentIndex = items.indexOf(draggingItem);
    const targetIndex = items.indexOf(targetItem);

    if (currentIndex !== -1 && targetIndex !== -1) {
      const newItems = [...items];
      newItems.splice(currentIndex, 1);
      newItems.splice(targetIndex, 0, draggingItem);
      setItems(newItems);
    }
  };

  //   const handleNameChange = (e) => {
  //     setNewItemName(e.target.value);
  //   };

  //   const handleImageChange = (e) => {
  //     setNewItemImage(e.target.value);
  //   };

  //   const addNewItem = () => {
  //     const newItemId = Math.max(...items.map((item) => item.id)) + 1;
  //     const newItem = { id: newItemId, name: newItemName, image: newItemImage };

  //     setItems([...items, newItem]);
  //     setNewItemName("");
  //     setNewItemImage("");
  //   };

  return (
    <div className="sortable-list">
      <div className="new-item"></div>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`item ${item === draggingItem ? "dragging" : ""}`}
          draggable="true"
          onDragStart={(e) => handleDragStart(e, item)}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, item)}
        >
          <div className="details">
            <div className="editor-container">{item.editor}</div>
          </div>
          <RiDragMove2Line />
        </div>
      ))}
    </div>
  );
};

export default DragNDropField;
