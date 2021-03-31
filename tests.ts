import { readFile } from 'fs/promises';

import WebinarConverter, {
  WebinarConversionError,
  WebinarXMLParseError,
} from './converter';

// filepath to webinars in XML
const xmlWebinarsPath = './in/webinars.xml';
// path to example JSON file with webinars
const jsonWebinarsPath = './out/webinars.json';

// conversion test
async function test1(xmlWebinarsPath: string, jsonWebinarsPath: string) {
  const data = await readFile(xmlWebinarsPath);
  const webinarsXMLString = data.toString();
  const webinarsJSON = await WebinarConverter.convertToJSON(webinarsXMLString);

  const webinarsToCompare = (await readFile(jsonWebinarsPath)).toString();

  if (JSON.stringify(webinarsJSON, null, 2) !== webinarsToCompare) {
    return 'failed';
  }

  return 'ok';
}

// XML parsing failure test
async function test2() {
  try {
    await WebinarConverter.convertToJSON('Definitely not valid XML');
  } catch (err) {
    if (err instanceof WebinarXMLParseError) {
      return 'ok';
    }
  }

  return 'failed';
}

// incorrect xml structure (not like ./in/webinars.xml)
async function test3() {
  try {
    await WebinarConverter.convertToJSON(
      '<validXML><but><incorrectStructure></incorrectStructure></but></validXML>'
    );
  } catch (err) {
    if (err instanceof WebinarConversionError) {
      return 'ok';
    }
  }

  return 'failed';
}

(async () => {
  console.log('Test 1:', await test1(xmlWebinarsPath, jsonWebinarsPath));
  console.log('Test 2:', await test2());
  console.log('Test 3:', await test3());
})();
