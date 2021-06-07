import React, { useReducer } from "react";
import { FaTrash } from "react-icons/fa";
import { AiOutlineCheckCircle, AiFillCheckCircle } from "react-icons/ai";
import Head from "next/head";
import { nanoid } from "nanoid";

const initialAppState = {
  items: [],
  editingItem: null,
  markedIds: [],
  value: ""
};

function upsertItem(currentItems, itemToBeUpserted) {
  if (!currentItems.find((item) => item.id === itemToBeUpserted.id)) {
    return [itemToBeUpserted, ...currentItems];
  }

  return currentItems.map((item) =>
    item.id === itemToBeUpserted.id ? itemToBeUpserted : item
  );
}

function appReducer(currentState, event) {
  switch (event.type) {
    case "VALUE_CHANGED": {
      return {
        ...currentState,
        value: event.value
      };
    }

    case "CLICKED_CHECKBOX": {
      return {
        ...currentState,
        markedIds: currentState.markedIds.includes(event.item.id)
          ? currentState.markedIds.filter(
              (markedId) => markedId !== event.item.id
            )
          : [...currentState.markedIds, event.item.id]
      };
    }

    case "CLICKED_ITEM": {
      if (currentState.editingItem?.id === event.item.id) {
        return {
          ...currentState,
          editingItem: null,
          value: ""
        };
      }

      return {
        ...currentState,
        editingItem: event.item,
        value: event.item.name
      };
    }

    case "SUBMITTED_FORM": {
      if (currentState.editingItem) {
        return {
          ...currentState,
          // currentState.items.map((item) =>
          //   item.id === currentState.editingItem.id
          //     ? {
          //         ...item,
          //         name: currentState.value
          //       }
          //     : item
          // ),
          items: upsertItem(currentState.items, {
            ...currentState.editingItem,
            name: currentState.value
          }),
          editingItem: null,
          value: ""
        };
      }

      return {
        ...currentState,
        // items: [
        //   {
        //     id: nanoid(),
        //     name: currentState.value,
        //     isCompleted: false
        //   },
        //   ...currentState.items
        // ],
        items: upsertItem(currentState.items, {
          id: nanoid(),
          name: currentState.value,
          isCompleted: false
        }),
        value: ""
      };
    }

    case "CLICKED_DELETE_ALL_BUTTON": {
      const editingItemDeleted = currentState.markedIds.includes(
        currentState.editingItem?.id
      );

      return {
        ...currentState,
        items: currentState.items.filter(
          (item) => !currentState.markedIds.includes(item.id)
        ),
        markedIds: [],
        editingItem: editingItemDeleted ? null : currentState.editingItem,
        value: editingItemDeleted ? "" : currentState.value
      };
    }

    case "SELECT_ALL_BUTTON_CLICKED": {
      if (currentState.items.length === currentState.markedIds.length) {
        return {
          ...currentState,
          markedIds: []
        };
      }

      return {
        ...currentState,
        markedIds: currentState.items.map((item) => item.id)
      };
    }

    case "DELETE_BUTTON_CLICKED": {
      return {
        ...currentState,
        items: currentState.items.filter((_item) => _item.id !== event.item.id)
      };
    }

    default: {
      return currentState;
    }
  }
}

const App = () => {
  const [state, dispatch] = useReducer(appReducer, initialAppState);

  return (
    <div className="container">
      <Head>
        <title>
          {state.items.length === 0
            ? "Nenhum item adicionado"
            : state.items.length === 1
            ? "1 item adicionado"
            : `${state.items.length} itens adicionados`}
        </title>
      </Head>
      <h1>Lista de Compras</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          dispatch({ type: "SUBMITTED_FORM" });
        }}
      >
        <input
          type="text"
          value={state.value}
          className="item-input"
          onChange={(e) =>
            dispatch({
              type: "VALUE_CHANGED",
              value: e.target.value
            })
          }
          placeholder="Não esqueça dos legumes..."
        />
        <br />
        <div className="buttons">
          <button type="submit" disabled={!state.value} className="add-button">
            {state.editingItem ? "Atualizar" : "Adicionar"} item
          </button>
          <button
            type="button"
            onClick={() =>
              dispatch({
                type: "CLICKED_DELETE_ALL_BUTTON"
              })
            }
            className="delete-button"
          >
            Excluir itens marcados
          </button>
          <button
            className={
              state.items.length > 0 &&
              state.items.length === state.markedIds.length
                ? "desmarcar"
                : "selecionar"
            }
            type="button"
            onClick={() =>
              dispatch({
                type: "SELECT_ALL_BUTTON_CLICKED"
              })
            }
          >
            {state.items.length > 0 &&
            state.items.length === state.markedIds.length
              ? "Desmarcar"
              : "Selecionar"}{" "}
            todos
          </button>
        </div>
      </form>
      <div>
        {state.items.map((item) => (
          <div className="item-list" key={item.id}>
            <span className="item-list-span">
              <button
                type="button"
                onClick={() =>
                  dispatch({
                    type: "CLICKED_CHECKBOX",
                    item
                  })
                }
              >
                {state.markedIds.includes(item.id) ? (
                  <AiFillCheckCircle size={23} className="check-button" />
                ) : (
                  <AiOutlineCheckCircle size={23} className="check-button" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  dispatch({
                    type: "CLICKED_ITEM",
                    item
                  });
                }}
              >
                {item.isCompleted === false ? (
                  <p>{item.name}</p>
                ) : (
                  <p className="complete">{item.name}</p>
                )}
              </button>
            </span>
            <button
              type="button"
              onClick={() =>
                dispatch({
                  type: "DELETE_BUTTON_CLICKED",
                  item
                })
              }
            >
              <FaTrash style={{ cursor: "pointer" }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
