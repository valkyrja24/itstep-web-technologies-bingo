Створення BINGO

# Серія вимог 1 (17 лютого 2025 року)

1. [x] Якщо перемикач "режим автора" не активовано, то клік по комірці приводить до її вибору (клас `selected`)
2. [ ] Виділення будь-яких 5 елементів по горизонталі, вертикалі **або диагоналі** повинно приводити до відображення повідомлення "BINGO!" внизу і кнопки "почати знову" (зверніть увагу, кнопка і сама панель вже є в HTML)
3. [ ] Натискання кнопки "почати знову" має приховувати панель з відображенням "BINGO!" і очищати таблицю
4. [ ] Активація перемикача "режим автора" має прибирати виділення елементів та виграша
5. [ ] В режимі автора клік по комірці не має призводити до її виділення
6. [ ] В режимі автора клік по комірці має приводити до її перетворення в `<textarea>` з текстом, що на даний момент присутній в комірці
7. [ ] Клік поза `<textarea>` яку ми редагуємо, має перетворити її назад в текст, що на даний момент присутній в `<textarea>`
8. [ ] Якщо на сторінці в режимі автора знаходяться дві комірки з однаковим текстом, то вони мають бути підсвічені червоним (клас `error` в CSS)
9. [ ] При спробі оновлення сторінки, якщо ми знаходимося в режимі автора і редагуємо комірку ми маємо вивести попередження про незбережені дані
10. [ ] При оновленні сторінки всі внесені вами зміни мають бути збережені (шляхом збереження їх в localStorage)

Матеріали до серії вимог:
  * [createElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)
  * [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
  * [submit](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit)
  * [beforeunload](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event)
  * [confirm](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm)
  * [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
  * [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
  * [JSON.parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
