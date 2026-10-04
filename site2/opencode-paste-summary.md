# opencode: видеть вставленный текст вместо `[Pasted ~N lines]`

Это функция «paste summary» — при вставке ≥3 строк (или >150 символов) вместо
текста подставляется плейсхолдер `[Pasted ~N lines]`. Полный текст всё равно
уходит модели, но редактировать его в поле ввода нельзя.

## 1. На лету, в текущей сессии

Нажать `ctrl+p`, в палитре найти «paste summary» и выбрать
**«Disable paste summary»**.

Переключение сохраняется в `~/.local/state/opencode/kv.json`,
ключ `paste_summary_enabled`.

## 2. Постоянно, в конфиге

Файл `~/.config/opencode/opencode.jsonc`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "experimental": {
    "disable_paste_summary": true
  }
}
```

Этот вариант уже внесён в глобальный конфиг (28.09.2026), и
`opencode debug config` подтверждает, что опция резолвится в `true`.

Важно: это лишь значение **по умолчанию**. Если когда-либо нажимали
«Enable paste summary» в палитре, сохранённое в `kv.json` состояние его
перекрывает, поэтому надёжнее щёлкнуть «Disable paste summary» через `ctrl+p`.

## 3. Опционально: хоткей на переключение

Файл `~/.config/opencode/tui.json`:

```json
{ "keybinds": { "app_toggle_paste_summary": "<leader>v" } }
```

По умолчанию у этой команды нет клавиши, отдельной slash-команды для неё нет.

## Альтернатива

`/editor` (или `ctrl+x e`) — открыть сообщение во внешнем редакторе
(из переменной `EDITOR`), там всё видно и редактируется.
