interface WebinarsXML {
  webinar: WebinarXML[];
}

interface WebinarXML {
  date: string;
  duration: string;
  title: string;
  desc: string;
  registration: string;
  speaker: {
    name: string;
    pic: string;
    twitter: string;
    web: string;
  };
  products: string;
}

interface WebinarJSON {
  title: string;
  date: string;
  dateTimestamp: number;
  link: string;
  speakerName: string;
  speakerPhoto: string;
  speakerTwitter: string;
  speakerWebsite: string;
  description: string;
  category: string[];
}
