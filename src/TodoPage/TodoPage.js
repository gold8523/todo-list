import { useState } from 'react';
import cn from 'classnames';

import Form from '../Form/Form';
import dayjs from 'dayjs';

import { ReactComponent as DelIcon } from './assets/x-del.svg';
import { ReactComponent as DoneIcon } from './assets/done.svg';
import { ReactComponent as EditIcon } from './assets/edit.svg';

import s from './TodoPage.module.css';


const TodoPage = () => {
  const [list, setList] = useState({});
  const [editTask, setEditTask] = useState(null);

  /**
   * @type { object } Дата сейчас
   */
  const now = dayjs().$d;

  /**
   * Функциия принимает объект значений из полей формы и файл загруженный пользователем и объединяет их в один объект, также добавляет свойства isDone(выполнение задачи) и isMiss(задача просрочена)
   * Также функция обнуляет стейт для редактирования
   * @param { object } itemList Объект значений введёных в форму
   * @param { object } itemFile Объект свойств файла
   */
  const handleList = (itemList, itemFile) => {

    setList(prevState => ({
      ...prevState,
      [itemList.id]: {
        id: itemList.id,
        title: itemList.title,
        description: itemList.description,
        date: itemList.date,
        file: itemFile,
        isDone: false,
        isMiss: false
      }
    }))

    setEditTask(null);
  }

  /**
   * Функция меняет статус записи выполнено/не выпонено
   * @param { number }  id Id записии
   */
  const handleClickDone = (id) => {
    setList(prevState => {
      const copyState = { ...prevState };

      Object.keys(copyState).map((item) => {

        console.log('done', item);
        if (item === id.toString()) {
          copyState[item].isDone = !copyState[item].isDone
        }
      })

      return copyState;
    })
  }

  /**
   * Функция удаяет запись
   * @param { number }  id Id записии
   */
  const handleClickDel = (id) => {
    setList(prevState => {
      const copyState = { ...prevState };
      delete copyState[id];

      return copyState;
    })
  }

  /**
   * Функция получает id, title, description, date записи и сохраняет в state
   * @param { number }  id Id записии
   */
  const handleClickEdit = (id) => {
    setEditTask(prevState => {
      return ({
        id: list[id].id,
        title: list[id].title,
        description: list[id].description,
        date: list[id].date,
      })
    })

    console.log('edit', editTask);
  }


  return (
    <div className={s.root}>
      <h1>ToDo List</h1>
      <Form
        myList={handleList}
        id={editTask !== null ? editTask.id : null}
        title={editTask !== null ? editTask.title : null}
        description={editTask !== null ? editTask.description : null}
        date={editTask !== null ? editTask.date : null}
      />
      <div className={s.listContainer}>
        <ul className={s.todoList}>
          {
            list !== null ?
              Object.entries(list).map(([key, value], index) => (
                <li
                  key={key}
                  className={cn(s.todoListItem, {
                    [s.miss]: now > dayjs(value.date) ? true : false,
                    [s.done]: value.isDone,
                  })}
                >
                  <div className={s.imageWrap}>
                    {value.file.type !== '' && <img src={value.file.fileUrl} alt={key} />}
                  </div>
                  <div className={s.descrWrap}>
                    <h3 className={s.todoItemtemTitle}>{value.title}</h3>
                    <p className={s.todoItemDescr}>{value.description}</p>
                    <span className={s.todoItemDate}>Дата окончания: {value.date}</span>
                  </div>
                  <div className={s.resultButtonsWrap}>
                    <DoneIcon
                      className={s.doneIcon}
                      onClick={() => handleClickDone(value.id)}
                    />
                    <DelIcon
                      className={s.delIcon}
                      onClick={() => handleClickDel(value.id)}
                    />
                    <EditIcon
                      className={s.editIcon}
                      onClick={() => handleClickEdit(value.id)}
                    />
                  </div>
                </li>
              )) : null
          }
        </ul>
      </div>
    </div>
  );
};

export default TodoPage;
