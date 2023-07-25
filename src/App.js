import React, { useState } from 'react';

import { BsPenFill, BsFillTrash3Fill } from 'react-icons/bs';
import { RiSaveFill } from 'react-icons/ri';

import './App.css';

function App() {

  const nextId = new Date().getTime();
  const ENTER_KEY = 13;
  const ESC_KEY = 27;

  const [editCardId, setEditCardId] = useState(''); //mudar estado de visualizacao apenas do mesmo id
  const [editCard, setEditCard] = useState(true); //estado boolean para iniciar edicao
  const [listValue, setListValue] = useState([]); //lista de a fazer
  const [value, setValue] = useState(''); // mostra texto em input


  const getDate = () => {
    const day = new Date().getDate();
    const hours = new Date().getHours();

    let minutes = new Date().getMinutes();
    let month = new Date().getMonth();

    if (minutes < 10) minutes = '0' + minutes;
    if (month < 10) month = '0' + month;
    const setTimeCreated = day + ' / ' + month + ' - ' + hours + ':' + minutes;

    return setTimeCreated.toString();
  };
  // new cards
  const resetState = () => {
    setEditCard(true); //desativa a edicao
    setValue('');; //apaga o texto
    setEditCardId(''); //remove id para retirar estado de visualizacao edit
  };
  // new cards
  const submit = () => {
    // prevenir envio vazios
    if (value !== '') {
      //pega data criado
      const setTimeCreated = getDate();
      setListValue([
        {
          id: nextId,
          name: value,
          created: setTimeCreated,
          edited: '',
          checked: false,
        },
        ...listValue,
      ]);
      // resetStateFunction.current.reset();
    } else {
      console.warn('Nenhum Valor Foi Inserido');
      return false;
    }
    resetState();
  };
  //input
  const onChange = (event) => {
    setValue(event.target.value);
  };
  //input
  const onKeyDown = (event) => {
    // which 13 = tabela ascii numero 13
    if (event.which === ENTER_KEY) {
      submit();
    } else if (event.which === ESC_KEY) {
      resetState();
    }
  };
  // ------------------- CARD EDIT --------------------

  //mostra alteracao do novo texto no card
  const onChangeCardEdit = (event) => {
    if (event) {
      const newText = event.target.value;
      setValue(newText);
    }
  };
  //verifica o key down para confirmar o edit
  const onKeyDownCardEdit = (event) => {
    if (event.which === ENTER_KEY) {
      cardUpdate(event);
    } else if (event.which === ESC_KEY) {
      resetState();
    }
  };
  //clicando fora do card com edicao habilitada
  const onBlur = () => {
    // resetando states
    resetState();
  };

  const cardDelete = (prop) => {
    // previne delete acidental
    //NAO IMPLEMENTADO
    if (prop) {
      setListValue(listValue.filter((item) => item.id !== prop.id));
    } else {
      console.log('Voce nao confirmou o delete');
      return;
    }
  };
  //verifica se o card foi concluido
  const getCheckBoxCard = (listId) => {

    const getCheck = listValue.map((list) => {
      if (listId === list.id) {

        return {
          ...list,
          checked: !list.checked,
        };
      } else {

        return list;
      }
    });
    setListValue(getCheck);
  };
  //faz o update no array
  const cardUpdate = (event) => {
    //pega data editado
    const setEditedTime = getDate();
    // evita update vazio
    if (value !== '') {
      let idUpdate = event.target.id;
      const updateList = listValue.map((newList) => {
        // verifica se o id da lista e o mesmo com o sendo editado
        // se for retorna os valores da lista mais a alteracao realizada
        // se nao apenas retorna a lista
        if ('textArea' + newList.id === idUpdate) {
          return {
            ...newList,
            name: value,
            edited: setEditedTime,
          };
        } else {
          return newList;
        }
      });
      setListValue(updateList); //update na lista de cards
      // resetando states
      resetState();
    } else {
      resetState();
      return false;
    }
  };

  const cardEdit = (event) => {
    const getId = 'textArea' + event.id;
    getId.toString();
    document.querySelector('#' + getId + '').focus();
    setEditCardId(event.id); // mudar estado de visualizacao apenas do mesmo id
    setEditCard(false); // estado boolean para iniciar edicao
    setValue(event.name);
  };

  return (
    <section id="app" className="container">
      <header>
        <h1 className="title">Todo List</h1>
      </header>
      <section className="main">
        <input
          autoFocus
          className="new-todo"
          placeholder="o que precisa ser feito ?"
          value={editCard ? value : ''}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />

      </section>
      <section className="container">
        <div className="list-card-container">

          {listValue.map((listText) => (
            <li
              key={listText.id}
              className={`
                      ${editCardId !== listText.id
                  ? 'edit-desactived-card'
                  : 'edit-actived-card'
                }
                     `}
            >
              <input
                id={'checkbox' + listText.id}
                className="list-card-checkbox"
                checked={listText.checked}
                onChange={() => getCheckBoxCard(listText.id)}
                type="checkbox"
              ></input>

              <textarea
                value={editCardId !== listText.id ? listText.name : value}
                id={'textArea' + listText.id}
                readOnly={editCard}
                onChange={onChangeCardEdit}
                onKeyDown={onKeyDownCardEdit}
                rows="5"
                onMouseDown={() => cardEdit(listText)}
                onBlur={onBlur}
                className={listText.checked ? "list-card-completed-textarea" : ""}
              />

              <div className="list-card-button">
                <button type="button" onClick={() => cardEdit(listText)}>
                  {listText.id === editCardId ? <RiSaveFill /> : <BsPenFill />}
                </button>
                <button type="button" onClick={() => cardDelete(listText)}>
                  <BsFillTrash3Fill />
                </button>
                <span>
                  Criado em: <b>{listText.created}</b>
                </span>
                <span>
                  {listText.edited === ''
                    ? ''
                    : 'Ultima edicao: ' + listText.edited}
                </span>
              </div>
              <div className={listText.checked ? "list-card-completed" : ""}></div>
            </li>

          ))}
        </div>
      </section>
    </section>
  );
}

export default App;
