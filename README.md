# Webinar Converter

Утилита для конвертации XML с информацией о вебинарах в заданный формат JSON.

## Использование

### Установка зависимостей

Для работы необходимо установить зависимости, перечисленные в `package.json`.

```shell
$ yarn install
```

### Typescript

```typescript
import WebinarConverter, {
  WebinarConversionError,
  WebinarXMLParseError,
} from '<path-to-utility>/converter';

(async () => {
  try {
    // массив объектов с информацией о вебинарах в заданном формате
    const webinarsJSON = await WebinarConverter.convertToJSON('<webinarsXMLString>');
    // ...
  } catch (err) {
    // ошибка парсинга XML
    if (err instanceof WebinarXMLParseError) {
      // ...
    }

    // ошибка конвертации из-за неверной структуры документа (не соответствует примеру в ./in/webinars.xml)
    if (err instanceof WebinarConversionError) {
      // ...
    }
  }
})();
```
