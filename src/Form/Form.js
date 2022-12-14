import { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Input from '../Input/Input';
import dayjs from 'dayjs';

import s from './Form.module.css';

/**
 * Функция конвртирует файл в формат base64
 * @param { object } file Файл загруженный пользователем
 * @returns promise резулльтат конвертирования файла
 */
const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', (event) => resolve(event.target.result));
    reader.addEventListener('error', (error) => reject(error));
    reader.readAsDataURL(file);
  })
}

/**
 * Компонент формы.
 * @param { func } myList Фунция передает значения полей формы из стета в компонент TodoPage.
 * @param { id } id Id записи для редактирования
 * @param { title } title Заголовок записи для редактирования
 * @param { date } date Дата окончания записи для редактирования
 * @returns возвращает форму
 */
const Form = ({ myList, id, title, date }) => {
  const [todoItem, setTodoItem] = useState({});
  const [taskFile, setTaskFile] = useState({});
  const ref = useRef(null);

  /**
   * Функция вызывает конвертироввание файла и запивывает результат в стейт
   * @param { object } userFile Файл полученный в форме
   */
  const convertFile = (userFile) => {
    const taskFile = userFile;

    for (const file of taskFile) {

      getBase64(file).then((fileAsBase64) => {

        setTaskFile(prevState => ({
          ...prevState,
          name: file.name,
          type: file.type,
          fileUrl: fileAsBase64
        }))

      }).catch((err) => {
        console.log('error >>>', err);
      });
    }

  }

  /**
   * Функция при изменении формы вызывает конвертацию файла или записывает значение поля формы в стейт
   * @param { object } e Объект события изменения формы
   */
  const handleChangeForm = (e) => {

    if (e.target.name === 'file') {
      convertFile(e.target.files)
    } else {
      setTodoItem(prevState => ({
        ...prevState,
        id: id > 0 ? id : dayjs().unix(),
        [e.target.name]: e.target.value
      }))
    }

  }

  /**
   * При отправлении формы проверяет указанную пользователем дату. Передает данные в компонент TodoPage.
   * И очищает форму.
   * @param { object } e Объект события отправки формы.
   *
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (dayjs().$d > dayjs(todoItem.date)) {
      alert('Укажите дату больше сегодняшней')
      return;
    }

    myList && myList(todoItem, taskFile);

    ref.current.reset();
  }

  return (
    <div className={s.root}>
      <form
        ref={ref}
        onSubmit={handleSubmit}
        onChange={handleChangeForm}
      >
        <label htmlFor="title">
          <Input
            type="text"
            name="title"
            placeholder="Введите заголовок"
            defaultValue={title}
          />
        </label>
        <label htmlFor="description">
          <textarea
            className={s.descr}
            name="description"
            rows="5"
            placeholder='Введите описание'
          ></textarea>
        </label>
        <label htmlFor="taget-date">
          <Input
            type="date"
            name="date"
            defaultValue={date}
          />
        </label>
        <label htmlFor="file">
          <Input
            type="file"
            name="file"
          />
        </label>
        <button type="submit" >Добавить задачу</button>
      </form>
    </div>
  );
};

Form.propTypes = {
  /**
   * Функция
   */
  myList: PropTypes.func,
  /**
   * Id записи
   */
  id: PropTypes.number,
  /**
   * Заголовок записи
   */
  title: PropTypes.string,
  /**
   * Дата окончания задачи
   */
  date: PropTypes.string
}

export default Form;
