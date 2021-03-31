import { parseStringPromise as parseXML } from 'xml2js';

const MIN_TO_MS = 60000;

// helper class for date formatting
class DateFormatter {
  static daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  static months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // assuming that dates represent the same day with different time
  static getTimeRangeString(dateStart: Date | number, dateEnd: Date | number) {
    // add leading zero for numbers less than 10
    const pad = (n: number) => {
      return n < 10 ? '0' + n : n.toString();
    };

    const date1 = new Date(dateStart);
    const date2 = new Date(dateEnd);

    const dayOfWeek = this.daysOfWeek[date1.getUTCDay()];
    const month = this.months[date1.getUTCMonth()];
    const day = date1.getUTCDate();
    const year = date1.getUTCFullYear();
    const timeStart = `${pad(date1.getUTCHours())}:${pad(date1.getUTCMinutes())}`;
    const timeEnd = `${pad(date2.getUTCHours())}:${pad(date2.getUTCMinutes())}`;

    return `${dayOfWeek}, ${month} ${day}, ${year}, ${timeStart}-${timeEnd} GMT`;
  }
}

export class WebinarXMLParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WebinarXMLParseError';
  }
}

export class WebinarConversionError extends Error {
  constructor(message = 'Failed to convert webinars to JSON') {
    super(message);
    this.name = 'WebinarConversionError';
  }
}

export default class WebinarConverter {
  static async convertToJSON(webinarsXMLString: string) {
    const parsedXML: WebinarsXML = await parseXML(webinarsXMLString, {
      trim: true,
      explicitArray: false,
      explicitRoot: false,
    }).catch((err: Error) => {
      throw new WebinarXMLParseError(`Failed to parse given XML\n${err.message}`);
    });

    let webinarsFormatted: WebinarJSON[];

    try {
      // get array of webinars from parsed XML document
      const webinars = parsedXML.webinar;

      // format webinars according to specified schema
      webinarsFormatted = webinars.map((webinar) => {
        const speaker = webinar.speaker;
        const products = webinar.products.split(' ');
        const category = products.map((product) => product.trim().toLowerCase());

        const webinarDateStart = new Date(webinar.date);

        // assuming that duration is specified in minutes
        const dateTimestamp =
          webinarDateStart.getTime() + parseInt(webinar.duration) * MIN_TO_MS;

        return {
          title: webinar.title,
          date: DateFormatter.getTimeRangeString(webinarDateStart, dateTimestamp),
          dateTimestamp,
          link: webinar.registration,
          speakerName: speaker.name,
          speakerPhoto: speaker.pic,
          speakerTwitter: speaker.twitter,
          speakerWebsite: speaker.web,
          description: webinar.desc,
          category,
        };
      });
    } catch {
      throw new WebinarConversionError();
    }

    return webinarsFormatted;
  }
}
