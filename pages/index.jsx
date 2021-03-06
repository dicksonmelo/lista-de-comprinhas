import React, { useState } from "react";
import { FaItunesNote, FaTrash } from "react-icons/fa";
import { AiOutlineCheckCircle, AiFillCheckCircle } from "react-icons/ai";
import Head from "next/head";

const App = () => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState();
  const [value, setValue] = useState("");

  function idGen() {
    return Math.random() * 10000;
  }

  const clearValue = () => {
    setValue('');
  }

  const clearEditingItem = () => {
    setEditingItem(null);
  }

  const handleAddItem = (addValue) => {
    setItems([
      {
        id: idGen(),
        name: addValue,
        isCompleted: false,
      },
      ...items,
    ]);
  };

  const updateItem = (itemID, updateValue) => {
    const itemIndex = items.findIndex(item => item.id === itemID);

    if (itemIndex < 0) {
      console.log('item not found');
      return;
    }
  
    const itemsCopy = [...items];
    itemsCopy[itemIndex] = {...items[itemIndex], name: updateValue};
    setItems(itemsCopy);
    clearEditingItem();

    console.log('itemID: ', itemID);
    console.log('item index: ', itemIndex);
    console.log('item copy: ', itemsCopy);
    console.log('items: ', items);
  };

  const canUpdate = () => {

    if (!items.length) {
      return false;
    }

    if (items.length > 1) {
      return false;
    }

    return true;
  };

  const handleChecked = (id) => {
    const checkedItems = items.map((item) => {
      return item.id === id
        ? { ...item, isCompleted: !item.isCompleted }
        : item;
    });

    setItems(checkedItems);
    if (canUpdate() && checkedItems[0].isCompleted) {
      setValue(checkedItems[0].name);
      setEditingItem(checkedItems[0]);
      return;
    }

    setValue('');
    clearEditingItem();
  };

  const deleteCheckedItems = (id) => {
    const newItems = items.filter(
      (item) => (item.id !== id) & (item.isCompleted === false)
    );

    setItems(newItems);
    clearEditingItem();
    setValue('');
  };

  const deleteItem = (id) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
    clearEditingItem();
    setValue('');
  };

  const onSubmit = () => {

    console.log('value: ', value);
    console.log('editingItem: ', editingItem);
    console.log('items: ', items);
    if (!value.length) {
      return;
    }

    if (canUpdate()) {
      updateItem(editingItem.id, value);
    } else {
      handleAddItem(value);
    }

    clearValue();
  }

  return (
    <div className="container">
      {items.length === 0 ? (
        <Head>
          <title>Nenhum item adicionado</title>
        </Head>
      ) : items.length === 1 ? (
        <Head>
          <title>1 item</title>
        </Head>
      ) : (
        <Head>
          <title>{items.length} itens</title>
        </Head>
      )}

      <h1>Lista de Compras</h1>
      <input
        type="text"
        value={value}
        className="item-input"
        onKeyPress={(e) => e.key === "Enter" && onSubmit()}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Não esqueça dos legumes..."
      />
      <br />
      <div className="buttons">
        <button onClick={onSubmit} className="add-button">
          Adicionar item
        </button>
        <button onClick={deleteCheckedItems} className="delete-button">
          Excluir itens marcados
        </button>
      </div>
      <div>
        {items.map((item) => (
          <div className="item-list" key={item.id}>
            <span className="item-list-span">
              <button type="checkbox" onClick={() => handleChecked(item.id)}>
                {item.isCompleted === false ? (
                  <AiOutlineCheckCircle size={23} className="check-button" />
                ) : (
                  <AiFillCheckCircle size={23} className="check-button" />
                )}
              </button>

              {item.isCompleted === false ? (
                <p>{item.name}</p>
              ) : (
                <p className="complete">{item.name}</p>
              )}
            </span>
            <FaTrash
              style={{ cursor: "pointer" }}
              onClick={() => deleteItem(item.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
