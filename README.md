# EnzimAgro Bot

### Контекст
Проект для автоматизації надання цін на продукцію компанії [Enzim Agro](https://agro.enzim.biz/), створений для **полегшення процесу пошуку цін** для користувача(клієнта). Телеграм-бот: [@enzimagro_bot](https://t.me/enzimagro_bot).

### Функціональність
Телеграм-бот надає можливість швидко дізнатися актуальну ціну препарату, відповідаючи на конкретні запитання:
1. Оберіть категорію препаратів
2. Оберіть препарат
3. Оберіть варіант пакування

Після обрання потрібного препарату та варіанту пакування телеграм-бот надсилає ціну відповідного до наших відповідей.

Кожен етап підтримує додаткову кнопку **"Назад"**, яка допомагає повернутися на крок назад.
Разом із повідомленням про обраний препарат та його ціну телеграм-бот надсилає кнопку **"Повернутися до категорій"**, що допомагає повернутися в початок "сцени" визначення цін.

Дані автоматично генеруються з системи обліку 1С у формат XLSX, який використовується для отримання даних для програми.
**Update:** наступна версія програми буде переведена на MongoDB.

### Локальний запуск
Локальний запуск програми можливий лише розробнику, який має конфігураційні файли для Telegram (та MongoDB у версії v2.0.0). 

Якщо ви хочете використовувати код програми для свого проекту - у корені проекту створіть конфігураційний файл CONFIG.js зі структурою:
```code
{
  BOT_TOKEN: 'ваш Telegram token'
}
```

### Використання
Для спрощення використання телеграм-боту користувач має доступ до двох команд:
+ <code>/price</code> - команда, що заапускає "сцену" визначення ціни товару - послідовність дій, що послідовно запитую у користувача бажану категорію препаратів, назву препарату та варіант пакування та відповідно до відповідей надсилає ціну обраного товару.
+ <code>/help</code> - команда, що допомагає користувачу зорієнтуватися в запуску потрібної команди для початку роботи.

### Приклади використання
1. Перша дія: телеграм-бот запитує потрібну категорію препаратів.
2. Друга дія: телеграм-бот запитує назву потрібного препарату відповідно до обраної категорії.

*Приклад запиту на обрання потрібної категорії та запиту на обрання товару зі списку товарів цієї категорії*:  
<img src="https://user-images.githubusercontent.com/71709401/174485814-445fe70b-4a6a-4ae2-a548-43d775806c09.png">
***

3. Третя дія: телеграм-бот запитує бажаний варіант упаковки.
4. Четверта дія: відповідь телеграм-бота на обраний препарат та бажаний варіант упаковки.
5. 
*Приклад запиту на обрання бажаного варіанту пакуваття та надсилання відповіді з ціною препарату*:  
<img src="https://user-images.githubusercontent.com/71709401/174485874-409a7c2e-3d43-4017-a7f6-019053620ad4.png">

### Автор
**LinkedIn**: [Sergey Ocheretenko](https://www.linkedin.com/in/sergeyocheretenko/)
**Telegram:** [@OcheretenkoS](https://t.me/OcheretenkoS).  
**Email:** [ocheretenko.s@gmail.com](mailto:ocheretenko.s@gmail.com).  
