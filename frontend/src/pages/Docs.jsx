import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Docs = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем коллекцию документов из Firestore
        const querySnapshot = await getDocs(collection(db, 'users'));
        // Преобразуем результат запроса в массив объектов данных документов
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        // Устанавливаем полученные данные в состояние
        setDocuments(data);
      } catch (error) {
        console.error('Error fetching documents: ', error);
      }
    };

    // Вызываем функцию для загрузки данных при монтировании компонента
    fetchData();
  }, []); // Пустой массив зависимостей означает, что эффект будет запускаться только один раз при монтировании

  return (
    <div className="wrapper">
      <h2>Documents from Firestore</h2>
      <ul>
        {documents.map((doc) => (
          <li key={doc.id}>
            <pre>{JSON.stringify(doc, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Docs;
